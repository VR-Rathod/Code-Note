---
seoTitle: Game Systems Programming Guide – Inventory, Quest, Dialogue, Save & Procedural Generation
description: "A comprehensive reference for building core game systems from scratch. Covers inventory management, quest engines, dialogue trees, save/load pipelines, achievement tracking, and procedural generation with real code examples."
keywords: "game systems, inventory system, quest system, dialogue system, save load system, achievement system, procedural generation, game programming, c++ game dev, game design patterns, vr-rathod, code-note"
displayTitle: Core Game Systems — Design & Implementation
---

tags:: index, game-development, game-systems, programming
title:: Game Systems

- # Core Game Systems — Design & Implementation
  collapsed:: true
	- > [!info] About This Page
	  > This page covers the **engineering** of systems common to nearly every game — the internals that power inventory screens, quest trackers, save files, and procedurally generated worlds.
	  > Each system is designed language-agnostically but includes real C++ and GDScript code examples.
	  > For engine-specific implementation see [[Godot]], [[Unity]], [[Unreal Engine]].
	- ## The Six Core Game Systems
	  collapsed:: true
		- ```mermaid
		  mindmap
		    root((Game Systems))
		      Inventory
		        Items & Stacks
		        Containers
		        Equipment
		        Crafting
		      Quest Engine
		        States & Objectives
		        Branching
		        Rewards
		      Dialogue
		        Conversation Trees
		        Variables
		        Localization
		      Save & Load
		        Serialization
		        Checkpoints
		        Cloud Saves
		      Achievements
		        Conditions
		        Progress Tracking
		        Platform Integration
		      Procedural Generation
		        Noise
		        Dungeon Gen
		        WFC
		  ```
- # 1 — Inventory System
  collapsed:: true
	- ## Why Inventory Is Non-Trivial
	  collapsed:: true
		- An inventory system sounds simple ("just a list of items") but in practice it must answer:
		- ```
		  ✔ Can items stack? How many per stack?
		  ✔ Does the player have a weight limit or slot limit?
		  ✔ Can items be equipped, consumed, dropped, or traded?
		  ✔ Do items have random attributes (RPG loot)?
		  ✔ Can containers exist inside containers (bags in a bag)?
		  ✔ How is it saved, versioned, and synchronized in multiplayer?
		  ```
	- ## The Item Data Model
	  collapsed:: true
		- ```cpp
		  // Item Definition — the TEMPLATE (stored in your item database, not in savegames)
		  struct ItemDefinition {
		      std::string id;          // "sword_iron" — unique key
		      std::string displayName; // "Iron Sword"
		      std::string description; // Shown in UI tooltip
		      std::string iconPath;    // "ui/icons/sword_iron.png"
		  
		      enum class Category { Weapon, Armor, Consumable, Material, Quest, Key } category;
		      enum class Rarity   { Common, Uncommon, Rare, Epic, Legendary }         rarity;
		  
		      float weight;      // kg — 0 for weightless items
		      int   maxStack;    // 1 = no stacking, 99 = up to 99 per slot
		      bool  isDroppable; // Can it be dropped on the ground?
		      bool  isTradeable; // Can it be sold / traded?
		      bool  isQuestItem; // Quest items often can't be discarded
		  
		      // Stat modifiers for equipment
		      std::unordered_map<std::string, float> statModifiers;
		      // { "attack": 15.0, "durability": 100.0 }
		  };
		  
		  // Item Instance — ONE specific item in a player's inventory
		  struct ItemInstance {
		      std::string definitionId; // Points to the ItemDefinition
		      uint64_t    instanceId;   // Unique ID for this specific item (for saves)
		      int         quantity;     // How many in this stack
		  
		      // Optional: per-instance data (RPG random rolls, durability)
		      std::unordered_map<std::string, float> attributes;
		      // { "attack": 18.5, "durability": 85.0, "fire_damage": 4.0 }
		  
		      bool operator==(const ItemInstance& other) const { return instanceId == other.instanceId; }
		  };
		  ```
		- > [!tip] Separate DEFINITION from INSTANCE. The definition is a read-only template shared across all copies of "Iron Sword". The instance holds the specific reality (its durability, enchantments, ownership).
	- ## Inventory Container
	  collapsed:: true
		- ```cpp
		  class Inventory {
		  public:
		      int maxSlots;
		      float maxWeight;
		  
		      std::vector<std::optional<ItemInstance>> slots; // Fixed-size grid with empty slots
		  
		      // Add an item — handles stacking automatically
		      bool addItem(const ItemInstance& newItem) {
		          const ItemDefinition& def = ItemDatabase::get(newItem.definitionId);
		  
		          // Try to stack onto existing items first
		          if (def.maxStack > 1) {
		              for (auto& slot : slots) {
		                  if (!slot.has_value()) continue;
		                  if (slot->definitionId == newItem.definitionId &&
		                      slot->quantity < def.maxStack) {
		                      int canAdd = def.maxStack - slot->quantity;
		                      int adding = std::min(canAdd, newItem.quantity);
		                      slot->quantity += adding;
		                      if (adding == newItem.quantity) return true; // Fully stacked
		                  }
		              }
		          }
		  
		          // Find an empty slot
		          for (auto& slot : slots) {
		              if (!slot.has_value()) {
		                  slot = newItem;
		                  return true;
		              }
		          }
		          return false; // Inventory full
		      }
		  
		      bool removeItem(uint64_t instanceId, int quantity = 1) {
		          for (auto& slot : slots) {
		              if (slot.has_value() && slot->instanceId == instanceId) {
		                  slot->quantity -= quantity;
		                  if (slot->quantity <= 0) slot.reset(); // Clear slot
		                  return true;
		              }
		          }
		          return false;
		      }
		  
		      float getTotalWeight() const {
		          float total = 0.0f;
		          for (const auto& slot : slots) {
		              if (!slot.has_value()) continue;
		              const auto& def = ItemDatabase::get(slot->definitionId);
		              total += def.weight * slot->quantity;
		          }
		          return total;
		      }
		  
		      bool hasItem(const std::string& definitionId, int requiredQty = 1) const {
		          int found = 0;
		          for (const auto& slot : slots) {
		              if (slot.has_value() && slot->definitionId == definitionId)
		                  found += slot->quantity;
		          }
		          return found >= requiredQty;
		      }
		  };
		  ```
	- ## Equipment System
	  collapsed:: true
		- ```cpp
		  enum class EquipSlot { Head, Chest, Legs, Feet, Hands, MainHand, OffHand, Ring1, Ring2, Neck };
		  
		  class EquipmentSystem {
		      std::unordered_map<EquipSlot, std::optional<ItemInstance>> equipped;
		  
		  public:
		      bool equip(ItemInstance item, EquipSlot slot, Inventory& inventory) {
		          // Unequip existing item first
		          if (equipped[slot].has_value()) {
		              inventory.addItem(equipped[slot].value()); // Return to bag
		          }
		  
		          // Remove from inventory and equip
		          inventory.removeItem(item.instanceId);
		          equipped[slot] = item;
		  
		          applyStatChanges(item, true);
		          return true;
		      }
		  
		      // Compute total stat modifications from all equipped items
		      float getStatTotal(const std::string& stat) const {
		          float total = 0.0f;
		          for (const auto& [slot, item] : equipped) {
		              if (item.has_value() && item->attributes.count(stat)) {
		                  total += item->attributes.at(stat);
		              }
		          }
		          return total;
		      }
		  };
		  ```
	- ## Inventory in Godot (GDScript)
	  collapsed:: true
		- ```gdscript
		  # inventory.gd — Autoload or Component
		  class_name Inventory extends Resource
		  
		  @export var max_slots: int = 36
		  @export var max_weight: float = 50.0
		  
		  var slots: Array[Dictionary] = [] # [{id, quantity, instance_id, attributes}]
		  
		  signal item_added(item_data: Dictionary)
		  signal item_removed(instance_id: String)
		  signal inventory_full
		  
		  func add_item(item_id: String, quantity: int = 1) -> bool:
		      var item_def = ItemDatabase.get_item(item_id)
		  
		      # Try stacking
		      if item_def.max_stack > 1:
		          for slot in slots:
		              if slot.id == item_id and slot.quantity < item_def.max_stack:
		                  slot.quantity = min(slot.quantity + quantity, item_def.max_stack)
		                  item_added.emit(slot)
		                  return true
		  
		      # Find empty slot
		      if slots.size() < max_slots:
		          var new_slot = {
		              "id": item_id,
		              "quantity": quantity,
		              "instance_id": str(randi()), # Generate unique ID
		              "attributes": {}
		          }
		          slots.append(new_slot)
		          item_added.emit(new_slot)
		          return true
		  
		      inventory_full.emit()
		      return false
		  
		  func has_item(item_id: String, required_qty: int = 1) -> bool:
		      var total: int = 0
		      for slot in slots:
		          if slot.id == item_id:
		              total += slot.quantity
		      return total >= required_qty
		  ```
- # 2 — Quest System
  collapsed:: true
	- ## Quest Architecture
	  collapsed:: true
		- ```mermaid
		  stateDiagram-v2
		      [*] --> Available : Player discovers quest
		      Available --> Active : Player accepts
		      Active --> Active : Objective progress
		      Active --> Failed : Time limit / bad choice
		      Active --> Completed : All objectives done
		      Completed --> [*]
		      Failed --> [*]
		  ```
	- ## Quest Data Model
	  collapsed:: true
		- ```cpp
		  // A single condition that must be true for an objective to complete
		  struct QuestCondition {
		      enum class Type {
		          KillEnemy,        // Kill N of enemy type X
		          CollectItem,      // Have N of item X in inventory
		          ReachLocation,    // Enter trigger zone X
		          TalkToNPC,        // Initiate dialogue with NPC X
		          CompleteCraft,    // Craft item X
		          SurviveTime,      // Survive for T seconds
		          CustomEvent       // Game fires a custom string event
		      };
		  
		      Type        type;
		      std::string targetId;     // Enemy type, item id, location id, etc.
		      int         requiredCount; // How many
		      int         currentCount;  // Runtime progress (not stored in definition)
		  
		      bool isComplete() const { return currentCount >= requiredCount; }
		  };
		  
		  // One step/goal within a quest
		  struct QuestObjective {
		      std::string id;
		      std::string description; // "Kill 5 Wolves"
		      bool        isOptional;  // Optional objectives give bonus rewards
		      bool        isHidden;    // Revealed only when triggered
		  
		      std::vector<QuestCondition> conditions; // ALL must be met for objective completion
		      std::string nextObjectiveId; // Chain: completing this unlocks the next
		  };
		  
		  // Quest Reward
		  struct QuestReward {
		      int                      goldAmount;
		      int                      experiencePoints;
		      std::vector<std::string> itemIds;      // Items given on completion
		      std::string              followUpQuestId; // Quest unlocked after this one
		  };
		  
		  // The Full Quest Definition (data asset — stored in JSON/ScriptableObject)
		  struct QuestDefinition {
		      std::string id;           // "main_q_01_prologue"
		      std::string title;        // "A New Beginning"
		      std::string description;  // Story text shown in journal
		      std::string giverNpcId;   // Who gives this quest
		  
		      enum class Category { MainStory, SideQuest, Daily, Faction, Hidden } category;
		  
		      std::vector<std::string>    prerequisiteQuestIds; // Must complete these first
		      std::vector<QuestObjective> objectives;
		      QuestReward                 reward;
		  
		      bool hasFail;       // Does this quest have a fail state?
		      float timeLimitSec; // 0 = no time limit
		  };
		  ```
	- ## Quest Manager (Runtime Engine)
	  collapsed:: true
		- ```cpp
		  class QuestManager {
		      // All quest states for the current player
		      std::unordered_map<std::string, QuestStatus> questStates;
		      // questStates["main_q_01"] = QuestStatus::Active
		  
		      // Index of active quest objectives listening for events
		      std::multimap<std::string, std::pair<std::string, int>> eventListeners;
		      // eventListeners["kill:wolf"] = { "main_q_01", objectiveIndex }
		  
		  public:
		      void acceptQuest(const std::string& questId) {
		          if (!canAccept(questId)) return;
		          questStates[questId] = QuestStatus::Active;
		          registerObjectiveListeners(questId);
		          onQuestStarted.broadcast(questId);
		      }
		  
		      // Called by the game engine whenever something happens
		      // e.g., onGameEvent("kill:wolf", 1) when player kills a wolf
		      void onGameEvent(const std::string& eventKey, int amount = 1) {
		          auto range = eventListeners.equal_range(eventKey);
		          for (auto it = range.first; it != range.second; ++it) {
		              auto& [questId, objIndex] = it->second;
		              updateObjectiveProgress(questId, objIndex, amount);
		          }
		      }
		  
		      void updateObjectiveProgress(const std::string& questId, int objIndex, int amount) {
		          auto& quest = getActiveQuest(questId);
		          auto& cond  = quest.objectives[objIndex].conditions[0];
		          cond.currentCount = std::min(cond.currentCount + amount, cond.requiredCount);
		  
		          // Check if objective is now complete
		          if (cond.isComplete()) {
		              checkQuestCompletion(questId);
		          }
		          onQuestUpdated.broadcast(questId);
		      }
		  
		      bool canAccept(const std::string& questId) const {
		          const auto& def = QuestDatabase::get(questId);
		          for (const auto& prereq : def.prerequisiteQuestIds) {
		              if (questStates.count(prereq) == 0 ||
		                  questStates.at(prereq) != QuestStatus::Completed) return false;
		          }
		          return questStates.count(questId) == 0; // Not already started/done
		      }
		  };
		  ```
	- ## Branching Quests
	  collapsed:: true
		- ```mermaid
		  graph TD
		      Q1["Quest: The Heist"]
		      O1["Objective: Get the key"]
		      C1{{"Player choice"}}
		      B1["Branch A: Steal from the merchant\n→ Merchant becomes hostile\n→ Unlocks quest: On the Run"]
		      B2["Branch B: Buy from the merchant\n→ Better reward\n→ Unlocks quest: The Deal"]
		  
		      Q1 --> O1 --> C1 --> B1
		      C1 --> B2
		  ```
		- The key design principle: **track choices as flags**, not as conditional logic hardcoded in objectives.
		- ```cpp
		  // Player made a choice — store it as a world state variable
		  worldState.set("heist_method", "stolen"); // or "purchased"
		  
		  // Quest system reads world state to decide what comes next
		  if (worldState.get("heist_method") == "stolen") {
		      questManager.startQuest("on_the_run");
		  } else {
		      questManager.startQuest("the_deal");
		  }
		  ```
- # 3 — Dialogue System
  collapsed:: true
	- ## Dialogue Tree Concepts
	  collapsed:: true
		- A dialogue system is a **directed graph** of nodes, where edges can be conditional.
		- ```mermaid
		  graph TD
		      Start["START\nNPC: 'Hello, traveler!'"]
		      C1{"Player Choices"}
		      A["'Tell me about this town.'\n→ NPC gives town history"]
		      B["'I need work.'\n→ NPC offers quest [if quest_available]"]
		      C["'Goodbye.'\n→ Conversation ends"]
		      B2["NPC: 'I have nothing for you.' [if quest_done]"]
		  
		      Start --> C1
		      C1 --> A
		      C1 -->|"Condition: quest_available == true"| B
		      C1 -->|"Condition: quest_available == false"| B2
		      C1 --> C
		  ```
	- ## Dialogue Node Data Model
	  collapsed:: true
		- ```cpp
		  struct DialogueNode {
		      std::string id;
		      std::string speakerId;  // "blacksmith_kira" (maps to NPC name + portrait)
		      std::string text;       // "Strange weather we've been having..."
		  
		      // Audio + animation data
		      std::string audioClipId;       // Voice over audio key
		      std::string speakerAnimation;  // "surprised", "happy", "angry"
		  
		      // Side effects that happen when this node triggers
		      struct DialogueAction {
		          enum class Type { StartQuest, SetFlag, GiveItem, PlayAnimation, EndConversation };
		          Type        type;
		          std::string parameter; // questId, flagName, itemId, etc.
		      };
		      std::vector<DialogueAction> actions; // Executed when node is shown
		  };
		  
		  struct DialogueChoice {
		      std::string text;       // The button text the player sees
		      std::string nextNodeId; // Where this choice leads
		      std::string condition;  // Optional: "quest_active:main_q_01" or "gold >= 50"
		      bool        isHidden;   // Hidden if condition isn't met (vs. greyed out)
		  };
		  
		  struct DialogueTree {
		      std::string id;            // "blacksmith_kira_main"
		      std::string startNodeId;
		      std::unordered_map<std::string, DialogueNode>   nodes;
		      std::unordered_map<std::string, std::vector<DialogueChoice>> choices;
		  };
		  ```
	- ## Dialogue Runner
	  collapsed:: true
		- ```cpp
		  class DialogueRunner {
		      const DialogueTree* currentTree = nullptr;
		      std::string currentNodeId;
		  
		  public:
		      void startConversation(const std::string& treeId) {
		          currentTree = DialogueDatabase::get(treeId);
		          showNode(currentTree->startNodeId);
		      }
		  
		      void showNode(const std::string& nodeId) {
		          currentNodeId = nodeId;
		          const auto& node = currentTree->nodes.at(nodeId);
		  
		          // 1. Fire all actions for this node
		          for (const auto& action : node.actions) {
		              executeAction(action);
		          }
		  
		          // 2. Show dialogue text in UI
		          UI::showDialogueText(node.speakerId, node.text);
		  
		          // 3. Build available choices
		          std::vector<DialogueChoice> availableChoices;
		          for (const auto& choice : currentTree->choices.at(nodeId)) {
		              if (evaluateCondition(choice.condition)) {
		                  availableChoices.push_back(choice);
		              }
		          }
		  
		          if (availableChoices.empty()) {
		              endConversation(); // No choices = auto-end
		          } else {
		              UI::showChoices(availableChoices);
		          }
		      }
		  
		      // Called when player clicks a choice
		      void selectChoice(int choiceIndex) {
		          const auto& choice = /* get the choice */;
		          WorldState::setLastDialogueChoice(choice.text); // Save for quests
		          showNode(choice.nextNodeId);
		      }
		  
		      bool evaluateCondition(const std::string& condition) {
		          if (condition.empty()) return true;
		          // Parse "flag:quest_active" or "gold >= 50" ...
		          return ConditionParser::evaluate(condition);
		      }
		  };
		  ```
	- ## Using Existing Dialogue Tools
	  collapsed:: true
		- | Tool | Language | Engine | Notes |
		  |---|---|---|---|
		  | **Ink** | Inkle's scripting language | Unity, Godot | Narrative-first. Powers "80 Days", "Heaven's Vault" |
		  | **Yarn Spinner** | Yarn Script | Unity, Godot, Unreal | Perfect for games with lots of NPC dialogue |
		  | **Twine** | Sugarcane/Harlowe | Export to JSON | Great prototyping tool for branching stories |
		  | **Dialogue Designer** | JSON/Graph Editor | Any engine | Standalone node-graph GUI exported as JSON |
		  | **Custom JSON** | Any | Any | Maximum flexibility for complex games |
		- ```gdscript
		  # Godot + Dialogic plugin (https://github.com/dialogic-godot/dialogic)
		  # Dialogic.start("blacksmith_kira_main") # That's it!
		  
		  # Godot + Yarn Spinner
		  # dialogueRunner.StartDialogue("BlacksmithIntro")
		  ```
- # 4 — Save & Load System
  collapsed:: true
	- ## What Needs to Be Saved
	  collapsed:: true
		- ```mermaid
		  graph TD
		      SaveState["Save State"]
		      subgraph World["World State"]
		          WS["Quest progress, flags & choices"]
		          NPC["NPC states (alive/dead, relationship)"]
		          Items["World items (placed/picked up)"]
		          Chunks["Chunk generation seeds"]
		      end
		      subgraph Player["Player State"]
		          PS["Position & rotation"]
		          Stats["Level, stats, attributes"]
		          Inv["Inventory contents"]
		          Equip["Equipped items"]
		      end
		      subgraph Meta["Meta"]
		          Time["In-game time & date"]
		          Settings["Graphics / audio settings"]
		          Screenshot["Save slot thumbnail"]
		      end
		  
		      SaveState --> World
		      SaveState --> Player
		      SaveState --> Meta
		  ```
	- ## Serialization Design
	  collapsed:: true
		- | Format | Pros | Cons | Best For |
		  |---|---|---|---|
		  | **JSON** | Human-readable, easy to debug, version-friendly | Larger file size, slower parsing | Most games — the default choice |
		  | **Binary** | Tiny files, fastest read/write | Unreadable, fragile to schema changes | Large worlds, console games |
		  | **MessagePack** | Binary + JSON-compatible schema | External library needed | Mobile games (small file sizes) |
		  | **SQLite** | Structured, query-able, safe | Overkill for simple games | Complex simulations, MMO state |
		  | **XML** | Very portable | Verbose, slow | Legacy engines |
	- ## Save System in C++
	  collapsed:: true
		- ```cpp
		  #include <nlohmann/json.hpp> // Single-header JSON library
		  using json = nlohmann::json;
		  
		  // Every saveable object implements this interface
		  class ISaveable {
		  public:
		      virtual json serialize()          const = 0;
		      virtual void deserialize(const json& data)  = 0;
		  };
		  
		  // Serialize the player
		  class Player : public ISaveable {
		  public:
		      json serialize() const override {
		          return json{
		              {"version",       2},                  // SCHEMA VERSION — critical!
		              {"position",      {pos.x, pos.y, pos.z}},
		              {"level",         level},
		              {"health",        health},
		              {"max_health",    maxHealth},
		              {"inventory",     inventory.serialize()},
		              {"equipment",     equipment.serialize()},
		              {"stats",         stats},              // Flat map of stat modifiers
		          };
		      }
		  
		      void deserialize(const json& data) override {
		          // Version migration: handle old save files
		          int version = data.value("version", 1);
		          if (version < 2) migrateSaveV1toV2(data);
		  
		          auto posData = data["position"];
		          pos          = { posData[0], posData[1], posData[2] };
		          level        = data["level"];
		          health       = data["health"];
		          maxHealth    = data["max_health"];
		          inventory.deserialize(data["inventory"]);
		          equipment.deserialize(data["equipment"]);
		      }
		  };
		  
		  class SaveManager {
		      const std::string saveDirectory = "saves/";
		  
		  public:
		      // Write a save slot
		      void save(int slot, const GameWorld& world, const Player& player) {
		          json saveData;
		          saveData["save_version"]   = GAME_BUILD_VERSION;
		          saveData["save_timestamp"] = std::time(nullptr);
		          saveData["play_time_sec"]  = playTimer.getTotalSeconds();
		          saveData["world"]          = world.serialize();
		          saveData["player"]         = player.serialize();
		          saveData["quest_state"]    = QuestManager::instance().serialize();
		  
		          std::string filename = saveDirectory + "slot_" + std::to_string(slot) + ".sav";
		  
		          // Write atomically: write to temp file then rename to prevent corruption
		          std::string tempfile = filename + ".tmp";
		          std::ofstream f(tempfile);
		          f << saveData.dump(4); // Pretty-print with indent 4
		          f.close();
		          std::filesystem::rename(tempfile, filename); // Atomic on most OS
		      }
		  
		      void load(int slot, GameWorld& world, Player& player) {
		          std::string filename = saveDirectory + "slot_" + std::to_string(slot) + ".sav";
		  
		          if (!std::filesystem::exists(filename))
		              throw std::runtime_error("Save file not found: " + filename);
		  
		          std::ifstream f(filename);
		          json saveData = json::parse(f);
		  
		          world.deserialize(saveData["world"]);
		          player.deserialize(saveData["player"]);
		          QuestManager::instance().deserialize(saveData["quest_state"]);
		      }
		  };
		  ```
	- ## Save File Versioning (Critical Practice)
	  collapsed:: true
		- > [!warning] Version Your Save Files
		  > If you ship a game update that changes item IDs, removes a quest, or adds new fields to Player — your players' old save files MUST still load without crashing.
		  > Always write a migration function from version N to N+1.
		- ```cpp
		  json migrateSaveV1toV2(const json& v1Data) {
		      json v2 = v1Data;
		      v2["version"] = 2;
		  
		      // v1 stored health as int, v2 uses float
		      v2["health"] = static_cast<float>(v1Data["health"].get<int>());
		  
		      // v1 didn't have "max_health" — derive from level
		      v2["max_health"] = 100.0f + v1Data["level"].get<int>() * 10.0f;
		  
		      // v1 used old item ids — remap them
		      for (auto& slot : v2["inventory"]["slots"]) {
		          if (slot["id"] == "potion_hp") slot["id"] = "health_potion_basic";
		      }
		      return v2;
		  }
		  ```
	- ## Save System in Godot (GDScript)
	  collapsed:: true
		- ```gdscript
		  # save_manager.gd — Autoload
		  extends Node
		  
		  const SAVE_DIR = "user://saves/"
		  
		  func save_game(slot: int) -> void:
		      var save_data := {
		          "version":       GameConfig.SAVE_VERSION,
		          "timestamp":     Time.get_unix_time_from_system(),
		          "player":        Player.serialize(),
		          "quests":        QuestManager.serialize(),
		          "world_flags":   WorldState.to_dict(),
		      }
		  
		      DirAccess.make_dir_recursive_absolute(SAVE_DIR)
		      var path := SAVE_DIR + "slot_%d.save" % slot
		  
		      var file := FileAccess.open(path, FileAccess.WRITE)
		      file.store_var(save_data, true) # store_var uses binary encoding
		      file.close()
		      print("Game saved to slot %d" % slot)
		  
		  func load_game(slot: int) -> bool:
		      var path := SAVE_DIR + "slot_%d.save" % slot
		      if not FileAccess.file_exists(path): return false
		  
		      var file := FileAccess.open(path, FileAccess.READ)
		      var data: Dictionary = file.get_var(true)
		      file.close()
		  
		      if data.get("version", 0) < GameConfig.SAVE_VERSION:
		          data = SaveMigrator.migrate(data) # Run migrations
		  
		      Player.deserialize(data["player"])
		      QuestManager.deserialize(data["quests"])
		      WorldState.from_dict(data["world_flags"])
		      return true
		  ```
- # 5 — Achievement System
  collapsed:: true
	- ## Achievement Data Model
	  collapsed:: true
		- ```cpp
		  struct AchievementDefinition {
		      std::string id;           // "first_blood"
		      std::string title;        // "First Blood"
		      std::string description;  // "Defeat your first enemy"
		      std::string iconPath;
		      bool        isHidden;     // Hidden until unlocked (no spoilers!)
		      bool        isPointBased; // If true, has progress (e.g., kill 100 enemies)
		      int         targetValue;  // 100 for "Kill 100 enemies"
		  };
		  
		  struct AchievementProgress {
		      std::string id;
		      bool        isUnlocked;
		      int         currentValue; // For progressive achievements
		      int64_t     unlockTime;   // Unix timestamp
		  };
		  ```
	- ## Achievement Manager (Event-Driven)
	  collapsed:: true
		- ```cpp
		  // The WRONG way: Check achievements inside game code
		  void Player::onEnemyKilled(Enemy* enemy) {
		      killCount++;
		      // ❌ This creates massive coupling — player knows about achievements
		      if (killCount == 1) AchievementManager::unlock("first_blood");
		      if (killCount == 100) AchievementManager::unlock("centurion");
		  }
		  
		  // The RIGHT way: event-driven, fully decoupled
		  void Player::onEnemyKilled(Enemy* enemy) {
		      killCount++;
		      // Player just fires an event
		      EventBus::fire("enemy_killed", { {"type", enemy->type}, {"count", killCount} });
		  }
		  
		  // AchievementManager LISTENS for events
		  class AchievementManager {
		  public:
		      void initialize() {
		          EventBus::on("enemy_killed", [this](const EventData& data) {
		              // Try to advance any achievement waiting for this event
		              tryAdvance("first_blood",  "enemy_killed", 1, 1);
		              tryAdvance("centurion",    "enemy_killed", data["count"], 100);
		              tryAdvance("undead_slayer","enemy_killed",
		                         data["type"] == "undead" ? 1 : 0, 50);
		          });
		  
		          EventBus::on("quest_completed", [this](const EventData& data) {
		              tryAdvance("quest_novice",  "quests_done", 1, 1);
		              tryAdvance("quest_veteran", "quests_done", questsDone, 50);
		          });
		      }
		  
		      void tryAdvance(const std::string& achievId, const std::string& stat,
		                       int amount, int target) {
		          auto& progress = playerProgress[achievId];
		          if (progress.isUnlocked) return;
		  
		          progress.currentValue += amount;
		          if (progress.currentValue >= target) {
		              unlock(achievId);
		          } else {
		              // Notify UI of progress change (for progress bars)
		              onProgressUpdated.broadcast(achievId, progress.currentValue, target);
		          }
		      }
		  
		      void unlock(const std::string& achievId) {
		          auto& progress         = playerProgress[achievId];
		          progress.isUnlocked    = true;
		          progress.unlockTime    = std::time(nullptr);
		  
		          // Notify UI — show toast notification
		          onAchievementUnlocked.broadcast(achievId);
		  
		          // Platform integration
		          PlatformAchievements::unlock(achievId); // Steam / PSN / Xbox Live
		      }
		  };
		  ```
	- ## Platform Achievement Integration
	  collapsed:: true
		- | Platform | API | Notes |
		  |---|---|---|
		  | **Steam** | `ISteamUserStats::SetAchievement()` | Via Steamworks SDK |
		  | **PlayStation** | `sceNpTrophyUnlockTrophy()` | Via PSN SDK |
		  | **Xbox** | `XblAchievementsUpdateAchievementAsync()` | Via GDK |
		  | **Apple Game Center** | `GKAchievement.report()` | Swift / ObjC on iOS/macOS |
		  | **Google Play Games** | `achievementsClient.unlock()` | Android / Kotlin |
		  | **Godot (all platforms)** | `SteamAchievement` + GodotSteam plugin | |
		  | **Unity** | `Social.ReportProgress()` | Unified Social API, platform specific |
- # 6 — Procedural Generation
  collapsed:: true
	- ## Key Noise Functions
	  collapsed:: true
		- ```mermaid
		  graph TD
		      Noise["Noise Functions\n(the backbone of procedural generation)"]
		      Value["Value Noise\nSmoothed random values\nFast, cheap, blocky look"]
		      Perlin["Perlin Noise\nGradient-based smooth variation\nInfinitely tileable"]
		      Simplex["Simplex/OpenSimplex Noise\nFewer artifacts than Perlin\nBetter for 3D/4D (terrain + time)"]
		      Worley["Worley (Voronoi) Noise\nDistance to nearest random point\nPerfect for cell/cave textures"]
		      FBM["Fractal Brownian Motion\n(fbm) = layered noise octaves\nMakes terrain look organic"]
		  
		      Noise --> Value
		      Noise --> Perlin
		      Noise --> Simplex
		      Noise --> Worley
		      Perlin --> FBM
		      Simplex --> FBM
		  ```
	- ## Terrain Generation with FBM
	  collapsed:: true
		- ```cpp
		  #include <cmath>
		  #include <functional>
		  
		  // Simple 2D Perlin-like noise (use FastNoiseLite in production)
		  float smoothNoise(float x, float y) { /* Perlin implementation */ }
		  
		  // Fractal Brownian Motion — stack multiple octaves of noise
		  float fbm(float x, float y,
		             int   octaves    = 6,
		             float frequency  = 0.005f,
		             float amplitude  = 1.0f,
		             float lacunarity = 2.0f,  // Each octave doubles frequency
		             float gain       = 0.5f)  // Each octave halves amplitude
		  {
		      float value      = 0.0f;
		      float normFactor = 0.0f;
		  
		      for (int i = 0; i < octaves; ++i) {
		          value      += amplitude * smoothNoise(x * frequency, y * frequency);
		          normFactor += amplitude;
		          frequency  *= lacunarity;
		          amplitude  *= gain;
		      }
		  
		      return value / normFactor; // Normalized to [0, 1]
		  }
		  
		  float getHeightAt(int worldX, int worldZ, uint64_t seed) {
		      float height = fbm(worldX + seed, worldZ + seed);
		  
		      // Apply a curve: flatten the ocean floor, sharpen mountain peaks
		      height = std::pow(height, 1.5f); // Exponential = sharper peaks
		  
		      return height * MAX_WORLD_HEIGHT; // Scale to world units
		  }
		  
		  // Biome determination from multiple noise channels
		  enum class Biome { Desert, Plains, Forest, Mountains, Tundra, Ocean };
		  
		  Biome getBiomeAt(int worldX, int worldZ, uint64_t seed) {
		      float temperature = fbm(worldX * 0.003f + seed * 0.1f, worldZ * 0.003f, 4);
		      float humidity    = fbm(worldX * 0.004f, worldZ * 0.004f + seed * 0.2f, 4);
		  
		      if (humidity > 0.6f && temperature > 0.5f) return Biome::Forest;
		      if (temperature > 0.7f && humidity < 0.3f) return Biome::Desert;
		      if (temperature < 0.2f)                    return Biome::Tundra;
		      return Biome::Plains;
		  }
		  ```
	- ## Dungeon Generation: BSP Algorithm
	  collapsed:: true
		- ```cpp
		  // Binary Space Partitioning — split a rectangle repeatedly, put a room in each leaf
		  struct Rect { int x, y, w, h; };
		  
		  struct BSPNode {
		      Rect area;
		      std::unique_ptr<BSPNode> left, right;
		      std::optional<Rect> room;
		  
		      bool isLeaf() const { return !left && !right; }
		  };
		  
		  void split(BSPNode& node, int minSize, std::mt19937& rng) {
		      if (node.area.w < minSize * 2 && node.area.h < minSize * 2) {
		          // Too small to split — place a room here
		          int rw = std::uniform_int_distribution(minSize, node.area.w)(rng);
		          int rh = std::uniform_int_distribution(minSize, node.area.h)(rng);
		          int rx = node.area.x + std::uniform_int_distribution(0, node.area.w - rw)(rng);
		          int ry = node.area.y + std::uniform_int_distribution(0, node.area.h - rh)(rng);
		          node.room = Rect{ rx, ry, rw, rh };
		          return;
		      }
		  
		      bool splitHorizontal = node.area.h > node.area.w;
		  
		      if (splitHorizontal) {
		          int split = std::uniform_int_distribution(minSize, node.area.h - minSize)(rng);
		          node.left  = std::make_unique<BSPNode>(Rect{node.area.x, node.area.y, node.area.w, split});
		          node.right = std::make_unique<BSPNode>(Rect{node.area.x, node.area.y + split, node.area.w, node.area.h - split});
		      } else {
		          int split = std::uniform_int_distribution(minSize, node.area.w - minSize)(rng);
		          node.left  = std::make_unique<BSPNode>(Rect{node.area.x, node.area.y, split, node.area.h});
		          node.right = std::make_unique<BSPNode>(Rect{node.area.x + split, node.area.y, node.area.w - split, node.area.h});
		      }
		  
		      split(*node.left,  minSize, rng);
		      split(*node.right, minSize, rng);
		  }
		  ```
	- ## Wave Function Collapse (WFC)
	  collapsed:: true
		- WFC generates structured content (tile-based maps, 3D buildings) by observing constraints and collapsing possibilities.
		- | Concept | Explanation |
		  |---|---|
		  | **Tiles** | The input building blocks (grass, wall, door, corner, etc.) |
		  | **Adjacency Rules** | "Tile GRASS can be next to GRASS or PATH, never WALL" |
		  | **Entropy** | Less certain positions (more possible tiles) = higher entropy |
		  | **Collapse** | Pick the lowest-entropy cell, randomly pick one of its possible tiles |
		  | **Propagate** | After collapsing one cell, update neighbors' possibilities, might trigger more collapses |
		- ```python
		  # Simplified WFC pseudocode
		  def wfc_generate(grid, adjacency_rules, seed):
		      random.seed(seed)
		  
		      # Initialize: every cell can be any tile
		      for cell in grid:
		          cell.possibilities = ALL_TILES
		  
		      while not all_collapsed(grid):
		          # Find cell with lowest entropy (fewest options, but > 1)
		          cell = min((c for c in grid if not c.collapsed), key=lambda c: len(c.possibilities))
		  
		          # Collapse: randomly pick one possibility
		          cell.tile = random.choice(list(cell.possibilities))
		          cell.collapsed = True
		  
		          # Propagate: update neighbors
		          propagate(cell, grid, adjacency_rules)
		  
		      return grid
		  
		  def propagate(changed_cell, grid, rules):
		      queue = [changed_cell]
		      while queue:
		          cell = queue.pop()
		          for neighbor in cell.neighbors:
		              if neighbor.collapsed: continue
		              allowed = rules.get_allowed(cell.tile, direction_to(cell, neighbor))
		              new_possible = neighbor.possibilities & allowed
		              if new_possible != neighbor.possibilities:
		                  neighbor.possibilities = new_possible
		                  queue.append(neighbor) # Propagate further
		              if len(new_possible) == 0:
		                  raise Exception("Contradiction! Backtrack needed.")
		  ```
		- > [!tip] [mxgmn/WaveFunctionCollapse](https://github.com/mxgmn/WaveFunctionCollapse) — The original WFC implementation with examples. Free and open source.
	- ## Procedural Tools and Libraries
	  collapsed:: true
		- | Tool / Library | Language | Purpose |
		  |---|---|---|
		  | **FastNoiseLite** | C++, C#, GLSL | Fastest noise library — Perlin, Simplex, Cellular, Value |
		  | **libnoise** | C++ | Classic noise composition tools |
		  | **PolyHaven** | Any | Free CC0 texture maps, useful as procedural inputs |
		  | **DunGen** | JS/TS | Dungeon generator (BSP, Cellular Automata) |
		  | **WaveFunctionCollapse** | C# | Original WFC by mxgmn |
		  | **Godot FastNoiseLite** | GDScript | Built-in! `var noise = FastNoiseLite.new()` |
		  | **Unity Terrain Tools** | C# | Height map generation + biome blending |
- # More Learn — Free Resources
	- [Game Programming Patterns (Robert Nystrom)](https://gameprogrammingpatterns.com/) - Free web book. The bible of game systems patterns.
	- [RedBlobGames](https://www.redblobgames.com/) - Interactive visualizations of pathfinding, noise, hex grids.
	- [Roguelike Tutorial (Python)](https://rogueliketutorials.com/) - Full dungeon gen + item/quest systems from scratch.
	- [FastNoiseLite (GitHub)](https://github.com/Auburn/FastNoiseLite) - Best noise library available.
	- [WFC by mxgmn (GitHub)](https://github.com/mxgmn/WaveFunctionCollapse) - Original WFC with many examples.
	- [GDQuest (Godot)](https://www.gdquest.com/) - Free Godot tutorials on inventory, saving, and more.
	- [InkleStudios/Ink](https://github.com/inkle/ink) - Free, open-source narrative scripting language for games.
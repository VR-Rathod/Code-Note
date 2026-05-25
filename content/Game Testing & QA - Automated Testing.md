---
seoTitle: Automated Testing for Games – Game Testing & QA Guide
description: "Complete automated game testing reference: Unity Test Framework, Unreal Automation, headless testing, CI/CD pipelines for games, screenshot regression, simulation testing, and game-specific automation patterns."
keywords: "automated game testing, Unity Test Framework, Unreal Automation, game CI/CD, headless testing, screenshot regression, game unit testing, simulation testing, VR-Rathod, Code-Note"
displayTitle: Game Testing & QA - Automated Testing
---

> [!info] About This Page
> This page covers **automated testing for games** — unit testing game logic, engine automation frameworks, CI/CD pipelines, headless testing, and screenshot regression.
> Parent: [[Game Testing & QA]]. See also: [[Game Testing & QA - Performance Profiling]], [[QA and Testing]].

> [!warning] Automation Coverage is Lower in Games
> A typical web app can achieve 80–90% automated test coverage. A typical game reaches 30–50%. This is not a failure — physics, AI, and "fun" are not deterministically testable. Focus automation on logic, data integrity, and regression safety nets.

- # Why Automate Game Tests?
  collapsed:: true
	- ```
	  Without automation:
	    - Every build requires manual regression of all features
	    - Bugs reappear because nobody retested old scenarios
	    - QA becomes the bottleneck before every milestone
	  
	  With automation:
	    - Regression runs every commit (30 min → 5 min unattended)
	    - Logic bugs caught before QA even sees the build
	    - Refactoring is safer — tests tell you if you broke something
	    - Performance budgets enforced per-build automatically
	  ```
	-
	- ## What CAN Be Automated in Games
	  collapsed:: true
		- ```
		  ✅ Game logic / rules (damage calculation, loot tables, XP formulas)
		  ✅ Save/Load round-trip (save state → reload → verify state matches)
		  ✅ Input → state transitions (press button → verify animation state)
		  ✅ AI state machines (verify correct state transitions)
		  ✅ Inventory / economy systems
		  ✅ Level/scene loading (verify scenes load without errors)
		  ✅ Screenshot regression (verify visuals didn't change unexpectedly)
		  ✅ Performance budgets (FPS / memory checked per build)
		  ✅ Build validation (game boots, main menu loads, no crash in 60s)
		  ```
	-
	- ## What is Hard to Automate
	  collapsed:: true
		- ```
		  ❌ "Is this fun?" — subjective, requires human playtesters
		  ❌ Emergent physics interactions — non-deterministic
		  ❌ AI behaviour quality — "does it feel smart?"
		  ❌ Exploits / edge-case player creativity
		  ❌ Accessibility and usability
		  ❌ Anything requiring creative human judgement
		  ```
- # Unity Test Framework
  collapsed:: true
	- ## Setup
	  collapsed:: true
		- ```
		  Package: com.unity.test-framework (installed via Package Manager)
		  
		  Test types:
		    Edit Mode Tests — Run in the Unity editor without Play mode
		                      No scene/engine required. Pure logic.
		                      Fast: run in milliseconds.
		  
		    Play Mode Tests — Run inside the Unity player (in editor or standalone)
		                      Can test GameObjects, coroutines, physics.
		                      Slower: needs scene setup.
		  
		  Create tests:
		    Right-click Project → Create → Testing → C# Test Script
		    Or: Window → General → Test Runner → Create Test Script
		  ```
	-
	- ## Edit Mode Test (Pure Logic)
	  collapsed:: true
		- ```csharp
		  using NUnit.Framework;
		  using UnityEngine;
		  
		  // Edit mode test — no MonoBehaviour, no scene
		  [TestFixture]
		  public class DamageCalculatorTests {
		  
		      [Test]
		      public void BaseDamage_WithNoModifiers_ReturnsBaseDamage() {
		          var calc = new DamageCalculator();
		          float result = calc.Calculate(baseDamage: 100f, modifiers: null);
		          Assert.AreEqual(100f, result, 0.001f);
		      }
		  
		      [Test]
		      public void CriticalHit_DoublesBaseDamage() {
		          var calc = new DamageCalculator();
		          float result = calc.Calculate(baseDamage: 100f, isCritical: true);
		          Assert.AreEqual(200f, result, 0.001f);
		      }
		  
		      [Test]
		      public void NegativeDamage_ClampedToZero() {
		          var calc = new DamageCalculator();
		          float result = calc.Calculate(baseDamage: -50f);
		          Assert.GreaterOrEqual(result, 0f);
		      }
		  
		      // Parameterised test — runs once per set
		      [TestCase(100f, 0.5f, 50f)]
		      [TestCase(200f, 0.25f, 50f)]
		      [TestCase(0f,   2.0f,  0f)]
		      public void DamageWithMultiplier_ReturnsCorrectResult(
		          float baseDmg, float multiplier, float expected) {
		          var calc = new DamageCalculator();
		          Assert.AreEqual(expected, calc.Calculate(baseDmg, multiplier), 0.001f);
		      }
		  }
		  ```
	-
	- ## Play Mode Test (Scene & MonoBehaviour)
	  collapsed:: true
		- ```csharp
		  using System.Collections;
		  using NUnit.Framework;
		  using UnityEngine;
		  using UnityEngine.TestTools;
		  
		  public class PlayerMovementTests {
		  
		      private GameObject playerGO;
		      private PlayerController player;
		  
		      [SetUp]
		      public void SetUp() {
		          playerGO = new GameObject("Player");
		          player = playerGO.AddComponent<PlayerController>();
		      }
		  
		      [TearDown]
		      public void TearDown() {
		          Object.DestroyImmediate(playerGO);
		      }
		  
		      // IEnumerator = coroutine test (waits frames)
		      [UnityTest]
		      public IEnumerator PlayerMovesForward_WhenInputPressed() {
		          Vector3 startPos = playerGO.transform.position;
		  
		          player.SimulateInput(Vector2.up); // inject input
		          yield return new WaitForSeconds(0.5f); // wait 0.5s
		  
		          Assert.Greater(playerGO.transform.position.z, startPos.z,
		              "Player should have moved forward");
		      }
		  
		      [UnityTest]
		      public IEnumerator PlayerDies_WhenHealthReachesZero() {
		          player.TakeDamage(9999f);
		          yield return null; // wait one frame
		  
		          Assert.IsTrue(player.IsDead, "Player should be dead");
		      }
		  }
		  ```
	-
	- ## Testing Save / Load Systems
	  collapsed:: true
		- ```csharp
		  [Test]
		  public void SaveLoad_RoundTrip_PreservesPlayerData() {
		      // Arrange: create save state
		      var original = new SaveData {
		          playerLevel = 15,
		          playerHP    = 87f,
		          position    = new Vector3(100f, 0f, 250f),
		          inventory   = new[] { "Sword", "Shield", "Potion" }
		      };
		  
		      // Act: save then load
		      SaveSystem.Save(original, slot: 0);
		      var loaded = SaveSystem.Load(slot: 0);
		  
		      // Assert: data survives round-trip
		      Assert.AreEqual(original.playerLevel, loaded.playerLevel);
		      Assert.AreEqual(original.playerHP,    loaded.playerHP, 0.001f);
		      Assert.AreEqual(original.position,    loaded.position);
		      CollectionAssert.AreEqual(original.inventory, loaded.inventory);
		  }
		  ```
- # Unreal Engine Automation System
  collapsed:: true
	- ## Overview
	  collapsed:: true
		- ```
		  Unreal provides two automation layers:
		  
		  1. Automation Framework (C++)
		     Low-level test macros. Fast. For engine/gameplay logic.
		     Run via: Session Frontend → Automation tab
		             Or: UnrealEditor -ExecCmds="Automation RunTests MyGame"
		  
		  2. Functional Tests (in-engine Blueprint/C++)
		     Place AAutoTestBase actors in a test level.
		     Tests run in Play mode (actual game simulation).
		     Best for: feature-level integration tests.
		  
		  3. Gauntlet (CI automation framework)
		     Runs packaged game builds. Full end-to-end.
		     Used by Epic internally. Complex setup.
		     Best for: large studios with dedicated CI hardware.
		  ```
	-
	- ## C++ Unit Test
	  collapsed:: true
		- ```cpp
		  // MyGame.cpp — UE automation test macro
		  #include "Misc/AutomationTest.h"
		  #include "DamageSystem.h"
		  
		  // IMPLEMENT_SIMPLE_AUTOMATION_TEST(TestClass, Name, Flags)
		  IMPLEMENT_SIMPLE_AUTOMATION_TEST(
		      FDamageSystemTest,
		      "MyGame.Gameplay.DamageSystem.CritHitDoublesBaseDamage",
		      EAutomationTestFlags::ApplicationContextMask |
		      EAutomationTestFlags::ProductFilter
		  )
		  
		  bool FDamageSystemTest::RunTest(const FString& Parameters) {
		      UDamageSystem* System = NewObject<UDamageSystem>();
		  
		      float BaseDamage  = 100.0f;
		      float CritDamage  = System->CalculateDamage(BaseDamage, true);
		  
		      // TestEqual(description, actual, expected)
		      TestEqual(TEXT("Crit damage doubles base"), CritDamage, 200.0f);
		  
		      float NormalDamage = System->CalculateDamage(BaseDamage, false);
		      TestEqual(TEXT("Normal damage == base"), NormalDamage, 100.0f);
		  
		      return true; // return false if test should fail
		  }
		  ```
	-
	- ## Blueprint Functional Test
	  collapsed:: true
		- ```
		  Setup in UE Editor:
		    1. Create test map: Maps/Test_PlayerMovement
		    2. Place AFunctionalTest actor in map
		    3. In event graph:
		       Event StartTest →
		         [Spawn Player at start position]
		         [Apply forward input for 1 second]
		         [Assert: Player Z > startZ + 100]
		         [Finish Test (Success/Failure)]
		  
		  Run: Session Frontend → Automation → Find "MyGame" tests → Run All
		  
		  Good for: Testing level-specific mechanics, triggers, AI behaviour.
		  ```
- # Godot Test Framework (GUT)
  collapsed:: true
	- ## Setup
	  collapsed:: true
		- ```
		  GUT (Godot Unit Test) — Plugin by bitwes
		  Install: AssetLib → search "GUT" → Download & Install
		  
		  Create test: res://test/test_damage_calculator.gd
		  Class must extend GutTest
		  ```
	-
	- ## GUT Test Example
	  collapsed:: true
		- ```gdscript
		  extends GutTest
		  
		  var damage_calc: DamageCalculator
		  
		  func before_each():
		      damage_calc = DamageCalculator.new()
		  
		  func after_each():
		      damage_calc.free()
		  
		  func test_base_damage_returns_correct_value():
		      var result = damage_calc.calculate(100.0, false)
		      assert_eq(result, 100.0, "Base damage should be 100")
		  
		  func test_critical_hit_doubles_damage():
		      var result = damage_calc.calculate(100.0, true)
		      assert_eq(result, 200.0, "Crit should double damage")
		  
		  func test_damage_never_negative():
		      var result = damage_calc.calculate(-50.0, false)
		      assert_gte(result, 0.0, "Damage cannot be negative")
		  
		  func test_multiple_values():
		      # Parameterised-style loop
		      var cases = [
		          [100.0, 0.5, 50.0],
		          [200.0, 0.25, 50.0],
		          [0.0, 2.0, 0.0],
		      ]
		      for c in cases:
		          var r = damage_calc.calculate(c[0], false, c[1])
		          assert_almost_eq(r, c[2], 0.001, str("Failed for: ", c))
		  ```
- # Screenshot Regression Testing
  collapsed:: true
	- ## What is Screenshot Regression?
	  collapsed:: true
		- ```
		  Capture a screenshot at key moments → compare to golden reference.
		  If pixels differ beyond threshold → flag for human review.
		  
		  Use cases:
		    - UI layout didn't break after a UI refactor
		    - Shader change didn't introduce visual artifacts
		    - LOD transition still looks acceptable
		    - New post-process didn't break existing scenes
		  
		  NOT a substitute for manual visual review.
		  IS a safety net to catch unexpected visual regressions automatically.
		  ```
	-
	- ## Unity Screenshot Test
	  collapsed:: true
		- ```csharp
		  using System.Collections;
		  using NUnit.Framework;
		  using UnityEngine;
		  using UnityEngine.TestTools;
		  using UnityEngine.TestTools.Graphics; // Unity Graphics Testing package
		  
		  public class ScreenshotRegressionTests {
		  
		      [UnityTest]
		      [ImageComparisonSettings(
		          TargetWidth = 1920, TargetHeight = 1080,
		          AverageCorrectnessThreshold = 0.005f)] // 0.5% pixel diff allowed
		      public IEnumerator MainMenu_MatchesGoldenImage() {
		          // Load main menu scene
		          yield return SceneLoader.LoadAsync("MainMenu");
		          yield return new WaitForSeconds(1f); // wait for animations to settle
		  
		          // The test framework captures screenshot and compares to stored reference
		          ImageAssert.AreEqual(
		              Resources.Load<Texture2D>("GoldenImages/MainMenu"),
		              Camera.main,
		              new ImageComparisonSettings()
		          );
		      }
		  }
		  ```
- # CI/CD for Games
  collapsed:: true
	- ## CI Pipeline Architecture
	  collapsed:: true
		- ```
		  Trigger: Push to main / pull request
		  
		  Stage 1 — Fast Checks (< 5 min):
		    ✅ Compile check (no build errors)
		    ✅ Static analysis / linting
		    ✅ Unit tests (Edit Mode — no engine needed)
		  
		  Stage 2 — Engine Tests (5–20 min):
		    ✅ Play Mode tests (engine required)
		    ✅ Functional tests in headless mode
		    ✅ Screenshot regression check
		  
		  Stage 3 — Build & Package (20–60 min):
		    ✅ Build for target platform(s)
		    ✅ Basic smoke test (boot game, reach main menu)
		    ✅ Performance benchmark (FPS/memory check)
		  
		  Stage 4 — Nightly / Pre-Release:
		    ✅ Full regression suite
		    ✅ Soak test (run 4 hours unattended)
		    ✅ Build artifact uploaded (for QA to test)
		  ```
	-
	- ## GitHub Actions — Unity CI Example
	  collapsed:: true
		- ```yaml
		  # .github/workflows/unity-tests.yml
		  name: Unity CI
		  on: [push, pull_request]
		  
		  jobs:
		    test:
		      name: Run Unity Tests
		      runs-on: ubuntu-latest
		      steps:
		        - uses: actions/checkout@v4
		          with: { lfs: true }
		  
		        - uses: game-ci/unity-test-runner@v4
		          id: tests
		          env:
		            UNITY_LICENSE: ${{ secrets.UNITY_LICENSE }}
		          with:
		            unityVersion: 2023.2.5f1
		            testMode: editmode
		            artifactsPath: test-results
		            coverageOptions: generateAdditionalMetrics
		  
		        - uses: actions/upload-artifact@v4
		          if: always()
		          with:
		            name: test-results
		            path: test-results
		  
		    build:
		      needs: test
		      name: Build Game
		      runs-on: ubuntu-latest
		      steps:
		        - uses: actions/checkout@v4
		          with: { lfs: true }
		  
		        - uses: game-ci/unity-builder@v4
		          env:
		            UNITY_LICENSE: ${{ secrets.UNITY_LICENSE }}
		          with:
		            targetPlatform: StandaloneLinux64
		            unityVersion: 2023.2.5f1
		  ```
	-
	- ## Headless Game Testing
	  collapsed:: true
		- ```
		  Run game without a display (for CI servers):
		  
		  Unity headless:
		    ./MyGame.x86_64 -batchmode -nographics -logFile output.log
		    -batchmode: no display required
		    -nographics: skip GPU init (pure logic / server only)
		  
		  Unreal headless:
		    ./MyGame -nullrhi -unattended -log
		    -nullrhi: null rendering (no GPU)
		    -unattended: suppress dialog boxes
		  
		  Use for:
		    ✅ Server-side simulation (multiplayer game server)
		    ✅ Logic tests that don't need rendering
		    ✅ AI/pathfinding simulations
		    ✅ Soak tests on a bare server
		  
		  Cannot use for:
		    ❌ Screenshot testing (needs GPU)
		    ❌ Visual regression
		    ❌ Platform-specific rendering tests
		  ```
- # Testing Game Systems
  collapsed:: true
	- ## Inventory System Tests
	  collapsed:: true
		- ```csharp
		  [TestFixture]
		  public class InventoryTests {
		  
		      [Test]
		      public void AddItem_WhenInventoryNotFull_ItemAdded() {
		          var inventory = new Inventory(maxSlots: 10);
		          bool added = inventory.Add(new Item("Sword"));
		          Assert.IsTrue(added);
		          Assert.AreEqual(1, inventory.Count);
		      }
		  
		      [Test]
		      public void AddItem_WhenInventoryFull_ReturnsFalse() {
		          var inventory = new Inventory(maxSlots: 1);
		          inventory.Add(new Item("Sword")); // fill it
		          bool added = inventory.Add(new Item("Shield")); // try to add
		          Assert.IsFalse(added);
		          Assert.AreEqual(1, inventory.Count);
		      }
		  
		      [Test]
		      public void RemoveItem_ExistingItem_ItemRemoved() {
		          var inventory = new Inventory(maxSlots: 10);
		          var sword = new Item("Sword");
		          inventory.Add(sword);
		          inventory.Remove(sword);
		          Assert.AreEqual(0, inventory.Count);
		      }
		  
		      [Test]
		      public void StackableItem_AddsToExistingStack() {
		          var inventory = new Inventory(maxSlots: 10);
		          inventory.Add(new Item("Potion", stackable: true, count: 5));
		          inventory.Add(new Item("Potion", stackable: true, count: 3));
		          Assert.AreEqual(1, inventory.Count); // still 1 slot
		          Assert.AreEqual(8, inventory.GetStack("Potion").Count);
		      }
		  }
		  ```
	-
	- ## Loot Table Tests
	  collapsed:: true
		- ```csharp
		  [Test]
		  public void LootTable_DropRates_WithinStatisticalBounds() {
		      var lootTable = new LootTable(new[] {
		          new LootEntry("Common Item", weight: 70),
		          new LootEntry("Rare Item",   weight: 25),
		          new LootEntry("Epic Item",   weight: 5),
		      });
		  
		      int common = 0, rare = 0, epic = 0;
		      int rolls = 10000;
		  
		      for (int i = 0; i < rolls; i++) {
		          string drop = lootTable.Roll(new System.Random(i));
		          if (drop == "Common Item") common++;
		          else if (drop == "Rare Item") rare++;
		          else if (drop == "Epic Item") epic++;
		      }
		  
		      // Allow ±5% variance
		      Assert.AreEqual(0.70f, (float)common / rolls, 0.05f);
		      Assert.AreEqual(0.25f, (float)rare   / rolls, 0.05f);
		      Assert.AreEqual(0.05f, (float)epic    / rolls, 0.05f);
		  }
		  ```
- # Automated Performance Tests
  collapsed:: true
	- ## FPS Budget Test (Unity)
	  collapsed:: true
		- ```csharp
		  [UnityTest]
		  [Performance]
		  public IEnumerator MainGameplay_FPS_AboveMinimum() {
		      yield return SceneLoader.LoadAsync("Level1_Combat");
		      yield return new WaitForSeconds(2f); // warm up
		  
		      // Measure for 5 seconds
		      var fpsValues = new List<float>();
		      float elapsed = 0f;
		      while (elapsed < 5f) {
		          fpsValues.Add(1f / Time.deltaTime);
		          elapsed += Time.deltaTime;
		          yield return null;
		      }
		  
		      float avgFPS = fpsValues.Average();
		      float minFPS = fpsValues.Min();
		  
		      // Assert performance budgets
		      Assert.GreaterOrEqual(avgFPS, 55f, $"Avg FPS {avgFPS:F1} below 55 target");
		      Assert.GreaterOrEqual(minFPS, 30f, $"Min FPS {minFPS:F1} — severe spike detected");
		  }
		  ```
	-
	- ## Unity Performance Testing Package
	  collapsed:: true
		- ```csharp
		  using Unity.PerformanceTesting;
		  
		  [Test, Performance]
		  public void DamageCalculation_Performance() {
		      var calc = new DamageCalculator();
		  
		      // Run 1000 iterations and measure
		      Measure.Method(() => {
		          calc.Calculate(100f, true);
		      })
		      .WarmupCount(100)
		      .MeasurementCount(1000)
		      .Run();
		  
		      // Results visible in Test Runner → Performance Report
		      // Trend tracked across builds automatically
		  }
		  ```
- # Tools Summary
  collapsed:: true
	- | Tool | Engine | Type | Cost |
	  |------|--------|------|------|
	  | Unity Test Framework | Unity | Unit + Play Mode | Free (built-in) |
	  | Unity Performance Testing | Unity | Perf benchmarks | Free (package) |
	  | Unity Graphics Testing | Unity | Screenshot regression | Free (package) |
	  | Unreal Automation System | Unreal | Unit + Functional | Free (built-in) |
	  | Unreal Gauntlet | Unreal | E2E / Soak | Free (built-in) |
	  | GUT | Godot | Unit tests | Free (plugin) |
	  | GameDriver | Unity/Unreal | UI + E2E automation | Paid |
	  | AltTester | Unity | UI automation | Free + Paid |
	  | Game CI (game-ci.com) | Unity/Godot/UE | GitHub Actions runner | Free |
	  | PlasticSCM / Perforce | Any | Version control + CI | Paid |
- # Useful Links & Resources
	- [Unity Test Framework docs](https://docs.unity3d.com/Packages/com.unity.test-framework@latest) — Official UTf documentation
	- [Unity Performance Testing](https://docs.unity3d.com/Packages/com.unity.test-framework.performance@latest) — Performance benchmarking
	- [Unreal Automation Spec](https://dev.epicgames.com/documentation/en-us/unreal-engine/automation-spec-in-unreal-engine) — Modern UE test spec format
	- [GUT – Godot Unit Test](https://github.com/bitwes/Gut) — Godot test framework
	- [Game CI](https://game-ci.com) — Unity/Godot/UE GitHub Actions CI
	- [AltTester](https://alttester.com) — Unity UI automation
	- [GameDriver.io](https://gamedriver.io) — Cross-engine E2E automation
	- [GDC: Testing at Scale](https://gdcvault.com/search.php#&keyword=automated+testing) — GDC automation talks
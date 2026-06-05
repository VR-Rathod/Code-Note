---
seoTitle: Game AI – Complete Guide from Finite State Machines to Neural Networks
description: "Comprehensive Game AI reference covering FSM, Behavior Trees, GOAP, Utility AI, pathfinding (A*, NavMesh, Flow Fields), steering behaviors, Boids, perception systems, procedural generation, dialogue AI, Director AI, crowd simulation, Minimax, MCTS, ML-Agents, and reinforcement learning for games."
keywords: "game AI, finite state machine, behavior tree, GOAP, utility AI, A star pathfinding, navmesh, flow fields, steering behaviors, boids, perception systems, procedural generation, dialogue AI, director AI, crowd simulation, minimax, MCTS, ML-Agents, reinforcement learning game AI, neural networks games, VR-Rathod, Code-Note, code note vr, Vaibhav Rathod, vaibhav, Vaibhav vr book"
displayTitle: Game AI – NPC Intelligence & Decision Systems
treeTitle: Game Development - Game AI
enableToc: true
---

> [!info] About This Page
> Game AI is the craft of creating **believable, fun, and responsive** game characters — not general AI research.
> For game design theory see [[Game Design]]. For engine implementation see [[Unity]], [[Unreal Engine]], [[Godot]].
> For the math and algorithms underneath see [[DSA Algo & System Design]] (graphs, A*, trees) and [[Machine Learning]] (RL, neural networks).

- # Introduction to Game AI
  collapsed:: true
	- ## What is Game AI?
		- Game AI ≠ real AI research. Game AI = **creating the illusion of intelligence** to serve gameplay.
		- The goal is NOT to create the most intelligent agent — it's to create the **most FUN and believable one**.
		- Think of it this way: a chess-engine-level bot in an FPS makes the game unplayable. The enemy needs to miss sometimes, take cover believably, communicate with teammates — and still let a skilled player win. That balance is game AI.
		- Game AI borrows from many disciplines:
			- **Computer Science** — [[DSA Algo & System Design]] for graphs, trees, search algorithms
			- **Mathematics** — vectors, probability, linear algebra (covered in [[Machine Learning]])
			- **[[Game Design]]** — AI must serve design goals, not just be technically impressive
			- **Psychology** — players perceive intent, fairness, and personality
		- > [!warning] A Common Mistake
		  > A chess-engine-level AI in an FPS makes the game unplayable. Game AI must be **tunable** and deliberately imperfect. Players should feel clever, not helpless.
		-
	- ## AI Systems Architecture
		- Every game AI agent runs through the same loop every frame — **Perceive → Decide → Act**. The difference between a dumb Pong AI and an FEAR soldier is how deep each step goes.
		- ```mermaid
		  graph TD
		      Perception["👁️ PERCEPTION\nSensing the world"]
		      Decision["🧠 DECISION MAKING\nWhat to do next"]
		      Action["🎬 ACTION\nExecute the decision"]
		      Movement["🏃 MOVEMENT\nHow to get there"]
		      Animation["🎭 ANIMATION\nLook believable"]
		      Perception --> Decision --> Action --> Movement --> Animation
		      Animation --> Perception
		      subgraph World["World State"]
		          Nav["Navigation Mesh"]
		          KnowBase["Knowledge Base"]
		          Targets["Target Registry"]
		      end
		      Perception <--> World
		      Decision <--> KnowBase
		      Movement <--> Nav
		  ```
	-
	- ## Game AI Knowledge Map
		- ```mermaid
		  mindmap
		    root((Game AI))
		      Decision Making
		        FSM / HFSM
		        Behavior Trees
		        GOAP
		        Utility AI
		      Pathfinding
		        A* Algorithm
		        NavMesh
		        Flow Fields
		        Dijkstra
		      Movement
		        Steering Behaviors
		        Boids Flocking
		        Crowd Simulation
		      Perception
		        Vision FOV + LOS
		        Hearing Radius
		        Knowledge Base
		      Strategy AI
		        Minimax
		        Alpha-Beta Pruning
		        MCTS
		      ML in Games
		        ML-Agents Unity
		        Imitation Learning
		        Reinforcement Learning
		        Neural Networks
		      Content AI
		        Procedural Generation
		        Dialogue Systems
		        Director AI
		      Tools
		        Debug Visualization
		        Performance Tuning
		        AI Middleware
		  ```
	-
	- ## AI Complexity Ladder
		- | Level | Technique | Games | Complexity |
		  |-------|-----------|-------|------------|
		  | 1 | Scripted responses | Pong, Pac-Man | Trivial |
		  | 2 | Finite State Machine | Most arcade games | Low |
		  | 3 | Hierarchical FSM | Halo, GTA | Medium |
		  | 4 | Behavior Trees | Modern AAA | Medium-High |
		  | 5 | GOAP | F.E.A.R., Tomb Raider | High |
		  | 6 | Utility AI | The Sims, RimWorld | High |
		  | 7 | MCTS / Minimax | Chess games, strategies | High |
		  | 8 | Machine Learning | AlphaStar, ML-Agents | Very High |
		- > [!tip] Where to Start
		  > For most games: start with **FSM** (Level 2), upgrade to **Behavior Trees** (Level 4) when FSMs get messy. Use **GOAP or Utility AI** for simulation games. Use **MCTS** for strategy. Use **ML** only when you need emergent behavior or have training infrastructure.
- # Finite State Machines (FSM)
  collapsed:: true
	- > [!tip] Most Used Pattern
	  > FSMs are still the most widely used AI pattern in games — simple, debuggable, predictable.
	-
	- ## Simple FSM
		- ```mermaid
		  stateDiagram-v2
		      [*] --> Idle
		      Idle --> Patrol : start_patrol
		      Patrol --> Alert : hear_sound
		      Alert --> Chase : see_player
		      Alert --> Patrol : lost_player (timeout)
		      Chase --> Attack : in_range
		      Chase --> Alert : lost_player
		      Attack --> Chase : player_escaped
		      Attack --> Dead : take_fatal_damage
		      Dead --> [*]
		  ```
		-
	- ## FSM Implementation
		- ```csharp title="FSM in C# (Unity)"
		  public enum EnemyState { Idle, Patrol, Alert, Chase, Attack, Dead }
		  
		  public class EnemyFSM : MonoBehaviour
		  {
		      [Header("State")]
		      public EnemyState currentState = EnemyState.Idle;
		      
		      [Header("Tuning")]
		      public float hearingRadius   = 10f;
		      public float visionRadius    = 15f;
		      public float attackRadius    = 2f;
		      public float alertTimeout    = 3f;
		      
		      private float alertTimer;
		      private Transform player;
		      
		      private void Start()  => player = GameObject.FindGameObjectWithTag("Player").transform;
		      
		      private void Update() => RunFSM();
		      
		      private void RunFSM()
		      {
		          switch (currentState)
		          {
		              case EnemyState.Idle:
		                  if (CanHearPlayer())  TransitionTo(EnemyState.Alert);
		                  break;
		                  
		              case EnemyState.Patrol:
		                  Patrol();
		                  if (CanSeePlayer())   TransitionTo(EnemyState.Chase);
		                  if (CanHearPlayer())  TransitionTo(EnemyState.Alert);
		                  break;
		                  
		              case EnemyState.Alert:
		                  alertTimer += Time.deltaTime;
		                  if (CanSeePlayer())   TransitionTo(EnemyState.Chase);
		                  if (alertTimer > alertTimeout)  TransitionTo(EnemyState.Patrol);
		                  break;
		                  
		              case EnemyState.Chase:
		                  ChasePlayer();
		                  if (InAttackRange())  TransitionTo(EnemyState.Attack);
		                  if (!CanSeePlayer())  TransitionTo(EnemyState.Alert);
		                  break;
		                  
		              case EnemyState.Attack:
		                  AttackPlayer();
		                  if (!InAttackRange()) TransitionTo(EnemyState.Chase);
		                  break;
		          }
		      }
		      
		      private void TransitionTo(EnemyState newState)
		      {
		          // Exit current state
		          OnExitState(currentState);
		          currentState = newState;
		          alertTimer = 0f;
		          // Enter new state
		          OnEnterState(newState);
		      }
		      
		      private bool CanHearPlayer() => 
		          Vector3.Distance(transform.position, player.position) < hearingRadius;
		      private bool CanSeePlayer() =>
		          Vector3.Distance(transform.position, player.position) < visionRadius && HasLineOfSight();
		      private bool InAttackRange() =>
		          Vector3.Distance(transform.position, player.position) < attackRadius;
		  }
		  ```
	-
	- ## Hierarchical FSM (HFSM)
		- ```mermaid
		  stateDiagram-v2
		      state Alive {
		          [*] --> Peaceful
		          state Peaceful {
		              [*] --> Idle
		              Idle --> Patrol : timer
		              Patrol --> Idle : reached_waypoint
		          }
		          state Combat {
		              [*] --> Chase
		              Chase --> Attack : in_range
		              Attack --> Chase : player_escaped
		              Attack --> Flee : low_health
		          }
		          Peaceful --> Combat : detect_enemy
		          Combat --> Peaceful : enemy_dead
		      }
		      Alive --> Dead : take_fatal_damage
		  ```
		- > [!tip] When to Use HFSM
		  > Use HFSM when states start sharing behaviors (e.g., "damage response" from ANY state) — add a parent state that handles shared transitions.
- # Behavior Trees
  collapsed:: true
	- > [!info] Why Behavior Trees?
	  > BTs solve FSM's problems: hard to add states, no hierarchical reuse, spaghetti transitions.
	  > BTs are **modular, reusable, and readable** — standard in AAA games (Halo, Batman, The Witcher 3).
	-
	- ## Node Types
		- ```mermaid
		  graph TD
		      subgraph Composites
		          SEQ[\"→ Sequence\\nAll must succeed\"]
		          SEL[\"? Selector\\nFirst success wins\"]
		          PAR[\"∥ Parallel\\nRun all simultaneously\"]
		      end
		      subgraph Decorators
		          INV[\"! Inverter\\nFlip result\"]
		          REP[\"↺ Repeater\\nRepeat N times\"]
		          UNTIL[\"✓ Until Success/Fail\"]
		      end
		      subgraph Leaves
		          ACT[\"▶ Action\\nDo something → S/F\"]
		          COND[\"? Condition\\nCheck something → S/F\"]
		      end
		  ```
		- | Node | Symbol | Returns | Description |
		  |------|--------|---------|-------------|
		  | Sequence | → | Fail on first failure | Like logical AND — all children must succeed |
		  | Selector | ? | Succeed on first success | Like logical OR — try until one succeeds |
		  | Parallel | ∥ | Configurable | Run all children simultaneously |
		  | Inverter | ! | Flips child result | NOT gate |
		  | Repeater | ↺ | Loops | Repeat child N times or until condition |
		  | Action | ▶ | Success/Fail/Running | Leaf — performs an action |
		  | Condition | ? | Success/Fail | Leaf — evaluates a condition |
		-
	- ## Combat Enemy Behavior Tree
		- ```
		  ROOT (Selector)
		  ├── [Sequence] → Dead behavior
		  │   ├── [Condition] IsDead?
		  │   └── [Action] PlayDeathAnimation
		  │
		  ├── [Sequence] → Flee if low health
		  │   ├── [Condition] HealthBelowThreshold(25%)
		  │   ├── [Condition] HasEscapeRoute?
		  │   └── [Action] FleeToSafeZone
		  │
		  ├── [Sequence] → Attack if in range
		  │   ├── [Condition] HasTarget?
		  │   ├── [Condition] InAttackRange?
		  │   └── [Selector] Pick attack
		  │       ├── [Sequence] Heavy attack (cooldown ready)
		  │       │   ├── [Condition] HeavyAttackReady?
		  │       │   └── [Action] HeavyAttack
		  │       └── [Action] LightAttack
		  │
		  ├── [Sequence] → Chase if can see player
		  │   ├── [Condition] CanSeePlayer?
		  │   └── [Action] ChasePlayer
		  │
		  ├── [Sequence] → Investigate noise
		  │   ├── [Condition] HeardSomething?
		  │   └── [Action] InvestigateSound
		  │
		  └── [Action] Patrol    ← Fallback default
		  ```
	-
	- ## BT Implementation (Unity Coroutine Style)
		- ```csharp title="Minimal BT framework in C#"
		  public enum BTStatus { Success, Failure, Running }
		  
		  public abstract class BTNode
		  {
		      public abstract BTStatus Tick();
		  }
		  
		  // Sequence — all must succeed
		  public class Sequence : BTNode
		  {
		      private readonly List<BTNode> children;
		      private int current = 0;
		      
		      public Sequence(params BTNode[] nodes) => children = new List<BTNode>(nodes);
		      
		      public override BTStatus Tick()
		      {
		          while (current < children.Count)
		          {
		              var status = children[current].Tick();
		              if (status == BTStatus.Failure)  { current = 0; return BTStatus.Failure; }
		              if (status == BTStatus.Running)  return BTStatus.Running;
		              current++;
		          }
		          current = 0;
		          return BTStatus.Success;
		      }
		  }
		  
		  // Selector — first success wins
		  public class Selector : BTNode
		  {
		      private readonly List<BTNode> children;
		      
		      public Selector(params BTNode[] nodes) => children = new List<BTNode>(nodes);
		      
		      public override BTStatus Tick()
		      {
		          foreach (var child in children)
		          {
		              var status = child.Tick();
		              if (status != BTStatus.Failure) return status;
		          }
		          return BTStatus.Failure;
		      }
		  }
		  
		  // Condition leaf
		  public class Condition : BTNode
		  {
		      private readonly Func<bool> condition;
		      public Condition(Func<bool> condition) => this.condition = condition;
		      public override BTStatus Tick() => condition() ? BTStatus.Success : BTStatus.Failure;
		  }
		  
		  // Action leaf
		  public class ActionNode : BTNode
		  {
		      private readonly Func<BTStatus> action;
		      public ActionNode(Func<BTStatus> action) => this.action = action;
		      public override BTStatus Tick() => action();
		  }
		  ```
	-
	- ## Popular BT Libraries
		- | Library | Engine | Language |
		  |---------|--------|---------|
		  | Behavior Designer | Unity | C# |
		  | FluentBehaviorTree | C# | Any |
		  | Behaviour Tree (Unreal) | Unreal | Blueprints + C++ |
		  | Beehave | Godot | GDScript |
		  | py_trees | Python | Python |
- # GOAP — Goal Oriented Action Planning
  collapsed:: true
	- > [!info] F.E.A.R.'s Secret Weapon
	  > GOAP was the AI behind F.E.A.R. (2005) — enemies that coordinated, took cover, communicated, and flanked. Created by Jeff Orkin at Monolith.
	-
	- ## GOAP Concepts
		- ```mermaid
		  graph LR
		      World[\"🌍 World State\\n{hasGun: false, ammoLow: true, targetDead: false}\"]
		      Goal[\"🎯 Goal State\\n{targetDead: true}\"]
		      Planner[\"🧮 A* Planner\\nFind action sequence\"]
		      Plan[\"📋 Plan\\n[FindGun → LoadAmmo → AimAtTarget → Shoot]\"]
		      Execute[\"▶️ Execute Plan\\nReplan if world changes\"]
		      World --> Planner
		      Goal --> Planner
		      Planner --> Plan --> Execute
		      Execute --> World
		  ```
		-
	- ## Actions with Pre/Post Conditions
		- | Action | Preconditions | Postconditions | Cost |
		  |--------|-------------|---------------|------|
		  | FindGun | hasGun=false | hasGun=true | 5 |
		  | LoadAmmo | hasGun=true, ammoLow=true | ammoLoaded=true | 2 |
		  | Shoot | hasGun=true, ammoLoaded=true, inRange=true | targetDead=true | 1 |
		  | MoveToRange | hasGun=true | inRange=true | 3 |
		  | TakeCover | threatened=true | inCover=true | 1 |
		  | Melee | inMeleeRange=true | targetDead=true | 1 |
		-
	- ## GOAP vs Behavior Tree
		- | Aspect | Behavior Tree | GOAP |
		  |--------|--------------|------|
		  | Planning | Designer-specified order | AI auto-plans |
		  | Emergent behavior | Low | High |
		  | Debug complexity | Easy | Hard |
		  | Designer control | High | Low |
		  | Flexibility | Medium | Very High |
		  | Performance cost | Low | Medium-High |
- # Utility AI
  collapsed:: true
	- > [!info] The Sims / RimWorld / Dwarf Fortress approach
	  > Utility AI scores **every possible action** and picks the highest scoring one. Produces incredibly natural, emergent behavior.
	-
	- ## Utility Scoring System
		- ```mermaid
		  graph TD
		      Actions[\"All Possible Actions\"]
		      Score[\"Score Each Action\\nvia utility functions\"]
		      Hunger[\"Hunger Score:\\nhigh hunger → eat action scores high\"]
		      Fear[\"Fear Score:\\nhigh threat → flee action scores high\"]
		      Social[\"Social Score:\\nlonely → talk action scores high\"]
		      Best[\"Pick Highest Score\"]
		      Execute[\"Execute Action\"]
		      Actions --> Score
		      Score --> Hunger
		      Score --> Fear
		      Score --> Social
		      Hunger --> Best
		      Fear --> Best
		      Social --> Best
		      Best --> Execute --> Actions
		  ```
		-
	- ## Utility Function Design
		- ```csharp title="Utility AI — response curves"
		  public class UtilityAI : MonoBehaviour
		  {
		      [System.Serializable]
		      public struct Action
		      {
		          public string name;
		          public AnimationCurve utilityCurve; // maps input (0-1) to utility score (0-1)
		          public System.Func<float> GetInput;
		          public System.Action Execute;
		      }
		      
		      private List<Action> actions = new();
		      
		      private void Update()
		      {
		          Action bestAction = default;
		          float bestScore = float.MinValue;
		          
		          foreach (var action in actions)
		          {
		              float input = action.GetInput();
		              float score = action.utilityCurve.Evaluate(input);
		              
		              if (score > bestScore)
		              {
		                  bestScore = score;
		                  bestAction = action;
		              }
		          }
		          
		          bestAction.Execute?.Invoke();
		      }
		      
		      // Example: NPC hunger utility
		      // Input: hunger level (0=full, 1=starving)
		      // Curve: exponential rise — small hunger = low priority, high hunger = urgent
		  }
		  ```
		-
	- ## Response Curves
		- | Curve Type | Shape | Use Case |
		  |-----------|-------|---------|
		  | Linear | Straight diagonal | Simple proportional response |
		  | Exponential | Gradual then steep | Urgency that grows quickly |
		  | Inverse exponential | Steep then gradual | Diminishing returns |
		  | Logistic (S-curve) | Slow → fast → slow | Natural threshold behavior |
		  | Quadratic | Parabolic | Preference for extremes |
- # Pathfinding
  collapsed:: true
	- ## A* Algorithm
		- ```mermaid
		  graph TD
		      Start[\"Start node\"]
		      Open[\"Open Set (priority queue)\\nsorted by f = g + h\"]
		      Closed[\"Closed Set\\nalready evaluated\"]
		      Neighbor[\"For each neighbor:\"]
		      Calc[\"Calculate:\\ng = cost from start\\nh = heuristic to goal\\nf = g + h\"]
		      Goal[\"Goal Reached?\"]
		      Path[\"Reconstruct path\"]
		      Start --> Open
		      Open --> Neighbor
		      Neighbor --> Calc
		      Calc --> Goal
		      Goal --> |Yes| Path
		      Goal --> |No| Open
		  ```
		-
	- ## A* Implementation
		- ```csharp title="A* in C#"
		  public class AStarPathfinder
		  {
		      private readonly int[,] grid;
		      private readonly int rows, cols;
		      
		      public AStarPathfinder(int[,] grid)
		      {
		          this.grid = grid;
		          rows = grid.GetLength(0);
		          cols = grid.GetLength(1);
		      }
		      
		      public List<Vector2Int> FindPath(Vector2Int start, Vector2Int goal)
		      {
		          var openSet = new SortedSet<Node>(Comparer<Node>.Create((a, b) => 
		              a.F != b.F ? a.F.CompareTo(b.F) : a.GetHashCode().CompareTo(b.GetHashCode())));
		          var gScore  = new Dictionary<Vector2Int, float>();
		          var parent  = new Dictionary<Vector2Int, Vector2Int>();
		          
		          gScore[start] = 0;
		          openSet.Add(new Node(start, 0 + Heuristic(start, goal)));
		          
		          while (openSet.Count > 0)
		          {
		              var current = openSet.Min.Pos;
		              openSet.Remove(openSet.Min);
		              
		              if (current == goal)
		                  return ReconstructPath(parent, goal);
		              
		              foreach (var neighbor in GetNeighbors(current))
		              {
		                  float tentativeG = gScore[current] + 1f;
		                  if (!gScore.ContainsKey(neighbor) || tentativeG < gScore[neighbor])
		                  {
		                      gScore[neighbor] = tentativeG;
		                      parent[neighbor] = current;
		                      openSet.Add(new Node(neighbor, tentativeG + Heuristic(neighbor, goal)));
		                  }
		              }
		          }
		          return null; // No path
		      }
		      
		      private float Heuristic(Vector2Int a, Vector2Int b) =>
		          Mathf.Abs(a.x - b.x) + Mathf.Abs(a.y - b.y); // Manhattan
		      
		      private IEnumerable<Vector2Int> GetNeighbors(Vector2Int pos)
		      {
		          var dirs = new[] { Vector2Int.up, Vector2Int.down, Vector2Int.left, Vector2Int.right };
		          foreach (var dir in dirs)
		          {
		              var n = pos + dir;
		              if (n.x >= 0 && n.x < rows && n.y >= 0 && n.y < cols && grid[n.x, n.y] == 0)
		                  yield return n;
		          }
		      }
		  }
		  ```
		-
	- ## Heuristic Functions
		- | Heuristic | Formula | Grid Type | Admissible? |
		  |-----------|---------|-----------|-------------|
		  | Manhattan | `|dx| + |dy|` | 4-directional | Yes |
		  | Chebyshev | `max(|dx|, |dy|)` | 8-directional | Yes |
		  | Euclidean | `√(dx²+dy²)` | Any direction | Yes |
		  | Octile | `max(dx,dy) + (√2-1)×min(dx,dy)` | 8-directional | Yes |
		  | Weighted (WA*) | `g + w×h` where w>1 | Any | No (faster but suboptimal) |
		-
	- ## NavMesh (Navigation Mesh)
		- ```mermaid
		  graph TD
		      World[\"3D World Geometry\"]
		      Bake[\"NavMesh Bake\\n(offline or runtime)\"]
		      Poly[\"Convex Polygons covering\\nwalkable surfaces\"]
		      Graph[\"Polygon Adjacency Graph\"]
		      APath[\"A* on polygon graph\"]
		      String[\"String-pull / funnel\\nalgorithm for smooth path\"]
		      Steer[\"Steering to follow path\"]
		      World --> Bake --> Poly --> Graph --> APath --> String --> Steer
		  ```
		- | NavMesh Feature | Description |
		  |----------------|-------------|
		  | Agents | Different agent sizes (human vs vehicle) |
		  | Off-mesh links | Jump gaps, climb ladders, teleport |
		  | Areas | Different terrain costs (mud=slow, road=fast) |
		  | Dynamic obstacles | Real-time obstacle carving |
		  | Crowd system | Multiple agents sharing NavMesh |
		-
	- ## Flow Fields (RTS Pathfinding)
		- > [!tip] For 1000+ units — Use Flow Fields
		  > A* for each unit = O(N × grid_search). Flow field = O(grid_search) for ALL units.
		- ```mermaid
		  graph LR
		      Goal[\"Goal cell\"]
		      Dijkstra[\"Run Dijkstra from goal\\nBuild cost field\"]
		      CostField[\"Cost Field\\n(distance to goal per cell)\"]
		      FlowField[\"Flow Field\\n(best direction per cell)\"]
		      Units[\"All units sample\\ntheir cell's direction\"]
		      Dijkstra --> CostField --> FlowField --> Units
		  ```
- # Steering Behaviors
  collapsed:: true
	- ## Craig Reynolds' Steering Behaviors
		- ```mermaid
		  graph TD
		      Seek[\"SEEK\\nMove toward target\"]
		      Flee[\"FLEE\\nMove away from target\"]
		      Arrive[\"ARRIVE\\nSeek + slow down\"]
		      Pursue[\"PURSUE\\nSeek predicted future position\"]
		      Evade[\"EVADE\\nFlee predicted future position\"]
		      Wander[\"WANDER\\nSteered random walk\"]
		      Align[\"ALIGN\\nMatch neighbor heading\"]
		      Cohesion[\"COHESION\\nMove toward neighbor center\"]
		      Separate[\"SEPARATE\\nAvoid neighbors\"]
		      Boids[\"BOIDS = Align + Cohesion + Separate\"]
		      Align --> Boids
		      Cohesion --> Boids
		      Separate --> Boids
		  ```
		-
	- ## Seek & Arrive
		- ```csharp title="Steering behaviors in C#"
		  public static class SteeringBehaviors
		  {
		      // Seek — accelerate toward target
		      public static Vector3 Seek(Vector3 position, Vector3 velocity, 
		                                  Vector3 target, float maxSpeed)
		      {
		          Vector3 desiredVelocity = (target - position).normalized * maxSpeed;
		          return desiredVelocity - velocity;  // steering force
		      }
		      
		      // Arrive — seek but slow near target
		      public static Vector3 Arrive(Vector3 position, Vector3 velocity,
		                                   Vector3 target, float maxSpeed, float slowRadius)
		      {
		          Vector3 toTarget = target - position;
		          float dist = toTarget.magnitude;
		          
		          float speed = dist < slowRadius 
		              ? maxSpeed * (dist / slowRadius)   // slow down
		              : maxSpeed;
		          
		          Vector3 desiredVelocity = toTarget.normalized * speed;
		          return desiredVelocity - velocity;
		      }
		      
		      // Pursue — seek the target's predicted future position
		      public static Vector3 Pursue(Vector3 position, Vector3 velocity,
		                                    Vector3 targetPos, Vector3 targetVel, float maxSpeed)
		      {
		          float lookAheadTime = Vector3.Distance(position, targetPos) / maxSpeed;
		          Vector3 futurePos = targetPos + targetVel * lookAheadTime;
		          return Seek(position, velocity, futurePos, maxSpeed);
		      }
		      
		      // Wander
		      private static Vector3 wanderTarget;
		      public static Vector3 Wander(Vector3 position, Vector3 forward,
		                                    float circleRadius, float circleDistance, float jitter)
		      {
		          wanderTarget += new Vector3(
		              Random.Range(-1f, 1f) * jitter,
		              0,
		              Random.Range(-1f, 1f) * jitter
		          );
		          wanderTarget = wanderTarget.normalized * circleRadius;
		          
		          Vector3 circleCenter = position + forward * circleDistance;
		          return circleCenter + wanderTarget;
		      }
		  }
		  ```
	-
	- ## Boids (Flocking)
		- ```csharp title="Boids simulation — separation, alignment, cohesion"
		  public class Boid : MonoBehaviour
		  {
		      public float maxSpeed   = 5f;
		      public float maxForce   = 0.3f;
		      public float perception = 4f;
		      
		      [Header("Weights")]
		      public float separationWeight = 1.5f;
		      public float alignmentWeight  = 1.0f;
		      public float cohesionWeight   = 1.0f;
		      
		      private Vector3 velocity;
		      
		      private void Update()
		      {
		          var neighbors = FindNeighbors();
		          
		          Vector3 separation = Separation(neighbors) * separationWeight;
		          Vector3 alignment  = Alignment(neighbors)  * alignmentWeight;
		          Vector3 cohesion   = Cohesion(neighbors)   * cohesionWeight;
		          
		          Vector3 acceleration = separation + alignment + cohesion;
		          acceleration = Vector3.ClampMagnitude(acceleration, maxForce);
		          
		          velocity = Vector3.ClampMagnitude(velocity + acceleration, maxSpeed);
		          transform.position += velocity * Time.deltaTime;
		          if (velocity != Vector3.zero)
		              transform.forward = velocity.normalized;
		      }
		      
		      private Vector3 Separation(List<Boid> neighbors)
		      {
		          Vector3 steer = Vector3.zero;
		          foreach (var n in neighbors)
		          {
		              float d = Vector3.Distance(transform.position, n.transform.position);
		              steer += (transform.position - n.transform.position) / (d * d);
		          }
		          return steer;
		      }
		      
		      private Vector3 Alignment(List<Boid> neighbors)
		      {
		          if (neighbors.Count == 0) return Vector3.zero;
		          Vector3 avg = Vector3.zero;
		          foreach (var n in neighbors) avg += n.velocity;
		          avg /= neighbors.Count;
		          return (avg.normalized * maxSpeed - velocity);
		      }
		      
		      private Vector3 Cohesion(List<Boid> neighbors)
		      {
		          if (neighbors.Count == 0) return Vector3.zero;
		          Vector3 center = Vector3.zero;
		          foreach (var n in neighbors) center += n.transform.position;
		          center /= neighbors.Count;
		          return SteeringBehaviors.Seek(transform.position, velocity, center, maxSpeed);
		      }
		  }
		  ```
- # Perception Systems
  collapsed:: true
	- ## Sensory Systems
		- ```mermaid
		  graph TD
		      subgraph Vision
		          FOV[\"Field of View (cone)\"]
		          LOS[\"Line of Sight (raycast)\"]
		          Memory[\"Visual Memory (last seen pos)\"]
		      end
		      subgraph Hearing
		          Radius[\"Hearing Radius\"]
		          Noise[\"Noise Events (sound propagation)\"]
		      end
		      subgraph Touch
		          Contact[\"Collision / Trigger\"]
		          Damage[\"Damage received\"]
		      end
		      subgraph Knowledge
		          KB[\"Knowledge Base\"]
		          World[\"World Model\"]
		      end
		      Vision --> KB
		      Hearing --> KB
		      Touch --> KB
		      KB --> World
		  ```
	-
	- ## FOV + Line of Sight
		- ```csharp title="Vision cone with raycast"
		  public class PerceptionSystem : MonoBehaviour
		  {
		      [Header("Vision")]
		      public float viewRadius = 15f;
		      [Range(0, 360)]
		      public float viewAngle  = 110f;
		      public LayerMask targetMask;
		      public LayerMask obstacleMask;
		      
		      [Header("Hearing")]
		      public float hearingRadius = 10f;
		      
		      public bool CanSeeTarget(Transform target)
		      {
		          Vector3 dirToTarget = (target.position - transform.position).normalized;
		          float   distToTarget = Vector3.Distance(transform.position, target.position);
		          
		          // Check distance
		          if (distToTarget > viewRadius) return false;
		          
		          // Check angle
		          if (Vector3.Angle(transform.forward, dirToTarget) > viewAngle * 0.5f) return false;
		          
		          // Check line of sight
		          if (Physics.Raycast(transform.position + Vector3.up, dirToTarget, distToTarget, obstacleMask))
		              return false; // Blocked by obstacle
		          
		          return true;
		      }
		      
		      // Called when any agent makes noise (footstep, gunshot, etc.)
		      public static void BroadcastNoise(Vector3 noisePos, float noiseRadius, 
		                                          NoiseType type, LayerMask listenerMask)
		      {
		          var colliders = Physics.OverlapSphere(noisePos, noiseRadius, listenerMask);
		          foreach (var col in colliders)
		          {
		              if (col.TryGetComponent<PerceptionSystem>(out var listener))
		                  listener.HearNoise(noisePos, noiseRadius, type);
		          }
		      }
		      
		      private void HearNoise(Vector3 pos, float radius, NoiseType type)
		      {
		          float dist = Vector3.Distance(transform.position, pos);
		          float perceived = 1f - (dist / radius); // 0=barely heard, 1=loud
		          OnHeardNoise?.Invoke(pos, perceived, type);
		      }
		      
		      public event System.Action<Vector3, float, NoiseType> OnHeardNoise;
		  }
		  ```
- # ML Agents & Reinforcement Learning
  collapsed:: true
	- ## What is Reinforcement Learning in Games?
		- **Reinforcement Learning (RL)** is about training an agent to make decisions by **trial and error**, rewarded or penalized based on outcomes. The agent doesn't follow hand-crafted rules — it discovers its own strategy by playing millions of episodes.
		- The same mathematical framework from [[Machine Learning]] is used here, but applied to game environments instead of static datasets.
		- Famous examples:
			- **AlphaGo / AlphaZero** — defeated world Go champions using MCTS + deep RL
			- **AlphaStar** — mastered StarCraft II at Grandmaster level (10^26 possible states)
			- **OpenAI Five** — beat professional Dota 2 teams using self-play
			- **Unity ML-Agents** — brings RL into game dev, letting developers train NPC behaviors in Unity
		- > [!info] RL vs Scripted AI
		  > Scripted AI = you write the rules. RL = the agent discovers the rules through experience.
		  > RL is expensive to train but produces surprising, emergent, and human-feeling behaviors.
	-
	- ## RL Core Concepts
		- | Concept | Meaning | Game Example |
		  |---------|---------|-------------|
		  | **Agent** | The entity making decisions | NPC, bot, game piece |
		  | **Environment** | The world the agent acts in | Game world, board |
		  | **State** | Current situation observed | Position, health, nearby enemies |
		  | **Action** | What the agent can do | Move, attack, jump |
		  | **Reward** | Feedback signal (+/-) | +1 kill, -1 death |
		  | **Policy** | Learned decision function (neural net) | Maps state → action |
		  | **Episode** | One complete game session | One match, one level |
		  | **Discount γ** | How much to value future rewards | γ=0.99 = long-term thinking |
	-
	- ## Reward Design — The Hard Part
		- > [!warning] Reward Hacking
		  > Bad reward design = agent finds unintended shortcuts.
		  > Boat racing agent rewarded for speed → learned to drive in circles collecting boost pickups.
		  > Sumo agent rewarded for not falling → learned to never move.
		- Good reward shaping:
			- Reward **outcomes**, not actions — `+1 kill` not `+0.1 shoot`
			- Add **small time penalties** to encourage efficiency (`-0.001/step`)
			- Use **negative rewards** for deaths, collisions, wasted resources
			- Phase out **shaped rewards** after early training
	-
	- ## Key RL Algorithms in Games
		- | Algorithm | Type | Best For |
		  |-----------|------|---------|
		  | **PPO** | Policy Gradient | Default choice — stable, efficient, used by ML-Agents |
		  | **SAC** | Actor-Critic | Continuous actions, sample efficient |
		  | **DQN** | Value-Based | Discrete actions — Atari, card games |
		  | **MCTS + NN** | Tree Search + RL | Strategy games — AlphaGo, AlphaZero |
		  | **Self-Play** | Training Paradigm | Competitive games — train vs past self |
		  | **GAIL / Imitation** | Supervised RL | Learn from human demos first |
		- → For the math behind these algorithms see [[Machine Learning]] — Reinforcement Learning section.
	-
	- ## Unity ML-Agents
		- Unity ML-Agents is a toolkit for training game AI using **reinforcement learning** and **imitation learning**.
		- ```mermaid
		  graph LR
		      Agent[\"🤖 Agent\\n(game character)\"]
		      Obs[\"📊 Observations\\n(what the agent sees)\"]
		      Actions[\"🎮 Actions\\n(what the agent does)\"]
		      Reward[\"💰 Reward Signal\\n(feedback)\"]
		      Policy[\"🧠 Neural Network Policy\"]
		      Env[\"🌍 Environment\"]
		      Agent --> |collects| Obs
		      Obs --> Policy
		      Policy --> Actions
		      Actions --> Env
		      Env --> Reward
		      Reward --> Policy
		  ```
		-
	- ## ML-Agents Agent Setup
		- ```csharp title="ML-Agents — simple ball rolling agent"
		  using Unity.MLAgents;
		  using Unity.MLAgents.Sensors;
		  using Unity.MLAgents.Actuators;
		  
		  public class RollerAgent : Agent
		  {
		      public Transform target;
		      private Rigidbody rb;
		      
		      public override void Initialize() => rb = GetComponent<Rigidbody>();
		      
		      // Called at start of each episode
		      public override void OnEpisodeBegin()
		      {
		          // Reset agent
		          rb.velocity        = Vector3.zero;
		          rb.angularVelocity = Vector3.zero;
		          transform.localPosition = new Vector3(Random.Range(-4f, 4f), 0.5f, Random.Range(-4f, 4f));
		          // Randomize target
		          target.localPosition = new Vector3(Random.Range(-4f, 4f), 0.5f, Random.Range(-4f, 4f));
		      }
		      
		      // What the agent observes each step
		      public override void CollectObservations(VectorSensor sensor)
		      {
		          sensor.AddObservation(target.localPosition);       // 3 floats
		          sensor.AddObservation(transform.localPosition);    // 3 floats
		          sensor.AddObservation(rb.velocity.x);              // 1 float
		          sensor.AddObservation(rb.velocity.z);              // 1 float
		          // Total: 8 observations
		      }
		      
		      // What the agent does each step
		      public override void OnActionReceived(ActionBuffers actions)
		      {
		          Vector3 controlSignal = Vector3.zero;
		          controlSignal.x = actions.ContinuousActions[0];
		          controlSignal.z = actions.ContinuousActions[1];
		          rb.AddForce(controlSignal * 10f);
		          
		          float dist = Vector3.Distance(transform.localPosition, target.localPosition);
		          
		          // Reward for reaching target
		          if (dist < 1.5f) { SetReward(1f); EndEpisode(); }
		          
		          // Penalty for falling off platform
		          if (transform.localPosition.y < 0) { EndEpisode(); }
		          
		          // Small reward for getting closer
		          AddReward(-0.001f);  // time penalty to encourage speed
		      }
		      
		      // Allow human control during testing
		      public override void Heuristic(in ActionBuffers actionsOut)
		      {
		          var ca = actionsOut.ContinuousActions;
		          ca[0] = Input.GetAxis("Horizontal");
		          ca[1] = Input.GetAxis("Vertical");
		      }
		  }
		  ```
	-
	- ## Training Configuration
		- ```yaml title="trainer_config.yaml — PPO config"
		  behaviors:
		    RollerBall:
		      trainer_type: ppo
		      hyperparameters:
		        batch_size: 10
		        buffer_size: 100
		        learning_rate: 3.0e-4
		        beta: 5.0e-3
		        epsilon: 0.2
		        lambd: 0.99
		        num_epoch: 3
		        learning_rate_schedule: linear
		      network_settings:
		        normalize: false
		        hidden_units: 128
		        num_layers: 2
		      reward_signals:
		        extrinsic:
		          gamma: 0.99
		          strength: 1.0
		      max_steps: 500000
		      time_horizon: 64
		      summary_freq: 10000
		  ```
		- ```bash title="Train and monitor"
		  mlagents-learn config/trainer_config.yaml --run-id=MyFirstRun
		  # Monitor with TensorBoard
		  tensorboard --logdir results/MyFirstRun
		  ```
- # Strategy Game AI
  collapsed:: true
	- ## Minimax with Alpha-Beta Pruning
		- ```python title="Minimax — perfect for turn-based games"
		  def minimax(state, depth, alpha, beta, maximizing):
		      if depth == 0 or state.is_terminal():
		          return state.evaluate()
		      
		      if maximizing:
		          max_eval = float('-inf')
		          for move in state.get_moves():
		              child = state.apply_move(move)
		              eval = minimax(child, depth-1, alpha, beta, False)
		              max_eval = max(max_eval, eval)
		              alpha = max(alpha, eval)
		              if beta <= alpha:
		                  break  # Beta cut-off — prune!
		          return max_eval
		      else:
		          min_eval = float('inf')
		          for move in state.get_moves():
		              child = state.apply_move(move)
		              eval = minimax(child, depth-1, alpha, beta, True)
		              min_eval = min(min_eval, eval)
		              beta = min(beta, eval)
		              if beta <= alpha:
		                  break  # Alpha cut-off — prune!
		          return min_eval
		  
		  # Best move selection
		  def get_best_move(state, depth):
		      best_move = None
		      best_score = float('-inf')
		      for move in state.get_moves():
		          score = minimax(state.apply_move(move), depth-1, float('-inf'), float('inf'), False)
		          if score > best_score:
		              best_score = score
		              best_move = move
		      return best_move
		  ```
	-
	- ## Monte Carlo Tree Search (MCTS)
		- > [!info] AlphaGo's Foundation
		  > MCTS is the backbone of AlphaGo and modern game AI for games with huge branching factors.
		- ```mermaid
		  graph TD
		      Select[\"1. SELECT\\nTraverse tree via UCB1\\n(balance exploration + exploitation)\"]
		      Expand[\"2. EXPAND\\nAdd new child node\"]
		      Simulate[\"3. SIMULATE (Rollout)\\nRandom playout to terminal state\"]
		      Backprop[\"4. BACKPROPAGATE\\nUpdate win statistics up the tree\"]
		      Repeat[\"Repeat N times → Pick best child\"]
		      Select --> Expand --> Simulate --> Backprop --> Repeat
		  ```
		- ```
		  UCB1 = (wins/visits) + C × √(ln(parent_visits) / visits)
		                          ↑
		                   exploration constant (√2)
		  ```
- # AI Debugging & Tools
  collapsed:: true
	- ## Debug Visualization
		- ```csharp title="AI gizmo debugging in Unity"
		  private void OnDrawGizmosSelected()
		  {
		      // Draw vision range
		      Gizmos.color = Color.yellow;
		      Gizmos.DrawWireSphere(transform.position, viewRadius);
		      
		      // Draw hearing range  
		      Gizmos.color = new Color(0, 1, 1, 0.3f);
		      Gizmos.DrawWireSphere(transform.position, hearingRadius);
		      
		      // Draw FOV cone
		      Vector3 viewAngleA = DirFromAngle(-viewAngle / 2, false);
		      Vector3 viewAngleB = DirFromAngle( viewAngle / 2, false);
		      Gizmos.color = Color.white;
		      Gizmos.DrawLine(transform.position, transform.position + viewAngleA * viewRadius);
		      Gizmos.DrawLine(transform.position, transform.position + viewAngleB * viewRadius);
		      
		      // Draw current path
		      if (currentPath != null)
		      {
		          Gizmos.color = Color.green;
		          for (int i = 0; i < currentPath.Count - 1; i++)
		              Gizmos.DrawLine(currentPath[i], currentPath[i+1]);
		      }
		      
		      // Show state
		  #if UNITY_EDITOR
		      UnityEditor.Handles.Label(transform.position + Vector3.up * 2, currentState.ToString());
		  #endif
		  }
		  ```
	-
	- ## Performance Optimization
		- | Technique | Savings | Use When |
		  |-----------|---------|---------|
		  | Update throttling | Run AI every 0.1s not every frame | All agents |
		  | LOD AI | Reduce AI detail at distance | Open worlds |
		  | Spatial partitioning | Grid/quadtree for neighbor queries | Boids, crowds |
		  | Flow fields | Shared pathfinding for many agents | RTS with 500+ units |
		  | Job System | Parallel AI update on multiple cores | Unity DOTS |
		  | Behavior Tree pooling | Reuse BT instances | Mobile games |
- # Procedural Content Generation (PCG) AI
  collapsed:: true
	- ## What is PCG?
		- PCG means using algorithms — and sometimes learned models — to generate game content **automatically** instead of hand-crafting it.
		- It gives games infinite replayability (Minecraft, Spelunky, No Man's Sky), reduces production time, and creates unique player experiences.
		- PCG is connected to [[Machine Learning]] (generative models like GANs and diffusion) and [[DSA Algo & System Design]] (graph algorithms, noise functions).
		- | Type | What It Generates | Examples |
		  |------|------------------|---------|
		  | **Procedural World** | Terrain, biomes, maps | Minecraft, No Man's Sky, Dwarf Fortress |
		  | **Dungeon Generation** | Room layouts, corridors | Spelunky, Dead Cells, Binding of Isaac |
		  | **NPC Behavior** | Schedules, dialogue, routines | Radiant AI (Skyrim), Dwarf Fortress |
		  | **Quests** | Objectives, rewards, stories | Skyrim radiant quests |
		  | **Music** | Adaptive/generative soundtracks | Minecraft music, No Man's Sky |
		  | **AI-Written Dialogue** | Context-aware NPC speech | Modern LLM-integrated NPCs |
	-
	- ## Noise-Based Terrain Generation
		- The foundation of almost all procedural terrain is **Perlin noise** — a smooth, coherent random function that produces natural-looking gradients.
		- Think of it like this: pure random noise = static on a TV screen. Perlin noise = rolling hills.
		- ```csharp title="Perlin noise terrain — Unity"
		  public class TerrainGenerator : MonoBehaviour
		  {
		      public int   width      = 256;
		      public int   depth      = 256;
		      public float scale      = 20f;    // zoom level — smaller = more zoomed in
		      public float heightMult = 15f;    // max terrain height
		      
		      [Header("Octaves — add detail at different scales")]
		      public int   octaves    = 4;      // number of noise layers
		      public float persistence = 0.5f;  // how much each octave contributes
		      public float lacunarity  = 2f;    // how much detail each octave adds
		      
		      private void Start()
		      {
		          Terrain terrain = GetComponent<Terrain>();
		          terrain.terrainData = GenerateTerrain(terrain.terrainData);
		      }
		      
		      private TerrainData GenerateTerrain(TerrainData data)
		      {
		          data.heightmapResolution = width + 1;
		          data.size = new Vector3(width, heightMult, depth);
		          data.SetHeights(0, 0, GenerateHeights());
		          return data;
		      }
		      
		      private float[,] GenerateHeights()
		      {
		          float[,] heights = new float[width, depth];
		          float offsetX = Random.Range(0f, 9999f); // random seed
		          float offsetZ = Random.Range(0f, 9999f);
		          
		          for (int x = 0; x < width; x++)
		          {
		              for (int z = 0; z < depth; z++)
		              {
		                  heights[x, z] = SampleNoise(x + offsetX, z + offsetZ);
		              }
		          }
		          return heights;
		      }
		      
		      private float SampleNoise(float x, float z)
		      {
		          float amplitude = 1f;
		          float frequency = 1f;
		          float noiseHeight = 0f;
		          float maxPossible = 0f;
		          
		          // Layer multiple octaves for detail
		          for (int i = 0; i < octaves; i++)
		          {
		              float sampleX = x / scale * frequency;
		              float sampleZ = z / scale * frequency;
		              
		              noiseHeight += Mathf.PerlinNoise(sampleX, sampleZ) * amplitude;
		              maxPossible += amplitude;
		              
		              amplitude  *= persistence; // each layer gets quieter
		              frequency  *= lacunarity;  // each layer gets finer
		          }
		          
		          return noiseHeight / maxPossible; // normalize 0-1
		      }
		  }
		  ```
	-
	- ## Dungeon Generation — BSP Algorithm
		- BSP (Binary Space Partitioning — see [[DSA Algo & System Design]]) splits a room recursively until rooms are small enough, then connects them with corridors.
		- ```python title="BSP dungeon generator"
		  import random
		  from dataclasses import dataclass
		  from typing import Optional, List, Tuple
		  
		  @dataclass
		  class Rect:
		      x: int; y: int; w: int; h: int
		      
		      def center(self) -> Tuple[int, int]:
		          return (self.x + self.w // 2, self.y + self.h // 2)
		      
		      def intersects(self, other: 'Rect') -> bool:
		          return (self.x <= other.x + other.w and self.x + self.w >= other.x and
		                  self.y <= other.y + other.h and self.y + self.h >= other.y)
		  
		  class BSPNode:
		      MIN_SIZE = 6
		      
		      def __init__(self, region: Rect):
		          self.region = region
		          self.left:  Optional['BSPNode'] = None
		          self.right: Optional['BSPNode'] = None
		          self.room:  Optional[Rect]      = None
		      
		      def split(self) -> bool:
		          if self.left or self.right:
		              return False
		          
		          split_h = random.choice([True, False])
		          if self.region.w > self.region.h and self.region.w / self.region.h >= 1.25:
		              split_h = False
		          elif self.region.h > self.region.w and self.region.h / self.region.w >= 1.25:
		              split_h = True
		          
		          max_size = (self.region.h if split_h else self.region.w) - self.MIN_SIZE
		          if max_size <= self.MIN_SIZE:
		              return False
		          
		          split_pos = random.randint(self.MIN_SIZE, max_size)
		          
		          if split_h:
		              self.left  = BSPNode(Rect(self.region.x, self.region.y, self.region.w, split_pos))
		              self.right = BSPNode(Rect(self.region.x, self.region.y + split_pos,
		                                        self.region.w, self.region.h - split_pos))
		          else:
		              self.left  = BSPNode(Rect(self.region.x, self.region.y, split_pos, self.region.h))
		              self.right = BSPNode(Rect(self.region.x + split_pos, self.region.y,
		                                        self.region.w - split_pos, self.region.h))
		          return True
		      
		      def create_room(self):
		          if self.left or self.right:
		              if self.left:  self.left.create_room()
		              if self.right: self.right.create_room()
		          else:
		              # Leaf node — create a room inside this region
		              w = random.randint(self.MIN_SIZE - 1, self.region.w - 1)
		              h = random.randint(self.MIN_SIZE - 1, self.region.h - 1)
		              x = random.randint(self.region.x, self.region.x + (self.region.w - w))
		              y = random.randint(self.region.y, self.region.y + (self.region.h - h))
		              self.room = Rect(x, y, w, h)
		  ```
	-
	- ## Wave Function Collapse (WFC)
		- WFC is an algorithm that generates tile-based maps by picking tiles that are **consistent with their neighbors** — like solving a constraint-satisfaction puzzle.
		- It's how games like Caves of Qud and the Townscaper building generator work.
		- ```
		  Algorithm:
		  1. Start with all cells = superposition of all possible tiles
		  2. OBSERVE: pick the cell with fewest possibilities (lowest entropy)
		  3. COLLAPSE: choose one tile for that cell (weighted random)
		  4. PROPAGATE: remove possibilities from neighbors that conflict
		  5. Repeat until all cells are collapsed, or contradiction found (restart)
		  
		  Tile constraints = "tile A can be right-adjacent to tiles B, C but not D"
		  Learned from a small example image or hand-defined rules.
		  ```
- # Dialogue Systems & NPC Conversation
  collapsed:: true
	- ## Types of Dialogue Systems
		- Dialogue is how players interact with the world socially. The type of system determines how dynamic and believable NPCs feel.
		- | Type | How It Works | Pros | Cons | Examples |
		  |------|-------------|------|------|---------|
		  | **Linear / Scripted** | Pre-written lines played in sequence | Full control, voice acted | No branching, static | Most narrative games |
		  | **Branching Trees** | Player chooses from options, different responses | Player agency | Expensive to write all branches | Mass Effect, The Witcher |
		  | **State-Based (Radiant)** | NPC says contextual lines based on world state | Dynamic, cheap | Feels shallow | Skyrim, Fallout |
		  | **Grammar-Based** | Rules generate varied sentences | Infinite variety | Hard to control tone | Dwarf Fortress announcements |
		  | **LLM-Powered** | Large language model generates responses live | Truly dynamic, emergent | Unpredictable, expensive | Inworld AI, AI Town demos |
	-
	- ## Ink — Narrative Scripting Language
		- Ink (by Inkle Studios) is the most widely used narrative scripting language for games. Used in Disco Elysium, 80 Days, Heaven's Vault.
		- ```ink title="Ink dialogue — branching NPC conversation"
		  // NPC greeting based on player reputation
		  VAR reputation = 50
		  VAR has_met = false
		  
		  -> greet_player
		  
		  === greet_player ===
		  { has_met:
		      - The guard nods at you. "Back again?"
		      - else:
		          ~ has_met = true
		          { reputation > 70:
		              The guard smiles warmly. "Welcome, friend. Good to have you here."
		          - reputation > 30:
		              The guard eyes you neutrally. "State your business."
		          - else:
		              The guard's hand moves to his weapon. "You're not welcome here."
		          }
		  }
		  
		  * [Ask about the town]    -> ask_town
		  * [Ask about the king]   -> ask_king
		  * [Say nothing and leave] -> END
		  
		  === ask_town ===
		  "The town? Been through rough times. But we're managing."
		  -> greet_player
		  
		  === ask_king ===
		  { reputation > 50:
		      The guard leans in. "Between you and me — the king's been acting strange."
		  - else:
		      "Not my place to speak of the king to strangers."
		  }
		  -> greet_player
		  ```
	-
	- ## Dialogue Graph Pattern (Node-Based)
		- ```mermaid
		  graph TD
		      Start["START\nGreeting"]
		      Q1["NPC: What do you want?"]
		      P1["Player: I'm looking for work"]
		      P2["Player: Just passing through"]
		      P3["Player: I need information"]
		      R1["NPC: Talk to the blacksmith\n[give quest]"]
		      R2["NPC: Don't cause trouble\n[end]"]
		      R3["NPC: Depends on the info\n[condition check: has_info_item?]"]
		      YES["NPC: Ah, you found it!\n[unlock faction]"]
		      NO["NPC: Come back when you have proof"]
		      Start --> Q1
		      Q1 --> P1 --> R1
		      Q1 --> P2 --> R2
		      Q1 --> P3 --> R3
		      R3 --> YES
		      R3 --> NO
		  ```
- # Director AI — Dynamic Difficulty & Pacing
  collapsed:: true
	- ## What is a Director AI?
		- A Director AI is a high-level system that **watches the player** and adjusts the game experience dynamically to keep them in the **flow state** — not bored, not overwhelmed.
		- The most famous example is Left 4 Dead's **AI Director**, which controls zombie spawns, item placement, and music based on player stress levels.
		- This concept comes directly from [[Game Design]] — specifically **flow theory** and **dynamic difficulty adjustment (DDA)**.
	-
	- ## Left 4 Dead AI Director — How It Works
		- ```mermaid
		  graph TD
		      Monitor["👁️ Monitor Players\nHealth · Ammo · Separation · Stress"]
		      Intensity["📊 Intensity Score\n0-100 (calm to overwhelmed)"]
		      Phase["Current Phase?"]
		      Build["BUILD-UP PHASE\nSpawn scouts, small groups\nSlowly raise pressure"]
		      Peak["PEAK PHASE\nHorde attack!\nBoss spawns\nPlayer overwhelmed"]
		      Relax["RELAX PHASE\nReduce spawns\nSpawn health/ammo\nLet players breathe"]
		      Monitor --> Intensity --> Phase
		      Phase --> Build --> Peak --> Relax --> Monitor
		  ```
		- ```
		  Director Logic (simplified):
		  
		  if (player_health < 30% AND ammo_low):
		      spawn_health_kit_nearby()
		      reduce_zombie_spawn_rate()
		  
		  if (team_health > 80% AND no_zombies_nearby AND time_since_last_horde > 60s):
		      trigger_horde()
		  
		  if (player_separated_from_team AND health_low):
		      spawn_witch_or_tank_near_team()   // punish splitting up
		  
		  if (player_on_hot_streak AND moving_fast):
		      increase_special_infected_spawn_rate()
		  ```
	-
	- ## Dynamic Difficulty Adjustment (DDA)
		- DDA automatically adjusts game difficulty based on player performance — so new players aren't crushed and experts aren't bored.
		- ```csharp title="DDA — adaptive enemy health and damage"
		  public class DifficultyDirector : MonoBehaviour
		  {
		      [Range(0f, 1f)]
		      public float difficultyScore = 0.5f;   // 0=easy, 1=hard
		      
		      [Header("Thresholds")]
		      public float easyThreshold = 0.3f;     // below this → increase difficulty
		      public float hardThreshold = 0.7f;     // above this → decrease difficulty
		      
		      private float playerDeathRate   = 0f;  // deaths / minute
		      private float playerKillRate    = 0f;  // kills / minute
		      private float playerHealthRatio = 1f;  // current hp / max hp
		      
		      private void Update()
		      {
		          UpdateMetrics();
		          AdjustDifficulty();
		          ApplyToEnemies();
		      }
		      
		      private void AdjustDifficulty()
		      {
		          // Player is dying a lot → make it easier
		          if (playerDeathRate > 2f || playerHealthRatio < 0.2f)
		              difficultyScore -= 0.01f * Time.deltaTime;
		          
		          // Player is dominating → make it harder
		          else if (playerKillRate > 10f && playerHealthRatio > 0.8f)
		              difficultyScore += 0.01f * Time.deltaTime;
		          
		          difficultyScore = Mathf.Clamp01(difficultyScore);
		      }
		      
		      private void ApplyToEnemies()
		      {
		          // Scale enemy stats based on difficulty
		          float enemyHealthMult  = Mathf.Lerp(0.5f, 2.0f,  difficultyScore);
		          float enemyDamageMult  = Mathf.Lerp(0.5f, 1.5f,  difficultyScore);
		          float enemySpeedMult   = Mathf.Lerp(0.8f, 1.2f,  difficultyScore);
		          float spawnRateSeconds = Mathf.Lerp(8f,   2f,     difficultyScore);
		          
		          EnemySpawner.Instance.SpawnInterval  = spawnRateSeconds;
		          EnemySpawner.Instance.HealthMult     = enemyHealthMult;
		          EnemySpawner.Instance.DamageMult     = enemyDamageMult;
		          EnemySpawner.Instance.SpeedMult      = enemySpeedMult;
		      }
		  }
		  ```
- # Crowd Simulation
  collapsed:: true
	- ## Why Crowds Are Hard
		- Simulating thousands of agents that look natural is one of the hardest problems in game AI. Each agent needs to:
			- Navigate to a goal without colliding with walls
			- Avoid other agents without creating traffic jams
			- Look natural — no teleporting, moonwalking, or T-posing through each other
		- Pure A* pathfinding for 1000+ agents is too expensive. Real crowd systems combine **Flow Fields** (shared navigation) + **local avoidance** (per-agent collision response).
	-
	- ## Crowd Techniques
		- | Technique | Scale | Description |
		  |-----------|-------|-------------|
		  | **Boids** | Dozens | Separation + alignment + cohesion — good for flocks, not dense crowds |
		  | **Flow Fields** | Thousands | Shared Dijkstra from goal, all agents follow field gradient |
		  | **RVO / ORCA** | Hundreds | Reciprocal Velocity Obstacles — smooth, collision-free, local avoidance |
		  | **Continuum Crowds** | Hundreds–Thousands | Treat crowd as fluid, solve with partial differential equations |
		  | **Unity DOTS Crowds** | Millions | Job System + Burst Compiler — parallel per-agent updates |
	-
	- ## RVO (Reciprocal Velocity Obstacles)
		- ORCA (Optimal Reciprocal Collision Avoidance) is the algorithm behind most modern crowd simulation. Each agent computes a safe velocity that avoids all other agents simultaneously.
		- ```csharp title="Simple RVO — avoid other agents"
		  public class CrowdAgent : MonoBehaviour
		  {
		      public float maxSpeed   = 3.5f;
		      public float radius     = 0.5f;
		      public float timeHorizon = 2f;   // seconds to look ahead for collisions
		      
		      private Vector3 preferredVelocity; // where we want to go
		      private Vector3 currentVelocity;
		      
		      private void Update()
		      {
		          // Desired velocity = straight to goal
		          preferredVelocity = (goal - transform.position).normalized * maxSpeed;
		          
		          // Compute avoidance velocity using ORCA
		          var neighbors = GetNearbyAgents(4f);
		          currentVelocity = ComputeORCAVelocity(preferredVelocity, neighbors);
		          
		          transform.position += currentVelocity * Time.deltaTime;
		      }
		      
		      private Vector3 ComputeORCAVelocity(Vector3 preferred, List<CrowdAgent> neighbors)
		      {
		          // For each neighbor, compute velocity obstacle half-plane
		          // Find velocity closest to preferred that satisfies all constraints
		          // Full implementation: use RVO2 library or Unity's built-in NavMeshAgent
		          // This is simplified — real ORCA requires linear programming solver
		          
		          Vector3 result = preferred;
		          foreach (var neighbor in neighbors)
		          {
		              Vector3 relPos = neighbor.transform.position - transform.position;
		              Vector3 relVel = currentVelocity - neighbor.currentVelocity;
		              float   dist   = relPos.magnitude;
		              float   minDist = radius + neighbor.radius;
		              
		              if (dist < minDist + 0.5f) // too close — push away
		              {
		                  Vector3 pushDir = (transform.position - neighbor.transform.position).normalized;
		                  result += pushDir * (minDist - dist) * 0.5f;
		              }
		          }
		          return Vector3.ClampMagnitude(result, maxSpeed);
		      }
		  }
		  ```
- # AI Middleware & Tools Comparison
  collapsed:: true
	- ## Decision Making Middleware
		- | Tool | Type | Engine | Language | Notes |
		  |------|------|--------|---------|-------|
		  | **Behavior Designer** | Behavior Trees | Unity | C# | Most popular Unity BT asset |
		  | **NodeCanvas** | BT + FSM + Dialogue | Unity | C# | All-in-one agent framework |
		  | **Unreal Behavior Trees** | Behavior Trees | Unreal | Blueprint + C++ | Built-in, AAA-proven |
		  | **Beehave** | Behavior Trees | Godot | GDScript | Free, open-source |
		  | **RAIN** | BT + Navigation | Unity | C# | Free, feature-rich |
		  | **Fluid Behavior Tree** | Behavior Trees | Any C# | C# | Lightweight, no Unity dependency |
	-
	- ## Pathfinding Middleware
		- | Tool | Description | Use Case |
		  |------|-------------|---------|
		  | **Unity NavMesh** | Built-in navigation, AI agents, off-mesh links | Most Unity games |
		  | **A* Pathfinding Project** | Drop-in A* with many graph types, threading | Complex Unity nav needs |
		  | **Recast/Detour** | Industry-standard NavMesh (used in Unreal built-in) | C++ engines |
		  | **Pathfinder.js** | JavaScript/TypeScript A* for browser games | Web games |
		  | **Flow Field (custom)** | Best for RTS with many units | Custom implementation |
	-
	- ## NPC / Dialogue Middleware
		- | Tool | Purpose | Used In |
		  |------|---------|---------|
		  | **Ink** | Narrative scripting language | Disco Elysium, Heaven's Vault |
		  | **Yarn Spinner** | Dialogue tree framework for Unity | Night in the Woods, A Short Hike |
		  | **Articy Draft** | Visual narrative + branching tool | AAA narrative design |
		  | **Twine** | Web-based interactive story prototyping | Indie text games |
		  | **Inworld AI** | LLM-powered NPC dialogue | Modern AI NPCs |
		  | **Convai** | Real-time NPC conversation AI | Metaverse / VR NPCs |
	-
	- ## AI for Specific Game Genres
		- | Genre | Primary AI Techniques |
		  |-------|----------------------|
		  | FPS / TPS | FSM / BT for enemies, A* NavMesh, perception systems, cover system |
		  | RPG / Open World | Behavior Trees, Radiant AI, dialogue graphs, schedules |
		  | RTS | Flow Fields, MCTS, formation movement, economy AI |
		  | Fighting Games | Frame data lookup tables, MCTS, neural network prediction |
		  | Racing | Rubber-banding (DDA), waypoint-following, opponent blocking |
		  | Horror | Director AI (L4D style), pacing, tension curves |
		  | Simulation | Utility AI, need-based systems, procedural dialogue |
		  | Puzzle | Solver AI for hint systems, procedural level generation |
		  | MOBA / Card Games | Minimax, MCTS, policy gradient RL |
- # More Learn
	- ## Books
		- [AI for Game Developers — David Bourg](https://archive.org/search?query=ai+for+game+developers) — Classic introduction.
		- [Behavioral Mathematics for Game AI — Dave Mark](https://www.wordware.com/files/ai/BehMath.pdf)
		- [Game AI Pro — Free online](http://www.gameaipro.com/) — 3 volumes of professional game AI articles.
		- [Artificial Intelligence for Games — Ian Millington](https://www.routledge.com/Artificial-Intelligence-for-Games/Millington/p/book/9780123747310) — Most comprehensive textbook.
	-
	- ## Resources
		- [AI Game Dev Community](https://www.aigamedev.com/)
		- [GDC AI Summit talks](https://gdcvault.com/browse/gdc-23?keyword=AI) — Free videos from professional developers.
		- [Unity ML-Agents Documentation](https://unity-technologies.github.io/ml-agents/)
		- [Behavior Trees for AI — Chris Simpson](https://www.gamedeveloper.com/programming/behavior-trees-for-ai-how-they-work) — Best introductory article.
		- [Amit's A* Pages](http://theory.stanford.edu/~amitp/GameProgramming/) — The definitive pathfinding reference.
		- [Red Blob Games](https://www.redblobgames.com/) — Outstanding interactive visualizations of pathfinding and grids.
	-
	- ## Internal Links
		- [[Game Design]] — AI systems serve game design goals — flow, challenge, tension
		- [[Game Development]] — Technical implementation patterns (component systems, update loops)
		- [[DSA Algo & System Design]] — A*, graphs, trees, data structures powering game AI
		- [[Machine Learning]] — RL algorithms, neural networks, the math behind ML-Agents
		- [[Game Physics]] — Physics and AI interaction (NavMesh agents, rigidbody movement)
		- [[Unity]] — Unity implementation: NavMesh, ML-Agents, Animator, Jobs System
		- [[Unreal Engine]] — Unreal: Behavior Trees, EQS, AI Perception, Navigation
		- [[Godot]] — Godot: NavigationAgent, Beehave BT addon, state machines
	-
	- ## Master Playlists YouTube
		- [Game AI — Sebastian Lague](https://www.youtube.com/results?search_query=sebastian+lague+pathfinding+a+star) — Beautiful visual pathfinding tutorials.
		- [Behavior Trees — Unity](https://www.youtube.com/results?search_query=unity+behavior+tree+game+ai+tutorial)
		- [ML-Agents Full Course](https://www.youtube.com/results?search_query=unity+ml+agents+full+course+reinforcement+learning)
		- [GOAP Game AI — F.E.A.R.](https://www.youtube.com/results?search_query=GOAP+game+AI+tutorial)
		- [Flow Fields RTS](https://www.youtube.com/results?search_query=flow+field+pathfinding+rts+tutorial)
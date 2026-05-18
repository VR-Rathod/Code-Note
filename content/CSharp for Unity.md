---
seoTitle: C# for Unity – Complete Unity Scripting Reference Guide
description: "Complete C# scripting reference for Unity covering MonoBehaviour lifecycle, Unity-specific APIs, coroutines, ScriptableObjects, events, physics, UI, and performance patterns."
keywords: "C# Unity, Unity scripting, MonoBehaviour, Unity C# reference, Unity coroutines, ScriptableObjects, Unity events, Unity physics, Unity UI, Unity performance, unity csharp guide, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: C# for Unity
---

- # Introduction
  collapsed:: true
	- This page covers **Unity-specific C# patterns** — the engine APIs, idioms, and workflows that differ from standard C#.
	- For the full C# language reference (LINQ, async/await, generics, OOP, etc.) see [[CSharp]].
	- For the full Unity engine reference (editor, physics, animation, UI, etc.) see [[Unity]].
- # MonoBehaviour Lifecycle
  collapsed:: true
	- ## Full Lifecycle Order
	  collapsed:: true
		- ```csharp
		  public class LifecycleDemo : MonoBehaviour
		  {
		      // ── Initialization ──────────────────────────────────────────
		  
		      void Awake()
		      {
		          // First callback. Called even if component is disabled.
		          // Use: get component references, initialize data.
		          // All Awakes run before any Start.
		      }
		  
		      void OnEnable()
		      {
		          // Called every time the GameObject/component is enabled.
		          // Use: subscribe to events.
		      }
		  
		      void Start()
		      {
		          // Called once on first frame the component is active.
		          // All Awakes have already run.
		          // Use: logic that depends on other objects being initialized.
		      }
		  
		      // ── Per-Frame ────────────────────────────────────────────────
		  
		      void Update()
		      {
		          // Every frame. Frame rate dependent.
		          // Use: input, non-physics movement, timers.
		      }
		  
		      void LateUpdate()
		      {
		          // After all Updates. Same frame.
		          // Use: camera follow, IK, anything that reads final positions.
		      }
		  
		      // ── Physics (Fixed Timestep) ─────────────────────────────────
		  
		      void FixedUpdate()
		      {
		          // Fixed timestep (default 0.02s = 50Hz). Frame-rate independent.
		          // Use: Rigidbody forces, physics queries.
		      }
		  
		      // ── Rendering ────────────────────────────────────────────────
		  
		      void OnPreRender()  { }  // before camera renders
		      void OnPostRender() { }  // after camera renders
		      void OnRenderObject() { } // after scene is rendered
		      void OnWillRenderObject() { } // called for each camera that renders this object
		  
		      // ── Collision & Trigger ──────────────────────────────────────
		  
		      void OnCollisionEnter(Collision col)  { }
		      void OnCollisionStay(Collision col)   { }
		      void OnCollisionExit(Collision col)   { }
		      void OnTriggerEnter(Collider other)   { }
		      void OnTriggerStay(Collider other)    { }
		      void OnTriggerExit(Collider other)    { }
		  
		      // 2D versions
		      void OnCollisionEnter2D(Collision2D col) { }
		      void OnTriggerEnter2D(Collider2D other)  { }
		  
		      // ── Mouse ────────────────────────────────────────────────────
		  
		      void OnMouseDown()  { }  // mouse button pressed over collider
		      void OnMouseUp()    { }  // mouse button released
		      void OnMouseEnter() { }  // mouse enters collider bounds
		      void OnMouseExit()  { }  // mouse leaves collider bounds
		      void OnMouseOver()  { }  // mouse is over collider
		  
		      // ── Application ──────────────────────────────────────────────
		  
		      void OnApplicationPause(bool paused)  { }  // app paused/resumed
		      void OnApplicationFocus(bool focused) { }  // app gained/lost focus
		      void OnApplicationQuit()              { }  // before app quits
		  
		      // ── Destruction ──────────────────────────────────────────────
		  
		      void OnDisable()
		      {
		          // Called when component/GameObject is disabled.
		          // Use: unsubscribe from events.
		      }
		  
		      void OnDestroy()
		      {
		          // Called when GameObject is destroyed.
		          // Use: cleanup, unsubscribe remaining events.
		      }
		  }
		  ```
	-
	- ## Awake vs Start — When to Use Each
	  collapsed:: true
		- ```csharp
		  public class Enemy : MonoBehaviour
		  {
		      Rigidbody rb;
		      Health health;
		      GameManager gm;
		  
		      void Awake()
		      {
		          // SELF-INITIALIZATION — get own components
		          rb     = GetComponent<Rigidbody>();
		          health = GetComponent<Health>();
		          // Don't access other objects here — they may not be Awake yet
		      }
		  
		      void Start()
		      {
		          // CROSS-OBJECT INITIALIZATION — safe to access other objects
		          gm = GameManager.Instance;
		          gm.RegisterEnemy(this);
		          health.OnDeath += OnDeath;
		      }
		  }
		  ```
- # Unity-Specific Types
  collapsed:: true
	- ## Vector2 & Vector3
	  collapsed:: true
		- ```csharp
		  // Construction
		  Vector3 pos = new Vector3(1f, 2f, 3f);
		  Vector2 dir = new Vector2(0f, 1f);
		  
		  // Constants
		  Vector3.zero    // (0,0,0)
		  Vector3.one     // (1,1,1)
		  Vector3.up      // (0,1,0)
		  Vector3.down    // (0,-1,0)
		  Vector3.forward // (0,0,1)
		  Vector3.back    // (0,0,-1)
		  Vector3.right   // (1,0,0)
		  Vector3.left    // (-1,0,0)
		  
		  // Operations
		  float mag   = pos.magnitude;          // length
		  float mag2  = pos.sqrMagnitude;       // faster (no sqrt)
		  Vector3 n   = pos.normalized;         // unit vector
		  float dist  = Vector3.Distance(a, b);
		  float dot   = Vector3.Dot(a, b);      // 1=same dir, 0=perp, -1=opposite
		  Vector3 cross = Vector3.Cross(a, b);  // perpendicular vector
		  
		  // Interpolation
		  Vector3.Lerp(a, b, t);          // linear, t clamped 0-1
		  Vector3.LerpUnclamped(a, b, t); // t can exceed 0-1
		  Vector3.Slerp(a, b, t);         // spherical (for directions)
		  Vector3.MoveTowards(a, b, maxDelta); // move by max distance
		  Vector3.SmoothDamp(a, b, ref vel, smoothTime); // smooth follow
		  
		  // Angle between vectors
		  float angle = Vector3.Angle(a, b);         // 0-180 degrees
		  float signed = Vector3.SignedAngle(a, b, Vector3.up); // -180 to 180
		  
		  // Project
		  Vector3 proj = Vector3.Project(a, b);      // project a onto b
		  Vector3 perp = Vector3.ProjectOnPlane(a, normal); // project onto plane
		  Vector3 refl = Vector3.Reflect(dir, normal); // reflect off surface
		  ```
	-
	- ## Quaternion
	  collapsed:: true
		- ```csharp
		  // Create rotations
		  Quaternion identity = Quaternion.identity;           // no rotation
		  Quaternion rot = Quaternion.Euler(0, 90, 0);         // from euler angles
		  Quaternion look = Quaternion.LookRotation(direction); // face a direction
		  Quaternion look2 = Quaternion.LookRotation(forward, up);
		  Quaternion axis = Quaternion.AngleAxis(45f, Vector3.up); // angle around axis
		  
		  // Apply rotation
		  transform.rotation = Quaternion.Euler(0, 90, 0);
		  transform.rotation *= Quaternion.Euler(0, 10, 0); // add rotation
		  
		  // Interpolate
		  transform.rotation = Quaternion.Slerp(from, to, t);     // smooth
		  transform.rotation = Quaternion.RotateTowards(from, to, maxDegrees);
		  
		  // Convert
		  Vector3 euler = transform.rotation.eulerAngles;
		  
		  // Rotate a vector
		  Vector3 rotated = transform.rotation * Vector3.forward;
		  
		  // Inverse
		  Quaternion inv = Quaternion.Inverse(transform.rotation);
		  
		  // Dot product (1 = same, 0 = 90°, -1 = opposite)
		  float dot = Quaternion.Dot(a, b);
		  float angle = Quaternion.Angle(a, b); // angle between rotations
		  ```
	-
	- ## Color
	  collapsed:: true
		- ```csharp
		  // Construction (0-1 range)
		  Color red   = new Color(1f, 0f, 0f);
		  Color semi  = new Color(1f, 0f, 0f, 0.5f); // 50% transparent
		  
		  // Named colors
		  Color.red; Color.green; Color.blue; Color.white; Color.black;
		  Color.yellow; Color.cyan; Color.magenta; Color.clear; Color.gray;
		  
		  // Hex (Color32 uses 0-255)
		  Color32 c32 = new Color32(255, 128, 0, 255);
		  Color fromHex;
		  ColorUtility.TryParseHtmlString("#FF8000", out fromHex);
		  string hex = "#" + ColorUtility.ToHtmlStringRGB(Color.red); // "FF0000"
		  
		  // Interpolate
		  Color lerped = Color.Lerp(Color.red, Color.blue, 0.5f);
		  
		  // HSV
		  Color.RGBToHSV(Color.red, out float h, out float s, out float v);
		  Color fromHSV = Color.HSVToRGB(0.5f, 1f, 1f);
		  ```
	-
	- ## Time
	  collapsed:: true
		- ```csharp
		  Time.deltaTime        // seconds since last frame (use in Update)
		  Time.fixedDeltaTime   // fixed physics timestep (use in FixedUpdate)
		  Time.time             // seconds since game started
		  Time.unscaledTime     // time ignoring timeScale (for UI/menus)
		  Time.timeScale        // 1=normal, 0=paused, 0.5=half speed, 2=double
		  Time.frameCount       // total frames rendered
		  Time.realtimeSinceStartup // real wall-clock time
		  
		  // Pause game
		  Time.timeScale = 0f;
		  
		  // Slow motion
		  Time.timeScale = 0.3f;
		  Time.fixedDeltaTime = 0.02f * Time.timeScale; // keep physics stable
		  
		  // Timer pattern
		  float timer = 0f;
		  float interval = 2f;
		  
		  void Update() {
		      timer += Time.deltaTime;
		      if (timer >= interval) {
		          timer = 0f;
		          DoSomething();
		      }
		  }
		  ```
	-
	- ## Mathf
	  collapsed:: true
		- ```csharp
		  // Constants
		  Mathf.PI          // 3.14159...
		  Mathf.Infinity    // float.MaxValue
		  Mathf.Deg2Rad     // multiply degrees to get radians
		  Mathf.Rad2Deg     // multiply radians to get degrees
		  
		  // Common functions
		  Mathf.Abs(-5f)              // 5
		  Mathf.Clamp(val, 0f, 1f)   // clamp between min and max
		  Mathf.Clamp01(val)          // clamp between 0 and 1
		  Mathf.Min(a, b)             // smaller value
		  Mathf.Max(a, b)             // larger value
		  Mathf.Sqrt(16f)             // 4
		  Mathf.Pow(2f, 8f)           // 256
		  Mathf.Floor(3.7f)           // 3
		  Mathf.Ceil(3.2f)            // 4
		  Mathf.Round(3.5f)           // 4
		  Mathf.Sign(-5f)             // -1
		  
		  // Interpolation
		  Mathf.Lerp(0f, 100f, 0.5f)         // 50
		  Mathf.LerpUnclamped(0f, 100f, 1.5f) // 150
		  Mathf.InverseLerp(0f, 100f, 50f)   // 0.5 (reverse lerp)
		  Mathf.SmoothStep(0f, 1f, t)        // smooth ease in/out
		  Mathf.MoveTowards(cur, target, maxDelta)
		  Mathf.SmoothDamp(cur, target, ref vel, smoothTime)
		  
		  // Trig
		  Mathf.Sin(angle * Mathf.Deg2Rad)
		  Mathf.Cos(angle * Mathf.Deg2Rad)
		  Mathf.Atan2(y, x) * Mathf.Rad2Deg  // angle from x-axis
		  
		  // Repeat / PingPong
		  Mathf.Repeat(Time.time, 1f)         // 0→1→0→1 (sawtooth)
		  Mathf.PingPong(Time.time, 1f)       // 0→1→0→1 (triangle)
		  
		  // Random
		  Random.Range(0, 10)       // int: 0 to 9 (exclusive max)
		  Random.Range(0f, 1f)      // float: 0.0 to 1.0 (inclusive max)
		  Random.insideUnitCircle  // random Vector2 inside unit circle
		  Random.insideUnitSphere  // random Vector3 inside unit sphere
		  Random.onUnitSphere      // random Vector3 on unit sphere surface
		  Random.rotation          // random Quaternion
		  ```
- # Coroutines In Depth
  collapsed:: true
	- ## All Yield Instructions
	  collapsed:: true
		- ```csharp
		  yield return null;                        // wait one frame
		  yield return new WaitForSeconds(2f);      // wait N real seconds
		  yield return new WaitForSecondsRealtime(2f); // wait N seconds (ignores timeScale)
		  yield return new WaitForFixedUpdate();    // wait for next FixedUpdate
		  yield return new WaitForEndOfFrame();     // wait until end of frame (after rendering)
		  yield return new WaitUntil(() => isReady);  // wait until condition is true
		  yield return new WaitWhile(() => isLoading); // wait while condition is true
		  yield return StartCoroutine(OtherRoutine()); // wait for another coroutine
		  yield return new AsyncOperation();        // wait for async operation (scene load, etc.)
		  yield break;                              // exit coroutine early
		  ```
	-
	- ## Coroutine Patterns
	  collapsed:: true
		- ```csharp
		  // Cached coroutine reference (to stop it later)
		  Coroutine flashRoutine;
		  
		  void StartFlash() {
		      if (flashRoutine != null) StopCoroutine(flashRoutine);
		      flashRoutine = StartCoroutine(Flash());
		  }
		  
		  IEnumerator Flash() {
		      for (int i = 0; i < 5; i++) {
		          renderer.enabled = false;
		          yield return new WaitForSeconds(0.1f);
		          renderer.enabled = true;
		          yield return new WaitForSeconds(0.1f);
		      }
		      flashRoutine = null;
		  }
		  
		  // Countdown timer
		  IEnumerator Countdown(int seconds) {
		      while (seconds > 0) {
		          timerText.text = seconds.ToString();
		          yield return new WaitForSeconds(1f);
		          seconds--;
		      }
		      timerText.text = "GO!";
		      StartGame();
		  }
		  
		  // Smooth value change
		  IEnumerator SmoothFOV(float targetFOV, float duration) {
		      float startFOV = cam.fieldOfView;
		      float elapsed = 0f;
		      while (elapsed < duration) {
		          elapsed += Time.deltaTime;
		          cam.fieldOfView = Mathf.Lerp(startFOV, targetFOV, elapsed / duration);
		          yield return null;
		      }
		      cam.fieldOfView = targetFOV;
		  }
		  ```
- # ScriptableObjects
  collapsed:: true
	- ## Data Container Pattern
	  collapsed:: true
		- ```csharp
		  // Item stats — shared across all instances of an item type
		  [CreateAssetMenu(fileName = "NewItem", menuName = "Game/Item")]
		  public class ItemData : ScriptableObject
		  {
		      [Header("Identity")]
		      public string itemName;
		      public Sprite icon;
		      [TextArea] public string description;
		  
		      [Header("Stats")]
		      public int damage;
		      public float attackSpeed;
		      public float range;
		  
		      [Header("Audio")]
		      public AudioClip useSound;
		      public AudioClip pickupSound;
		  
		      [Header("Prefab")]
		      public GameObject worldPrefab;
		  
		      // Methods are fine too
		      public string GetTooltip() => $"{itemName}\nDamage: {damage}\nSpeed: {attackSpeed}";
		  }
		  
		  // Enemy config
		  [CreateAssetMenu(menuName = "Game/EnemyConfig")]
		  public class EnemyConfig : ScriptableObject
		  {
		      public string enemyName;
		      public int maxHealth;
		      public float moveSpeed;
		      public float detectionRange;
		      public float attackRange;
		      public int damage;
		      public float attackCooldown;
		      public GameObject deathEffect;
		      public int scoreValue;
		  }
		  ```
	-
	- ## ScriptableObject Event System
	  collapsed:: true
		- ```csharp
		  // GameEvent.cs — the event asset
		  [CreateAssetMenu(menuName = "Events/GameEvent")]
		  public class GameEvent : ScriptableObject
		  {
		      readonly List<GameEventListener> listeners = new();
		  
		      public void Raise() {
		          for (int i = listeners.Count - 1; i >= 0; i--)
		              listeners[i].OnEventRaised();
		      }
		  
		      public void Register(GameEventListener l)   => listeners.Add(l);
		      public void Unregister(GameEventListener l) => listeners.Remove(l);
		  }
		  
		  // GameEventListener.cs — attach to any GameObject
		  public class GameEventListener : MonoBehaviour
		  {
		      [SerializeField] GameEvent gameEvent;
		      [SerializeField] UnityEvent response;
		  
		      void OnEnable()  => gameEvent.Register(this);
		      void OnDisable() => gameEvent.Unregister(this);
		  
		      public void OnEventRaised() => response.Invoke();
		  }
		  
		  // Usage:
		  // 1. Create GameEvent asset: "OnPlayerDied"
		  // 2. Raise from any script: onPlayerDied.Raise()
		  // 3. Add GameEventListener to UI, sound, etc. — wire up in Inspector
		  ```
	-
	- ## Runtime Sets
	  collapsed:: true
		- ```csharp
		  // Track all active enemies without singletons or FindObjectsOfType
		  [CreateAssetMenu(menuName = "Game/EnemySet")]
		  public class EnemySet : ScriptableObject
		  {
		      public List<Enemy> Items = new();
		  
		      public void Add(Enemy e)    => Items.Add(e);
		      public void Remove(Enemy e) => Items.Remove(e);
		      public int Count => Items.Count;
		  }
		  
		  // Enemy.cs
		  [SerializeField] EnemySet enemySet;
		  void OnEnable()  => enemySet.Add(this);
		  void OnDisable() => enemySet.Remove(this);
		  
		  // WaveManager.cs
		  [SerializeField] EnemySet enemySet;
		  void Update() {
		      if (enemySet.Count == 0) StartNextWave();
		  }
		  ```
- # Performance Patterns
  collapsed:: true
	- ## Avoiding GC Allocations
	  collapsed:: true
		- ```csharp
		  // BAD — allocates every frame
		  void Update() {
		      var enemies = FindObjectsOfType<Enemy>(); // allocation
		      string msg = "Score: " + score;           // string concat = allocation
		      GetComponents<Collider>();                 // allocation
		  }
		  
		  // GOOD — cache references
		  Enemy[] enemies;
		  StringBuilder sb = new StringBuilder();
		  Collider[] colliders = new Collider[10]; // pre-allocated buffer
		  
		  void Awake() {
		      enemies = FindObjectsOfType<Enemy>(); // once
		  }
		  
		  void Update() {
		      sb.Clear();
		      sb.Append("Score: ");
		      sb.Append(score);
		      scoreText.text = sb.ToString();
		  
		      // Non-allocating overlap
		      int count = Physics.OverlapSphereNonAlloc(pos, radius, colliders);
		      for (int i = 0; i < count; i++) { /* use colliders[i] */ }
		  }
		  ```
	-
	- ## Update Optimization
	  collapsed:: true
		- ```csharp
		  // BAD — expensive check every frame
		  void Update() {
		      if (Vector3.Distance(transform.position, player.position) < 10f)
		          Chase();
		  }
		  
		  // GOOD — use sqrMagnitude (no sqrt)
		  void Update() {
		      if ((transform.position - player.position).sqrMagnitude < 100f) // 10*10
		          Chase();
		  }
		  
		  // GOOD — throttle expensive checks
		  float checkInterval = 0.2f;
		  float nextCheck;
		  
		  void Update() {
		      if (Time.time >= nextCheck) {
		          nextCheck = Time.time + checkInterval;
		          UpdatePathfinding();
		      }
		  }
		  
		  // GOOD — use InvokeRepeating for periodic tasks
		  void Start() {
		      InvokeRepeating(nameof(SpawnEnemy), 2f, 5f); // start after 2s, repeat every 5s
		  }
		  void OnDisable() => CancelInvoke();
		  ```
	-
	- ## Object Pooling (Simple)
	  collapsed:: true
		- ```csharp
		  public class SimplePool<T> where T : Component
		  {
		      readonly Queue<T> pool = new();
		      readonly T prefab;
		      readonly Transform parent;
		  
		      public SimplePool(T prefab, int preload, Transform parent = null) {
		          this.prefab = prefab;
		          this.parent = parent;
		          for (int i = 0; i < preload; i++) {
		              var obj = Object.Instantiate(prefab, parent);
		              obj.gameObject.SetActive(false);
		              pool.Enqueue(obj);
		          }
		      }
		  
		      public T Get(Vector3 pos, Quaternion rot) {
		          T obj = pool.Count > 0 ? pool.Dequeue() : Object.Instantiate(prefab, parent);
		          obj.transform.SetPositionAndRotation(pos, rot);
		          obj.gameObject.SetActive(true);
		          return obj;
		      }
		  
		      public void Return(T obj) {
		          obj.gameObject.SetActive(false);
		          pool.Enqueue(obj);
		      }
		  }
		  ```
- # Common Unity Patterns
  collapsed:: true
	- ## State Machine
	  collapsed:: true
		- ```csharp
		  public class EnemyStateMachine : MonoBehaviour
		  {
		      enum State { Idle, Patrol, Chase, Attack, Dead }
		      State currentState = State.Idle;
		  
		      void Update() {
		          switch (currentState) {
		              case State.Idle:   UpdateIdle();   break;
		              case State.Patrol: UpdatePatrol(); break;
		              case State.Chase:  UpdateChase();  break;
		              case State.Attack: UpdateAttack(); break;
		          }
		      }
		  
		      void ChangeState(State newState) {
		          OnExitState(currentState);
		          currentState = newState;
		          OnEnterState(currentState);
		      }
		  
		      void OnEnterState(State s) {
		          switch (s) {
		              case State.Chase: agent.speed = runSpeed; break;
		              case State.Attack: StartCoroutine(AttackRoutine()); break;
		          }
		      }
		  
		      void OnExitState(State s) {
		          switch (s) {
		              case State.Attack: StopAllCoroutines(); break;
		          }
		      }
		  
		      void UpdateIdle() {
		          if (PlayerInRange(detectionRange)) ChangeState(State.Chase);
		      }
		  
		      void UpdateChase() {
		          agent.SetDestination(player.position);
		          if (PlayerInRange(attackRange)) ChangeState(State.Attack);
		          if (!PlayerInRange(detectionRange)) ChangeState(State.Patrol);
		      }
		  
		      bool PlayerInRange(float range) =>
		          (player.position - transform.position).sqrMagnitude < range * range;
		  }
		  ```
	-
	- ## Observer Pattern with Events
	  collapsed:: true
		- ```csharp
		  // Central event bus — no direct references needed
		  public static class EventBus
		  {
		      public static event Action<int>   OnScoreChanged;
		      public static event Action<float> OnHealthChanged;
		      public static event Action        OnPlayerDied;
		      public static event Action<int>   OnLevelCompleted;
		  
		      public static void ScoreChanged(int score)    => OnScoreChanged?.Invoke(score);
		      public static void HealthChanged(float hp)    => OnHealthChanged?.Invoke(hp);
		      public static void PlayerDied()               => OnPlayerDied?.Invoke();
		      public static void LevelCompleted(int level)  => OnLevelCompleted?.Invoke(level);
		  }
		  
		  // Publisher
		  public class Player : MonoBehaviour {
		      void TakeDamage(float amount) {
		          health -= amount;
		          EventBus.HealthChanged(health);
		          if (health <= 0) EventBus.PlayerDied();
		      }
		  }
		  
		  // Subscriber
		  public class HUD : MonoBehaviour {
		      void OnEnable()  => EventBus.OnHealthChanged += UpdateHealthBar;
		      void OnDisable() => EventBus.OnHealthChanged -= UpdateHealthBar;
		      void UpdateHealthBar(float hp) => healthBar.value = hp / maxHp;
		  }
		  ```
- # More Learn
	- [[CSharp]] - Full C# language reference (LINQ, async/await, generics, OOP)
	- [[Unity]] - Full Unity engine reference (editor, physics, animation, UI, shaders)
	- [Unity Scripting API](https://docs.unity3d.com/ScriptReference/)
	- [Unity Manual — Scripting](https://docs.unity3d.com/Manual/ScriptingSection.html)
	- [Unity Learn — Scripting](https://learn.unity.com/pathway/unity-essentials)
	- [Game Programming Patterns (free book)](https://gameprogrammingpatterns.com/)
	- [Jason Weimann — Unity Architecture](https://www.youtube.com/@Unity3dCollege)
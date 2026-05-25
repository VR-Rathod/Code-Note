---
seoTitle: Unity Engine Reference – Complete C# Scripting and Game Dev Guide
description: "Complete Unity reference covering GameObjects, MonoBehaviour, C# scripting, physics, animation, UI, audio, shaders, networking, and Unity 6 features for 2D/3D game development."
keywords: "Unity, Unity engine, Unity C#, MonoBehaviour, GameObjects, components, physics, animation, UI, shaders, Unity 6, 2D game, 3D game, unity notes, unity guide, unity cheatsheet, unity reference, unity tutorial, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Unity
---

- # History
  collapsed:: true
	- **How**: Developed by Unity Technologies, first released in **2005** at Apple's Worldwide Developers Conference as a Mac-exclusive engine. Became cross-platform in 2008.
	- **Who**: Co-founded by **David Helgason**, **Nicholas Francis**, and **Joachim Ante**.
	- **Why**: To democratize game development — give indie developers access to a professional-grade engine without the cost of Unreal or proprietary tools.
- # Introduction
  collapsed:: true
	- Unity is the world's most widely used real-time 3D engine. It powers over 50% of mobile games and is used for 2D, 3D, AR/VR, and simulation. Scripting is done in **C#** via **MonoBehaviour**.
	- For the complete in-depth C# language reference (variables, OOP, LINQ, async/await, generics, and more), see the dedicated [[CSharp]] note.
	-
	- ## Advantages
	  collapsed:: true
		- Massive asset store — thousands of free and paid assets.
		- Cross-platform — Windows, macOS, Linux, iOS, Android, WebGL, consoles.
		- URP and HDRP render pipelines for any visual target.
		- Huge community — most tutorials and Stack Overflow answers are Unity.
		- Unity 6 brings GPU Resident Drawer, Render Graph, and improved performance.
	-
	- ## Disadvantages
	  collapsed:: true
		- Runtime fee controversy (partially walked back, but trust damaged).
		- Editor can be slow for large projects.
		- C# garbage collection can cause frame spikes without careful management.
		- HDRP and URP have different shader/material workflows — not interchangeable.
- # Editor & Project Setup
  collapsed:: true
	- ## Editor Layout
	  collapsed:: true
		- ```
		  Scene View      — visual editor, place and move objects
		  Game View       — preview of what the camera sees
		  Hierarchy       — tree of all GameObjects in the scene
		  Inspector       — properties of the selected GameObject/component
		  Project         — all project assets (bottom panel)
		  Console         — logs, warnings, errors
		  ```
	-
	- ## Key Shortcuts
	  collapsed:: true
		- ```
		  Ctrl+S          Save scene
		  Ctrl+Z / Y      Undo / Redo
		  W / E / R / T   Move / Rotate / Scale / Rect tool
		  F               Focus on selected object
		  Ctrl+P          Play / Stop
		  Ctrl+Shift+P    Pause
		  Alt+LMB         Orbit camera
		  RMB+WASD        Fly through scene
		  Ctrl+D          Duplicate selected
		  Del             Delete selected
		  ```
	-
	- ## Project Structure
	  collapsed:: true
		- ```
		  Assets/             All project content
		  Assets/Scenes/      Scene files (.unity)
		  Assets/Scripts/     C# scripts
		  Assets/Prefabs/     Reusable prefab assets
		  Assets/Materials/   Materials and shaders
		  Assets/Textures/    Images and sprites
		  Assets/Audio/       Sound files
		  Packages/           Unity Package Manager packages
		  ProjectSettings/    Project-wide settings
		  Library/            Auto-generated cache (don't commit)
		  ```
	-
	- ## Build Settings & Player Settings
	  collapsed:: true
		- ```
		  File → Build Settings:
		    Add scenes to build list
		    Switch platform (PC, Android, iOS, WebGL, etc.)
		    Build / Build and Run
		  
		  Edit → Project Settings → Player:
		    Company Name, Product Name, Version
		    Icon, Splash Screen
		    Scripting Backend: Mono (fast iteration) / IL2CPP (better performance)
		    API Compatibility Level: .NET Standard 2.1 / .NET Framework
		  ```
- # Core Concepts — GameObjects & Components
  collapsed:: true
	- ## GameObject
	  collapsed:: true
		- ```
		  Everything in a Unity scene is a GameObject.
		  A GameObject is just a container — it does nothing by itself.
		  Behaviour comes from Components attached to it.
		  
		  Every GameObject has:
		    Transform   — position, rotation, scale (always present, cannot remove)
		    Name        — string identifier
		    Tag         — category label (Player, Enemy, Ground, etc.)
		    Layer       — used for physics, rendering, raycasting
		    Active      — enabled/disabled
		  ```
	-
	- ## Components
	  collapsed:: true
		- ```
		  Common built-in components:
		  
		  Rendering:
		    MeshFilter          — holds the mesh data
		    MeshRenderer        — renders the mesh with a material
		    SpriteRenderer      — renders a 2D sprite
		    Camera              — renders the scene from a viewpoint
		    Light               — directional, point, spot, area light
		    ParticleSystem      — CPU particle effects
		    LineRenderer        — draws lines in world space
		  
		  Physics (3D):
		    Rigidbody           — physics simulation (gravity, forces)
		    BoxCollider         — box-shaped collision
		    SphereCollider      — sphere collision
		    CapsuleCollider     — capsule collision (characters)
		    MeshCollider        — mesh-shaped collision
		    CharacterController — kinematic character movement
		  
		  Physics (2D):
		    Rigidbody2D         — 2D physics simulation
		    BoxCollider2D       — 2D box collision
		    CircleCollider2D    — 2D circle collision
		    PolygonCollider2D   — 2D polygon collision
		  
		  Audio:
		    AudioSource         — plays audio clips
		    AudioListener       — receives audio (usually on Camera)
		  
		  UI:
		    Canvas              — root of all UI elements
		    Text (TMP)          — TextMeshPro text
		    Image               — UI image/sprite
		    Button              — clickable button
		    Slider              — value slider
		  
		  Navigation:
		    NavMeshAgent        — AI pathfinding agent
		    NavMeshObstacle     — dynamic obstacle for NavMesh
		  
		  Animation:
		    Animator            — state machine animation controller
		    Animation           — legacy animation (avoid for new projects)
		  ```
	-
	- ## Prefabs
	  collapsed:: true
		- ```
		  Prefab — a reusable GameObject template saved as an asset.
		  Changes to the prefab propagate to all instances.
		  
		  Create: drag GameObject from Hierarchy → Project window
		  Edit:   double-click prefab in Project → Prefab Mode
		  
		  Prefab Variants: inherit from a base prefab, override specific properties
		  Nested Prefabs:  prefabs inside prefabs
		  ```
		- ```csharp
		  // Instantiate a prefab at runtime
		  [SerializeField] GameObject bulletPrefab;
		  
		  void Fire() {
		      GameObject bullet = Instantiate(bulletPrefab, firePoint.position, firePoint.rotation);
		      // or with parent:
		      Instantiate(bulletPrefab, firePoint.position, Quaternion.identity, transform);
		  }
		  
		  // Destroy
		  Destroy(bullet);           // immediate
		  Destroy(bullet, 3f);       // after 3 seconds
		  Destroy(gameObject);       // destroy self
		  ```
- # MonoBehaviour — Scripting Basics
  collapsed:: true
	- ## Script Structure & Lifecycle
	  collapsed:: true
		- ```csharp
		  using UnityEngine;
		  
		  public class PlayerController : MonoBehaviour
		  {
		      // Inspector-exposed fields
		      [SerializeField] float speed = 5f;
		      [SerializeField] float jumpForce = 8f;
		  
		      // Component references
		      Rigidbody rb;
		      Animator anim;
		  
		      // Called once before first frame (before Start)
		      void Awake() {
		          rb   = GetComponent<Rigidbody>();
		          anim = GetComponent<Animator>();
		      }
		  
		      // Called once on first frame (after all Awakes)
		      void Start() {
		          Debug.Log("Player started: " + gameObject.name);
		      }
		  
		      // Called every frame
		      void Update() {
		          HandleInput();
		      }
		  
		      // Called every physics tick (fixed timestep, default 50/s)
		      void FixedUpdate() {
		          Move();
		      }
		  
		      // Called after all Updates — good for camera follow
		      void LateUpdate() {
		          // camera logic here
		      }
		  
		      // Called when GameObject is enabled
		      void OnEnable()  { }
		  
		      // Called when GameObject is disabled or destroyed
		      void OnDisable() { }
		  
		      // Called when GameObject is destroyed
		      void OnDestroy() { }
		  
		      void HandleInput() { }
		      void Move() { }
		  }
		  ```
	-
	- ## Lifecycle Order
	  collapsed:: true
		- ```mermaid
		  graph TD
		      Start([Scene Load]) --> Awake[Awake]
		      Awake --> OnEnable[OnEnable]
		      OnEnable --> StartCall[Start]
		      StartCall --> PhysicsLoop{Physics Loop}
		      PhysicsLoop -->|Fixed Timestep| FixedUpdate[FixedUpdate]
		      FixedUpdate --> InternalPhysics[Internal Physics Update]
		      InternalPhysics --> TriggerCollision[OnTrigger / OnCollision]
		      TriggerCollision --> PhysicsLoop
		      PhysicsLoop -->|Next Frame| InputEvents[Input Events]
		      InputEvents --> UpdateCall[Update]
		      UpdateCall --> CoYield{Yield Instructions}
		      CoYield -->|null / frame| Coroutine[Coroutines Run]
		      Coroutine --> LateUpdate[LateUpdate]
		      LateUpdate --> Render[Rendering]
		      Render --> FrameEnd{Frame End}
		      FrameEnd -->|Loop| PhysicsLoop
		      FrameEnd -->|Disable| OnDisable[OnDisable]
		      OnDisable --> OnDestroy[OnDestroy]
		      OnDestroy --> End([Deallocation])
		  ```
		- ```
		  Scene Load:
		    Awake()          → all objects, any order
		    OnEnable()       → objects that start enabled
		    Start()          → all objects, after all Awakes
		  
		  Per Frame:
		    Update()         → every frame
		    LateUpdate()     → after all Updates
		  
		  Per Physics Tick:
		    FixedUpdate()    → fixed timestep (default 0.02s = 50Hz)
		  
		  Rendering:
		    OnPreRender()    → before camera renders
		    OnRenderObject() → after camera renders scene
		    OnPostRender()   → after camera renders
		    OnGUI()          → immediate mode GUI (legacy)
		  
		  Destruction:
		    OnDisable()
		    OnDestroy()
		  ```
	-
	- ## SerializeField & Inspector Attributes
	  collapsed:: true
		- ```csharp
		  public class Example : MonoBehaviour
		  {
		      // Show private field in Inspector
		      [SerializeField] float speed = 5f;
		  
		      // Hide public field from Inspector
		      [HideInInspector] public int hiddenValue;
		  
		      // Clamp slider in Inspector
		      [Range(0f, 100f)] public float volume = 50f;
		  
		      // Multi-line text field
		      [Multiline(5)] public string description;
		  
		      // Tooltip on hover
		      [Tooltip("Movement speed in units/second")]
		      public float moveSpeed = 3f;
		  
		      // Organize with headers and spaces
		      [Header("Combat Settings")]
		      public int damage = 10;
		  
		      [Space(10)]
		      public int health = 100;
		  
		      // Require a component on the same GameObject
		      [RequireComponent(typeof(Rigidbody))]
		      // (put this above the class declaration)
		  
		      // Run in edit mode
		      // [ExecuteInEditMode] or [ExecuteAlways]
		  }
		  ```
	-
	- ## Finding GameObjects & Components
	  collapsed:: true
		- ```csharp
		  // Get component on same GameObject (fast — use in Awake)
		  Rigidbody rb = GetComponent<Rigidbody>();
		  
		  // Get component on child
		  Animator anim = GetComponentInChildren<Animator>();
		  
		  // Get component on parent
		  Health hp = GetComponentInParent<Health>();
		  
		  // Find by name (slow — avoid in Update)
		  GameObject player = GameObject.Find("Player");
		  
		  // Find by tag (faster than Find)
		  GameObject enemy = GameObject.FindWithTag("Enemy");
		  GameObject[] enemies = GameObject.FindGameObjectsWithTag("Enemy");
		  
		  // Find by type (slowest — scans all objects)
		  PlayerController pc = FindObjectOfType<PlayerController>();
		  PlayerController[] all = FindObjectsOfType<PlayerController>();
		  
		  // Null check before use
		  if (rb != null) rb.AddForce(Vector3.up * 5f);
		  
		  // TryGetComponent (no allocation on failure)
		  if (TryGetComponent<Rigidbody>(out Rigidbody body)) {
		      body.AddForce(Vector3.up);
		  }
		  ```
- # Input System
  collapsed:: true
	- ## New Input System (Recommended)
	  collapsed:: true
		- ```
		  Setup:
		  1. Install via Package Manager: Input System
		  2. Edit → Project Settings → Player → Active Input Handling → Input System Package
		  3. Create InputActionAsset → define Actions and Bindings
		  4. Generate C# class from the asset
		  ```
		- ```csharp
		  using UnityEngine;
		  using UnityEngine.InputSystem;
		  
		  public class PlayerInput : MonoBehaviour
		  {
		      PlayerControls controls; // generated C# class
		      Vector2 moveInput;
		  
		      void Awake() {
		          controls = new PlayerControls();
		      }
		  
		      void OnEnable() {
		          controls.Player.Enable();
		          controls.Player.Move.performed += OnMove;
		          controls.Player.Move.canceled  += OnMove;
		          controls.Player.Jump.performed += OnJump;
		      }
		  
		      void OnDisable() {
		          controls.Player.Move.performed -= OnMove;
		          controls.Player.Move.canceled  -= OnMove;
		          controls.Player.Jump.performed -= OnJump;
		          controls.Player.Disable();
		      }
		  
		      void OnMove(InputAction.CallbackContext ctx) {
		          moveInput = ctx.ReadValue<Vector2>();
		      }
		  
		      void OnJump(InputAction.CallbackContext ctx) {
		          Jump();
		      }
		  
		      void Update() {
		          transform.Translate(new Vector3(moveInput.x, 0, moveInput.y) * 5f * Time.deltaTime);
		      }
		  
		      void Jump() { Debug.Log("Jump!"); }
		  }
		  ```
	-
	- ## Legacy Input System
	  collapsed:: true
		- ```csharp
		  void Update() {
		      // Axes (smooth, -1 to 1)
		      float h = Input.GetAxis("Horizontal");   // A/D or Left/Right
		      float v = Input.GetAxis("Vertical");     // W/S or Up/Down
		      float mouse_x = Input.GetAxis("Mouse X");
		      float mouse_y = Input.GetAxis("Mouse Y");
		  
		      // Raw axes (no smoothing, -1, 0, or 1)
		      float hRaw = Input.GetAxisRaw("Horizontal");
		  
		      // Keys
		      if (Input.GetKeyDown(KeyCode.Space))  Jump();    // pressed this frame
		      if (Input.GetKey(KeyCode.LeftShift))  Sprint();  // held down
		      if (Input.GetKeyUp(KeyCode.Space))    Land();    // released this frame
		  
		      // Mouse buttons (0=left, 1=right, 2=middle)
		      if (Input.GetMouseButtonDown(0)) Shoot();
		      Vector3 mousePos = Input.mousePosition;
		  
		      // Buttons (defined in Edit → Project Settings → Input Manager)
		      if (Input.GetButtonDown("Fire1")) Shoot();
		      if (Input.GetButton("Jump"))      HoldJump();
		  }
		  ```
- # Physics
  collapsed:: true
	- ## Rigidbody (3D)
	  collapsed:: true
		- ```csharp
		  public class PhysicsExample : MonoBehaviour
		  {
		      Rigidbody rb;
		  
		      void Awake() => rb = GetComponent<Rigidbody>();
		  
		      void FixedUpdate() {
		          // Move with physics (use in FixedUpdate)
		          rb.MovePosition(rb.position + Vector3.forward * 5f * Time.fixedDeltaTime);
		  
		          // Apply force
		          rb.AddForce(Vector3.forward * 10f);                    // continuous
		          rb.AddForce(Vector3.up * 500f, ForceMode.Impulse);     // instant
		          rb.AddForce(Vector3.right * 5f, ForceMode.VelocityChange); // ignore mass
		  
		          // Apply torque (rotation force)
		          rb.AddTorque(Vector3.up * 10f);
		  
		          // Direct velocity (use sparingly)
		          rb.linearVelocity = new Vector3(0, rb.linearVelocity.y, 0);
		      }
		  
		      void Start() {
		          rb.mass = 2f;
		          rb.linearDamping = 0.5f;       // air resistance
		          rb.angularDamping = 0.05f;
		          rb.useGravity = true;
		          rb.isKinematic = false;         // true = moved by script, not physics
		          rb.constraints = RigidbodyConstraints.FreezeRotationX
		                         | RigidbodyConstraints.FreezeRotationZ;
		      }
		  }
		  ```
	-
	- ## Collision Events
	  collapsed:: true
		- ```csharp
		  // 3D Collision (requires Rigidbody + Collider, isTrigger = false)
		  void OnCollisionEnter(Collision col) {
		      Debug.Log("Hit: " + col.gameObject.name);
		      Debug.Log("Impact point: " + col.contacts[0].point);
		      Debug.Log("Impact force: " + col.impulse.magnitude);
		  
		      if (col.gameObject.CompareTag("Enemy")) {
		          TakeDamage(10);
		      }
		  }
		  void OnCollisionStay(Collision col)  { /* held contact */ }
		  void OnCollisionExit(Collision col)  { /* contact ended */ }
		  
		  // 3D Trigger (isTrigger = true on collider)
		  void OnTriggerEnter(Collider other) {
		      if (other.CompareTag("Pickup")) {
		          Collect(other.gameObject);
		          Destroy(other.gameObject);
		      }
		  }
		  void OnTriggerStay(Collider other)  { }
		  void OnTriggerExit(Collider other)  { }
		  
		  // 2D versions
		  void OnCollisionEnter2D(Collision2D col) { }
		  void OnTriggerEnter2D(Collider2D other)  { }
		  ```
	-
	- ## Raycasting
	  collapsed:: true
		- ```csharp
		  void ShootRay() {
		      Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		      // or: Ray ray = new Ray(transform.position, transform.forward);
		  
		      RaycastHit hit;
		      float maxDist = 100f;
		      int layerMask = LayerMask.GetMask("Enemy", "Ground");
		  
		      if (Physics.Raycast(ray, out hit, maxDist, layerMask)) {
		          Debug.Log("Hit: " + hit.collider.name);
		          Debug.Log("Point: " + hit.point);
		          Debug.Log("Normal: " + hit.normal);
		          Debug.Log("Distance: " + hit.distance);
		  
		          // Draw debug ray in Scene view
		          Debug.DrawRay(ray.origin, ray.direction * hit.distance, Color.red, 1f);
		      }
		  
		      // All hits (sorted by distance)
		      RaycastHit[] hits = Physics.RaycastAll(ray, maxDist, layerMask);
		  
		      // Sphere cast
		      if (Physics.SphereCast(transform.position, 0.5f, transform.forward, out hit, 10f)) { }
		  
		      // Overlap sphere (returns all colliders in radius)
		      Collider[] nearby = Physics.OverlapSphere(transform.position, 5f, layerMask);
		      foreach (var col in nearby) Debug.Log(col.name);
		  
		      // 2D raycast
		      RaycastHit2D hit2D = Physics2D.Raycast(transform.position, Vector2.right, 10f);
		      if (hit2D.collider != null) Debug.Log(hit2D.collider.name);
		  }
		  ```
	-
	- ## CharacterController
	  collapsed:: true
		- ```csharp
		  public class CharacterMove : MonoBehaviour
		  {
		      CharacterController cc;
		      float gravity = -9.81f;
		      float verticalVelocity;
		  
		      void Awake() => cc = GetComponent<CharacterController>();
		  
		      void Update() {
		          // Gravity
		          if (cc.isGrounded && verticalVelocity < 0)
		              verticalVelocity = -2f;
		          verticalVelocity += gravity * Time.deltaTime;
		  
		          // Jump
		          if (Input.GetButtonDown("Jump") && cc.isGrounded)
		              verticalVelocity = Mathf.Sqrt(4f * -2f * gravity);
		  
		          // Move
		          float h = Input.GetAxis("Horizontal");
		          float v = Input.GetAxis("Vertical");
		          Vector3 move = transform.right * h + transform.forward * v;
		          move.y = verticalVelocity;
		  
		          cc.Move(move * 5f * Time.deltaTime);
		      }
		  }
		  ```
- # 2D Game Development
  collapsed:: true
	- ## Rigidbody2D & Movement
	  collapsed:: true
		- ```csharp
		  public class Player2D : MonoBehaviour
		  {
		      [SerializeField] float speed = 5f;
		      [SerializeField] float jumpForce = 10f;
		      Rigidbody2D rb;
		      bool isGrounded;
		  
		      void Awake() => rb = GetComponent<Rigidbody2D>();
		  
		      void Update() {
		          float h = Input.GetAxisRaw("Horizontal");
		          rb.linearVelocity = new Vector2(h * speed, rb.linearVelocity.y);
		  
		          if (Input.GetButtonDown("Jump") && isGrounded)
		              rb.AddForce(Vector2.up * jumpForce, ForceMode2D.Impulse);
		      }
		  
		      void OnCollisionEnter2D(Collision2D col) {
		          if (col.gameObject.CompareTag("Ground")) isGrounded = true;
		      }
		      void OnCollisionExit2D(Collision2D col) {
		          if (col.gameObject.CompareTag("Ground")) isGrounded = false;
		      }
		  }
		  ```
	-
	- ## SpriteRenderer & Sprite Animation
	  collapsed:: true
		- ```csharp
		  SpriteRenderer sr = GetComponent<SpriteRenderer>();
		  
		  // Flip sprite
		  sr.flipX = true;
		  sr.flipY = false;
		  
		  // Change sprite
		  sr.sprite = Resources.Load<Sprite>("Sprites/player_jump");
		  
		  // Change color / transparency
		  sr.color = Color.red;
		  sr.color = new Color(1f, 1f, 1f, 0.5f); // 50% transparent
		  
		  // Sorting order (higher = drawn on top)
		  sr.sortingOrder = 5;
		  sr.sortingLayerName = "Player";
		  ```
	-
	- ## Tilemap
	  collapsed:: true
		- ```csharp
		  using UnityEngine.Tilemaps;
		  
		  Tilemap tilemap = GetComponent<Tilemap>();
		  
		  // Get tile at position
		  Vector3Int cellPos = tilemap.WorldToCell(transform.position);
		  TileBase tile = tilemap.GetTile(cellPos);
		  
		  // Set tile
		  tilemap.SetTile(new Vector3Int(3, 2, 0), myTile);
		  
		  // Remove tile
		  tilemap.SetTile(cellPos, null);
		  
		  // Convert world ↔ cell
		  Vector3Int cell = tilemap.WorldToCell(worldPos);
		  Vector3 world = tilemap.CellToWorld(cell);
		  ```
	-
	- ## Camera2D Follow
	  collapsed:: true
		- ```csharp
		  public class CameraFollow : MonoBehaviour
		  {
		      [SerializeField] Transform target;
		      [SerializeField] float smoothSpeed = 5f;
		      [SerializeField] Vector3 offset = new Vector3(0, 2, -10);
		  
		      void LateUpdate() {
		          Vector3 desired = target.position + offset;
		          transform.position = Vector3.Lerp(transform.position, desired,
		              smoothSpeed * Time.deltaTime);
		      }
		  }
		  ```
- # 3D Game Development
  collapsed:: true
	- ## Transform Operations
	  collapsed:: true
		- ```csharp
		  // Position
		  transform.position = new Vector3(0, 1, 5);
		  transform.localPosition = Vector3.zero;       // relative to parent
		  transform.Translate(Vector3.forward * 5f * Time.deltaTime); // move relative to self
		  transform.Translate(Vector3.forward * 5f, Space.World);     // move in world space
		  
		  // Rotation
		  transform.rotation = Quaternion.identity;
		  transform.eulerAngles = new Vector3(0, 90, 0);
		  transform.Rotate(Vector3.up, 90f);            // rotate around axis
		  transform.LookAt(target.position);            // face a target
		  
		  // Smooth rotation
		  Quaternion targetRot = Quaternion.LookRotation(direction);
		  transform.rotation = Quaternion.Slerp(transform.rotation, targetRot, 5f * Time.deltaTime);
		  
		  // Scale
		  transform.localScale = new Vector3(2f, 2f, 2f);
		  
		  // Parent / Child
		  transform.SetParent(parentTransform);
		  transform.SetParent(null);                    // detach from parent
		  int childCount = transform.childCount;
		  Transform child = transform.GetChild(0);
		  ```
	-
	- ## Vector Math
	  collapsed:: true
		- ```csharp
		  Vector3 a = new Vector3(1, 0, 0);
		  Vector3 b = new Vector3(0, 1, 0);
		  
		  // Operations
		  Vector3 sum  = a + b;
		  Vector3 diff = a - b;
		  Vector3 scaled = a * 3f;
		  
		  // Magnitude & normalization
		  float mag  = a.magnitude;          // length
		  float mag2 = a.sqrMagnitude;       // faster (no sqrt)
		  Vector3 norm = a.normalized;       // unit vector
		  
		  // Dot & cross product
		  float dot   = Vector3.Dot(a, b);   // 0 = perpendicular, 1 = parallel
		  Vector3 cross = Vector3.Cross(a, b); // perpendicular to both
		  
		  // Distance
		  float dist = Vector3.Distance(a, b);
		  
		  // Interpolation
		  Vector3 lerped = Vector3.Lerp(a, b, 0.5f);       // linear
		  Vector3 slerped = Vector3.Slerp(a, b, 0.5f);     // spherical (for directions)
		  Vector3 moved = Vector3.MoveTowards(a, b, 0.1f); // move by max delta
		  
		  // Useful constants
		  Vector3.zero    // (0, 0, 0)
		  Vector3.one     // (1, 1, 1)
		  Vector3.up      // (0, 1, 0)
		  Vector3.forward // (0, 0, 1)
		  Vector3.right   // (1, 0, 0)
		  ```
	-
	- ## First-Person Controller
	  collapsed:: true
		- ```csharp
		  public class FPSController : MonoBehaviour
		  {
		      [SerializeField] float moveSpeed = 5f;
		      [SerializeField] float mouseSensitivity = 2f;
		      [SerializeField] Transform cameraTransform;
		  
		      CharacterController cc;
		      float xRotation;
		      float verticalVelocity;
		      float gravity = -9.81f;
		  
		      void Awake() {
		          cc = GetComponent<CharacterController>();
		          Cursor.lockState = CursorLockMode.Locked;
		      }
		  
		      void Update() {
		          // Mouse look
		          float mouseX = Input.GetAxis("Mouse X") * mouseSensitivity;
		          float mouseY = Input.GetAxis("Mouse Y") * mouseSensitivity;
		          xRotation -= mouseY;
		          xRotation = Mathf.Clamp(xRotation, -90f, 90f);
		          cameraTransform.localRotation = Quaternion.Euler(xRotation, 0, 0);
		          transform.Rotate(Vector3.up * mouseX);
		  
		          // Movement
		          float h = Input.GetAxis("Horizontal");
		          float v = Input.GetAxis("Vertical");
		          Vector3 move = transform.right * h + transform.forward * v;
		  
		          // Gravity
		          if (cc.isGrounded && verticalVelocity < 0) verticalVelocity = -2f;
		          if (Input.GetButtonDown("Jump") && cc.isGrounded)
		              verticalVelocity = Mathf.Sqrt(4f * -2f * gravity);
		          verticalVelocity += gravity * Time.deltaTime;
		          move.y = verticalVelocity;
		  
		          cc.Move(move * moveSpeed * Time.deltaTime);
		      }
		  }
		  ```
- # Animation System
  collapsed:: true
	- ## Animator & Animator Controller
	  collapsed:: true
		- ```
		  Animator Controller — state machine that controls animations.
		  
		  States:    Each state plays one AnimationClip
		  Transitions: Arrows between states with conditions
		  Parameters: Bool, Int, Float, Trigger — drive transitions
		  
		  Layers:    Multiple animation layers (base, upper body, face)
		  Blend Trees: Blend multiple clips by a float parameter (idle/walk/run)
		  ```
		- ```csharp
		  Animator anim = GetComponent<Animator>();
		  
		  // Set parameters
		  anim.SetFloat("Speed", rb.linearVelocity.magnitude);
		  anim.SetBool("IsGrounded", isGrounded);
		  anim.SetTrigger("Jump");       // one-shot trigger
		  anim.ResetTrigger("Jump");     // cancel trigger
		  anim.SetInteger("State", 2);
		  
		  // Get parameters
		  float speed = anim.GetFloat("Speed");
		  bool grounded = anim.GetBool("IsGrounded");
		  
		  // Play state directly
		  anim.Play("Run");
		  anim.Play("Attack", 0, 0f);   // (state, layer, normalizedTime)
		  
		  // Cross-fade
		  anim.CrossFade("Walk", 0.2f); // blend over 0.2 seconds
		  
		  // Check current state
		  AnimatorStateInfo info = anim.GetCurrentAnimatorStateInfo(0);
		  if (info.IsName("Attack")) { }
		  if (info.normalizedTime >= 1f) { /* animation finished */ }
		  ```
	-
	- ## Animation Events
	  collapsed:: true
		- ```csharp
		  // Add event in Animation window at a specific frame
		  // Function must be on a MonoBehaviour on the same GameObject
		  
		  void OnFootstep() {
		      AudioSource.PlayClipAtPoint(footstepClip, transform.position);
		  }
		  
		  void OnAttackHit() {
		      // Enable hitbox at this frame
		      hitbox.enabled = true;
		  }
		  ```
	-
	- ## Root Motion
	  collapsed:: true
		- ```csharp
		  // Apply Root Motion — animator moves the character via animation curves
		  // Enable "Apply Root Motion" on Animator component
		  
		  // Override root motion in script
		  void OnAnimatorMove() {
		      Vector3 velocity = anim.deltaPosition / Time.deltaTime;
		      cc.Move(anim.deltaPosition);
		  }
		  ```
- # UI System (uGUI & TextMeshPro)
  collapsed:: true
	- ## Canvas Setup
	  collapsed:: true
		- ```
		  Canvas Render Modes:
		    Screen Space - Overlay   — UI always on top, no camera needed
		    Screen Space - Camera    — UI rendered by a specific camera
		    World Space              — UI exists in 3D world (VR, diegetic UI)
		  
		  Canvas Scaler:
		    Constant Pixel Size      — fixed pixel size
		    Scale With Screen Size   — scales to reference resolution (recommended)
		    Constant Physical Size   — physical size in mm/cm
		  ```
	-
	- ## Common UI Components
	  collapsed:: true
		- ```csharp
		  using UnityEngine.UI;
		  using TMPro;
		  
		  // Text (TextMeshPro — recommended)
		  TextMeshProUGUI label = GetComponent<TextMeshProUGUI>();
		  label.text = "Score: " + score;
		  label.color = Color.yellow;
		  label.fontSize = 24;
		  
		  // Image
		  Image img = GetComponent<Image>();
		  img.sprite = mySprite;
		  img.color = new Color(1, 1, 1, 0.8f);
		  img.fillAmount = 0.75f;  // for radial health bars (Image Type = Filled)
		  
		  // Button
		  Button btn = GetComponent<Button>();
		  btn.onClick.AddListener(OnButtonClicked);
		  btn.onClick.AddListener(() => Debug.Log("Clicked!"));
		  btn.interactable = false;
		  
		  // Slider
		  Slider slider = GetComponent<Slider>();
		  slider.value = 0.5f;
		  slider.minValue = 0f;
		  slider.maxValue = 100f;
		  slider.onValueChanged.AddListener(OnSliderChanged);
		  
		  // Toggle
		  Toggle toggle = GetComponent<Toggle>();
		  toggle.isOn = true;
		  toggle.onValueChanged.AddListener(OnToggleChanged);
		  
		  // InputField (TMP)
		  TMP_InputField input = GetComponent<TMP_InputField>();
		  string text = input.text;
		  input.onEndEdit.AddListener(OnInputSubmit);
		  ```
	-
	- ## HUD Manager Pattern
	  collapsed:: true
		- ```csharp
		  public class HUDManager : MonoBehaviour
		  {
		      [SerializeField] Slider healthBar;
		      [SerializeField] TextMeshProUGUI scoreText;
		      [SerializeField] TextMeshProUGUI ammoText;
		      [SerializeField] GameObject gameOverPanel;
		  
		      public void UpdateHealth(float current, float max) {
		          healthBar.value = current / max;
		      }
		  
		      public void UpdateScore(int score) {
		          scoreText.text = $"Score: {score:N0}";
		      }
		  
		      public void UpdateAmmo(int current, int reserve) {
		          ammoText.text = $"{current} / {reserve}";
		      }
		  
		      public void ShowGameOver() {
		          gameOverPanel.SetActive(true);
		          Time.timeScale = 0f; // pause game
		      }
		  }
		  ```
- # Audio System
  collapsed:: true
	- ## AudioSource & AudioClip
	  collapsed:: true
		- ```csharp
		  public class AudioManager : MonoBehaviour
		  {
		      [SerializeField] AudioSource musicSource;
		      [SerializeField] AudioSource sfxSource;
		      [SerializeField] AudioClip jumpClip;
		      [SerializeField] AudioClip shootClip;
		  
		      void Start() {
		          musicSource.loop = true;
		          musicSource.volume = 0.5f;
		          musicSource.Play();
		      }
		  
		      public void PlayJump() {
		          sfxSource.PlayOneShot(jumpClip);          // doesn't interrupt
		      }
		  
		      public void PlayShoot() {
		          sfxSource.PlayOneShot(shootClip, 0.8f);   // with volume scale
		      }
		  
		      // Play at world position (fire and forget)
		      public void PlayAt(AudioClip clip, Vector3 pos) {
		          AudioSource.PlayClipAtPoint(clip, pos, 1f);
		      }
		  
		      // Randomize pitch for variation
		      public void PlayWithVariation(AudioClip clip) {
		          sfxSource.pitch = Random.Range(0.9f, 1.1f);
		          sfxSource.PlayOneShot(clip);
		      }
		  }
		  ```
	-
	- ## Audio Mixer
	  collapsed:: true
		- ```csharp
		  using UnityEngine.Audio;
		  
		  [SerializeField] AudioMixer mixer;
		  
		  // Set volume (exposed parameter in Mixer)
		  // Note: AudioMixer uses dB — convert from 0-1 slider
		  public void SetMusicVolume(float sliderValue) {
		      float dB = Mathf.Log10(Mathf.Max(sliderValue, 0.0001f)) * 20f;
		      mixer.SetFloat("MusicVolume", dB);
		  }
		  
		  // Mute
		  mixer.SetFloat("SFXVolume", -80f);  // -80dB = silent
		  
		  // Snapshot transition
		  AudioMixerSnapshot snapshot = mixer.FindSnapshot("Underwater");
		  snapshot.TransitionTo(0.5f); // blend over 0.5 seconds
		  ```
- # Scene Management
  collapsed:: true
	- ## Loading Scenes
	  collapsed:: true
		- ```csharp
		  using UnityEngine.SceneManagement;
		  
		  // Load scene (destroys current)
		  SceneManager.LoadScene("MainMenu");
		  SceneManager.LoadScene(1);              // by build index
		  
		  // Reload current scene
		  SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
		  
		  // Additive load (keep current scene)
		  SceneManager.LoadScene("HUD", LoadSceneMode.Additive);
		  
		  // Async load (show loading screen)
		  IEnumerator LoadAsync(string sceneName) {
		      AsyncOperation op = SceneManager.LoadSceneAsync(sceneName);
		      op.allowSceneActivation = false;
		  
		      while (!op.isDone) {
		          float progress = Mathf.Clamp01(op.progress / 0.9f); // 0-1
		          loadingBar.fillAmount = progress;
		  
		          if (op.progress >= 0.9f) {
		              // Scene ready — wait for input or auto-activate
		              op.allowSceneActivation = true;
		          }
		          yield return null;
		      }
		  }
		  
		  // Unload additive scene
		  SceneManager.UnloadSceneAsync("HUD");
		  
		  // Don't destroy on load (persist across scenes)
		  DontDestroyOnLoad(gameObject);
		  ```
	-
	- ## Singleton Pattern (GameManager)
	  collapsed:: true
		- ```csharp
		  public class GameManager : MonoBehaviour
		  {
		      public static GameManager Instance { get; private set; }
		  
		      public int Score { get; private set; }
		      public int Lives { get; private set; } = 3;
		  
		      void Awake() {
		          if (Instance != null && Instance != this) {
		              Destroy(gameObject);
		              return;
		          }
		          Instance = this;
		          DontDestroyOnLoad(gameObject);
		      }
		  
		      public void AddScore(int points) {
		          Score += points;
		          OnScoreChanged?.Invoke(Score);
		      }
		  
		      public event System.Action<int> OnScoreChanged;
		  }
		  
		  // Access from anywhere
		  GameManager.Instance.AddScore(100);
		  ```
- # Coroutines
  collapsed:: true
	- ## IEnumerator Basics
	  collapsed:: true
		- ```csharp
		  // Start / Stop
		  StartCoroutine(MyRoutine());
		  Coroutine c = StartCoroutine(MyRoutine());
		  StopCoroutine(c);
		  StopAllCoroutines();
		  
		  // Basic coroutine
		  IEnumerator MyRoutine() {
		      Debug.Log("Start");
		      yield return new WaitForSeconds(2f);    // wait 2 seconds
		      Debug.Log("After 2 seconds");
		      yield return null;                       // wait one frame
		      yield return new WaitForFixedUpdate();  // wait for FixedUpdate
		      yield return new WaitForEndOfFrame();   // wait for end of frame
		      Debug.Log("Done");
		  }
		  
		  // Wait until condition
		  IEnumerator WaitForDoor() {
		      yield return new WaitUntil(() => door.isOpen);
		      EnterRoom();
		  }
		  
		  // Wait while condition
		  IEnumerator WaitWhileLoading() {
		      yield return new WaitWhile(() => isLoading);
		      ShowMenu();
		  }
		  
		  // Fade out example
		  IEnumerator FadeOut(float duration) {
		      float elapsed = 0f;
		      Color startColor = spriteRenderer.color;
		  
		      while (elapsed < duration) {
		          elapsed += Time.deltaTime;
		          float alpha = 1f - (elapsed / duration);
		          spriteRenderer.color = new Color(startColor.r, startColor.g, startColor.b, alpha);
		          yield return null;
		      }
		  
		      spriteRenderer.color = new Color(startColor.r, startColor.g, startColor.b, 0f);
		      gameObject.SetActive(false);
		  }
		  ```
- # Object Pooling
  collapsed:: true
	- ## Unity Object Pool (Unity 2021+)
	  collapsed:: true
		- ```csharp
		  using UnityEngine.Pool;
		  
		  public class BulletPool : MonoBehaviour
		  {
		      [SerializeField] GameObject bulletPrefab;
		      IObjectPool<GameObject> pool;
		  
		      void Awake() {
		          pool = new ObjectPool<GameObject>(
		              createFunc:    () => Instantiate(bulletPrefab),
		              actionOnGet:   obj => obj.SetActive(true),
		              actionOnRelease: obj => obj.SetActive(false),
		              actionOnDestroy: obj => Destroy(obj),
		              collectionCheck: false,
		              defaultCapacity: 20,
		              maxSize: 100
		          );
		      }
		  
		      public GameObject Get() => pool.Get();
		      public void Release(GameObject obj) => pool.Release(obj);
		  }
		  
		  // Bullet.cs — return to pool when done
		  public class Bullet : MonoBehaviour
		  {
		      BulletPool pool;
		  
		      public void Init(BulletPool p) => pool = p;
		  
		      void OnTriggerEnter(Collider other) {
		          pool.Release(gameObject);
		      }
		  }
		  ```
- # Saving & Loading Data
  collapsed:: true
	- ## PlayerPrefs (Simple Key-Value)
	  collapsed:: true
		- ```csharp
		  // Save
		  PlayerPrefs.SetInt("HighScore", 9999);
		  PlayerPrefs.SetFloat("Volume", 0.8f);
		  PlayerPrefs.SetString("PlayerName", "Alice");
		  PlayerPrefs.Save(); // flush to disk
		  
		  // Load
		  int score = PlayerPrefs.GetInt("HighScore", 0);       // 0 = default
		  float vol = PlayerPrefs.GetFloat("Volume", 1f);
		  string name = PlayerPrefs.GetString("PlayerName", "Player");
		  
		  // Check & Delete
		  if (PlayerPrefs.HasKey("HighScore")) { }
		  PlayerPrefs.DeleteKey("HighScore");
		  PlayerPrefs.DeleteAll();
		  ```
	-
	- ## JSON Save System
	  collapsed:: true
		- ```csharp
		  using System.IO;
		  
		  [System.Serializable]
		  public class SaveData {
		      public int score;
		      public int level;
		      public float[] playerPosition;
		      public List<string> unlockedItems;
		  }
		  
		  public static class SaveSystem
		  {
		      static string SavePath => Application.persistentDataPath + "/save.json";
		  
		      public static void Save(SaveData data) {
		          string json = JsonUtility.ToJson(data, prettyPrint: true);
		          File.WriteAllText(SavePath, json);
		          Debug.Log("Saved to: " + SavePath);
		      }
		  
		      public static SaveData Load() {
		          if (!File.Exists(SavePath)) return new SaveData();
		          string json = File.ReadAllText(SavePath);
		          return JsonUtility.FromJson<SaveData>(json);
		      }
		  
		      public static void Delete() {
		          if (File.Exists(SavePath)) File.Delete(SavePath);
		      }
		  }
		  
		  // Usage
		  var data = new SaveData { score = 500, level = 3 };
		  SaveSystem.Save(data);
		  SaveData loaded = SaveSystem.Load();
		  ```
- # AI & Navigation
  collapsed:: true
	- ## NavMesh Agent
	  collapsed:: true
		- ```csharp
		  using UnityEngine.AI;
		  
		  public class EnemyAI : MonoBehaviour
		  {
		      NavMeshAgent agent;
		      Transform player;
		      [SerializeField] float detectionRange = 10f;
		      [SerializeField] float attackRange = 2f;
		  
		      void Awake() {
		          agent = GetComponent<NavMeshAgent>();
		          player = GameObject.FindWithTag("Player").transform;
		      }
		  
		      void Update() {
		          float dist = Vector3.Distance(transform.position, player.position);
		  
		          if (dist <= attackRange) {
		              agent.isStopped = true;
		              Attack();
		          } else if (dist <= detectionRange) {
		              agent.isStopped = false;
		              agent.SetDestination(player.position);
		          } else {
		              agent.isStopped = true;
		          }
		      }
		  
		      void Attack() { /* attack logic */ }
		  }
		  
		  // NavMesh setup:
		  // 1. Mark static geometry as Navigation Static
		  // 2. Window → AI → Navigation → Bake
		  // 3. Add NavMeshAgent component to enemy
		  
		  // NavMesh query
		  NavMeshHit hit;
		  if (NavMesh.SamplePosition(randomPos, out hit, 5f, NavMesh.AllAreas)) {
		      agent.SetDestination(hit.position);
		  }
		  ```
- # Shaders & Rendering
  collapsed:: true
	- ## Shader Graph (URP/HDRP)
	  collapsed:: true
		- ```
		  Shader Graph — node-based shader editor (URP and HDRP)
		  
		  Create: Right-click Project → Create → Shader Graph → URP → Lit Shader Graph
		  
		  Common nodes:
		    Sample Texture 2D   — sample a texture
		    UV                  — texture coordinates
		    Time                — current time (for animation)
		    Fresnel Effect      — rim lighting
		    Normal Map          — surface normals
		    Lerp                — blend between values
		    Multiply / Add      — math operations
		    Split / Combine     — split/combine vectors
		    Vertex Color        — per-vertex color data
		  
		  Output:
		    Base Color, Metallic, Smoothness, Normal, Emission, Alpha
		  ```
	-
	- ## Material Property Block (Performance)
	  collapsed:: true
		- ```csharp
		  // Change material properties per-instance without creating new materials
		  MaterialPropertyBlock mpb = new MaterialPropertyBlock();
		  Renderer rend = GetComponent<Renderer>();
		  
		  // Set properties
		  mpb.SetColor("_BaseColor", Color.red);
		  mpb.SetFloat("_Metallic", 0.8f);
		  mpb.SetTexture("_BaseMap", myTexture);
		  rend.SetPropertyBlock(mpb);
		  
		  // Clear
		  rend.SetPropertyBlock(null);
		  ```
	-
	- ## Post Processing (URP)
	  collapsed:: true
		- ```
		  Setup:
		  1. Add Volume component to a GameObject
		  2. Set Profile → Create New
		  3. Add Overrides: Bloom, Color Grading, Depth of Field, Vignette, etc.
		  4. Camera must have Post Processing enabled
		  
		  Global Volume:  affects entire scene
		  Local Volume:   affects camera when inside the volume's collider
		  ```
		- ```csharp
		  using UnityEngine.Rendering;
		  using UnityEngine.Rendering.Universal;
		  
		  Volume volume;
		  Bloom bloom;
		  
		  void Start() {
		      volume = GetComponent<Volume>();
		      volume.profile.TryGet(out bloom);
		  }
		  
		  void Update() {
		      // Pulse bloom on hit
		      bloom.intensity.value = Mathf.PingPong(Time.time, 2f);
		  }
		  ```
- # Debugging & Profiling
  collapsed:: true
	- ## Debug Utilities
	  collapsed:: true
		- ```csharp
		  // Console logs
		  Debug.Log("Info message");
		  Debug.LogWarning("Warning: " + value);
		  Debug.LogError("Error: " + error);
		  Debug.LogFormat("Player pos: {0}", transform.position);
		  
		  // Conditional (only in editor/development builds)
		  Debug.Assert(health > 0, "Health must be positive!");
		  
		  // Visual debug in Scene view
		  Debug.DrawLine(start, end, Color.red, 2f);           // duration 2s
		  Debug.DrawRay(transform.position, Vector3.up * 5f, Color.green);
		  
		  // Gizmos (visible in Scene view, not Game view)
		  void OnDrawGizmos() {
		      Gizmos.color = Color.yellow;
		      Gizmos.DrawWireSphere(transform.position, detectionRange);
		      Gizmos.DrawLine(transform.position, target.position);
		  }
		  
		  void OnDrawGizmosSelected() {
		      // Only when this object is selected
		      Gizmos.color = Color.red;
		      Gizmos.DrawWireCube(transform.position, Vector3.one);
		  }
		  ```
	-
	- ## Profiler
	  collapsed:: true
		- ```
		  Window → Analysis → Profiler
		  
		  Key areas:
		    CPU Usage    — script, physics, rendering time per frame
		    Memory       — allocations, GC calls (spikes = frame hitches)
		    Rendering    — draw calls, batches, triangles
		    Physics      — collision checks, rigidbody count
		  
		  Custom profiler markers:
		  ```
		- ```csharp
		  using Unity.Profiling;
		  
		  static readonly ProfilerMarker s_MyMarker = new ProfilerMarker("MySystem.Update");
		  
		  void Update() {
		      s_MyMarker.Begin();
		      // expensive code here
		      s_MyMarker.End();
		  }
		  ```
- # C# for Unity — Unity-Specific Patterns
  collapsed:: true
	- For the full C# language reference see [[CSharp]]. For Unity-specific scripting patterns in depth, see [[CSharp for Unity]].
	-
	- ## Events & Delegates
	  collapsed:: true
		- ```csharp
		  // C# event pattern — decoupled communication
		  public class Health : MonoBehaviour
		  {
		      public event System.Action<int> OnDamaged;
		      public event System.Action OnDeath;
		      public event System.Action<int, int> OnHealthChanged; // current, max
		  
		      int current = 100;
		      int max = 100;
		  
		      public void TakeDamage(int amount) {
		          current = Mathf.Max(0, current - amount);
		          OnDamaged?.Invoke(amount);
		          OnHealthChanged?.Invoke(current, max);
		          if (current == 0) OnDeath?.Invoke();
		      }
		  }
		  
		  // Subscribe
		  health.OnDeath += HandleDeath;
		  health.OnHealthChanged += (cur, max) => healthBar.value = (float)cur / max;
		  
		  // Unsubscribe (important — prevents memory leaks)
		  void OnDestroy() {
		      health.OnDeath -= HandleDeath;
		  }
		  ```
	-
	- ## ScriptableObjects — Data Containers
	  collapsed:: true
		- ```csharp
		  // ScriptableObject — data asset, not attached to a GameObject
		  // Great for: item stats, enemy configs, game settings, shared events
		  
		  [CreateAssetMenu(fileName = "NewWeapon", menuName = "Game/Weapon")]
		  public class WeaponData : ScriptableObject
		  {
		      public string weaponName;
		      public int damage;
		      public float fireRate;
		      public float range;
		      public AudioClip fireSound;
		      public GameObject bulletPrefab;
		  }
		  
		  // Create: Right-click Project → Game → Weapon
		  // Use in script:
		  [SerializeField] WeaponData weaponData;
		  
		  void Shoot() {
		      Debug.Log($"Firing {weaponData.weaponName} for {weaponData.damage} damage");
		      AudioSource.PlayClipAtPoint(weaponData.fireSound, transform.position);
		  }
		  
		  // ScriptableObject Event (Ryan Hipple pattern)
		  [CreateAssetMenu(menuName = "Game/GameEvent")]
		  public class GameEvent : ScriptableObject
		  {
		      List<GameEventListener> listeners = new();
		      public void Raise() => listeners.ForEach(l => l.OnEventRaised());
		      public void Register(GameEventListener l) => listeners.Add(l);
		      public void Unregister(GameEventListener l) => listeners.Remove(l);
		  }
		  ```
	-
	- ## ScriptableObject-based Variables & Events
	  collapsed:: true
		- This architecture pattern decouples code by storing runtime variables and events inside assets. Highly recommended for implementing the modular relationships in [[Game Design#Advanced Design Systems]].
		- ```mermaid
		  graph TD
		      Player[Player Health script] -->|1. Event.Raise| Asset[GameEvent SO Asset: OnPlayerDamaged]
		      Asset -->|2. Notifies listeners| L1[GameEventListener 1]
		      Asset -->|2. Notifies listeners| L2[GameEventListener 2]
		      L1 -->|3. UnityEvent Response| UI[Player Health UI]
		      L2 -->|3. UnityEvent Response| Audio[Audio System]
		  ```
		- ```csharp
		  // Shared Float Variable asset
		  [CreateAssetMenu(menuName = "Variables/FloatVariable")]
		  public class FloatVariable : ScriptableObject
		  {
		      public float Value;
		  }
		  
		  // Listener Component
		  public class GameEventListener : MonoBehaviour
		  {
		      [SerializeField] GameEvent Event;
		      [SerializeField] UnityEngine.Events.UnityEvent Response;
		  
		      void OnEnable()  => Event.Register(this);
		      void OnDisable() => Event.Unregister(this);
		  
		      public void OnEventRaised() => Response.Invoke();
		  }
		  ```
	-
	- ## Interfaces for Decoupling
	  collapsed:: true
		- ```csharp
		  public interface IDamageable {
		      void TakeDamage(int amount);
		  }
		  
		  public interface IInteractable {
		      void Interact(GameObject interactor);
		      string GetPrompt();
		  }
		  
		  // Implement on any class
		  public class Enemy : MonoBehaviour, IDamageable {
		      public void TakeDamage(int amount) { /* ... */ }
		  }
		  
		  public class Barrel : MonoBehaviour, IDamageable, IInteractable {
		      public void TakeDamage(int amount) { Explode(); }
		      public void Interact(GameObject g) { Push(g); }
		      public string GetPrompt() => "Push barrel";
		  }
		  
		  // Use without knowing the concrete type
		  void ShootAt(GameObject target) {
		      if (target.TryGetComponent<IDamageable>(out var damageable))
		          damageable.TakeDamage(25);
		  }
		  ```
	-
	- ## UniTask (Zero-Allocation Async/Await)
	  collapsed:: true
		- Standard C# Tasks allocate GC memory on every await. UniTask is a struct-based implementation optimized for Unity.
		- ```csharp
		  using Cysharp.Threading.Tasks;
		  using System;
		  using UnityEngine;
		  
		  public class AsyncLoadExample : MonoBehaviour
		  {
		      // Zero allocation async wait
		      public async UniTaskVoid StartGameSequenceAsync()
		      {
		          try
		          {
		              Debug.Log("Starting loading sequence...");
		              await UniTask.Delay(TimeSpan.FromSeconds(2f), delayType: DelayType.Realtime);
		              
		              // Awaiting scene load directly
		              await UnityEngine.SceneManagement.SceneManager.LoadSceneAsync("GameScene").ToUniTask();
		              Debug.Log("Scene loaded successfully");
		          }
		          catch (Exception ex)
		          {
		              Debug.LogException(ex);
		          }
		      }
		  }
		  ```
	-
	- ## Non-Allocating Physics Queries
	  collapsed:: true
		- Standard queries (e.g. `OverlapSphere`) allocate garbage arrays. Always use the `NonAlloc` methods with a pre-allocated cache.
		- ```csharp
		  public class PhysicsScanner : MonoBehaviour
		  {
		      // Static cache to prevent garbage allocation on invocation
		      readonly Collider[] scanResults = new Collider[20];
		      [SerializeField] LayerMask targetLayers;
		  
		      void Update()
		      {
		          // Returns the count of colliders found, up to the size of the array
		          int foundCount = Physics.OverlapSphereNonAlloc(transform.position, 5f, scanResults, targetLayers);
		          
		          for (int i = 0; i < foundCount; i++)
		          {
		              Debug.Log($"Found: {scanResults[i].name}");
		          }
		      }
		  }
		  ```
- # Editor Scripting
  collapsed:: true
	- Extending the Unity Editor to create custom tools, inspectors, and windows. Crucial for streamlining level layout and building prototyping tools during the production pipeline (see [[Game Design#Prototyping & Production]]).
	-
	- ## Custom Inspectors (IMGUI)
	  collapsed:: true
		- Customize how a script appears inside the Inspector tab.
		- ```csharp
		  using UnityEngine;
		  #if UNITY_EDITOR
		  using UnityEditor;
		  
		  [CustomEditor(typeof(Weapon))]
		  public class WeaponEditor : Editor
		  {
		      public override void OnInspectorGUI()
		      {
		          // Get reference to actual target script
		          Weapon weapon = (Weapon)target;
		  
		          // Draw standard inspector variables
		          DrawDefaultInspector();
		  
		          EditorGUILayout.Space();
		          EditorGUILayout.LabelField("Custom Editor Tools", EditorStyles.boldLabel);
		  
		          if (GUILayout.Button("Refill Ammo"))
		          {
		              weapon.Refill();
		          }
		      }
		  }
		  #endif
		  
		  // Target Component script
		  public class Weapon : MonoBehaviour
		  {
		      public int ammo = 10;
		      public void Refill() => ammo = 100;
		  }
		  ```
	-
	- ## Custom Editor Windows
	  collapsed:: true
		- Create persistent, docking windows within the Unity interface.
		- ```csharp
		  #if UNITY_EDITOR
		  using UnityEditor;
		  using UnityEngine;
		  
		  public class LevelBuilderWindow : EditorWindow
		  {
		      GameObject objectToSpawn;
		  
		      [MenuItem("Tools/Level Builder")]
		      public static void ShowWindow()
		      {
		          GetWindow<LevelBuilderWindow>("Level Builder");
		      }
		  
		      void OnGUI()
		      {
		          GUILayout.Label("Spawning Configuration", EditorStyles.boldLabel);
		          objectToSpawn = (GameObject)EditorGUILayout.ObjectField("Prefab", objectToSpawn, typeof(GameObject), false);
		  
		          if (GUILayout.Button("Spawn at Origin"))
		          {
		              if (objectToSpawn != null)
		              {
		                  Instantiate(objectToSpawn, Vector3.zero, Quaternion.identity);
		              }
		          }
		      }
		  }
		  #endif
		  ```
	-
	- ## Property Drawers
	  collapsed:: true
		- Overriding how custom structures or serialized classes display in the editor.
		- ```csharp
		  using UnityEngine;
		  #if UNITY_EDITOR
		  using UnityEditor;
		  
		  [System.Serializable]
		  public struct ScaledFloat
		  {
		      public float value;
		      public float multiplier;
		  }
		  
		  [CustomPropertyDrawer(typeof(ScaledFloat))]
		  public class ScaledFloatDrawer : PropertyDrawer
		  {
		      public override void OnGUI(Rect position, SerializedProperty property, GUIContent label)
		      {
		          EditorGUI.BeginProperty(position, label, property);
		          position = EditorGUI.PrefixLabel(position, GUIUtility.GetControlID(FocusType.Passive), label);
		  
		          // Divide drawing space into two columns
		          float width = position.width / 2;
		          Rect valueRect = new Rect(position.x, position.y, width - 5, position.height);
		          Rect multRect = new Rect(position.x + width, position.y, width, position.height);
		  
		          EditorGUI.PropertyField(valueRect, property.FindPropertyRelative("value"), GUIContent.none);
		          EditorGUI.PropertyField(multRect, property.FindPropertyRelative("multiplier"), GUIContent.none);
		  
		          EditorGUI.EndProperty();
		      }
		  }
		  #endif
		  ```
	-
	- ## UI Toolkit in the Editor
	  collapsed:: true
		- The modern layout engine replacing standard IMGUI using XML-like layout (UXML) and style sheets (USS).
		- ```csharp
		  #if UNITY_EDITOR
		  using UnityEditor;
		  using UnityEngine;
		  using UnityEngine.UIElements;
		  
		  public class UIToolkitWindow : EditorWindow
		  {
		      [MenuItem("Tools/UI Toolkit Window")]
		      public static void ShowWindow() => GetWindow<UIToolkitWindow>("UI Toolkit");
		  
		      void CreateGUI()
		      {
		          VisualElement root = rootVisualElement;
		  
		          // Create a label
		          Label label = new Label("Modern UI Toolkit Label");
		          label.style.fontSize = 20;
		          label.style.color = Color.cyan;
		          root.Add(label);
		  
		          // Create a button
		          Button btn = new Button(() => Debug.Log("Clicked UI Toolkit Button!"));
		          btn.text = "Click Me";
		          root.Add(btn);
		      }
		  }
		  #endif
		  ```
- # Unity 6 Graphics & Core Features
  collapsed:: true
	- Unity 6 is focused on GPU-driven workflows, visual fidelity, and high performance.
	-
	- ## GPU Resident Drawer
	  collapsed:: true
		- **What**: Move the rendering submission queue from the CPU to the GPU.
		- ```mermaid
		  graph TD
		      subgraph Standard Pipeline (CPU Bound)
		          CPU_B[CPU: Groups Meshes & Calculates Material Properties] -->|Submit Draw Call per batch| GPU_B[GPU Renders meshes]
		      end
		      subgraph GPU Resident Drawer (GPU Driven)
		          CPU_R[CPU: Uploads mesh/material instance buffers once] -->|Draw commands executed on-device| GPU_R[GPU: Culls, groups, and renders directly]
		      end
		  ```
		- **How**: Instantiated mesh draws are grouped, batched, and rendered directly via GPU-driven instancing.
		- **Advantage**: Reduces CPU batching overhead and draw calls by up to 90% in dense scenes.
		- **Setup**: In Universal Render Pipeline (URP) or HDRP assets, toggle `GPU Resident Drawer` in the Rendering configuration settings. Requires devices supporting Shader Model 4.5+.
	-
	- ## Render Graph API
	  collapsed:: true
		- **What**: Scriptable Render Pipeline (SRP) backend replacing old command buffer logic.
		- **Concept**: Rendering is defined as a directed acyclic graph (DAG) of passes. Resource allocation, dependency checking, and execution are optimized automatically.
		- ```mermaid
		  graph LR
		      Depth[Depth Prepass] --> GBuffer[G-Buffer Pass]
		      GBuffer --> Shadow[Shadow Pass]
		      GBuffer --> Lighting[Lighting Pass]
		      Shadow --> Lighting
		      Lighting --> Post[Post-Processing Pass]
		      Post --> STP[Spatial Temporal Post-Processing]
		      STP --> Present[Present to Screen]
		  ```
		- **Code Example**:
		  ```csharp
		  using UnityEngine.Rendering;
		  using UnityEngine.Rendering.RenderGraphModule;
		  
		  public class CustomGraphPass : ScriptableRenderPass
		  {
		      // Unity 6 Render Graph Execution entry point
		      public override void RecordRenderGraph(RenderGraph renderGraph, ContextContainer frameData)
		      {
		          // Get textures and context
		          UniversalResourceData resourceData = frameData.Get<UniversalResourceData>();
		          TextureHandle colorBuffer = resourceData.activeColorBuffer;
		  
		          using (var builder = renderGraph.AddRasterRenderPass<PassData>("Custom Blur Pass", out var passData))
		          {
		              passData.target = colorBuffer;
		              builder.UseTexture(colorBuffer, AccessFlags.Write);
		              
		              builder.SetRenderFunc<PassData>((data, context) =>
		              {
		                  // Draw render commands using GPU context here
		              });
		          }
		      }
		  
		      class PassData
		      {
		          public TextureHandle target;
		      }
		  }
		  ```
	-
	- ## Spatial Temporal Post-Processing (STP)
	  collapsed:: true
		- **What**: Unity's native hardware-agnostic temporal upscaler.
		- **How**: Resolves a high-fidelity image from lower rendering resolutions (e.g. upscaling 1080p to 4K) using motion vectors and historical frame buffers.
		- **Usage**: Set up on the Camera component or pipeline settings. Ideal for high-end graphic pipelines where DLSS/FSR is unavailable.
	-
	- ## Adaptive Probe Volumes (APV)
	  collapsed:: true
		- **What**: Automated global illumination placement replacing manual Light Probes.
		- **How**: Dynamically samples bounce light and ambient occlusion grids based on geometry density.
		- **Advantage**: Smooth lighting transitions, dynamic streaming of light probes, and prevents light leaks in interior walls.
- # Performance & Memory Optimization
  collapsed:: true
	- Essential practices to maintain stable framerates (60/120 FPS) and avoid garbage collection hitching.
	-
	- ## Garbage Collection (GC) Optimization
	  collapsed:: true
		- **Avoid Boxing**: Passing value types as objects allocates memory on the heap. Avoid using string concat inside `Update()`.
		- **Cache Component Reference**: Never call `GetComponent` or `.tag` in loops. Use tags with `CompareTag()`.
		- **Shader Property Caching**: Do not use string names for shaders in update loops. Cache the hash code.
		- ```csharp
		  public class OptimizedLoops : MonoBehaviour
		  {
		      static readonly int BaseColorID = Shader.PropertyToID("_BaseColor");
		      Material propertyMaterial;
		  
		      void Start()
		      {
		          propertyMaterial = GetComponent<Renderer>().material;
		      }
		  
		      void Update()
		      {
		          // Good: using cached integer property IDs rather than string name "_BaseColor"
		          propertyMaterial.SetColor(BaseColorID, Color.red);
		          
		          // Good: CompareTag performs no GC allocation
		          if (gameObject.CompareTag("Player")) { } 
		      }
		  }
		  ```
		- **Dynamic GC Control**: Use Incremental GC (distributes sweeps over multiple frames) or disable garbage collector manually during intensive gameplay sequences:
		  ```csharp
		  // Disable garbage collections during a race
		  UnityEngine.Scripting.GarbageCollector.GCMode = UnityEngine.Scripting.GarbageCollector.Mode.Disabled;
		  
		  // Re-enable when opening game menu
		  UnityEngine.Scripting.GarbageCollector.GCMode = UnityEngine.Scripting.GarbageCollector.Mode.Enabled;
		  ```
	-
	- ## Draw Call & Batching Optimization
	  collapsed:: true
		- ```mermaid
		  graph TD
		      Meshes[GameObjects to Render] --> Method{Optimization Method?}
		      Method -->|Static Meshes, Shared Material| SB[Static Batching\nCombines meshes at start into single buffer]
		      Method -->|Small Dynamic Meshes, Shared Material| DB[Dynamic Batching\nCPU groups meshes on-fly <300 vertices]
		      Method -->|Same Mesh, Different Material Data| GI[GPU Instancing\nDraws many instances using MaterialPropertyBlock]
		      Method -->|Different Meshes, Different Materials| SRP[SRP Batcher\nCaches materials in GPU, uploads only transforms]
		      SB --> Output[Reduced Draw Calls / GPU State Changes]
		      DB --> Output
		      GI --> Output
		      SRP --> Output
		  ```
		- **Static Batching**: Combines static meshes sharing the same material into a single batch at startup.
		- **Dynamic Batching**: CPU groups small dynamic meshes on the fly (requires <300 vertices).
		- **GPU Instancing**: The GPU draws many instances of the same mesh using different parameters (using MaterialPropertyBlocks).
		- **SRP Batcher**: Keeps materials cached in GPU memory and uploads only transform properties. Works out of the box in URP/HDRP when using compatible shaders.
		- **Sprite Atlasing**: Combines multiple sprite textures into a single texture asset, preventing multiple draw calls in 2D UI.
	-
	- ## Texture Compression
	  collapsed:: true
		- Choose the correct compression format depending on the target platform:
		- | Format | Target Platform | Description |
		  | :--- | :--- | :--- |
		  | **ASTC** | Mobile (iOS/Android) | Modern block-based compression. Variable block sizing. High quality. |
		  | **ETC2** | Older Android | Fallback format. Requires square dimensions. |
		  | **BC7 / DXT5** | PC / Console | High-fidelity compression for modern desktop hardware. |
	-
	- ## Memory Management & Addressables
	  collapsed:: true
		- **Resources Folder (Avoid)**: Assets inside the `Resources` folder are loaded into memory on startup and increase build sizes.
		- **Addressable Asset System**: Loads assets asynchronously and manages their reference counts.
		- ```csharp
		  using UnityEngine;
		  using UnityEngine.AddressableAssets;
		  using UnityEngine.ResourceManagement.AsyncOperations;
		  
		  public class AddressablesLoader : MonoBehaviour
		  {
		      [SerializeField] AssetReference prefabRef;
		      GameObject spawnedObject;
		  
		      void Start()
		      {
		          // Load async
		          prefabRef.InstantiateAsync().Completed += OnSpawnCompleted;
		      }
		  
		      void OnSpawnCompleted(AsyncOperationHandle<GameObject> handle)
		      {
		          if (handle.Status == AsyncOperationStatus.Succeeded)
		          {
		              spawnedObject = handle.Result;
		          }
		      }
		  
		      void OnDestroy()
		      {
		          // Release memory
		          if (spawnedObject != null)
		          {
		              prefabRef.ReleaseInstance(spawnedObject);
		          }
		      }
		  }
		  ```
- # Data-Oriented Technology Stack (DOTS)
  collapsed:: true
	- Unity's high-performance stack combining the C# Job System, the Burst Compiler, and ECS.
	-
	- ## C# Job System
	  collapsed:: true
		- **Purpose**: Safely write multithreaded code. Prevents race conditions by using native memory containers and dependency handles.
		- ```mermaid
		  graph TD
		      Main[Main Thread] -->|1. Allocates NativeArray| NativeMemory[Native Heap Memory]
		      Main -->|2. Schedules Job| JobQueue[C# Job System Queue]
		      JobQueue -->|3. Distributes tasks| W1[Worker Thread 1: Burst Compiled]
		      JobQueue -->|3. Distributes tasks| W2[Worker Thread 2: Burst Compiled]
		      JobQueue -->|3. Distributes tasks| W3[Worker Thread 3: Burst Compiled]
		      W1 -->|4. Read/Write| NativeMemory
		      W2 -->|4. Read/Write| NativeMemory
		      W3 -->|4. Read/Write| NativeMemory
		      Main -->|5. Wait for Complete| JobQueue
		      Main -->|6. Safely reads output & disposes| NativeMemory
		  ```
		- **Job Example**:
		  ```csharp
		  using Unity.Collections;
		  using Unity.Jobs;
		  using UnityEngine;
		  
		  public struct CalculateDistanceJob : IJobParallelFor
		  {
		      // NativeArray represents unmanaged memory
		      [ReadOnly] public NativeArray<Vector3> startPositions;
		      [ReadOnly] public NativeArray<Vector3> endPositions;
		      public NativeArray<float> outputDistances;
		  
		      public void Execute(int index)
		      {
		          outputDistances[index] = Vector3.Distance(startPositions[index], endPositions[index]);
		      }
		  }
		  ```
	-
	- ## Burst Compiler
	  collapsed:: true
		- **What**: An LLVM-based compiler that converts C# IL code into highly optimized machine code.
		- **Usage**: Requires math calculations using unmanaged structures. Place `[BurstCompile]` above the Job structure.
		- **Job Scheduling**:
		  ```csharp
		  using Unity.Collections;
		  using Unity.Jobs;
		  using Unity.Burst;
		  using UnityEngine;
		  
		  public class JobRunner : MonoBehaviour
		  {
		      void Update()
		      {
		          int dataSize = 1000;
		          // Allocate unmanaged arrays
		          NativeArray<Vector3> starts = new NativeArray<Vector3>(dataSize, Allocator.TempJob);
		          NativeArray<Vector3> ends = new NativeArray<Vector3>(dataSize, Allocator.TempJob);
		          NativeArray<float> distances = new NativeArray<float>(dataSize, Allocator.TempJob);
		  
		          var job = new CalculateDistanceJob
		          {
		              startPositions = starts,
		              endPositions = ends,
		              outputDistances = distances
		          };
		  
		          // Schedule job across worker threads (inner loop batch count: 64)
		          JobHandle handle = job.Schedule(dataSize, 64);
		          
		          // Block main thread until calculations are done
		          handle.Complete();
		  
		          // Dispose native memory to prevent memory leaks
		          starts.Dispose();
		          ends.Dispose();
		          distances.Dispose();
		      }
		  }
		  ```
	-
	- ## Entity Component System (ECS) Overview
	  collapsed:: true
		- **Entities**: Identifiers (indices) replacing standard GameObjects.
		- **Components**: Structs holding pure data (`IComponentData`) without any behavior.
		- **Systems**: Classes managing the data transform logic (`ISystem` or `SystemBase`). Executes over groups of entities matching component queries.
		- ```mermaid
		  graph TD
		      subgraph Entity Manager
		          E1[Entity 1]
		          E2[Entity 2]
		          E3[Entity 3]
		      end
		      subgraph Component Data Arrays
		          C_Pos[Position Component Data Array]
		          C_Vel[Velocity Component Data Array]
		          C_Health[Health Component Data Array]
		      end
		      subgraph Systems
		          MovementSystem[Movement System]
		          DamageSystem[Damage System]
		      end
		      E1 --> C_Pos
		      E1 --> C_Vel
		      E2 --> C_Pos
		      E2 --> C_Health
		      E3 --> C_Pos
		      E3 --> C_Vel
		      E3 --> C_Health
		      
		      MovementSystem -->|Iterates over Position + Velocity| C_Pos
		      MovementSystem -->|Iterates over Position + Velocity| C_Vel
		      DamageSystem -->|Iterates over Health| C_Health
		  ```
- # Netcode for GameObjects (NGO)
  collapsed:: true
	- Unity's official high-level networking framework for multiplayer games. Used to implement the social/multiplayer mechanics defined in [[Game Design#Game Mechanics Design]].
	- ```mermaid
	  graph TD
	      subgraph Client 1 (Owner)
	          C1_Input[Input / Movement]
	      end
	      subgraph Server (Authority)
	          S_State[Validate & Calculate State]
	          NetVar[Synced NetworkVariable]
	      end
	      subgraph Client 2 (Proxy)
	          C2_Visual[Visual Position / State]
	      end
	      
	      C1_Input -->|1. ServerRpc Request| S_State
	      S_State -->|2. Updates| NetVar
	      NetVar -->|3. Auto-Replicated Sync| C2_Visual
	      S_State -->|4. ClientRpc Broadcast| C2_Visual
	  ```
	-
	- ## NetworkManager Setup
	  collapsed:: true
		- The root controller in the scene. Holds references to the transport layer (e.g. Unity Transport) and registered Network Prefabs.
		- ```csharp
		  // Quick Host/Server startup script
		  public class ConnectUI : MonoBehaviour
		  {
		      void OnGUI()
		      {
		          GUILayout.BeginArea(new Rect(10, 10, 300, 300));
		          if (!Unity.Netcode.NetworkManager.Singleton.IsClient && !Unity.Netcode.NetworkManager.Singleton.IsServer)
		          {
		              if (GUILayout.Button("Host (Server + Client)")) NetworkManager.Singleton.StartHost();
		              if (GUILayout.Button("Server Only")) NetworkManager.Singleton.StartServer();
		              if (GUILayout.Button("Client Join")) NetworkManager.Singleton.StartClient();
		          }
		          GUILayout.EndArea();
		      }
		  }
		  ```
	-
	- ## NetworkVariable & Syncing
	  collapsed:: true
		- Syncs state dynamically across connected clients.
		- ```csharp
		  using Unity.Netcode;
		  using UnityEngine;
		  
		  public class PlayerSync : NetworkBehaviour
		  {
		      // Sync variable with Owner write rights
		      public NetworkVariable<Vector3> NetPosition = new NetworkVariable<Vector3>(
		          writePerm: NetworkVariableWritePermission.Owner
		      );
		  
		      void Update()
		      {
		          if (IsOwner)
		          {
		              NetPosition.Value = transform.position;
		          }
		          else
		          {
		              transform.position = NetPosition.Value;
		          }
		      }
		  }
		  ```
	-
	- ## Remote Procedure Calls (RPCs)
	  collapsed:: true
		- Execute methods across client-server boundaries.
		- **ServerRpc**: Sent by clients, executed on the server.
		- **ClientRpc**: Sent by the server, executed on all clients.
		- ```csharp
		  using Unity.Netcode;
		  using UnityEngine;
		  
		  public class CombatNetwork : NetworkBehaviour
		  {
		      // Client requests damage calculation on the server
		      [ServerRpc]
		      public void TakeDamageServerRpc(int amount)
		      {
		          int remainingHealth = 100 - amount;
		          UpdateHealthUIClientRpc(remainingHealth);
		      }
		  
		      // Server notifies all clients to update health interface
		      [ClientRpc]
		      public void UpdateHealthUIClientRpc(int currentHealth)
		      {
		          Debug.Log($"Update client UI. Health: {currentHealth}");
		      }
		  }
		  ```
	-
	- ## Spawning Prefabs
	  collapsed:: true
		- Spawning objects on the server instantiates them on all clients.
		- ```csharp
		  public class Spawner : NetworkBehaviour
		  {
		      [SerializeField] GameObject prefabToNetworkSpawn;
		  
		      [ServerRpc]
		      public void SpawnObjectServerRpc(Vector3 pos)
		      {
		          GameObject instance = Instantiate(prefabToNetworkSpawn, pos, Quaternion.identity);
		          // Register spawned entity across the network
		          instance.GetComponent<NetworkObject>().Spawn();
		      }
		  }
		  ```
- # Library & Frameworks
  collapsed:: true
	- ## Core Unity Packages
	  collapsed:: true
		- [[Universal Render Pipeline (URP)]] — Scalable, high-performance rendering from mobile devices to high-end PCs.
		- [[High Definition Render Pipeline (HDRP)]] — AAA-grade rendering, volumetric lighting, and physical cameras for PC and console.
		- [[Input System]] — Modern, event-based system supporting customized binding mappings and hot-swappable hardware.
		- [[Cinemachine]] — Procedural camera system supporting tracking, camera blending, smart damping, and screen composition.
		- [[TextMeshPro]] — High-fidelity text mesh layout system based on Signed Distance Field (SDF) textures.
		- [[Unity UI (uGUI)]] — Standard Canvas-based user interface components.
		- [[Addressables]] — Dynamic async asset grouping, loading, memory releasing, and content deployment workflows.
		- [[Unity Netcode for GameObjects]] — Official high-level engine networking system for multiplayer synchronization.
	-
	- ## Popular Third-Party Assets
	  collapsed:: true
		- [[DOTween]] — Fast, allocation-free tweening engine for smooth UI and object animations.
		- [[Odin Inspector]] — Advanced scripting library to create rich layouts and custom inspector grids.
		- [[Photon PUN 2]] — Cloud-hosted real-time multiplayer networking framework.
		- [[Mirror Networking]] — High-performance open-source TCP/UDP server/client architecture.
		- [[Newtonsoft.Json for Unity]] — Full-featured JSON serialization library configured for platform compliance.
		- [[UniTask]] — Struct-based zero-allocation task integrations for C# async/await workflows.
		- [[NaughtyAttributes]] — Inspector decoration helpers without creating custom editors.
- # More Learn
	- [Unity Manual](https://docs.unity3d.com/Manual/index.html)
	- [Unity Scripting API](https://docs.unity3d.com/ScriptReference/)
	- [Unity Learn (Official Tutorials)](https://learn.unity.com/)
	- [Unity Asset Store](https://assetstore.unity.com/)
	- [Unity Forum](https://forum.unity.com/)
	- [Game Dev Beginner (Unity Tutorials)](https://gamedevbeginner.com/)
	- [Brackeys YouTube (archived)](https://www.youtube.com/@Brackeys)
	- [Unity GitHub](https://github.com/Unity-Technologies)
	- [Awesome Unity](https://github.com/RyanNielson/awesome-unity)
	- [[Game Design]] — Theoretical frameworks, player psychology, MDA, core loops, game feel and balance
	- [[Game Systems]] — Engine-agnostic inventory, quest, save/load & procedural gen patterns
	- [[Advanced Graphics]] — SRP, URP, HDRP low-level rendering connection to graphics APIs
	- [[CSharp for Unity]] — Unity-specific scripting patterns and practices in depth
	- [[CSharp]] — Complete C# programming language fundamentals, generics, and structures
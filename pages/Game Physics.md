---
seoTitle: Game Physics – Complete Guide from Rigid Bodies to Soft Bodies & Fluid Simulation
description: "Comprehensive game physics reference covering rigid body dynamics, collision detection (AABB, OBB, SAT, GJK), physics engines, constraints, joints, raycasting, soft bodies, cloth, fluid simulation, and game-specific physics tricks."
keywords: "game physics, rigid body dynamics, collision detection, AABB, OBB, SAT, GJK, EPA, physics engine, Box2D, Bullet, PhysX, Havok, raycasting, soft body physics, cloth simulation, fluid simulation, verlet integration, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Game Physics – Dynamics, Collision & Simulation
treeTitle: Game Development - Game Physics
enableToc: true
---

> [!info] About This Page
> Game physics covers the simulation of physical systems to create believable interactions.
> For engine implementation see [[Unity]], [[Unreal Engine]], [[Godot]]. For game design implications see [[Game Design]] #Game Feel.

- # Physics Fundamentals
  collapsed:: true
	- ## Newton's Laws in Games
		- | Law | Statement | Game Application |
		  |-----|-----------|-----------------|
		  | 1st — Inertia | Object stays at rest or in motion unless acted upon | Objects don't stop unless friction/force applied |
		  | 2nd — F = ma | Force = mass × acceleration | Heavier objects need more force to move |
		  | 3rd — Action-Reaction | Every action has equal opposite reaction | Explosions push shooter backward |
		-
	- ## Key Quantities
		- | Quantity | Symbol | Unit | Description |
		  |----------|--------|------|-------------|
		  | Position | x | m | Location in space |
		  | Velocity | v | m/s | Rate of position change |
		  | Acceleration | a | m/s² | Rate of velocity change |
		  | Force | F | N (kg·m/s²) | Cause of acceleration |
		  | Mass | m | kg | Resistance to acceleration |
		  | Momentum | p = mv | kg·m/s | Mass × velocity |
		  | Impulse | J = F·Δt | N·s | Instantaneous force |
		  | Torque | τ = r×F | N·m | Rotational force |
		  | Angular velocity | ω | rad/s | Rate of rotation |
		  | Moment of inertia | I | kg·m² | Rotational mass |
		-
	- ## Integration Methods
		- ```mermaid
		  graph TD
		      Euler[\"Euler (explicit)\\npos += vel * dt\\nvel += acc * dt\\nFast but unstable\"]
		      SemiEuler[\"Semi-implicit Euler\\nvel += acc * dt\\npos += vel * dt\\nStable enough for games\"]
		      Verlet[\"Verlet\\npos_new = 2*pos - pos_old + acc * dt²\\nGreat for constraints\"]
		      RK4[\"Runge-Kutta 4\\n4 evaluations per step\\nMost accurate\"]
		  ```
		- ```python title="Integration methods comparison"
		  # Euler (explicit) — simple but can explode
		  def euler(pos, vel, acc, dt):
		      pos_new = pos + vel * dt
		      vel_new = vel + acc * dt
		      return pos_new, vel_new
		  
		  # Semi-implicit Euler — velocity updated first
		  # MOST COMMON in games — stable for most scenarios
		  def semi_euler(pos, vel, acc, dt):
		      vel_new = vel + acc * dt        # update velocity first
		      pos_new = pos + vel_new * dt    # use new velocity
		      return pos_new, vel_new
		  
		  # Verlet — great for constraints and particles
		  def verlet(pos, pos_old, acc, dt):
		      pos_new = 2 * pos - pos_old + acc * dt * dt
		      vel = (pos_new - pos_old) / (2 * dt)
		      return pos_new, vel
		  
		  # RK4 — most accurate, expensive
		  def rk4(pos, vel, acc_func, dt):
		      k1v = acc_func(pos, vel)
		      k1p = vel
		      
		      k2v = acc_func(pos + k1p*dt/2, vel + k1v*dt/2)
		      k2p = vel + k1v*dt/2
		      
		      k3v = acc_func(pos + k2p*dt/2, vel + k2v*dt/2)
		      k3p = vel + k2v*dt/2
		      
		      k4v = acc_func(pos + k3p*dt, vel + k3v*dt)
		      k4p = vel + k3v*dt
		      
		      vel_new = vel + (k1v + 2*k2v + 2*k3v + k4v) * dt / 6
		      pos_new = pos + (k1p + 2*k2p + 2*k3p + k4p) * dt / 6
		      return pos_new, vel_new
		  ```
- # Rigid Body Dynamics
  collapsed:: true
	- ## Rigid Body State
		- ```csharp title="Rigid body data structure"
		  public class RigidBody
		  {
		      // Linear state
		      public Vector3 position;
		      public Vector3 velocity;
		      public Vector3 force;          // accumulated force this frame
		      public float   mass;
		      public float   inverseMass;    // 1/mass — 0 for static objects
		      
		      // Angular state
		      public Quaternion orientation;
		      public Vector3    angularVelocity;
		      public Vector3    torque;
		      public Matrix3x3  inertiaTensor;
		      public Matrix3x3  inverseInertiaTensor;
		      
		      // Material properties
		      public float restitution;   // bounciness (0=no bounce, 1=perfect bounce)
		      public float friction;      // surface friction coefficient
		      
		      // Integrate physics for one timestep
		      public void Integrate(float dt)
		      {
		          if (inverseMass == 0) return;  // static object
		          
		          // Linear
		          Vector3 acceleration = force * inverseMass;
		          velocity    += acceleration * dt;
		          position    += velocity * dt;
		          
		          // Angular
		          Vector3 angularAcceleration = inverseInertiaTensor * torque;
		          angularVelocity  += angularAcceleration * dt;
		          orientation      *= Quaternion.Euler(angularVelocity * dt * Mathf.Rad2Deg);
		          
		          // Clear accumulated forces
		          force  = Vector3.zero;
		          torque = Vector3.zero;
		      }
		      
		      public void AddForce(Vector3 f) => force += f;
		      
		      public void AddForceAtPoint(Vector3 f, Vector3 point)
		      {
		          force  += f;
		          torque += Vector3.Cross(point - position, f);
		      }
		  }
		  ```
	-
	- ## Inertia Tensors for Common Shapes
		- | Shape | Ixx | Iyy | Izz |
		  |-------|-----|-----|-----|
		  | Solid sphere | 2/5 mr² | 2/5 mr² | 2/5 mr² |
		  | Hollow sphere | 2/3 mr² | 2/3 mr² | 2/3 mr² |
		  | Solid cylinder (y-axis) | 1/12 m(3r²+h²) | 1/2 mr² | 1/12 m(3r²+h²) |
		  | Box (a,b,c) | 1/12 m(b²+c²) | 1/12 m(a²+c²) | 1/12 m(a²+b²) |
- # Collision Detection
  collapsed:: true
	- ## Broad Phase — Rough Elimination
		- ```mermaid
		  graph TD
		      All[\"All objects\"]
		      Broad[\"Broad Phase — eliminate obvious non-collisions\"]
		      Narrow[\"Narrow Phase — precise test on candidates\"]
		      Manifold[\"Generate Contact Manifold\"]
		      Resolve[\"Resolve Collision\"]
		      All --> Broad --> Narrow --> Manifold --> Resolve
		  ```
		-
		- | Broad Phase Method | Description | Best For |
		  |-------------------|-------------|---------|
		  | AABB Sweep & Prune | Sort intervals on each axis | Dense scenes |
		  | Spatial Hash | Hash 3D grid cells | Large dynamic scenes |
		  | Octree / BVH | Hierarchical bounding volumes | Static geometry |
		  | Grid partitioning | Divide world into cells | Uniform density |
		-
	- ## AABB — Axis-Aligned Bounding Box
		- Fastest collision test — just compare min/max coordinates.
		- ```csharp title="AABB collision"
		  public struct AABB
		  {
		      public Vector3 min, max;
		      
		      public bool Overlaps(AABB other) =>
		          min.x <= other.max.x && max.x >= other.min.x &&
		          min.y <= other.max.y && max.y >= other.min.y &&
		          min.z <= other.max.z && max.z >= other.min.z;
		      
		      public Vector3 Center => (min + max) * 0.5f;
		      public Vector3 Extents => (max - min) * 0.5f;
		      
		      // Expand AABB to contain a point
		      public void Encapsulate(Vector3 point)
		      {
		          min = Vector3.Min(min, point);
		          max = Vector3.Max(max, point);
		      }
		  }
		  ```
	-
	- ## SAT — Separating Axis Theorem
		- > [!tip] Convex Shape Collision
		  > SAT works for ANY two **convex** shapes. If you can find a separating axis (where projections don't overlap) → no collision.
		- ```csharp title="SAT — 2D polygon collision"
		  public static bool SATCollision(Vector2[] polyA, Vector2[] polyB, out Vector2 mtv)
		  {
		      mtv = Vector2.zero;
		      float minOverlap = float.MaxValue;
		      Vector2 smallestAxis = Vector2.zero;
		      
		      // Test all edges of A and B as potential separating axes
		      var axes = GetAxes(polyA).Concat(GetAxes(polyB));
		      
		      foreach (var axis in axes)
		      {
		          var (minA, maxA) = Project(polyA, axis);
		          var (minB, maxB) = Project(polyB, axis);
		          
		          float overlap = Mathf.Min(maxA, maxB) - Mathf.Max(minA, minB);
		          
		          if (overlap < 0) return false;  // Separating axis found — no collision
		          
		          if (overlap < minOverlap)
		          {
		              minOverlap  = overlap;
		              smallestAxis = axis;
		          }
		      }
		      
		      // Minimum translation vector to resolve collision
		      mtv = smallestAxis * minOverlap;
		      return true;
		  }
		  
		  private static IEnumerable<Vector2> GetAxes(Vector2[] poly)
		  {
		      for (int i = 0; i < poly.Length; i++)
		      {
		          var edge = poly[(i+1) % poly.Length] - poly[i];
		          yield return new Vector2(-edge.y, edge.x).normalized;  // perpendicular
		      }
		  }
		  
		  private static (float min, float max) Project(Vector2[] poly, Vector2 axis)
		  {
		      float min = float.MaxValue, max = float.MinValue;
		      foreach (var v in poly)
		      {
		          float d = Vector2.Dot(v, axis);
		          min = Mathf.Min(min, d);
		          max = Mathf.Max(max, d);
		      }
		      return (min, max);
		  }
		  ```
	-
	- ## GJK Algorithm (3D Convex Shapes)
		- GJK (Gilbert–Johnson–Keerthi) determines if two convex shapes intersect using Minkowski difference + simplex.
		- ```mermaid
		  graph TD
		      Pick[\"Pick arbitrary direction d\"]
		      Support[\"Find support point = furthest in direction d\\nin Minkowski difference A⊖B\"]
		      Simplex[\"Add to simplex (point/line/triangle/tetrahedron)\"]
		      Origin[\"Does simplex contain the origin?\"]
		      Collision[\"YES → COLLISION!\"]
		      New[\"Update d toward origin\\nContinue\"]
		      No[\"Direction away from origin found\\nNO COLLISION\"]
		      Pick --> Support --> Simplex --> Origin
		      Origin --> |Yes| Collision
		      Origin --> |No| New --> Support
		      Origin --> |Diverged| No
		  ```
		- > [!tip] GJK + EPA
		  > GJK detects collision. **EPA (Expanding Polytope Algorithm)** computes the penetration depth and MTV (minimum translation vector) for resolution.
	-
	- ## Raycasting
		- ```csharp title="Ray-AABB intersection — slab method"
		  public static bool RayAABB(Vector3 origin, Vector3 direction, AABB box, out float t)
		  {
		      Vector3 invDir = new Vector3(1f/direction.x, 1f/direction.y, 1f/direction.z);
		      
		      float tx1 = (box.min.x - origin.x) * invDir.x;
		      float tx2 = (box.max.x - origin.x) * invDir.x;
		      float ty1 = (box.min.y - origin.y) * invDir.y;
		      float ty2 = (box.max.y - origin.y) * invDir.y;
		      float tz1 = (box.min.z - origin.z) * invDir.z;
		      float tz2 = (box.max.z - origin.z) * invDir.z;
		      
		      float tmin = Mathf.Max(Mathf.Max(Mathf.Min(tx1,tx2), Mathf.Min(ty1,ty2)), Mathf.Min(tz1,tz2));
		      float tmax = Mathf.Min(Mathf.Min(Mathf.Max(tx1,tx2), Mathf.Max(ty1,ty2)), Mathf.Max(tz1,tz2));
		      
		      t = tmin;
		      return tmax >= 0 && tmin <= tmax;
		  }
		  
		  // Ray-Sphere intersection
		  public static bool RaySphere(Vector3 origin, Vector3 direction, 
		                                Vector3 center, float radius, out float t)
		  {
		      Vector3 oc = origin - center;
		      float a = Vector3.Dot(direction, direction);
		      float b = 2f * Vector3.Dot(oc, direction);
		      float c = Vector3.Dot(oc, oc) - radius * radius;
		      float disc = b*b - 4*a*c;
		      
		      if (disc < 0) { t = 0; return false; }
		      t = (-b - Mathf.Sqrt(disc)) / (2f * a);
		      return t >= 0;
		  }
		  ```
- # Collision Resolution
  collapsed:: true
	- ## Impulse-Based Resolution
		- ```csharp title="Impulse-based collision response"
		  public static void ResolveCollision(RigidBody a, RigidBody b,
		                                       Vector3 normal, Vector3 contactPoint)
		  {
		      // Relative velocity at contact point
		      Vector3 rA = contactPoint - a.position;
		      Vector3 rB = contactPoint - b.position;
		      
		      Vector3 velA = a.velocity + Vector3.Cross(a.angularVelocity, rA);
		      Vector3 velB = b.velocity + Vector3.Cross(b.angularVelocity, rB);
		      Vector3 relativeVel = velA - velB;
		      
		      float velAlongNormal = Vector3.Dot(relativeVel, normal);
		      if (velAlongNormal > 0) return;  // Already separating
		      
		      float e = Mathf.Min(a.restitution, b.restitution);  // Coefficient of restitution
		      
		      // Impulse scalar
		      float j = -(1 + e) * velAlongNormal;
		      j /= a.inverseMass + b.inverseMass
		           + Vector3.Dot(Vector3.Cross(a.inverseInertiaTensor * Vector3.Cross(rA, normal), rA), normal)
		           + Vector3.Dot(Vector3.Cross(b.inverseInertiaTensor * Vector3.Cross(rB, normal), rB), normal);
		      
		      Vector3 impulse = j * normal;
		      
		      // Apply impulse
		      a.velocity        += a.inverseMass  * impulse;
		      b.velocity        -= b.inverseMass  * impulse;
		      a.angularVelocity += a.inverseInertiaTensor * Vector3.Cross(rA,  impulse);
		      b.angularVelocity -= b.inverseInertiaTensor * Vector3.Cross(rB,  impulse);
		      
		      // Friction impulse
		      Vector3 tangent = (relativeVel - Vector3.Dot(relativeVel, normal) * normal).normalized;
		      float jt = -Vector3.Dot(relativeVel, tangent) / (a.inverseMass + b.inverseMass);
		      
		      float mu = Mathf.Sqrt(a.friction * b.friction);
		      Vector3 frictionImpulse = Mathf.Abs(jt) < j * mu 
		          ? jt * tangent                  // static friction
		          : -j * mu * tangent;            // kinetic friction (Coulomb's law)
		      
		      a.velocity        += a.inverseMass * frictionImpulse;
		      b.velocity        -= b.inverseMass * frictionImpulse;
		  }
		  ```
- # Constraints & Joints
  collapsed:: true
	- ## Constraint Types
		- | Constraint | DoF Removed | Example |
		  |-----------|------------|---------|
		  | Fixed joint | 6 (all) | Welded parts |
		  | Hinge/revolute | 5 | Door, wheel axle |
		  | Slider/prismatic | 5 | Piston, elevator |
		  | Ball-and-socket | 3 | Shoulder, hip |
		  | Spring-damper | 0 (soft) | Suspension, ragdoll |
		  | Distance constraint | 1 | Rope, chain |
		-
	- ## Position-Based Dynamics (PBD)
		- PBD is used by most game engines (Havok, PhysX 5) for **constraint solving** — fast, stable, great for cloth and ropes.
		- ```python title="PBD constraint solver"
		  def solve_distance_constraint(pos_a, pos_b, mass_a, mass_b, rest_length, stiffness):
		      delta = pos_b - pos_a
		      dist = np.linalg.norm(delta)
		      
		      if dist == 0: return pos_a, pos_b  # Avoid divide by zero
		      
		      w1, w2 = 1/mass_a, 1/mass_b
		      lambda_ = (dist - rest_length) / (w1 + w2) * stiffness
		      correction = lambda_ * delta / dist
		      
		      pos_a += w1 * correction
		      pos_b -= w2 * correction
		      return pos_a, pos_b
		  ```
- # Soft Body Physics
  collapsed:: true
	- ## Mass-Spring System
		- ```mermaid
		  graph LR
		      M1[\"Mass 1\"] --- S1[\"Spring 1\"] --- M2[\"Mass 2\"]
		      M2 --- S2[\"Spring 2\"] --- M3[\"Mass 3\"]
		      M1 --- S3[\"Shear Spring\"] --- M3
		  ```
		- Used for **cloth, jelly, hair, ropes**. Each node is a mass, connections are springs with rest length.
		- ```csharp title="Mass-spring cloth simulation"
		  public class ClothSimulator : MonoBehaviour
		  {
		      [Header("Grid")]
		      public int   rows = 10, cols = 10;
		      public float spacing = 0.1f;
		      
		      [Header("Physics")]
		      public float mass       = 0.1f;
		      public float stiffness  = 1000f;
		      public float damping    = 0.98f;
		      public float gravity    = -9.81f;
		      
		      private Vector3[] positions, velocities, forces;
		      private List<(int, int, float)> springs = new();  // (a, b, restLength)
		      
		      private void Start()
		      {
		          int n = rows * cols;
		          positions  = new Vector3[n];
		          velocities = new Vector3[n];
		          forces     = new Vector3[n];
		          
		          // Initialize grid positions
		          for (int r = 0; r < rows; r++)
		          for (int c = 0; c < cols; c++)
		          {
		              int i = r * cols + c;
		              positions[i] = new Vector3(c * spacing, 0, r * spacing);
		          }
		          
		          // Add structural springs (horizontal + vertical)
		          for (int r = 0; r < rows; r++)
		          for (int c = 0; c < cols; c++)
		          {
		              int i = r * cols + c;
		              if (c + 1 < cols) springs.Add((i, i+1, spacing));
		              if (r + 1 < rows) springs.Add((i, i+cols, spacing));
		              // Shear springs (diagonal)
		              if (c + 1 < cols && r + 1 < rows)
		              {
		                  springs.Add((i, i+cols+1, spacing * Mathf.Sqrt(2)));
		                  springs.Add((i+1, i+cols, spacing * Mathf.Sqrt(2)));
		              }
		          }
		      }
		      
		      private void FixedUpdate()
		      {
		          // Reset forces + apply gravity
		          for (int i = 0; i < positions.Length; i++)
		              forces[i] = new Vector3(0, gravity * mass, 0);
		          
		          // Spring forces
		          foreach (var (a, b, rest) in springs)
		          {
		              Vector3 delta = positions[b] - positions[a];
		              float   dist  = delta.magnitude;
		              float   f     = stiffness * (dist - rest);
		              Vector3 dir   = delta / dist;
		              
		              forces[a] += f * dir;
		              forces[b] -= f * dir;
		          }
		          
		          // Integrate
		          float dt = Time.fixedDeltaTime;
		          for (int i = 0; i < positions.Length; i++)
		          {
		              if (IsFixed(i)) continue;  // Pinned corners
		              velocities[i] = (velocities[i] + forces[i] / mass * dt) * damping;
		              positions[i] += velocities[i] * dt;
		          }
		      }
		      
		      private bool IsFixed(int i) => i == 0 || i == cols - 1;  // Pin top corners
		  }
		  ```
- # Physics Engines Reference
  collapsed:: true
	- ## Engine Comparison
		- | Engine | License | Language | Used In |
		  |--------|---------|---------|---------|
		  | **PhysX 5** | BSD/Proprietary | C++ | Unity, Unreal Engine |
		  | **Havok Physics** | Proprietary | C++ | Halo, The Witcher, Skyrim |
		  | **Bullet Physics** | zlib/Free | C++ | Blender, many indie games |
		  | **Box2D** | MIT | C/C++ | Angry Birds, many 2D games |
		  | **Jolt Physics** | MIT | C++ | Horizon Zero Dawn remaster |
		  | **Godot Physics** | MIT | C++ | Godot engine built-in |
		  | **Chipmunk2D** | MIT | C | Many 2D mobile games |
		  | **ReactPhysics3D** | zlib | C++ | Custom engines |
		-
	- ## Game Physics Tricks
		- | Trick | How | Why |
		  |-------|-----|-----|
		  | Coyote time | Allow jump 150ms after walking off ledge | Feels fair |
		  | Jump buffering | Buffer jump input 200ms before landing | Feels responsive |
		  | Variable jump height | Stop upward vel when key released | Player control |
		  | Gravity scaling | Higher gravity for faster fall | Snappy movement |
		  | Terminal velocity cap | Max fall speed | Prevents phasing through floor |
		  | Sticky floors | Downward force on slopes | Prevents sliding |
		  | Phys layers | Objects ignore certain layers | Performance + design |
		  | Discrete → CCD | Sweep for fast objects | Prevents tunneling |
- # More Learn
	- ## Resources
		- [Real-Time Collision Detection — Christer Ericson](https://realtimecollisiondetection.net/) — The bible.
		- [Game Physics — David Eberly](https://www.geometrictools.com/Books/Books.html)
		- [Physics for Game Programmers — Grant Palmer](https://link.springer.com/book/10.1007/978-1-59059-472-1)
		- [Two-Bit Coding — Physics Tutorials](https://www.youtube.com/@TwoBitCoding) — YouTube physics implementation series.
		- [[Game Development]] — Engine physics loop, FixedUpdate
		- [[Game Design]] — Physics in game design context
		- [[Advanced Graphics]] — Physics-based rendering
---
seoTitle: Mobile Game Development – Complete iOS & Android Guide
description: "Comprehensive mobile game development reference covering touch controls, mobile optimization, iOS and Android platform features, monetization, publishing, and performance profiling."
keywords: "mobile game development, iOS game development, Android game development, touch controls, mobile optimization, mobile monetization, Unity mobile, Godot mobile, game publishing, app store, google play, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Mobile Game Development
---

> [!info] About This Page
> This page covers **mobile game development** — touch input, platform-specific features, optimization, monetization, and publishing for iOS and Android.
> For engine setup see [[Godot]], [[Unity]], [[Unreal Engine]].
> For game design patterns see [[Game Design]]. For audio see [[Game Audio]].

- # History
  collapsed:: true
	- **How**: Mobile gaming began with Snake on Nokia phones (1997), exploded with the App Store launch (2008), and became the world's largest gaming market by revenue by 2016.
	- **Who**: Key players — Apple (iOS/App Store), Google (Android/Play Store), Unity Technologies (dominant mobile engine), and studios like Supercell, King, Niantic, and miHoYo.
	- **Why**: 3.6 billion mobile gamers worldwide (2024). Mobile is the most accessible gaming platform — no console required, always in pocket.
	-
	- ## Mobile Gaming Timeline
	  collapsed:: true
		- ```mermaid
		  timeline
		      title Mobile Gaming Evolution
		      1997 : Snake on Nokia
		           : First mainstream mobile game
		      2003 : Java ME Games
		           : Basic 2D games on feature phones
		      2008 : App Store Launch
		           : iPhone changes everything
		           : Touch-first design begins
		      2010 : Angry Birds Era
		           : Casual gaming explosion
		           : Free-to-play model emerges
		      2013 : Clash of Clans
		           : Gacha and live service dominance
		           : Mobile surpasses console revenue
		      2016 : Pokemon GO
		           : AR gaming goes mainstream
		      2019 : Call of Duty Mobile
		           : AAA quality on mobile
		           : 120Hz displays arrive
		      2023 : Genshin Impact Era
		           : Console-quality mobile games
		           : Cross-platform standard
		  ```
-
- # Introduction
	- Mobile game development requires a fundamentally different mindset from PC/console development.
	- Constraints are severe — limited CPU, GPU, RAM, battery, and storage. Touch input replaces keyboard/mouse/controller.
	- But the audience is massive and the distribution is global and instant.
	-
	- ## Mobile vs PC/Console
	  collapsed:: true
		- | Aspect | Mobile | PC / Console |
		  |--------|--------|-------------|
		  | Input | Touch, gyroscope, accelerometer | Keyboard, mouse, controller |
		  | Session length | 2–10 minutes (casual) | 30–120 minutes |
		  | CPU | 4–8 cores, low clock speed | 8–16 cores, high clock speed |
		  | GPU | Tile-based (PowerVR, Mali, Adreno) | Immediate mode (NVIDIA, AMD) |
		  | RAM | 2–8 GB (shared with OS) | 16–64 GB |
		  | Storage | 64–512 GB (shared) | 500 GB–4 TB |
		  | Battery | Critical constraint | Not a concern |
		  | Distribution | App Store / Play Store | Steam, Epic, direct |
		  | Monetization | F2P dominant | Premium dominant |
		  | Screen size | 4–7 inches | 24–55 inches |
	-
	- ## Mobile Game Knowledge Map
	  collapsed:: true
		- ```mermaid
		  mindmap
		    root((Mobile Game Dev))
		      Input
		        Touch Controls
		        Gestures
		        Gyroscope
		        Accelerometer
		      Platform
		        iOS Specifics
		        Android Specifics
		        Cross-Platform
		      Optimization
		        CPU Performance
		        GPU Performance
		        Memory Management
		        Battery Life
		      Monetization
		        Free-to-Play
		        In-App Purchases
		        Ads
		        Battle Pass
		      Publishing
		        App Store
		        Google Play
		        Certification
		        ASO
		  ```
-
- # Touch Controls
	- > [!info] Touch-First Design
	  > Mobile games must be designed **touch-first** — not ported from keyboard/mouse.
	  > Every interaction must work with a finger on a small screen, often one-handed.
	-
	- ## Touch Input Types
	  collapsed:: true
		- | Input Type | Description | Game Use Case |
		  |-----------|-------------|--------------|
		  | Tap | Single finger touch and release | Jump, shoot, select |
		  | Double tap | Two taps quickly | Special action, zoom |
		  | Long press | Hold finger down | Charge attack, context menu |
		  | Swipe | Drag in a direction | Slice, scroll, dodge |
		  | Pinch | Two fingers moving together | Zoom out |
		  | Spread | Two fingers moving apart | Zoom in |
		  | Rotate | Two fingers rotating | Rotate object |
		  | Multi-touch | Multiple simultaneous touches | Virtual joystick + button |
		  | Drag | Move finger while held | Move character, drag UI |
	-
	- ## Virtual Controls Design
		- ```mermaid
		  graph TD
		      subgraph Good["✅ Good Virtual Control Design"]
		          G1["Large touch targets\n(min 44x44 points / 88x88 px)"]
		          G2["Transparent overlays\ndon't block gameplay"]
		          G3["Customizable position\nplayer sets layout"]
		          G4["Visual + haptic feedback\non every press"]
		          G5["Dead zone on joystick\nprevents drift"]
		      end
		      subgraph Bad["❌ Bad Virtual Control Design"]
		                B1["Tiny buttons\nfinger misses constantly"]
		                B2["Opaque controls\nblock important gameplay"]
		                B3["Fixed layout\ndoesn't fit all hand sizes"]
		                B4["No feedback\nplayer unsure if pressed"]
		    end 
		  ```
		-
		- | Control Type | Min Size | Placement | Notes |
		  |-------------|---------|-----------|-------|
		  | Movement joystick | 120×120 dp | Bottom-left | Allow repositioning |
		  | Action buttons | 60×60 dp | Bottom-right | 3–4 max visible |
		  | Jump button | 80×80 dp | Bottom-right | Most used — make largest |
		  | Menu/pause | 44×44 dp | Top corner | Small, out of the way |
		-
		- ## Touch Input in Unity
			- ```csharp
			  
			    using UnityEngine;  
			    using UnityEngine.InputSystem;  
			    
			    public class TouchInputHandler : MonoBehaviour  
			    {  
			      void Update() {  
			          // New Input System — recommended  
			          if (Touchscreen.current == null) return;  
			    
			          var touches = Touchscreen.current.touches;  
			          foreach (var touch in touches) {  
			              if (touch.phase.ReadValue() == UnityEngine.InputSystem.TouchPhase.Began) {  
			                  Vector2 pos = touch.position.ReadValue();  
			                  HandleTap(pos);  
			              }  
			          }  
			      }  
			    
			      // Legacy Input — still widely used  
			      void UpdateLegacy() {  
			          for (int i = 0; i < Input.touchCount; i++) {  
			              Touch touch = Input.GetTouch(i);  
			    
			              switch (touch.phase) {  
			                  case TouchPhase.Began:  
			                      HandleTouchStart(touch.position, touch.fingerId);  
			                      break;  
			                  case TouchPhase.Moved:  
			                      HandleTouchMove(touch.position, touch.deltaPosition, touch.fingerId);  
			                      break;  
			                  case TouchPhase.Ended:  
			                  case TouchPhase.Canceled:  
			                      HandleTouchEnd(touch.fingerId);  
			                      break;  
			              }  
			          }  
			      }  
			    
			      void HandleTap(Vector2 screenPos) {  
			          // Convert screen position to world position  
			          Ray ray = Camera.main.ScreenPointToRay(screenPos);  
			          if (Physics.Raycast(ray, out RaycastHit hit)) {  
			              Debug.Log("Tapped: " + hit.collider.name);  
			          }  
			      }  
			    
			      void HandleTouchStart(Vector2 pos, int id) { }  
			      void HandleTouchMove(Vector2 pos, Vector2 delta, int id) { }  
			      void HandleTouchEnd(int id) { }  
			    }
			  ```
	-
	- ## Touch Input in Godot
	  collapsed:: true
		- ```gdscript
		  extends Node2D
		  
		  var touch_positions: Dictionary = {}  # finger_id → position
		  
		  func _input(event: InputEvent) -> void:
		      if event is InputEventScreenTouch:
		          if event.pressed:
		              touch_positions[event.index] = event.position
		              _on_touch_start(event.index, event.position)
		          else:
		              touch_positions.erase(event.index)
		              _on_touch_end(event.index, event.position)
		  
		      elif event is InputEventScreenDrag:
		          touch_positions[event.index] = event.position
		          _on_touch_drag(event.index, event.position, event.relative)
		  
		  func _on_touch_start(finger_id: int, pos: Vector2) -> void:
		      print("Touch started: finger %d at %s" % [finger_id, pos])
		  
		  func _on_touch_drag(finger_id: int, pos: Vector2, delta: Vector2) -> void:
		      # Virtual joystick logic
		      if finger_id == 0:  # left thumb
		          var joystick_input = (pos - joystick_origin).normalized()
		          player.velocity = joystick_input * player_speed
		  
		  func _on_touch_end(finger_id: int, pos: Vector2) -> void:
		      if finger_id == 0:
		          player.velocity = Vector2.ZERO
		  ```
	-
	- ## Gesture Recognition
	  collapsed:: true
		- ```gdscript
		  # Simple swipe detection in Godot
		  extends Node
		  
		  var touch_start: Vector2
		  var touch_start_time: float
		  const SWIPE_MIN_DISTANCE: float = 50.0
		  const SWIPE_MAX_TIME: float = 0.3
		  
		  func _input(event: InputEvent) -> void:
		      if event is InputEventScreenTouch:
		          if event.pressed:
		              touch_start = event.position
		              touch_start_time = Time.get_ticks_msec() / 1000.0
		          else:
		              var elapsed = Time.get_ticks_msec() / 1000.0 - touch_start_time
		              var delta = event.position - touch_start
		              if delta.length() > SWIPE_MIN_DISTANCE and elapsed < SWIPE_MAX_TIME:
		                  _on_swipe(delta.normalized())
		  
		  func _on_swipe(direction: Vector2) -> void:
		      if abs(direction.x) > abs(direction.y):
		          if direction.x > 0: print("Swipe RIGHT")
		          else: print("Swipe LEFT")
		      else:
		          if direction.y > 0: print("Swipe DOWN")
		          else: print("Swipe UP")
		  ```
	-
	- ## Gyroscope & Accelerometer
	  collapsed:: true
		- ```csharp
		  // Unity — gyroscope and accelerometer
		  void Start() {
		      // Enable gyroscope
		      Input.gyro.enabled = true;
		  }
		  
		  void Update() {
		      // Accelerometer — tilt controls
		      Vector3 tilt = Input.acceleration;
		      // tilt.x = left/right tilt (-1 to 1)
		      // tilt.y = forward/back tilt
		      // tilt.z = face up/down
		  
		      float steerInput = Mathf.Clamp(tilt.x * 2f, -1f, 1f);
		      car.Steer(steerInput);
		  
		      // Gyroscope — rotation rate
		      Vector3 rotationRate = Input.gyro.rotationRate;
		      // Use for aiming, camera control in FPS
		  }
		  ```
-
- # Mobile Optimization
  collapsed:: true
	- > [!warning] Mobile Constraints
	  > Mobile GPUs are **tile-based** — fundamentally different from desktop GPUs.
	  > Overdraw, fill rate, and memory bandwidth are the primary bottlenecks.
	  > Battery life is a hard constraint — sustained high CPU/GPU usage kills the game.
	-
	- ## Mobile GPU Architecture
	  collapsed:: true
		- ```mermaid
		  graph TD
		      subgraph Desktop["🖥️ Desktop GPU — Immediate Mode"]
		          D1["Draw call submitted"]
		          D2["Entire frame rendered immediately"]
		          D3["Results written to VRAM"]
		          D1 --> D2 --> D3
		      end
		      subgraph Mobile["📱 Mobile GPU — Tile-Based Deferred Rendering"]
		          M1["Draw call submitted"]
		          M2["Screen divided into tiles\n(16x16 or 32x32 pixels)"]
		          M3["Each tile rendered\ncompletely in on-chip memory"]
		          M4["Tile written to RAM\nonly when complete"]
		          M1 --> M2 --> M3 --> M4
		      end
		      Mobile -->|"Benefit"| Benefit["Lower memory bandwidth\nBetter power efficiency"]
		      Mobile -->|"Implication"| Impl["Avoid reading framebuffer mid-frame\nDeferred rendering is expensive"]
		  ```
	-
	- ## Performance Targets
	  collapsed:: true
		- | Target | FPS | Frame Budget | Use Case |
		  |--------|-----|-------------|---------|
		  | Minimum | 30 FPS | 33.3ms | Casual, strategy |
		  | Standard | 60 FPS | 16.6ms | Action, platformer |
		  | High refresh | 90 FPS | 11.1ms | Competitive, premium |
		  | Ultra | 120 FPS | 8.3ms | Flagship devices only |
		- > [!tip] Target 60 FPS on mid-range devices
		  > Design for a 2-year-old mid-range phone (e.g., Samsung A-series, iPhone SE).
		  > If it runs well there, it runs everywhere.
	-
	- ## CPU Optimization
	  collapsed:: true
		- | Technique | Description | Impact |
		  |-----------|-------------|--------|
		  | Object pooling | Reuse objects instead of instantiate/destroy | High — eliminates GC spikes |
		  | Update throttling | Don't update AI/physics every frame | High — reduces CPU load |
		  | Job system | Multithreaded work (Unity Jobs, Godot threads) | High — uses all cores |
		  | Avoid string operations | String allocation causes GC | Medium |
		  | Cache component references | Don't call GetComponent every frame | Medium |
		  | Reduce physics bodies | Sleep inactive rigidbodies | Medium |
		  | LOD for AI | Distant enemies use simplified logic | Medium |
	-
	- ## GPU Optimization
	  collapsed:: true
		- | Technique | Description | Impact |
		  |-----------|-------------|--------|
		  | Reduce draw calls | Batch/instancing — fewer API calls | Very High |
		  | Texture compression | ETC2 (Android), ASTC (modern), PVRTC (iOS) | Very High |
		  | Mipmaps | Pre-generated lower-res textures for distance | High |
		  | Reduce overdraw | Sort transparent objects, use depth prepass | High |
		  | Shader complexity | Use mobile-optimized shaders (mediump) | High |
		  | Avoid post-processing | Bloom, DOF, SSAO are expensive on mobile | High |
		  | Texture atlases | Combine textures to reduce binds | Medium |
		  | Reduce polygon count | Mobile needs lower poly than PC | Medium |
	-
	- ## Texture Compression for Mobile
	  collapsed:: true
		- | Format | Platform | Quality | Notes |
		  |--------|----------|---------|-------|
		  | ETC2 | Android (OpenGL ES 3.0+) | Good | Universal Android support |
		  | ASTC | Modern Android + iOS (A8+) | Excellent | Best quality/size ratio |
		  | PVRTC | iOS (older devices) | Good | Power of 2 textures only |
		  | BC (DXT) | Desktop only | Excellent | Not for mobile |
		- > [!tip] Use ASTC for modern targets
		  > ASTC supports all block sizes (4x4 to 12x12) and is the best choice for devices from 2015+.
		  > Fall back to ETC2 for older Android devices.
	-
	- ## Memory Management
	  collapsed:: true
		- ```mermaid
		  graph TD
		      Budget["📱 Mobile Memory Budget\n~1.5–3 GB total app limit"]
		      Code["Code + Engine\n~100–300 MB"]
		      Textures["Textures\n~200–500 MB"]
		      Audio["Audio\n~50–150 MB"]
		      Meshes["Meshes + Animations\n~50–200 MB"]
		      Runtime["Runtime + GC\n~100–300 MB"]
		      Budget --> Code
		      Budget --> Textures
		      Budget --> Audio
		      Budget --> Meshes
		      Budget --> Runtime
		  ```
		- | Strategy | Description |
		  |----------|-------------|
		  | Addressables / Asset Bundles | Load/unload assets on demand |
		  | Texture streaming | Load lower mip levels first |
		  | Audio streaming | Stream music from disk, load SFX into memory |
		  | Scene streaming | Load only visible areas |
		  | Avoid texture duplication | Share materials and atlases |
	-
	- ## Battery Optimization
	  collapsed:: true
		- > [!warning] Battery is a First-Class Concern
		  > A game that drains battery in 30 minutes gets 1-star reviews.
		  > Players expect 1–2 hours of gameplay per charge.
		- | Technique | Battery Saving | Notes |
		  |-----------|---------------|-------|
		  | Cap FPS to 30 or 60 | Very High | Don't render at 120 FPS if 60 is fine |
		  | Reduce CPU wake-ups | High | Don't poll every frame if not needed |
		  | Disable GPS/camera when unused | High | Sensors drain battery |
		  | Reduce network calls | Medium | Batch server requests |
		  | Lower resolution on low battery | Medium | Detect battery level |
		  | Pause background processes | Medium | Stop AI when app backgrounded |
-
- # iOS Platform Features
  collapsed:: true
	- ## iOS-Specific Capabilities
	  collapsed:: true
		- | Feature | Description | Use Case |
		  |---------|-------------|---------|
		  | Game Center | Apple's social gaming platform | Leaderboards, achievements, multiplayer matchmaking |
		  | Sign in with Apple | Authentication | User accounts without email |
		  | StoreKit 2 | In-app purchases and subscriptions | Monetization |
		  | ARKit | Augmented reality framework | AR games |
		  | CoreMotion | Accelerometer, gyroscope, pedometer | Motion controls |
		  | Haptic Engine | Precise haptic feedback | Game feel, UI feedback |
		  | Metal | Apple's GPU API | High-performance rendering |
		  | ProMotion | 120Hz adaptive refresh | Smooth gameplay on Pro devices |
		  | App Clips | Instant mini-app experience | Game demos without install |
	-
	- ## iOS Device Tiers (2024)
	  collapsed:: true
		- | Tier | Devices | GPU | RAM | Target |
		  |------|---------|-----|-----|--------|
		  | Budget | iPhone SE 2nd gen | A13 | 3 GB | Minimum spec |
		  | Mid | iPhone 13 | A15 | 4 GB | Standard target |
		  | High | iPhone 15 | A16 | 6 GB | High quality |
		  | Pro | iPhone 15 Pro | A17 Pro | 8 GB | Maximum quality |
	-
	- ## iOS Haptics (Unity)
	  collapsed:: true
		- ```csharp
		  // iOS Haptic Feedback — Unity
		  #if UNITY_IOS
		  using UnityEngine.iOS;
		  
		  public class HapticManager : MonoBehaviour
		  {
		      // Light tap — UI interactions
		      public void LightImpact() {
		          Handheld.Vibrate(); // basic
		          // For precise haptics use iOS native plugin
		    }
		  
		      // Trigger haptic via native iOS API
		      [System.Runtime.InteropServices.DllImport("__Internal")]
		      private static extern void _TriggerHapticFeedback(int style);
		      // style: 0=light, 1=medium, 2=heavy, 3=soft, 4=rigid
		  
		      public void MediumImpact() => _TriggerHapticFeedback(1);
		      public void HeavyImpact()  => _TriggerHapticFeedback(2);
		  }
		  #endif
		  ```
	-
	- ## Game Center Integration (Unity)
	  collapsed:: true
		- ```csharp
		  using UnityEngine.SocialPlatforms;
		  using UnityEngine.SocialPlatforms.GameCenter;
		  
		  public class GameCenterManager : MonoBehaviour
		  {
		      void Start() {
		          // Authenticate with Game Center
		          Social.localUser.Authenticate(success => {
		              if (success) Debug.Log("Game Center: Authenticated");
		              else Debug.Log("Game Center: Failed");
		          });
		      }
		  
		      // Report score to leaderboard
		      public void ReportScore(long score, string leaderboardID) {
		          Social.ReportScore(score, leaderboardID, success => {
		              Debug.Log("Score reported: " + success);
		          });
		      }
		  
		      // Unlock achievement
		      public void UnlockAchievement(string achievementID) {
		          Social.ReportProgress(achievementID, 100.0, success => {
		              Debug.Log("Achievement unlocked: " + success);
		          });
		      }
		  
		      // Show leaderboard UI
		      public void ShowLeaderboard() {
		          Social.ShowLeaderboardUI();
		      }
		  }
		  ```
-
- # Android Platform Features
  collapsed:: true
	- ## Android-Specific Capabilities
	  collapsed:: true
		- | Feature | Description | Use Case |
		  |---------|-------------|---------|
		  | Google Play Games | Social gaming platform | Leaderboards, achievements, cloud saves |
		  | Play Billing | In-app purchases | Monetization |
		  | ARCore | Augmented reality | AR games |
		  | Android Game Development Kit | Performance tools | Profiling, frame pacing |
		  | AGDK Frame Pacing | Smooth frame delivery | Eliminate jank |
		  | Vulkan | Low-level GPU API | High-performance rendering |
		  | OpenGL ES 3.2 | Standard GPU API | Broad compatibility |
		  | Android Adaptive Performance | Dynamic quality scaling | Battery + thermal management |
		  | Google Play Instant | Play without installing | Game demos |
	-
	- ## Android Device Fragmentation
	  collapsed:: true
		- > [!warning] Fragmentation Challenge
		  > Android runs on thousands of different devices with wildly different hardware.
		  > Always test on low-end, mid-range, and high-end devices.
		- | Tier | Example Devices | GPU | RAM | Target |
		  |------|----------------|-----|-----|--------|
		  | Low-end | Samsung A03, Redmi 9 | Mali-G52 | 2–3 GB | Minimum spec |
		  | Mid-range | Samsung A54, Pixel 6a | Adreno 642 | 4–6 GB | Standard target |
		  | High-end | Samsung S24, Pixel 8 | Adreno 750 | 8–12 GB | High quality |
		  | Flagship | Samsung S24 Ultra | Adreno 750 | 12 GB | Maximum quality |
	-
	- ## Android Frame Pacing (AGDK)
	  collapsed:: true
		- ```cpp
		  // Android Game Development Kit — Frame Pacing
		  // Eliminates jank caused by irregular frame delivery
		  #include "swappy/swappyGL.h"
		  
		  // Initialize Swappy
		  SwappyGL_init(env, activity);
		  SwappyGL_setSwapIntervalNS(1000000000L / 60); // 60 FPS
		  
		  // In render loop — replace eglSwapBuffers with:
		  SwappyGL_swap(display, surface); // handles frame pacing automatically
		  ```
	-
	- ## Android Adaptive Performance (Unity)
	  collapsed:: true
		- ```csharp
		  using UnityEngine.Android;
		  
		  public class AdaptivePerformanceManager : MonoBehaviour
		  {
		      IAdaptivePerformance ap;
		  
		      void Start() {
		          ap = Holder.Instance;
		          if (ap == null || !ap.Active) return;
		  
		          // Subscribe to thermal warnings
		          ap.ThermalStatus.ThermalEvent += OnThermalEvent;
		      }
		  
		      void OnThermalEvent(ThermalMetrics metrics) {
		          switch (metrics.WarningLevel) {
		              case WarningLevel.NoWarning:
		                  SetQuality(QualityLevel.High);
		                  break;
		              case WarningLevel.ThrottlingImminent:
		                  SetQuality(QualityLevel.Medium);
		                  break;
		              case WarningLevel.Throttling:
		                  SetQuality(QualityLevel.Low);
		                  break;
		          }
		      }
		  
		      void SetQuality(QualityLevel level) {
		          switch (level) {
		              case QualityLevel.High:
		                  QualitySettings.SetQualityLevel(2);
		                  Application.targetFrameRate = 60;
		                  break;
		              case QualityLevel.Medium:
		                  QualitySettings.SetQualityLevel(1);
		                  Application.targetFrameRate = 30;
		                  break;
		              case QualityLevel.Low:
		                  QualitySettings.SetQualityLevel(0);
		                  Application.targetFrameRate = 30;
		                  break;
		          }
		      }
		  }
		  ```
-
- # Mobile Monetization
  collapsed:: true
	- > [!info] Mobile Monetization Reality
	  > 95%+ of mobile games are free-to-play. Premium games exist but are a small niche.
	  > The average mobile player spends $0. The top 5% of players ("whales") generate 50%+ of revenue.
	-
	- ## Monetization Models
	  collapsed:: true
		- ```mermaid
		  graph TD
		      subgraph F2P["💰 Free-to-Play Models"]
		          IAP["In-App Purchases\nCosmetics, currency, items"]
		          Ads["Advertising\nBanner, interstitial, rewarded"]
		          BP["Battle Pass\nSeasonal progression"]
		          Sub["Subscription\nMonthly premium access"]
		      end
		      subgraph Premium["💵 Premium Models"]
		          Paid["Paid Download\n$0.99 – $9.99"]
		          DLC["DLC / Expansion\nAdditional content"]
		          Demo["Free Demo\nPaid full version"]
		      end
		  ```
		- | Model | Revenue Potential | Player Friction | Best For |
		  |-------|-----------------|----------------|---------|
		  | Rewarded ads | Medium | Low (optional) | Casual, hyper-casual |
		  | Interstitial ads | Low-Medium | High (forced) | Hyper-casual only |
		  | Banner ads | Low | Medium | Casual |
		  | IAP — cosmetics | High | Low | Any genre |
		  | IAP — pay-to-win | Very High | Very High (ethical issues) | Avoid |
		  | Battle pass | High | Low | Mid-core, live service |
		  | Subscription | Medium | Low | Premium content |
		  | Premium ($2.99+) | Low volume, high quality | None | Core gamers |
	-
	- ## In-App Purchases (Unity IAP)
	  collapsed:: true
		- ```csharp
		  using UnityEngine;
		  using UnityEngine.Purchasing;
		  using UnityEngine.Purchasing.Extension;
		  
		  public class IAPManager : MonoBehaviour, IDetailedStoreListener
		  {
		      IStoreController storeController;
		  
		      // Product IDs — must match App Store / Play Store
		      const string PRODUCT_GEMS_100    = "com.mygame.gems100";
		      const string PRODUCT_NO_ADS      = "com.mygame.noads";
		      const string PRODUCT_MONTHLY_SUB = "com.mygame.monthly";
		  
		      void Start() {
		          var builder = ConfigurationBuilder.Instance(
		              StandardPurchasingModule.Instance());
		  
		          // Add products
		          builder.AddProduct(PRODUCT_GEMS_100,    ProductType.Consumable);
		          builder.AddProduct(PRODUCT_NO_ADS,      ProductType.NonConsumable);
		          builder.AddProduct(PRODUCT_MONTHLY_SUB, ProductType.Subscription);
		  
		          UnityPurchasing.Initialize(this, builder);
		      }
		  
		      // Buy a product
		      public void BuyGems() {
		          storeController.InitiatePurchase(PRODUCT_GEMS_100);
		      }
		  
		      // Called on successful purchase
		      public PurchaseProcessingResult ProcessPurchase(PurchaseEventArgs args) {
		          if (args.purchasedProduct.definition.id == PRODUCT_GEMS_100) {
		              GivePlayerGems(100);
		          }
		          else if (args.purchasedProduct.definition.id == PRODUCT_NO_ADS) {
		              DisableAds();
		          }
		          return PurchaseProcessingResult.Complete;
		      }
		  
		      public void OnInitialized(IStoreController controller,
		                                 IExtensionProvider extensions) {
		          storeController = controller;
		      }
		  
		      public void OnInitializeFailed(InitializationFailureReason error,
		                                      string message) {
		          Debug.LogError("IAP Init failed: " + error);
		      }
		  
		      public void OnPurchaseFailed(Product product,
		                                    PurchaseFailureDescription failure) {
		          Debug.LogError("Purchase failed: " + failure.reason);
		      }
		  
		      void GivePlayerGems(int amount) { /* add gems to player */ }
		      void DisableAds() { /* set no-ads flag */ }
		  }
		  ```
	-
	- ## Rewarded Ads (Unity Ads)
	  collapsed:: true
		- ```csharp
		  using UnityEngine;
		  using UnityEngine.Advertisements;
		  
		  public class AdsManager : MonoBehaviour, IUnityAdsLoadListener,
		                                            IUnityAdsShowListener
		  {
		      [SerializeField] string androidGameID = "1234567";
		      [SerializeField] string iosGameID     = "7654321";
		      const string REWARDED_AD_UNIT = "Rewarded_Android"; // or iOS
		  
		      void Start() {
		          string gameID = Application.platform == RuntimePlatform.IPhonePlayer
		              ? iosGameID : androidGameID;
		          Advertisement.Initialize(gameID, testMode: false);
		          LoadRewardedAd();
		      }
		  
		      void LoadRewardedAd() {
		          Advertisement.Load(REWARDED_AD_UNIT, this);
		      }
		  
		      public void ShowRewardedAd(System.Action onRewardGranted) {
		          this.onRewardGranted = onRewardGranted;
		          Advertisement.Show(REWARDED_AD_UNIT, this);
		      }
		  
		      System.Action onRewardGranted;
		  
		      // IUnityAdsShowListener
		      public void OnUnityAdsShowComplete(string adUnitId,
		          UnityAdsShowCompletionState completionState) {
		          if (completionState == UnityAdsShowCompletionState.COMPLETED) {
		              onRewardGranted?.Invoke(); // grant reward
		          }
		          LoadRewardedAd(); // preload next ad
		      }
		  
		      public void OnUnityAdsAdLoaded(string adUnitId) { }
		      public void OnUnityAdsFailedToLoad(string id, UnityAdsLoadError e, string msg) { }
		      public void OnUnityAdsShowFailure(string id, UnityAdsShowError e, string msg) { }
		      public void OnUnityAdsShowStart(string adUnitId) { }
		      public void OnUnityAdsShowClick(string adUnitId) { }
		  }
		  ```
	-
	- ## Ethical Monetization for Mobile
	  collapsed:: true
		- | Ethical | Predatory |
		  |---------|----------|
		  | ✅ Rewarded ads (optional) | ❌ Forced interstitials every 2 minutes |
		  | ✅ Cosmetics only IAP | ❌ Pay-to-win in competitive modes |
		  | ✅ Clear pricing | ❌ Confusing currency conversion |
		  | ✅ Pity system on gacha | ❌ Loot boxes targeting children |
		  | ✅ No-ads purchase option | ❌ Energy systems forcing waits or payment |
		  | ✅ Battle pass with earnable currency | ❌ FOMO timers on purchases |
		- > [!warning] Regulations
		  > Loot boxes are **banned or regulated** in Belgium, Netherlands, South Korea, and others.
		  > Always implement parental controls and spending limits.
		  > COPPA (US) and GDPR-K (EU) apply to games targeting children under 13.
-
- # Publishing & App Stores
  collapsed:: true
	- ## App Store vs Google Play
	  collapsed:: true
		- | Aspect | Apple App Store | Google Play Store |
		  |--------|----------------|------------------|
		  | Review time | 1–3 days | Hours to 3 days |
		  | Review strictness | Very strict | Moderate |
		  | Revenue cut | 30% (15% for small devs) | 30% (15% for small devs) |
		  | Platform | iOS only | Android only |
		  | Sideloading | Very restricted (EU exception) | Allowed |
		  | Developer fee | $99/year | $25 one-time |
		  | Crash reporting | Xcode Organizer | Play Console |
		  | A/B testing | Product Page Optimization | Store Listing Experiments |
	-
	- ## App Store Optimization (ASO)
	  collapsed:: true
		- > [!tip] ASO = SEO for App Stores
		  > Good ASO can double or triple organic downloads without spending on ads.
		- | Element | Best Practice |
		  |---------|--------------|
		  | App name | Include primary keyword (max 30 chars) |
		  | Subtitle (iOS) | Secondary keywords (max 30 chars) |
		  | Keywords field (iOS) | Comma-separated, no spaces, no repeats |
		  | Description | First 3 lines most important (above fold) |
		  | Icon | Bold, simple, recognizable at small size |
		  | Screenshots | Show gameplay in first 2 screenshots |
		  | Preview video | 15–30 seconds, show core gameplay loop |
		  | Ratings | Prompt at right moment (after win, not after fail) |
		  | Localization | Translate to top 5 markets for 3x more downloads |
	-
	- ## Build & Export Settings
	  collapsed:: true
		- ```
		  Unity iOS Build Settings:
		    Target SDK: Device SDK (not Simulator)
		    Architecture: ARM64 (required for App Store)
		    Scripting Backend: IL2CPP (required for App Store)
		    API Compatibility: .NET Standard 2.1
		    Strip Engine Code: Enabled (reduces binary size)
		    Managed Stripping Level: Medium
		  
		  Unity Android Build Settings:
		    Target API Level: 34+ (required by Play Store 2024)
		    Minimum API Level: 22 (Android 5.1)
		    Scripting Backend: IL2CPP
		    Target Architecture: ARM64 (required), ARMv7 (optional)
		    Build Format: AAB (Android App Bundle) — required by Play Store
		    Keystore: Sign with release keystore (never lose this!)
		  ```
		- > [!warning] Never Lose Your Keystore
		  > The Android keystore is required to update your app on Play Store.
		  > If you lose it, you cannot update your app — you must publish as a new app.
		  > Back it up in multiple secure locations.
	-
	- ## Performance Profiling Tools
	  collapsed:: true
		- | Tool | Platform | What It Profiles |
		  |------|----------|-----------------|
		  | Unity Profiler | All | CPU, GPU, memory, audio, physics |
		  | Xcode Instruments | iOS | CPU, GPU, memory, energy |
		  | Android GPU Inspector | Android | GPU frame analysis |
		  | Android Studio Profiler | Android | CPU, memory, network, energy |
		  | RenderDoc | Android (Vulkan) | GPU frame capture |
		  | Snapdragon Profiler | Qualcomm Android | Adreno GPU deep analysis |
		  | Mali Graphics Debugger | ARM Android | Mali GPU analysis |
-
- # Cross-Platform Development
  collapsed:: true
	- ## Engine Export Comparison
	  collapsed:: true
		- | Engine | iOS Export | Android Export | Notes |
		  |--------|-----------|---------------|-------|
		  | Unity | ✅ Excellent | ✅ Excellent | Industry standard for mobile |
		  | Godot | ✅ Good | ✅ Good | Free, improving rapidly |
		  | Unreal | ✅ Good | ✅ Good | Heavy — best for high-end mobile |
		  | Flutter (Flame) | ✅ Good | ✅ Good | Dart-based, good for 2D |
		  | React Native (Expo) | ✅ Good | ✅ Good | JS-based, casual games |
	-
	- ## Platform Detection (Unity)
	  collapsed:: true
		- ```csharp
		  // Detect platform and adjust behavior
		  void Start() {
		      #if UNITY_IOS
		          InitGameCenter();
		          SetIOSQuality();
		      #elif UNITY_ANDROID
		          InitGooglePlayGames();
		          SetAndroidQuality();
		      #endif
		  
		      // Runtime detection
		      if (Application.isMobilePlatform) {
		          EnableTouchControls();
		          DisableMouseControls();
		          Application.targetFrameRate = 60;
		      }
		  
		      // Screen orientation
		      Screen.orientation = ScreenOrientation.LandscapeLeft;
		      Screen.sleepTimeout = SleepTimeout.NeverSleep; // prevent screen sleep
		  }
		  
		  void SetIOSQuality() {
		      // iPhone 15 Pro — high quality
		      if (SystemInfo.graphicsMemorySize >= 4096) {
		          QualitySettings.SetQualityLevel(3);
		          Application.targetFrameRate = 60;
		      }
		      // iPhone SE — low quality
		      else {
		          QualitySettings.SetQualityLevel(1);
		          Application.targetFrameRate = 30;
		      }
		  }
		  ```
	-
	- ## Safe Area (Notch / Dynamic Island)
	  collapsed:: true
		- ```csharp
		  // Handle iPhone notch, Dynamic Island, Android punch-hole cameras
		  using UnityEngine;
		  
		  public class SafeAreaHandler : MonoBehaviour
		  {
		      RectTransform rectTransform;
		      Rect lastSafeArea;
		  
		      void Awake() {
		          rectTransform = GetComponent<RectTransform>();
		          ApplySafeArea();
		      }
		  
		      void ApplySafeArea() {
		          Rect safeArea = Screen.safeArea;
		          if (safeArea == lastSafeArea) return;
		          lastSafeArea = safeArea;
		  
		          // Convert safe area to anchor min/max
		          Vector2 anchorMin = safeArea.position;
		          Vector2 anchorMax = safeArea.position + safeArea.size;
		          anchorMin.x /= Screen.width;
		          anchorMin.y /= Screen.height;
		          anchorMax.x /= Screen.width;
		          anchorMax.y /= Screen.height;
		  
		          rectTransform.anchorMin = anchorMin;
		          rectTransform.anchorMax = anchorMax;
		      }
		  }
		  ```
-
- # Logseq Graph Connections
  collapsed:: true
	- tags:: mobile-game-development, ios, android, touch-controls, mobile-optimization, monetization, unity-mobile, godot-mobile
	- Related pages:
		- [[Game Development]] — core game dev concepts applicable to mobile
		- [[Game Design]] — mobile-specific design patterns (session length, core loops, monetization)
		- [[Game Audio]] — mobile audio optimization and FMOD/Wwise mobile integration
		- [[Unity]] — Unity mobile export, URP mobile, Unity IAP
		- [[Godot]] — Godot mobile export and touch input
		- [[Unreal Engine]] — Unreal mobile rendering and optimization
		- [[Advanced Graphics]] — mobile GPU architecture (tile-based rendering)
		- [[Free Assets]] — free mobile game assets and UI kits
-
- # More Learn
	- ## Official Documentation
		- [Unity Mobile Optimization Guide](https://docs.unity3d.com/Manual/MobileOptimization.html) — Official Unity mobile performance guide.
		- [Apple Human Interface Guidelines — Games](https://developer.apple.com/design/human-interface-guidelines/game-controls) — Apple's design standards for iOS games.
		- [Android Game Development Kit](https://developer.android.com/games/agdk) — Google's official mobile game development tools.
		- [Google Play Academy](https://play.google.com/academy/) — Free courses on publishing and growing on Google Play.
		- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) — What Apple allows and rejects.
	-
	- ## Free Learning Resources
		- [GDC Mobile Summit Talks](https://gdcvault.com/free?keyword=mobile) — Free GDC mobile game development talks.
		- [Unity Learn — Mobile](https://learn.unity.com/search?k=%5B%22tag%3A5f6e5b0e-e3e3-4b3e-b3e3-5f6e5b0e5f6e%22%5D) — Free Unity mobile tutorials.
		- [Deconstructor of Fun](https://www.deconstructoroffun.com/) — Mobile game business and design analysis.
	-
	- ## Tools
		- [GameAnalytics](https://gameanalytics.com/) — Free mobile game analytics. Track retention, sessions, revenue.
		- [Firebase](https://firebase.google.com/) — Free analytics, crash reporting, A/B testing for mobile games.
		- [Adjust](https://www.adjust.com/) — Mobile attribution and analytics.
		- [AppFollow](https://appfollow.io/) — App store review monitoring and ASO tools.
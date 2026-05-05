---
seoTitle: VR/AR Development – Complete Virtual & Augmented Reality Guide
description: "Comprehensive VR/AR development reference covering OpenXR, SteamVR, Meta SDK, ARCore, ARKit, interaction design, performance optimization, and engine integration for Unity, Unreal, and Godot."
keywords: "VR development, AR development, virtual reality, augmented reality, OpenXR, SteamVR, Meta Quest, ARCore, ARKit, XR development, mixed reality, VR interaction design, VR optimization, Unity XR, Unreal VR, Godot XR, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: VR/AR Development
---

> [!info] About This Page
> This page covers **VR and AR game and application development** — from hardware fundamentals to production-ready XR experiences.
> For engine setup see [[Unity]], [[Unreal Engine]], [[Godot]].
> For rendering concepts see [[Advanced Graphics]]. For game design see [[Game Design]].

- # History
  collapsed:: true
	- **How**: VR began with military flight simulators (1960s), became a consumer curiosity with Nintendo Virtual Boy (1995), then truly arrived with Oculus Rift DK1 (2012) and consumer headsets (2016). AR went mainstream with Pokemon GO (2016) and Apple Vision Pro (2024).
	- **Who**: Key players — Oculus/Meta (Quest), Valve (Index/SteamVR), Sony (PSVR), Apple (Vision Pro), Microsoft (HoloLens), Google (ARCore), Apple (ARKit), Khronos Group (OpenXR).
	- **Why**: VR creates the highest possible immersion — presence. AR overlays digital information on the real world. Both are transforming gaming, training, medicine, architecture, and social interaction.
	-
	- ## XR Timeline
	  collapsed:: true
		- ```mermaid
		  timeline
		      title VR/AR Evolution
		      1968 : The Sword of Damocles
		           : First head-mounted display
		           : Ivan Sutherland MIT
		      1995 : Nintendo Virtual Boy
		           : First consumer VR attempt
		           : Commercial failure
		      2012 : Oculus Rift DK1
		           : Kickstarter success
		           : Modern VR era begins
		      2016 : Consumer VR Launch
		           : HTC Vive, Oculus Rift CV1, PSVR
		           : Pokemon GO AR mainstream
		      2019 : Oculus Quest 1
		           : Standalone VR, no PC required
		           : VR becomes accessible
		      2020 : OpenXR 1.0 Standard
		           : Cross-platform XR API
		           : Industry unification begins
		      2023 : Meta Quest 3
		           : Mixed reality passthrough
		           : Affordable high-quality VR
		      2024 : Apple Vision Pro
		           : Spatial computing era
		           : $3499 premium device
		  ```
-
- # Introduction
  collapsed:: true
	- > [!tip] XR Terminology
	  > **VR** (Virtual Reality) — fully immersive digital environment, real world blocked out.
	  > **AR** (Augmented Reality) — digital overlays on real world (phone camera or glasses).
	  > **MR** (Mixed Reality) — digital objects interact with real world (HoloLens, Quest 3 passthrough).
	  > **XR** (Extended Reality) — umbrella term covering VR + AR + MR.
	-
	- ## XR Knowledge Map
	  collapsed:: true
		- ```mermaid
		  mindmap
		    root((XR Development))
		      Hardware
		        Headsets
		        Controllers
		        Tracking
		        Display Tech
		      SDKs and APIs
		        OpenXR
		        SteamVR
		        Meta SDK
		        ARCore
		        ARKit
		      Interaction Design
		        Locomotion
		        Hand Tracking
		        Gaze Input
		        Haptics
		      Rendering
		        Stereo Rendering
		        Foveated Rendering
		        Reprojection
		        Performance
		      Platforms
		        Meta Quest
		        PC VR
		        PSVR2
		        iOS AR
		        Android AR
		  ```
	-
	- ## VR vs AR vs MR
	  collapsed:: true
		- | Type | Real World | Digital World | Device | Example |
		  |------|-----------|--------------|--------|---------|
		  | VR | Blocked out | Fully immersive | Headset | Beat Saber, Half-Life Alyx |
		  | AR | Visible (camera) | Overlaid | Phone / glasses | Pokemon GO, IKEA Place |
		  | MR | Visible (passthrough) | Interacts with real | Headset | HoloLens, Quest 3 |
		  | Spatial Computing | Seamless blend | Context-aware | Vision Pro | Apple Vision Pro apps |

- # VR Hardware Fundamentals
  collapsed:: true
	- ## Headset Types
	  collapsed:: true
		- | Type | Description | Examples | Pros | Cons |
		  |------|-------------|---------|------|------|
		  | Standalone | Self-contained, no PC | Meta Quest 3, Quest 2 | Wireless, affordable, easy setup | Limited GPU power |
		  | PC VR (tethered) | Connected to gaming PC | Valve Index, Pimax | Maximum quality | Cable, expensive PC needed |
		  | PC VR (wireless) | PC power, wireless link | Quest 3 + Air Link | Best of both | Latency, compression |
		  | Console VR | Connected to console | PSVR2 | Plug-and-play | Platform locked |
		  | Standalone premium | High-end standalone | Apple Vision Pro | Best standalone quality | Very expensive |
	-
	- ## Display Technology
	  collapsed:: true
		- | Spec | Minimum | Good | Excellent | Notes |
		  |------|---------|------|-----------|-------|
		  | Resolution per eye | 1080×1200 | 1832×1920 | 2064×2208+ | Higher = less screen door effect |
		  | Refresh rate | 72 Hz | 90 Hz | 120 Hz | Higher = less motion sickness |
		  | FOV (Field of View) | 90° | 110° | 120°+ | Wider = more immersive |
		  | IPD adjustment | Fixed | Software | Hardware | Interpupillary distance |
		  | Panel type | LCD | Fast-LCD | OLED/MicroOLED | OLED = better blacks, contrast |
		- > [!warning] Comfort Zone
		  > **90 Hz minimum** for comfortable VR. Below 90 Hz causes motion sickness in most users.
		  > **72 Hz** is acceptable for slow-paced experiences only.
	-
	- ## Tracking Systems
	  collapsed:: true
		- ```mermaid
		  graph TD
		      subgraph Inside["📷 Inside-Out Tracking (Modern Standard)"]
		          I1["Cameras on headset\nlook outward"]
		          I2["SLAM algorithm\nmaps environment"]
		          I3["6DOF tracking\nno external hardware"]
		          I1 --> I2 --> I3
		      end
		      subgraph Outside["📡 Outside-In Tracking (Legacy)"]
		          O1["External base stations\n(Valve Lighthouse)"]
		          O2["Sensors on headset\ndetect laser sweeps"]
		          O3["Very precise tracking\nrequires room setup"]
		          O1 --> O2 --> O3
		      end
		  ```
		- | DOF | Description | Example |
		  |-----|-------------|---------|
		  | 3DOF | Rotation only (pitch, yaw, roll) — no position | Cardboard, Gear VR |
		  | 6DOF | Rotation + position (x, y, z) — full movement | Quest 3, Index, PSVR2 |
	-
	- ## VR Headset Comparison (2024)
	  collapsed:: true
		- | Headset | Type | Resolution/Eye | Refresh | Price | Best For |
		  |---------|------|---------------|---------|-------|---------|
		  | Meta Quest 2 | Standalone | 1832×1920 | 90 Hz | ~$250 | Budget, beginners |
		  | Meta Quest 3 | Standalone MR | 2064×2208 | 120 Hz | $500 | Best value |
		  | Valve Index | PC VR | 1440×1600 | 144 Hz | $999 | PC VR enthusiasts |
		  | PSVR2 | Console VR | 2000×2040 | 120 Hz | $550 | PlayStation gamers |
		  | Apple Vision Pro | Standalone | 3660×3142 | 100 Hz | $3499 | Spatial computing |
		  | Pimax Crystal | PC VR | 2880×2880 | 160 Hz | $1599 | Sim enthusiasts |

- # OpenXR
  collapsed:: true
	- > [!info] What is OpenXR?
	  > OpenXR is the **open, royalty-free standard** for VR/AR applications by the Khronos Group (2020).
	  > Write once, run on any OpenXR-compatible device — Meta Quest, Valve Index, PSVR2, HoloLens, and more.
	  > Replaces the fragmented landscape of vendor-specific SDKs.
	  > Supported by: Unity, Unreal Engine, Godot, and all major headset manufacturers.
	-
	- ## OpenXR Architecture
	  collapsed:: true
		- ```mermaid
		  graph TD
		      App["Your XR Application"]
		      OpenXR["OpenXR API\n(Khronos Standard)"]
		      subgraph Runtimes["OpenXR Runtimes"]
		          Meta["Meta OpenXR Runtime\n(Quest devices)"]
		          Valve["SteamVR Runtime\n(PC VR)"]
		          WMR["Windows MR Runtime\n(HoloLens, WMR)"]
		          PSVR["Sony Runtime\n(PSVR2)"]
		      end
		      subgraph Hardware["Hardware"]
		          Q3["Meta Quest 3"]
		          Index["Valve Index"]
		          HL["HoloLens 2"]
		          PS["PSVR2"]
		      end
		      App --> OpenXR
		      OpenXR --> Meta --> Q3
		      OpenXR --> Valve --> Index
		      OpenXR --> WMR --> HL
		      OpenXR --> PSVR --> PS
		  ```
	-
	- ## OpenXR Core Concepts
	  collapsed:: true
		- | Concept | Description |
		  |---------|-------------|
		  | Instance | OpenXR context — created once at startup |
		  | System | Represents the XR hardware (headset + controllers) |
		  | Session | Active XR session — manages rendering and input |
		  | Space | Coordinate reference frame (local, stage, view) |
		  | Action | Abstract input (trigger press, thumbstick axis) |
		  | Action Set | Group of related actions |
		  | Swapchain | Images rendered to and presented to the headset |
		  | Frame | One rendered frame — predict, wait, begin, render, end |
	-
	- ## OpenXR C++ Initialization
	  collapsed:: true
		- ```cpp
		  #include <openxr/openxr.h>

		  XrInstance instance = XR_NULL_HANDLE;
		  XrSession  session  = XR_NULL_HANDLE;
		  XrSystemId systemId = XR_NULL_SYSTEM_ID;

		  // 1. Create Instance
		  XrInstanceCreateInfo instanceInfo{XR_TYPE_INSTANCE_CREATE_INFO};
		  instanceInfo.applicationInfo.apiVersion = XR_CURRENT_API_VERSION;
		  strcpy(instanceInfo.applicationInfo.applicationName, "My VR Game");
		  strcpy(instanceInfo.applicationInfo.engineName, "My Engine");

		  const char* extensions[] = {
		      XR_KHR_VULKAN_ENABLE2_EXTENSION_NAME,  // or OpenGL
		      XR_EXT_HAND_TRACKING_EXTENSION_NAME,   // hand tracking
		  };
		  instanceInfo.enabledExtensionCount = 2;
		  instanceInfo.enabledExtensionNames = extensions;

		  xrCreateInstance(&instanceInfo, &instance);

		  // 2. Get System (headset)
		  XrSystemGetInfo systemInfo{XR_TYPE_SYSTEM_GET_INFO};
		  systemInfo.formFactor = XR_FORM_FACTOR_HEAD_MOUNTED_DISPLAY;
		  xrGetSystem(instance, &systemInfo, &systemId);

		  // 3. Create Session
		  XrSessionCreateInfo sessionInfo{XR_TYPE_SESSION_CREATE_INFO};
		  sessionInfo.systemId = systemId;
		  // + graphics binding (Vulkan/OpenGL specific struct)
		  xrCreateSession(instance, &sessionInfo, &session);

		  // 4. Create Reference Space (stage = room-scale)
		  XrReferenceSpaceCreateInfo spaceInfo{XR_TYPE_REFERENCE_SPACE_CREATE_INFO};
		  spaceInfo.referenceSpaceType = XR_REFERENCE_SPACE_TYPE_STAGE;
		  spaceInfo.poseInReferenceSpace = {{0,0,0,1}, {0,0,0}}; // identity pose

		  XrSpace stageSpace = XR_NULL_HANDLE;
		  xrCreateReferenceSpace(session, &spaceInfo, &stageSpace);
		  ```
	-
	- ## OpenXR Input System
	  collapsed:: true
		- ```cpp
		  // OpenXR uses an abstract action system
		  // Actions are bound to physical inputs via interaction profiles

		  XrActionSet actionSet = XR_NULL_HANDLE;
		  XrAction triggerAction, gripAction, thumbstickAction;

		  // Create action set
		  XrActionSetCreateInfo setInfo{XR_TYPE_ACTION_SET_CREATE_INFO};
		  strcpy(setInfo.actionSetName, "gameplay");
		  strcpy(setInfo.localizedActionSetName, "Gameplay");
		  xrCreateActionSet(instance, &setInfo, &actionSet);

		  // Create trigger action (boolean)
		  XrActionCreateInfo triggerInfo{XR_TYPE_ACTION_CREATE_INFO};
		  triggerInfo.actionType = XR_ACTION_TYPE_BOOLEAN_INPUT;
		  strcpy(triggerInfo.actionName, "shoot");
		  strcpy(triggerInfo.localizedActionName, "Shoot");
		  xrCreateAction(actionSet, &triggerInfo, &triggerAction);

		  // Create thumbstick action (2D vector)
		  XrActionCreateInfo stickInfo{XR_TYPE_ACTION_CREATE_INFO};
		  stickInfo.actionType = XR_ACTION_TYPE_VECTOR2F_INPUT;
		  strcpy(stickInfo.actionName, "move");
		  xrCreateAction(actionSet, &stickInfo, &thumbstickAction);

		  // Suggest bindings for Meta Touch controllers
		  XrActionSuggestedBinding bindings[] = {
		      {triggerAction,    xrStringToPath(instance, "/user/hand/right/input/trigger/value")},
		      {thumbstickAction, xrStringToPath(instance, "/user/hand/left/input/thumbstick")},
		  };

		  XrInteractionProfileSuggestedBinding suggested{
		      XR_TYPE_INTERACTION_PROFILE_SUGGESTED_BINDING};
		  suggested.interactionProfile =
		      xrStringToPath(instance, "/interaction_profiles/oculus/touch_controller");
		  suggested.suggestedBindings    = bindings;
		  suggested.countSuggestedBindings = 2;
		  xrSuggestInteractionProfileBindings(instance, &suggested);

		  // Per frame — read action state
		  XrActionStateBoolean triggerState{XR_TYPE_ACTION_STATE_BOOLEAN};
		  XrActionStateGetInfo getInfo{XR_TYPE_ACTION_STATE_GET_INFO};
		  getInfo.action = triggerAction;
		  xrGetActionStateBoolean(session, &getInfo, &triggerState);

		  if (triggerState.isActive && triggerState.currentState) {
		      // Trigger is pressed — shoot!
		  }
		  ```

- # SteamVR
  collapsed:: true
	- > [!info] What is SteamVR?
	  > SteamVR is Valve's VR platform and runtime for PC VR. It supports all major PC VR headsets via OpenVR/OpenXR.
	  > The SteamVR Input system provides a unified abstraction over different controller types.
	  > Used by: Half-Life: Alyx, Boneworks, Lone Echo, most PC VR games.
	-
	- ## SteamVR in Unity (OpenXR)
	  collapsed:: true
		- ```csharp
		  // Unity XR Interaction Toolkit — works with SteamVR via OpenXR
		  using UnityEngine;
		  using UnityEngine.XR.Interaction.Toolkit;
		  using UnityEngine.XR;

		  public class VRPlayerController : MonoBehaviour
		  {
		      [SerializeField] XRNode leftHandNode  = XRNode.LeftHand;
		      [SerializeField] XRNode rightHandNode = XRNode.RightHand;
		      [SerializeField] float  moveSpeed = 3f;
		      [SerializeField] CharacterController characterController;

		      void Update() {
		          // Get thumbstick input from left controller
		          InputDevice leftDevice = InputDevices.GetDeviceAtXRNode(leftHandNode);
		          Vector2 moveInput;
		          if (leftDevice.TryGetFeatureValue(CommonUsages.primary2DAxis, out moveInput)) {
		              // Move relative to HMD forward direction
		              Transform hmd = Camera.main.transform;
		              Vector3 forward = Vector3.ProjectOnPlane(hmd.forward, Vector3.up).normalized;
		              Vector3 right   = Vector3.ProjectOnPlane(hmd.right,   Vector3.up).normalized;
		              Vector3 move    = (forward * moveInput.y + right * moveInput.x) * moveSpeed;
		              characterController.Move(move * Time.deltaTime);
		          }

		          // Get trigger from right controller
		          InputDevice rightDevice = InputDevices.GetDeviceAtXRNode(rightHandNode);
		          float triggerValue;
		          if (rightDevice.TryGetFeatureValue(CommonUsages.trigger, out triggerValue)) {
		              if (triggerValue > 0.8f) Shoot();
		          }

		          // Haptic feedback
		          rightDevice.SendHapticImpulse(0, 0.5f, 0.1f); // channel, amplitude, duration
		      }

		      void Shoot() { /* fire weapon */ }
		  }
		  ```
	-
	- ## XR Interaction Toolkit (Unity)
	  collapsed:: true
		- ```csharp
		  // XR Interaction Toolkit — high-level VR interaction
		  using UnityEngine.XR.Interaction.Toolkit;

		  // XRGrabInteractable — make any object grabbable
		  // Add component to GameObject in Inspector:
		  // XRGrabInteractable + Rigidbody + Collider

		  public class VRWeapon : XRGrabInteractable
		  {
		      [SerializeField] GameObject bulletPrefab;
		      [SerializeField] Transform  muzzle;

		      protected override void OnSelectEntered(SelectEnterEventArgs args) {
		          base.OnSelectEntered(args);
		          // Called when player grabs the weapon
		          Debug.Log("Weapon grabbed by: " + args.interactorObject.transform.name);
		      }

		      protected override void OnActivated(ActivateEventArgs args) {
		          base.OnActivated(args);
		          // Called when trigger is pressed while holding
		          Fire();
		      }

		      void Fire() {
		          var bullet = Instantiate(bulletPrefab, muzzle.position, muzzle.rotation);
		          bullet.GetComponent<Rigidbody>().AddForce(muzzle.forward * 1000f);

		          // Haptic feedback on firing hand
		          if (interactorsSelecting.Count > 0) {
		              var interactor = interactorsSelecting[0] as XRBaseControllerInteractor;
		              interactor?.SendHapticImpulse(0.7f, 0.1f);
		          }
		      }
		  }
		  ```

- # Meta Quest SDK
  collapsed:: true
	- > [!info] Meta Quest Platform
	  > Meta Quest (formerly Oculus) is the dominant standalone VR platform with 20M+ devices sold.
	  > The Meta XR SDK provides Quest-specific features: hand tracking, passthrough, scene understanding, and social features.
	  > Supports both Unity and Unreal Engine.
	-
	- ## Meta Quest Features
	  collapsed:: true
		- | Feature | Description | SDK |
		  |---------|-------------|-----|
		  | Hand Tracking | Controller-free hand input | Meta XR SDK |
		  | Passthrough | See real world through headset cameras | Meta XR SDK |
		  | Scene Understanding | Detect walls, floors, furniture | Meta XR SDK |
		  | Spatial Anchors | Persistent anchors in real world | Meta XR SDK |
		  | Multiplayer | Voice chat, social features | Meta Platform SDK |
		  | App Lab | Sideload without full store review | Meta Developer |
		  | Mixed Reality | Blend virtual and real world | Meta XR SDK |
	-
	- ## Hand Tracking (Unity)
	  collapsed:: true
		- ```csharp
		  using Oculus.Interaction;
		  using Oculus.Interaction.Input;

		  public class HandTrackingExample : MonoBehaviour
		  {
		      [SerializeField] Hand leftHand;
		      [SerializeField] Hand rightHand;

		      void Update() {
		          // Check if hand tracking is active
		          if (!leftHand.IsTrackedDataValid) return;

		          // Get joint pose (e.g., index fingertip)
		          Pose indexTip;
		          if (leftHand.GetJointPose(HandJointId.HandIndexTip, out indexTip)) {
		              // indexTip.position = world position of fingertip
		              // indexTip.rotation = orientation of fingertip
		              CheckPinch(indexTip.position);
		          }

		          // Detect pinch gesture
		          float pinchStrength = leftHand.GetFingerPinchStrength(HandFinger.Index);
		          if (pinchStrength > 0.9f) {
		              OnPinch();
		          }
		      }

		      void CheckPinch(Vector3 fingertipPos) { }
		      void OnPinch() { Debug.Log("Pinch detected!"); }
		  }
		  ```
	-
	- ## Passthrough & Mixed Reality (Unity)
	  collapsed:: true
		- ```csharp
		  using UnityEngine;
		  using Oculus.Platform;

		  public class PassthroughManager : MonoBehaviour
		  {
		      [SerializeField] OVRPassthroughLayer passthroughLayer;

		      void Start() {
		          // Enable passthrough (see real world)
		          passthroughLayer.enabled = true;

		          // Set camera background to transparent
		          Camera.main.clearFlags = CameraClearFlags.SolidColor;
		          Camera.main.backgroundColor = Color.clear;
		      }

		      public void TogglePassthrough(bool enabled) {
		          passthroughLayer.enabled = enabled;
		          // When disabled — fully virtual environment
		          // When enabled — mixed reality
		      }

		      // Set passthrough opacity (0 = fully virtual, 1 = fully real)
		      public void SetOpacity(float opacity) {
		          passthroughLayer.textureOpacity = opacity;
		      }
		  }
		  ```
	-
	- ## Meta Quest in Godot
	  collapsed:: true
		- ```gdscript
		  # Godot 4 — Meta Quest via OpenXR plugin
		  # Install: Godot OpenXR Vendors plugin

		  extends Node3D

		  @onready var xr_interface = XRServer.find_interface("OpenXR")
		  @onready var left_controller  = $XROrigin3D/LeftController
		  @onready var right_controller = $XROrigin3D/RightController

		  func _ready() -> void:
		      if xr_interface and xr_interface.is_initialized():
		          DisplayServer.window_set_vsync_mode(DisplayServer.VSYNC_DISABLED)
		          get_viewport().use_xr = true
		      else:
		          push_error("OpenXR not initialized")

		  func _process(_delta: float) -> void:
		      # Read controller input
		      var trigger = Input.get_action_strength("trigger_right")
		      if trigger > 0.8:
		          shoot()

		      # Get controller position
		      var right_pos = right_controller.global_position
		      var right_rot = right_controller.global_rotation

		  func shoot() -> void:
		      # Trigger haptic feedback
		      Input.start_joy_vibration(0, 0.5, 0.5, 0.1)
		  ```

- # ARCore (Android AR)
  collapsed:: true
	- > [!info] What is ARCore?
	  > ARCore is Google's AR platform for Android (2018). It enables phones and tablets to understand the real world and place digital objects in it.
	  > Supported on 400M+ Android devices. Also available for iOS via ARCore for iOS.
	  > Used by: Google Maps AR, IKEA Place, Pokemon GO (partial), Snapchat AR filters.
	-
	- ## ARCore Core Features
	  collapsed:: true
		- ```mermaid
		  graph TD
		      subgraph Tracking["📍 World Tracking"]
		          MT["Motion Tracking\n6DOF phone position\nusing camera + IMU"]
		          EP["Environmental Understanding\nDetect horizontal/vertical planes\nFloors, tables, walls"]
		          LI["Light Estimation\nEstimate real-world lighting\nfor realistic shadows"]
		      end
		      subgraph Anchors["⚓ Anchors"]
		          LA["Local Anchors\nPersist in session"]
		          CA["Cloud Anchors\nShared across devices\nMultiplayer AR"]
		          GA["Geospatial Anchors\nGPS + Street View\nOutdoor AR"]
		      end
		      subgraph Content["🎮 AR Content"]
		          Plane["Plane Detection\nPlace objects on surfaces"]
		          Depth["Depth API\nOcclusion — objects behind real surfaces"]
		          Face["Face Tracking\nAR face filters"]
		          Image["Image Tracking\nTrack printed markers"]
		      end
		  ```
	-
	- ## ARCore in Unity (AR Foundation)
	  collapsed:: true
		- ```csharp
		  // AR Foundation — Unity's cross-platform AR framework
		  // Works with ARCore (Android) and ARKit (iOS) via same API

		  using UnityEngine;
		  using UnityEngine.XR.ARFoundation;
		  using UnityEngine.XR.ARSubsystems;
		  using System.Collections.Generic;

		  public class ARPlacementManager : MonoBehaviour
		  {
		      [SerializeField] ARRaycastManager   raycastManager;
		      [SerializeField] ARPlaneManager      planeManager;
		      [SerializeField] GameObject          objectToPlace;

		      List<ARRaycastHit> hits = new List<ARRaycastHit>();
		      GameObject         placedObject;

		  void Update() {
		          // Tap to place object on detected plane
		          if (Input.touchCount == 0) return;
		          Touch touch = Input.GetTouch(0);
		          if (touch.phase != TouchPhase.Began) return;

		          // Raycast against detected AR planes
		          if (raycastManager.Raycast(touch.position, hits,
		              TrackableType.PlaneWithinPolygon)) {

		              Pose hitPose = hits[0].pose;

		              if (placedObject == null) {
		                  // First placement
		                  placedObject = Instantiate(objectToPlace,
		                      hitPose.position, hitPose.rotation);
		              } else {
		                  // Move existing object
		                  placedObject.transform.SetPositionAndRotation(
		                      hitPose.position, hitPose.rotation);
		              }
		          }
		      }

		      // Toggle plane visualization
		      public void TogglePlaneVisualization(bool visible) {
		          foreach (var plane in planeManager.trackables) {
		              plane.gameObject.SetActive(visible);
		          }
		      }
		  }
		  ```
	-
	- ## ARCore Depth API (Occlusion)
	  collapsed:: true
		- ```csharp
		  // Depth API — virtual objects occluded by real-world surfaces
		  using UnityEngine.XR.ARFoundation;

		  public class ARDepthOcclusion : MonoBehaviour
		  {
		      [SerializeField] AROcclusionManager occlusionManager;

		      void Start() {
		          // Enable environment depth occlusion
		          occlusionManager.requestedEnvironmentDepthMode =
		              EnvironmentDepthMode.Best;

		          // Enable human segmentation (separate people from background)
		          occlusionManager.requestedHumanDepthMode =
		              HumanSegmentationDepthMode.Best;
		      }
		  }
		  // With depth enabled, virtual objects automatically hide behind
		  // real-world surfaces — a chair leg blocks a virtual ball, etc.
		  ```

- # ARKit (iOS AR)
  collapsed:: true
	- > [!info] What is ARKit?
	  > ARKit is Apple's AR framework for iOS and iPadOS (2017). It uses the iPhone/iPad camera, LiDAR scanner (Pro models), and motion sensors.
	  > Generally higher quality than ARCore due to Apple's tight hardware/software integration and LiDAR.
	  > Used by: IKEA Place, Measure app, countless iOS AR games.
	-
	- ## ARKit vs ARCore
	  collapsed:: true
		- | Feature | ARKit (iOS) | ARCore (Android) |
		  |---------|------------|-----------------|
		  | Plane detection | Excellent | Good |
		  | LiDAR depth | Yes (Pro devices) | Some devices |
		  | Face tracking | Yes (TrueDepth camera) | Yes (front camera) |
		  | Image tracking | Yes | Yes |
		  | Object detection | Yes | Limited |
		  | People occlusion | Yes | Yes (Depth API) |
		  | Geospatial | Yes (ARKit 6+) | Yes (Geospatial API) |
		  | Collaborative sessions | Yes | Cloud Anchors |
		  | Quality consistency | Very high | Varies by device |
	-
	- ## ARKit in Unity (AR Foundation)
	  collapsed:: true
		- ```csharp
		  // AR Foundation works identically for ARKit and ARCore
		  // Same code — different platform subsystem underneath

		  using UnityEngine.XR.ARFoundation;
		  using UnityEngine.XR.ARKit;

		  public class ARKitFeatures : MonoBehaviour
		  {
		      [SerializeField] ARFaceManager faceManager;
		      [SerializeField] ARAnchorManager anchorManager;

		      void Start() {
		          // Face tracking — AR face filters
		          faceManager.facesChanged += OnFacesChanged;
		      }

		      void OnFacesChanged(ARFacesChangedEventArgs args) {
		          foreach (var face in args.added) {
		              // face.vertices — mesh of detected face
		              // face.blendShapeCoefficients — 52 blend shapes
		              // (smile, blink, jaw open, etc.)
		              Debug.Log("Face detected at: " + face.transform.position);
		          }
		      }

		      // LiDAR — scene reconstruction (iPhone 12 Pro+)
		      void EnableSceneReconstruction() {
		          var sessionSubsystem = (ARKitSessionSubsystem)
		              ARSession.subsystem;
		          if (sessionSubsystem.coachingOverlaySupported) {
		              sessionSubsystem.requestedCoachingGoal =
		                  ARCoachingGoal.HorizontalPlane;
		          }
		      }
		  }
		  ```
	-
	- ## ARKit in Swift (Native)
	  collapsed:: true
		- ```swift
		  import ARKit
		  import RealityKit

		  class ARViewController: UIViewController, ARSessionDelegate {

		      @IBOutlet var arView: ARView!

		      override func viewDidLoad() {
		          super.viewDidLoad()

		          // Configure AR session
		          let config = ARWorldTrackingConfiguration()
		          config.planeDetection = [.horizontal, .vertical]
		          config.environmentTexturing = .automatic

		          // Enable LiDAR scene reconstruction (Pro devices)
		          if ARWorldTrackingConfiguration.supportsSceneReconstruction(.mesh) {
		              config.sceneReconstruction = .mesh
		          }

		          arView.session.run(config)
		          arView.session.delegate = self

		          // Add tap gesture for placement
		          let tap = UITapGestureRecognizer(target: self,
		              action: #selector(handleTap))
		          arView.addGestureRecognizer(tap)
		      }

		      @objc func handleTap(_ gesture: UITapGestureRecognizer) {
		          let location = gesture.location(in: arView)

		          // Raycast against detected planes
		          let results = arView.raycast(from: location,
		              allowing: .estimatedPlane, alignment: .horizontal)

		          if let result = results.first {
		              // Place 3D model at tap location
		              let anchor = AnchorEntity(world: result.worldTransform)
		              let box = ModelEntity(mesh: .generateBox(size: 0.1),
		                  materials: [SimpleMaterial(color: .blue, isMetallic: true)])
		              anchor.addChild(box)
		              arView.scene.addAnchor(anchor)
		          }
		      }
		  }
		  ```

- # VR Interaction Design
  collapsed:: true
	- > [!info] VR UX is Different
	  > VR interaction design is fundamentally different from flat-screen design.
	  > Players are **inside** the experience. Every design decision affects comfort, immersion, and presence.
	-
	- ## Locomotion Systems
	  collapsed:: true
		- ```mermaid
		  graph TD
		      subgraph Comfort["😌 High Comfort"]
		          TP["Teleportation\nPoint and teleport\nNo motion sickness\nBreaks immersion slightly"]
		          ARM["Arm Swinger\nSwing arms to walk\nModerate comfort\nMore natural"]
		      end
		      subgraph Medium["😐 Medium Comfort"]
		          SM["Smooth Locomotion\nThumbstick movement\nMost immersive\nCan cause sickness"]
		          DASH["Dash / Blink\nInstant short movement\nGood compromise"]
		      end
		      subgraph Physical["🏃 Physical Movement"]
		          RW["Room-Scale Walking\nPhysically walk in room\nBest comfort\nLimited by room size"]
		          TREAD["Treadmill\nOmni-directional treadmill\nBest immersion\nExpensive hardware"]
		      end
		  ```
		- | Locomotion | Comfort | Immersion | Best For |
		  |-----------|---------|-----------|---------|
		  | Teleportation | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Casual, accessibility |
		  | Smooth locomotion | ⭐⭐ | ⭐⭐⭐⭐⭐ | Action games, experienced users |
		  | Arm swinger | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Adventure, exploration |
		  | Room-scale | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Puzzle, horror, social |
		  | Dash/blink | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Action, platformer |
		- > [!tip] Always offer teleportation as an option
		  > Even if your game uses smooth locomotion, always provide teleportation for players prone to motion sickness.
	-
	- ## Comfort & Motion Sickness Prevention
	  collapsed:: true
		- | Cause | Prevention |
		  |-------|-----------|
		  | Smooth locomotion | Vignette/tunnel vision during movement |
		  | Low frame rate | Maintain 90 FPS minimum — never drop below 72 |
		  | Latency | Keep motion-to-photon latency < 20ms |
		  | Artificial head bob | Never add camera bob — only real head movement |
		  | Acceleration | Instant velocity changes — no gradual acceleration |
		  | Conflicting motion | Don't move camera independently of player input |
		  | Small FOV | Don't artificially restrict FOV |
		- > [!warning] Motion Sickness Rules
		  > - **Never** move the camera without player input
		  > - **Never** add camera shake or bob
		  > - **Always** maintain target frame rate — frame drops cause immediate sickness
		  > - **Always** provide comfort options (vignette, teleport, snap turning)
	-
	- ## VR UI Design
	  collapsed:: true
		- | UI Type | Description | Use Case |
		  |---------|-------------|---------|
		  | World-space UI | Panels floating in 3D world | Menus, inventory, HUD |
		  | Diegetic UI | UI on in-game objects (watch, tablet) | Immersive games |
		  | Gaze-based | Look at button to activate | Accessibility, no controller |
		  | Hand-attached | UI follows controller/hand | Quick access menus |
		  | Laser pointer | Ray from controller selects UI | Standard VR interaction |
		- ```
		  VR UI Distance Guidelines:
		    Too close  < 0.5m  — eye strain, hard to focus
		    Comfortable: 1–3m  — ideal reading distance
		    Far        > 5m    — hard to read small text
		    Sky/world  > 10m   — environmental elements only

		  Minimum button size: 5cm × 5cm in world space
		  Minimum text size: 14pt at 1m distance
		  ```
	-
	- ## Hand Tracking Interaction
	  collapsed:: true
		- ```mermaid
		  graph TD
		      subgraph Gestures["✋ Hand Gestures"]
		          Pinch["Pinch\nIndex + thumb\nSelect, grab"]
		          Point["Point\nIndex extended\nAim, indicate"]
		          Grab["Grab\nAll fingers closed\nHold objects"]
		          Open["Open palm\nAll fingers extended\nMenu, stop"]
		      end
		      subgraph Direct["🤏 Direct Manipulation"]
		          Touch["Touch\nFinger touches object\nPress buttons"]
		          Poke["Poke\nFingertip interaction\nKeyboard, piano"]
		          TwoHand["Two-handed\nScale, rotate objects\nManipulation"]
		      end
		  ```

- # VR Rendering & Performance
  collapsed:: true
	- > [!warning] VR Performance is Critical
	  > Dropping below target frame rate in VR causes **immediate motion sickness**.
	  > VR requires rendering **two eyes** at high resolution and high frame rate simultaneously.
	  > Performance budget is roughly **half** of what you'd have for a flat-screen game.
	-
	- ## VR Rendering Pipeline
	  collapsed:: true
		- ```mermaid
		  graph LR
		      subgraph Stereo["👁️ Stereo Rendering"]
		          L["Left Eye\nRender"] 
		          R["Right Eye\nRender"]
		      end
		      subgraph Techniques["Rendering Techniques"]
		          MR["Multi-View Rendering\nRender both eyes\nin one pass (GPU)"]
		          SR["Single Pass Instanced\nInstanced draw calls\nfor both eyes"]
		      end
		      subgraph Reprojection["🔄 Reprojection"]
		          ATW["Asynchronous TimeWarp\nReproject last frame\nif new frame late"]
		          ASW["Asynchronous SpaceWarp\nSynthesize frames\nat half rate"]
		      end
		      Stereo --> Techniques
		      Techniques --> Reprojection
		  ```
	-
	- ## Foveated Rendering
	  collapsed:: true
		- > [!info] Foveated Rendering
		  > The human eye only sees sharply in the center (fovea). Peripheral vision is blurry.
		  > Foveated rendering renders the center at full resolution and the periphery at lower resolution — saving 30–50% GPU cost.
		- | Type | Description | Hardware Required |
		  |------|-------------|-----------------|
		  | Fixed Foveated | Always render center at full res | Any VR headset |
		  | Eye-tracked Foveated | Follow gaze direction | Eye tracking (Quest Pro, PSVR2) |
		  | Variable Rate Shading | GPU-level resolution control | Modern GPUs |
		- ```csharp
		  // Unity — Fixed Foveated Rendering (Meta Quest)
		  using Unity.XR.Oculus;

		  void Start() {
		      // Enable fixed foveated rendering
		      OculusSettings.fixedFoveatedRenderingLevel =
		          OculusSettings.FixedFoveatedRenderingLevel.High;
		      OculusSettings.useDynamicFixedFoveatedRendering = true;
		  }
		  ```
	-
	- ## VR Performance Targets
	  collapsed:: true
		- | Platform | Target FPS | Frame Budget | Resolution/Eye |
		  |----------|-----------|-------------|---------------|
		  | Meta Quest 2 | 72–90 Hz | 11–14ms | 1832×1920 |
		  | Meta Quest 3 | 90–120 Hz | 8–11ms | 2064×2208 |
		  | PC VR (SteamVR) | 90–144 Hz | 7–11ms | Varies |
		  | PSVR2 | 90–120 Hz | 8–11ms | 2000×2040 |
		  | Apple Vision Pro | 100 Hz | 10ms | 3660×3142 |
	-
	- ## VR Optimization Checklist
	  collapsed:: true
		- > [!tip] VR Optimization Priority List
		  > - ✅ Single Pass Instanced rendering (renders both eyes in one pass)
		  > - ✅ Fixed Foveated Rendering enabled
		  > - ✅ Baked lighting — no real-time shadows on standalone
		  > - ✅ Texture compression (ASTC for Quest)
		  > - ✅ Draw call batching and GPU instancing
		  > - ✅ Occlusion culling
		  > - ✅ LOD for distant objects
		  > - ✅ No post-processing on standalone (bloom, SSAO too expensive)
		  > - ✅ Reprojection as safety net (ATW/ASW)
		  > - ✅ Profile with OVR Metrics Tool (Quest) or SteamVR Frame Timing
- # Engine VR Setup
  collapsed:: true
	- ## Unity XR Setup
	  collapsed:: true
		- ```
		  Unity XR Setup Steps:
		  1. Window → Package Manager → Install:
		     - XR Plugin Management
		     - OpenXR Plugin
		     - XR Interaction Toolkit
		     - AR Foundation (for AR)
		     - Meta XR SDK (for Quest features)

		  2. Edit → Project Settings → XR Plug-in Management:
		     - Android: Enable OpenXR
		     - iOS: Enable ARKit
		     - PC: Enable OpenXR

		  3. OpenXR Feature Groups:
		     - Enable: Meta Quest Support
		     - Enable: Hand Tracking Subsystem
		     - Enable: Eye Gaze Interaction

		  4. Scene Setup:
		     - Add XR Origin (Camera Rig)
		     - Add XR Interaction Manager
		     - Add Left/Right Controller objects
		     - Configure Input Action Assets
		  ```
	-
	- ## Godot XR Setup
	  collapsed:: true
		- ```gdscript
		  # Godot 4 XR Setup
		  # 1. Install OpenXR plugin from Asset Library
		  # 2. Project Settings → XR → Enable OpenXR

		  extends Node3D

		  func _ready() -> void:
		      var xr_interface = XRServer.find_interface("OpenXR")
		      if xr_interface and xr_interface.initialize():
		          print("OpenXR initialized")
		          get_viewport().use_xr = true
		          DisplayServer.window_set_vsync_mode(
		              DisplayServer.VSYNC_DISABLED)
		      else:
		          push_error("OpenXR failed to initialize")

		  # Scene structure for VR:
		  # XROrigin3D (root)
		  #   ├── XRCamera3D (head)
		  #   ├── XRController3D (left hand)
		  #   │     └── MeshInstance3D (controller model)
		  #   └── XRController3D (right hand)
		  #         └── MeshInstance3D (controller model)
		  ```
	-
	- ## Unreal Engine VR Setup
	  collapsed:: true
		- ```
		  Unreal Engine VR Setup:
		  1. Edit → Plugins → Enable:
		     - OpenXR
		     - OpenXR Hand Tracking
		     - Meta XR (for Quest)

		  2. Project Settings → Engine → Input:
		     - Add VR motion controller bindings

		  3. Use VR Template as starting point:
		     - File → New Project → VR Template
		     - Includes: locomotion, grabbing, UI interaction

		  4. VR Pawn setup:
		     - VRPawn Blueprint
		     - Camera component (head)
		     - MotionControllerComponent (left/right)
		     - GrabComponent for interaction
		  ```

- # More Learn
	- ## Official Documentation
		- [OpenXR Specification — Khronos](https://registry.khronos.org/OpenXR/specs/1.0/html/xrspec.html) — Complete OpenXR spec.
		- [Unity XR Documentation](https://docs.unity3d.com/Manual/XR.html) — Unity XR setup and features.
		- [Unreal VR Documentation](https://docs.unrealengine.com/5.0/en-US/developing-for-xr-experiences-in-unreal-engine/) — Unreal XR development guide.
		- [Meta Quest Developer Docs](https://developer.oculus.com/documentation/) — Meta Quest SDK and features.
		- [ARCore Documentation](https://developers.google.com/ar) — Google ARCore developer guide.
		- [ARKit Documentation](https://developer.apple.com/augmented-reality/arkit/) — Apple ARKit developer guide.
		- [Godot XR Documentation](https://docs.godotengine.org/en/stable/tutorials/xr/index.html) — Godot OpenXR setup.
	-
	- ## Free Learning Resources
		- [GDC VR/AR Talks](https://gdcvault.com/free?keyword=vr) — Free GDC talks on VR/AR development.
		- [Valem Tutorials — Unity VR](https://www.youtube.com/@ValemTutorials) — Free Unity VR tutorials on YouTube.
		- [Dilmer Valecillos — Unity XR](https://www.youtube.com/@dilmerv) — Free Unity XR Interaction Toolkit tutorials.
		- [Meta Quest Developer Hub](https://developer.oculus.com/documentation/unity/unity-gs-overview/) — Free Meta Quest Unity guide.
	-
	- ## Tools
		- [OVR Metrics Tool](https://developer.oculus.com/documentation/unity/ts-ovr-metrics-tool/) — Free Quest performance profiler.
		- [SteamVR Frame Timing](https://store.steampowered.com/app/250820/SteamVR/) — Built into SteamVR, free.
		- [RenderDoc](https://renderdoc.org/) — Free GPU frame debugger, supports VR.
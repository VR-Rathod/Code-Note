---
seoTitle: Unreal Engine Reference – Beginner to Advanced C++ & Blueprint Guide
description: "Complete Unreal Engine 5 reference from beginner to super advanced — Blueprints, C++ gameplay, GAS, Nanite, Lumen, Chaos Physics, Mass Entity ECS, Niagara VFX, materials, networking, PCG, profiling, and engine module development."
keywords: "Unreal Engine, UE5, Blueprints, C++ gameplay, GAS, Gameplay Ability System, Nanite, Lumen, Chaos Physics, Mass Entity, ECS, Niagara VFX, materials, HLSL, networking, replication, PCG, procedural generation, World Partition, MetaHuman, Control Rig, Motion Matching, Sequencer, profiling, optimization, engine modules, plugin development, unreal engine notes, unreal engine guide, ue5 cheatsheet, unreal reference, VR-Rathod, Code-Note, code note vr, vr book"
treeTitle: Game Development - Engines - Unreal Engine
---

- # History
- **How**: Developed by **Epic Games**, first released in **1998** with the game *Unreal*. UE4 (2014) brought it to modern PBR/physically-based era. UE5 (2022) introduced Nanite and Lumen.
- **Who**: Founded by **Tim Sweeney**. Epic Games continues active development.
- **Why**: To push real-time graphics to cinematic quality — used in AAA games, films, archviz, automotive, and XR.
- # Introduction
	- Unreal Engine 5 is the industry-leading real-time 3D engine. It uses **C++** for core gameplay and **Blueprints** (visual scripting) for rapid prototyping. UE5 features Nanite (virtualized geometry), Lumen (dynamic GI), and a full suite of tools for games, film, and simulation.
	-
	- ## Advantages
		- Nanite — render billions of polygons with no LOD setup.
		- Lumen — fully dynamic global illumination and reflections.
		- Blueprint visual scripting — no C++ needed to prototype.
		- World Partition — seamless open-world streaming.
		- MetaHuman — photorealistic human characters.
		- Free to use — 5% royalty only after $1M revenue.
		- Source code available on GitHub.
	-
	- ## Disadvantages
		- Very heavy — editor uses 8–16GB RAM, needs a powerful GPU.
		- Steep learning curve — massive feature set.
		- Compile times for C++ can be long.
		- Overkill for simple 2D or small indie games.
- # Editor & Project Setup
  collapsed:: true
	- ## Editor Layout
	  collapsed:: true
		- ```
		  Viewport        — 3D scene view (perspective/orthographic)
		  Content Browser — All project assets (bottom panel)
		  Outliner        — Scene hierarchy (top right)
		  Details Panel   — Properties of selected actor (right)
		  Toolbar         — Play, Build, Source Control buttons (top)
		  Modes Panel     — Select, Landscape, Foliage, Mesh Paint modes
		  ```
	-
	- ## Viewport Navigation
	  collapsed:: true
		- ```
		  RMB + WASD       — Fly through scene
		  RMB + QE         — Move up/down
		  Alt + LMB        — Orbit around selection
		  Alt + RMB        — Zoom
		  F                — Focus on selected actor
		  G                — Toggle game view (hide editor gizmos)
		  Ctrl + Space     — Open Content Browser
		  ```
	-
	- ## Project Structure
	  collapsed:: true
		- ```
		  /Content/           All game assets (textures, meshes, blueprints, maps)
		  /Source/            C++ source files
		  /Config/            Project settings (.ini files)
		  /Plugins/           Engine and project plugins
		  /Saved/             Logs, screenshots, autosaves
		  /Intermediate/      Compiled binaries (auto-generated)
		  
		  Key files:
		  MyProject.uproject  — Project descriptor
		  MyProject.sln       — Visual Studio solution
		  ```
	-
	- ## Key Shortcuts
	  collapsed:: true
		- ```
		  Ctrl+S          Save current level
		  Ctrl+Z / Y      Undo / Redo
		  W / E / R       Translate / Rotate / Scale gizmo
		  Alt+drag        Duplicate actor
		  End             Snap actor to floor
		  P               Toggle Play-in-Editor (PIE)
		  Ctrl+P          Quick asset search (Content Browser)
		  Shift+F1        Release mouse during PIE
		  ```
- # Core Concepts — Actors & Components
  collapsed:: true
	- ## Actor
	  collapsed:: true
		- ```
		  Actor — the base class for everything placed in a level.
		  Every object in the world (character, light, camera, trigger) is an Actor.
		  
		  Lifecycle:
		    Constructor       → object created (CDO — Class Default Object)
		    BeginPlay()       → actor enters the game world
		    Tick(DeltaTime)   → called every frame
		    EndPlay()         → actor removed from world
		    Destroyed()       → actor fully destroyed
		  ```
	-
	- ## Components
	  collapsed:: true
		- ```
		  Components add functionality to Actors.
		  
		  Common Components:
		    UStaticMeshComponent      — renders a static 3D mesh
		    USkeletalMeshComponent    — renders an animated mesh with skeleton
		    UCapsuleComponent         — collision capsule (used for characters)
		    UBoxComponent             — box collision
		    USphereComponent          — sphere collision
		    UCharacterMovementComponent — handles character physics/movement
		    UCameraComponent          — camera view
		    USpringArmComponent       — camera boom (follows character)
		    UAudioComponent           — plays audio
		    UPointLightComponent      — point light
		    UParticleSystemComponent  — particle effects (Cascade)
		    UNiagaraComponent         — particle effects (Niagara, modern)
		    UWidgetComponent          — 3D UI widget in world space
		  ```
	-
	- ## Actor Hierarchy Example
	  collapsed:: true
		- ```
		  ACharacter (Actor)
		  ├── UCapsuleComponent       (root, collision)
		  ├── USkeletalMeshComponent  (visual mesh)
		  ├── USpringArmComponent     (camera boom)
		  │   └── UCameraComponent    (camera)
		  └── UCharacterMovementComponent (movement)
		  ```
- # Blueprints — Visual Scripting
  collapsed:: true
	- ## What are Blueprints?
	  collapsed:: true
		- ```
		  Blueprints are Unreal's node-based visual scripting system.
		  Every Blueprint is a class — it can extend any C++ class.
		  
		  Types:
		    Blueprint Class       — extends Actor, Character, etc. (most common)
		    Level Blueprint       — per-level scripting (triggers, cinematics)
		    Blueprint Interface   — define functions any Blueprint can implement
		    Blueprint Macro Library — reusable macro nodes
		    Blueprint Function Library — reusable static functions
		    Animation Blueprint   — controls skeletal animation state machine
		  ```
	-
	- ## Blueprint Basics
	  collapsed:: true
		- ```
		  Event Graph:
		    Event BeginPlay  → executes once when game starts
		    Event Tick       → executes every frame (has DeltaSeconds pin)
		    Event Hit        → called on collision
		    Event Overlap    → called on overlap begin/end
		  
		  Nodes:
		    Function call    — white exec pin (sequence)
		    Pure function     — no exec pin (math, getters)
		    Variable get/set  — blue (object ref), green (bool), red (float), etc.
		    Branch            — if/else
		    Sequence          — run multiple outputs in order
		    ForEach Loop      — iterate array
		    Cast To           — safe downcast (Cast To AMyCharacter)
		    Delay             — wait N seconds then continue
		  ```
	-
	- ## Blueprint Communication
	  collapsed:: true
		- ```
		  Direct Reference:
		    Get reference to actor → call function on it
		  
		  Cast To:
		    Cast To APlayerCharacter → access player-specific functions
		  
		  Event Dispatcher (like signals):
		    Define dispatcher → bind in other BP → call to broadcast
		  
		  Blueprint Interface:
		    Define interface function → implement in any BP
		    Call without knowing exact type (polymorphism)
		  
		  Game Instance:
		    Persistent data across levels (score, settings)
		  ```
	-
	- ## Blueprint vs C++
	  collapsed:: true
		- ```
		  Blueprints:
		    + Fast to prototype
		    + Visual, designer-friendly
		    + No compile step
		    - Slower execution than C++
		    - Hard to diff/merge in version control
		    - Gets messy at scale ("spaghetti blueprints")
		  
		  C++:
		    + Full performance
		    + Better for complex logic, algorithms
		    + Version control friendly
		    - Requires compile
		    - Steeper learning curve
		  
		  Best practice: Core systems in C++, expose to Blueprint for designers.
		  ```
- # C++ in Unreal Engine
  collapsed:: true
	- ## UObject & Macros
	  collapsed:: true
		- ```c++
		  // All Unreal classes use UCLASS, UPROPERTY, UFUNCTION macros
		  // These enable reflection, serialization, Blueprint exposure, GC
		  
		  UCLASS()
		  class MYGAME_API AMyActor : public AActor
		  {
		      GENERATED_BODY()
		  
		  public:
		      AMyActor();
		  
		      // Exposed to Blueprint and editor
		      UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Stats")
		      float Health = 100.f;
		  
		      UPROPERTY(VisibleAnywhere, BlueprintReadOnly)
		      UStaticMeshComponent* Mesh;
		  
		      // Callable from Blueprint
		      UFUNCTION(BlueprintCallable, Category = "Combat")
		      void TakeDamage(float Amount);
		  
		      // Implementable in Blueprint
		      UFUNCTION(BlueprintImplementableEvent)
		      void OnDeath();
		  
		      // C++ default, overridable in Blueprint
		      UFUNCTION(BlueprintNativeEvent)
		      void OnHit();
		      virtual void OnHit_Implementation();
		  
		  protected:
		      virtual void BeginPlay() override;
		      virtual void Tick(float DeltaTime) override;
		  };
		  ```
	-
	- ## UPROPERTY Specifiers
	  collapsed:: true
		- ```c++
		  UPROPERTY(EditAnywhere)          // editable in editor (instance + CDO)
		  UPROPERTY(EditDefaultsOnly)      // editable only in Blueprint defaults
		  UPROPERTY(EditInstanceOnly)      // editable only on placed instances
		  UPROPERTY(VisibleAnywhere)       // visible but not editable
		  UPROPERTY(BlueprintReadWrite)    // read + write from Blueprint
		  UPROPERTY(BlueprintReadOnly)     // read only from Blueprint
		  UPROPERTY(Replicated)            // synced over network
		  UPROPERTY(ReplicatedUsing=OnRep_Health) // replicated with callback
		  UPROPERTY(Transient)             // not saved to disk
		  UPROPERTY(SaveGame)              // included in save game serialization
		  UPROPERTY(Category = "Combat")  // organizes in Details panel
		  UPROPERTY(meta = (ClampMin = "0", ClampMax = "100"))
		  ```
	-
	- ## UFUNCTION Specifiers
	  collapsed:: true
		- ```c++
		  UFUNCTION(BlueprintCallable)         // callable from Blueprint
		  UFUNCTION(BlueprintPure)             // no exec pin, no side effects
		  UFUNCTION(BlueprintImplementableEvent) // implemented in Blueprint
		  UFUNCTION(BlueprintNativeEvent)      // C++ default + Blueprint override
		  UFUNCTION(Server, Reliable)          // runs on server (RPC)
		  UFUNCTION(Client, Reliable)          // runs on owning client (RPC)
		  UFUNCTION(NetMulticast, Unreliable)  // runs on all clients
		  UFUNCTION(Exec)                      // console command
		  UFUNCTION(CallInEditor)              // button in editor Details panel
		  ```
	-
	- ## Constructor & Component Setup
	  collapsed:: true
		- ```c++
		  AMyActor::AMyActor()
		  {
		      PrimaryActorTick.bCanEverTick = true;
		  
		      // Create components in constructor
		      Mesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Mesh"));
		      RootComponent = Mesh;
		  
		      SpringArm = CreateDefaultSubobject<USpringArmComponent>(TEXT("SpringArm"));
		      SpringArm->SetupAttachment(RootComponent);
		      SpringArm->TargetArmLength = 400.f;
		      SpringArm->bUsePawnControlRotation = true;
		  
		      Camera = CreateDefaultSubobject<UCameraComponent>(TEXT("Camera"));
		      Camera->SetupAttachment(SpringArm, USpringArmComponent::SocketName);
		  }
		  
		  void AMyActor::BeginPlay()
		  {
		      Super::BeginPlay();
		      UE_LOG(LogTemp, Warning, TEXT("Actor started: %s"), *GetName());
		  }
		  
		  void AMyActor::Tick(float DeltaTime)
		  {
		      Super::Tick(DeltaTime);
		      // Per-frame logic here
		  }
		  ```
- # Gameplay Framework
  collapsed:: true
	- ## Core Classes
	  collapsed:: true
		- ```
		  APawn           — Any actor that can be possessed/controlled
		  ACharacter      — Pawn with mesh, capsule, movement component
		  APlayerController — Translates player input → Pawn actions
		  AAIController   — Controls AI Pawns
		  AGameModeBase   — Rules of the game (win/lose, spawn, teams)
		  AGameStateBase  — Replicated game state (score, timer)
		  APlayerState    — Per-player replicated state (name, score)
		  UGameInstance   — Persistent across levels (settings, session)
		  AHUD            — Heads-up display (legacy, prefer UMG)
		  APlayerCameraManager — Controls camera behavior
		  ```
	-
	- ## Character Movement
	  collapsed:: true
		- ```c++
		  // ACharacter has UCharacterMovementComponent built in
		  
		  void AMyCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
		  {
		      Super::SetupPlayerInputComponent(PlayerInputComponent);
		  
		      // Enhanced Input (UE5 standard)
		      if (auto* EIC = Cast<UEnhancedInputComponent>(PlayerInputComponent))
		      {
		          EIC->BindAction(MoveAction, ETriggerEvent::Triggered, this, &AMyCharacter::Move);
		          EIC->BindAction(JumpAction, ETriggerEvent::Started,   this, &AMyCharacter::Jump);
		          EIC->BindAction(LookAction, ETriggerEvent::Triggered, this, &AMyCharacter::Look);
		      }
		  }
		  
		  void AMyCharacter::Move(const FInputActionValue& Value)
		  {
		      FVector2D Input = Value.Get<FVector2D>();
		      if (Controller)
		      {
		          const FRotator Rot = Controller->GetControlRotation();
		          const FRotator YawRot(0, Rot.Yaw, 0);
		          AddMovementInput(FRotationMatrix(YawRot).GetUnitAxis(EAxis::X), Input.Y);
		          AddMovementInput(FRotationMatrix(YawRot).GetUnitAxis(EAxis::Y), Input.X);
		      }
		  }
		  
		  void AMyCharacter::Look(const FInputActionValue& Value)
		  {
		      FVector2D Input = Value.Get<FVector2D>();
		      AddControllerYawInput(Input.X);
		      AddControllerPitchInput(Input.Y);
		  }
		  ```
	-
	- ## Enhanced Input System (UE5)
	  collapsed:: true
		- ```
		  Setup:
		  1. Create InputAction asset (IA_Move, IA_Jump, IA_Look)
		  2. Create InputMappingContext asset (IMC_Default)
		  3. Map keys to actions in IMC
		  4. Add IMC to PlayerController in BeginPlay
		  ```
		- ```c++
		  void AMyPlayerController::BeginPlay()
		  {
		      Super::BeginPlay();
		      if (auto* EIS = GetLocalPlayer()->GetSubsystem<UEnhancedInputLocalPlayerSubsystem>())
		      {
		          EIS->AddMappingContext(DefaultMappingContext, 0);
		      }
		  }
		  ```
- # Unreal C++ — Common Patterns
  collapsed:: true
	- ## Logging
	  collapsed:: true
		- ```c++
		  // UE_LOG(Category, Verbosity, Format, ...)
		  UE_LOG(LogTemp, Log,     TEXT("Info message"));
		  UE_LOG(LogTemp, Warning, TEXT("Player health: %f"), Health);
		  UE_LOG(LogTemp, Error,   TEXT("Null pointer: %s"), *GetName());
		  
		  // On-screen debug message
		  GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Red, TEXT("Hit!"));
		  GEngine->AddOnScreenDebugMessage(-1, 3.f, FColor::Green,
		      FString::Printf(TEXT("Health: %.1f"), Health));
		  ```
	-
	- ## Timers
	  collapsed:: true
		- ```c++
		  FTimerHandle TimerHandle;
		  
		  // Call function after delay
		  GetWorldTimerManager().SetTimer(
		      TimerHandle,
		      this,
		      &AMyActor::OnTimerFired,
		      2.0f,   // delay in seconds
		      false   // loop?
		  );
		  
		  // Looping timer
		  GetWorldTimerManager().SetTimer(TimerHandle, this,
		      &AMyActor::SpawnEnemy, 3.0f, true);
		  
		  // Cancel timer
		  GetWorldTimerManager().ClearTimer(TimerHandle);
		  
		  // Check remaining time
		  float Remaining = GetWorldTimerManager().GetTimerRemaining(TimerHandle);
		  ```
	-
	- ## Delegates & Events
	  collapsed:: true
		- ```c++
		  // Declare delegate type
		  DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnHealthChanged, float, NewHealth);
		  
		  // In class:
		  UPROPERTY(BlueprintAssignable)
		  FOnHealthChanged OnHealthChanged;
		  
		  // Broadcast (fire event)
		  OnHealthChanged.Broadcast(Health);
		  
		  // Bind in C++
		  OnHealthChanged.AddDynamic(this, &AMyHUD::UpdateHealthBar);
		  
		  // Bind in Blueprint: assign to OnHealthChanged event
		  
		  // Single-cast delegate (not multicast)
		  DECLARE_DELEGATE_OneParam(FOnDeath, AActor*);
		  FOnDeath OnDeath;
		  OnDeath.BindUObject(this, &AMyActor::HandleDeath);
		  OnDeath.ExecuteIfBound(this);
		  ```
	-
	- ## Casting & Type Checking
	  collapsed:: true
		- ```c++
		  // Cast (returns nullptr if wrong type)
		  AMyCharacter* Player = Cast<AMyCharacter>(OtherActor);
		  if (Player)
		  {
		      Player->TakeDamage(25.f);
		  }
		  
		  // IsA — type check without cast
		  if (OtherActor->IsA<AEnemy>())
		  {
		      // it's an enemy
		  }
		  
		  // GetClass
		  UE_LOG(LogTemp, Log, TEXT("Class: %s"), *OtherActor->GetClass()->GetName());
		  ```
	-
	- ## Spawning Actors
	  collapsed:: true
		- ```c++
		  // Spawn from class reference
		  UPROPERTY(EditDefaultsOnly)
		  TSubclassOf<AActor> BulletClass;
		  
		  void AWeapon::Fire()
		  {
		      FVector  SpawnLoc = GetActorLocation() + GetActorForwardVector() * 100.f;
		      FRotator SpawnRot = GetActorRotation();
		  
		      FActorSpawnParameters Params;
		      Params.Owner   = this;
		      Params.Instigator = GetInstigator();
		  
		      AActor* Bullet = GetWorld()->SpawnActor<AActor>(BulletClass, SpawnLoc, SpawnRot, Params);
		  }
		  
		  // Deferred spawn (set properties before BeginPlay)
		  AMyActor* Actor = GetWorld()->SpawnActorDeferred<AMyActor>(
		      AMyActor::StaticClass(), Transform);
		  Actor->Health = 200.f;
		  UGameplayStatics::FinishSpawningActor(Actor, Transform);
		  ```
- # Physics & Collision
  collapsed:: true
	- ## Collision Channels & Responses
	  collapsed:: true
		- ```
		  Object Channels (what the object IS):
		    WorldStatic, WorldDynamic, Pawn, PhysicsBody, Vehicle, Destructible
		    + Custom channels (e.g., Bullet, Interactable)
		  
		  Trace Channels (what a raycast IS):
		    Visibility, Camera + Custom
		  
		  Responses per channel:
		    Ignore  — no interaction
		    Overlap — trigger overlap events, no physics block
		    Block   — full physics collision
		  ```
	-
	- ## Line Trace (Raycast)
	  collapsed:: true
		- ```c++
		  void AMyCharacter::ShootRay()
		  {
		      FVector Start = GetActorLocation();
		      FVector End   = Start + GetActorForwardVector() * 5000.f;
		  
		      FHitResult Hit;
		      FCollisionQueryParams Params;
		      Params.AddIgnoredActor(this);
		  
		      bool bHit = GetWorld()->LineTraceSingleByChannel(
		          Hit, Start, End, ECC_Visibility, Params);
		  
		      if (bHit)
		      {
		          UE_LOG(LogTemp, Warning, TEXT("Hit: %s"), *Hit.GetActor()->GetName());
		          DrawDebugPoint(GetWorld(), Hit.ImpactPoint, 10.f, FColor::Red, false, 2.f);
		      }
		  
		      // Debug line
		      DrawDebugLine(GetWorld(), Start, End, FColor::Green, false, 1.f, 0, 1.f);
		  }
		  ```
	-
	- ## Overlap Events
	  collapsed:: true
		- ```c++
		  // In constructor — enable overlap
		  TriggerBox->SetGenerateOverlapEvents(true);
		  
		  // Bind in BeginPlay
		  TriggerBox->OnComponentBeginOverlap.AddDynamic(this, &AMyTrigger::OnOverlapBegin);
		  TriggerBox->OnComponentEndOverlap.AddDynamic(this,   &AMyTrigger::OnOverlapEnd);
		  
		  void AMyTrigger::OnOverlapBegin(UPrimitiveComponent* OverlappedComp,
		      AActor* OtherActor, UPrimitiveComponent* OtherComp,
		      int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
		  {
		      if (AMyCharacter* Player = Cast<AMyCharacter>(OtherActor))
		      {
		          Player->EnterZone(this);
		      }
		  }
		  ```
	-
	- ## Physics Bodies
	  collapsed:: true
		- ```c++
		  // Enable physics simulation on mesh
		  Mesh->SetSimulatePhysics(true);
		  Mesh->SetEnableGravity(true);
		  
		  // Apply impulse
		  Mesh->AddImpulse(FVector(0, 0, 1000.f), NAME_None, true); // true = velocity change
		  
		  // Apply force
		  Mesh->AddForce(FVector(500.f, 0, 0));
		  
		  // Set linear velocity
		  Mesh->SetPhysicsLinearVelocity(FVector(0, 0, 500.f));
		  
		  // Set mass
		  Mesh->SetMassOverrideInKg(NAME_None, 50.f);
		  ```
- # Animation System
  collapsed:: true
	- ## Animation Blueprint
	  collapsed:: true
		- ```
		  Animation Blueprint (ABP) controls skeletal mesh animation.
		  
		  Two graphs:
		    Event Graph  — logic (update variables: speed, is_jumping, etc.)
		    Anim Graph   — state machine / blend tree (outputs final pose)
		  
		  State Machine:
		    States: Idle, Walk, Run, Jump, Fall, Land
		    Transitions: conditions between states (Speed > 10 → Walk)
		  
		  Blend Spaces:
		    1D BlendSpace — blend animations by one axis (speed: idle→walk→run)
		    2D BlendSpace — blend by two axes (speed + direction → strafe)
		  ```
	-
	- ## Anim Notifies
	  collapsed:: true
		- ```
		  Anim Notify — event fired at a specific frame in an animation
		  
		  Uses:
		    - Play footstep sound at foot-down frame
		    - Spawn projectile at attack frame
		    - Enable/disable collision during attack
		  
		  In C++:
		  ```
		- ```c++
		  // Override in AnimInstance or listen via delegate
		  UFUNCTION()
		  void OnFootstep(USkeletalMeshComponent* MeshComp,
		                  UAnimSequenceBase* Animation,
		                  FName NotifyName);
		  ```
	-
	- ## Inverse Kinematics (IK)
	  collapsed:: true
		- ```
		  IK solves joint positions to reach a target.
		  
		  Common uses:
		    Foot IK    — feet conform to uneven terrain
		    Hand IK    — hands grip weapons/objects correctly
		    Look At IK — head/eyes track a target
		  
		  UE5 IK Rig + IK Retargeter:
		    - IK Rig: define IK chains and goals
		    - IK Retargeter: retarget animations between different skeletons
		  
		  Control Rig:
		    - Procedural animation system
		    - Full-body IK, custom rigs, runtime deformation
		  ```
	-
	- ## Montages
	  collapsed:: true
		- ```c++
		  // Animation Montage — play one-shot animations (attack, reload, death)
		  // Supports sections, blending, notifies
		  
		  UPROPERTY(EditDefaultsOnly)
		  UAnimMontage* AttackMontage;
		  
		  void AMyCharacter::Attack()
		  {
		      if (AttackMontage)
		      {
		          UAnimInstance* AnimInst = GetMesh()->GetAnimInstance();
		          AnimInst->Montage_Play(AttackMontage, 1.0f);
		  
		          // Jump to section
		          AnimInst->Montage_JumpToSection(FName("HeavyAttack"), AttackMontage);
		      }
		  }
		  ```
- # UI — Unreal Motion Graphics (UMG)
  collapsed:: true
	- ## Widget Blueprint
	  collapsed:: true
		- ```
		  UMG is Unreal's UI system — drag-and-drop widget designer.
		  
		  Common Widgets:
		    Text Block      — display text
		    Button          — clickable button
		    Image           — display texture/material
		    Progress Bar    — health/loading bar
		    Slider          — value slider
		    Check Box       — toggle
		    Editable Text   — text input
		    Canvas Panel    — free-position layout
		    Vertical/Horizontal Box — stacked layout
		    Grid Panel      — grid layout
		    Scroll Box      — scrollable container
		    Overlay         — stack widgets on top of each other
		  ```
	-
	- ## Creating & Showing Widgets
	  collapsed:: true
		- ```c++
		  UPROPERTY(EditDefaultsOnly)
		  TSubclassOf<UUserWidget> HUDWidgetClass;
		  
		  UUserWidget* HUDWidget;
		  
		  void AMyPlayerController::BeginPlay()
		  {
		      Super::BeginPlay();
		  
		      HUDWidget = CreateWidget<UUserWidget>(this, HUDWidgetClass);
		      if (HUDWidget)
		      {
		          HUDWidget->AddToViewport();
		      }
		  }
		  
		  // Remove widget
		  HUDWidget->RemoveFromParent();
		  
		  // Show/hide
		  HUDWidget->SetVisibility(ESlateVisibility::Visible);
		  HUDWidget->SetVisibility(ESlateVisibility::Hidden);
		  HUDWidget->SetVisibility(ESlateVisibility::Collapsed);
		  ```
	-
	- ## Widget C++ Binding
	  collapsed:: true
		- ```c++
		  // In Widget Blueprint C++ class
		  UCLASS()
		  class UMyHUDWidget : public UUserWidget
		  {
		      GENERATED_BODY()
		  
		  public:
		      // Bind to widget in designer (must match widget name)
		      UPROPERTY(meta = (BindWidget))
		      UProgressBar* HealthBar;
		  
		      UPROPERTY(meta = (BindWidget))
		      UTextBlock* ScoreText;
		  
		      // Optional bind (won't error if missing)
		      UPROPERTY(meta = (BindWidgetOptional))
		      UButton* PauseButton;
		  
		      void UpdateHealth(float Percent)
		      {
		          HealthBar->SetPercent(Percent);
		      }
		  
		      void UpdateScore(int32 Score)
		      {
		          ScoreText->SetText(FText::AsNumber(Score));
		      }
		  };
		  ```
- # Audio System
  collapsed:: true
	- ## Sound Assets
	  collapsed:: true
		- ```
		  Sound Wave        — raw audio file (.wav, .ogg)
		  Sound Cue         — node-based audio graph (randomize, loop, mix)
		  Sound Attenuation — defines 3D falloff, spatialization settings
		  Sound Class       — volume group (Master, Music, SFX, Voice)
		  Sound Mix         — adjust class volumes (e.g., duck music during dialogue)
		  MetaSound         — UE5 procedural audio system (replaces Sound Cue)
		  ```
	-
	- ## Playing Audio
	  collapsed:: true
		- ```c++
		  #include "Kismet/GameplayStatics.h"
		  
		  // Play at location (fire and forget)
		  UGameplayStatics::PlaySoundAtLocation(this, JumpSound, GetActorLocation());
		  
		  // Play 2D (non-spatial, UI/music)
		  UGameplayStatics::PlaySound2D(this, MenuMusic);
		  
		  // Spawn persistent audio component
		  UAudioComponent* AudioComp = UGameplayStatics::SpawnSoundAtLocation(
		      this, FootstepSound, GetActorLocation());
		  AudioComp->SetVolumeMultiplier(0.8f);
		  AudioComp->SetPitchMultiplier(FMath::RandRange(0.9f, 1.1f));
		  
		  // Stop
		  AudioComp->Stop();
		  
		  // Attached audio component (follows actor)
		  UAudioComponent* Comp = UGameplayStatics::SpawnSoundAttached(
		      EngineSound, RootComponent);
		  ```
- # AI System
  collapsed:: true
	- ## Behavior Tree + Blackboard
	  collapsed:: true
		- ```
		  Blackboard — shared data store for AI (key-value pairs)
		    Keys: TargetActor, PatrolPoint, IsAlerted, Health
		  
		  Behavior Tree — hierarchical task graph
		    Selector  — try children until one succeeds
		    Sequence  — run children in order until one fails
		    Task      — leaf node (Move To, Wait, Play Animation, custom)
		    Decorator — condition gate (Is Target Visible?, Has Ammo?)
		    Service   — runs in background (update target location every 0.5s)
		  ```
	-
	- ## AI Controller Setup
	  collapsed:: true
		- ```c++
		  UCLASS()
		  class AMyAIController : public AAIController
		  {
		      GENERATED_BODY()
		  
		      UPROPERTY(EditDefaultsOnly)
		      UBehaviorTree* BehaviorTree;
		  
		      UPROPERTY(EditDefaultsOnly)
		      UBlackboardData* BlackboardData;
		  
		  public:
		      virtual void OnPossess(APawn* InPawn) override
		      {
		          Super::OnPossess(InPawn);
		          if (UseBlackboard(BlackboardData, Blackboard))
		          {
		              RunBehaviorTree(BehaviorTree);
		          }
		      }
		  };
		  
		  // Set blackboard value
		  GetBlackboardComponent()->SetValueAsObject(TEXT("TargetActor"), Player);
		  GetBlackboardComponent()->SetValueAsBool(TEXT("IsAlerted"), true);
		  GetBlackboardComponent()->SetValueAsVector(TEXT("LastKnownPos"), PlayerLoc);
		  ```
	-
	- ## Custom BT Task
	  collapsed:: true
		- ```c++
		  UCLASS()
		  class UBTTask_AttackPlayer : public UBTTaskNode
		  {
		      GENERATED_BODY()
		  
		      virtual EBTNodeResult::Type ExecuteTask(
		          UBehaviorTreeComponent& OwnerComp, uint8* NodeMemory) override
		      {
		          AAIController* Controller = OwnerComp.GetAIOwner();
		          AMyEnemy* Enemy = Cast<AMyEnemy>(Controller->GetPawn());
		  
		          if (!Enemy) return EBTNodeResult::Failed;
		  
		          Enemy->PerformAttack();
		          return EBTNodeResult::Succeeded;
		      }
		  };
		  ```
	-
	- ## Navigation & Pathfinding
	  collapsed:: true
		- ```c++
		  // Move to actor
		  MoveToActor(TargetActor, 150.f); // 150 = acceptance radius
		  
		  // Move to location
		  MoveToLocation(TargetLocation);
		  
		  // Check if path exists
		  UNavigationSystemV1* NavSys = UNavigationSystemV1::GetCurrent(GetWorld());
		  FNavLocation Result;
		  bool bFound = NavSys->GetRandomReachablePointInRadius(
		      GetActorLocation(), 1000.f, Result);
		  
		  // NavMesh setup: place NavMeshBoundsVolume in level, press P to visualize
		  ```
- # Multiplayer & Networking
  collapsed:: true
	- ## Replication Basics
	  collapsed:: true
		- ```
		  Unreal uses a Client-Server model.
		  Server is authoritative — owns game state.
		  Clients predict locally, server corrects.
		  
		  Enable replication on Actor:
		    bReplicates = true;              // replicate actor existence
		    SetReplicateMovement(true);      // replicate transform
		  
		  Replicate a variable:
		    UPROPERTY(Replicated)
		    float Health;
		  
		    // Must implement GetLifetimeReplicatedProps:
		    void AMyActor::GetLifetimeReplicatedProps(
		        TArray<FLifetimeProperty>& OutLifetimeProps) const
		    {
		        Super::GetLifetimeReplicatedProps(OutLifetimeProps);
		        DOREPLIFETIME(AMyActor, Health);
		        DOREPLIFETIME_CONDITION(AMyActor, Ammo, COND_OwnerOnly);
		    }
		  ```
	-
	- ## RepNotify
	  collapsed:: true
		- ```c++
		  // Called on clients when variable changes
		  UPROPERTY(ReplicatedUsing = OnRep_Health)
		  float Health;
		  
		  UFUNCTION()
		  void OnRep_Health()
		  {
		      // Update health bar UI
		      UpdateHealthBar(Health);
		  }
		  ```
	-
	- ## RPCs (Remote Procedure Calls)
	  collapsed:: true
		- ```c++
		  // Server RPC — client calls, runs on server
		  UFUNCTION(Server, Reliable, WithValidation)
		  void ServerFire(FVector Direction);
		  
		  void AMyCharacter::ServerFire_Implementation(FVector Direction)
		  {
		      // Authoritative fire logic
		      SpawnProjectile(Direction);
		  }
		  
		  bool AMyCharacter::ServerFire_Validate(FVector Direction)
		  {
		      return Direction.IsNormalized(); // anti-cheat validation
		  }
		  
		  // Multicast RPC — server calls, runs on all clients
		  UFUNCTION(NetMulticast, Unreliable)
		  void MulticastPlayEffect(FVector Location);
		  
		  void AMyCharacter::MulticastPlayEffect_Implementation(FVector Location)
		  {
		      UGameplayStatics::SpawnEmitterAtLocation(GetWorld(), HitEffect, Location);
		  }
		  
		  // Client RPC — server calls, runs on owning client only
		  UFUNCTION(Client, Reliable)
		  void ClientShowMessage(const FString& Message);
		  ```
	-
	- ## Network Roles
	  collapsed:: true
		- ```c++
		  // Check where code is running
		  HasAuthority()                    // true on server
		  IsLocallyControlled()             // true on owning client
		  GetLocalRole() == ROLE_Authority  // server
		  GetLocalRole() == ROLE_AutonomousProxy // owning client
		  GetLocalRole() == ROLE_SimulatedProxy  // other clients
		  
		  // Common pattern
		  if (HasAuthority())
		  {
		      // Server-only logic (damage, scoring, spawning)
		  }
		  ```
- # Rendering — UE5 Features
  collapsed:: true
	- ## Nanite (Virtualized Geometry)
	  collapsed:: true
		- ```
		  Nanite renders micro-polygon geometry — billions of triangles with no LOD setup.
		  
		  How it works:
		    - Meshes stored as hierarchical clusters
		    - GPU selects which clusters to render based on screen size
		    - Only pixels that matter are shaded
		    - Effectively unlimited polygon count
		  
		  Enable: Static Mesh → Details → Nanite → Enable Nanite Support
		  
		  Limitations:
		    - No deforming meshes (skeletal, cloth, particles)
		    - No translucency
		    - Requires DX12 / Vulkan
		  ```
	-
	- ## Lumen (Dynamic Global Illumination)
	  collapsed:: true
		- ```
		  Lumen provides fully dynamic GI and reflections — no baking required.
		  
		  How it works:
		    - Traces rays against Signed Distance Fields (SDF) of meshes
		    - Screen traces for near-field detail
		    - Hardware ray tracing optional for higher quality
		  
		  Enable: Project Settings → Rendering → Global Illumination → Lumen
		  
		  Quality modes:
		    Software Lumen — runs on any DX11+ GPU
		    Hardware Lumen — requires RTX/RDNA2, higher quality reflections
		  ```
	-
	- ## Virtual Shadow Maps (VSM)
	  collapsed:: true
		- ```
		  VSM replaces traditional shadow maps in UE5.
		  
		  Features:
		    - Very high resolution (16k virtual resolution)
		    - Only renders shadow pages that are visible
		    - Works with Nanite geometry
		    - Supports many dynamic lights efficiently
		  
		  Enable: Project Settings → Rendering → Shadows → Virtual Shadow Maps
		  ```
	-
	- ## Materials & Shaders
	  collapsed:: true
		- ```
		  Material Editor — node-based shader graph
		  
		  Key output pins:
		    Base Color    — albedo texture/color
		    Metallic      — 0 = dielectric, 1 = metal
		    Roughness     — 0 = mirror, 1 = diffuse
		    Normal        — normal map
		    Emissive      — self-illumination (drives bloom)
		    Opacity       — transparency (Blend Mode: Translucent)
		    Ambient Occlusion — baked AO texture
		  
		  Material Domains:
		    Surface       — standard 3D surface
		    Deferred Decal — projected onto surfaces
		    Light Function — modulate light shape
		    Post Process  — full-screen effect
		    UI            — for UMG widgets
		  
		  Material Instances:
		    Child of a Material — override parameters without recompile
		    Dynamic Material Instance (MID) — change params at runtime
		  ```
		- ```c++
		  // Create dynamic material instance at runtime
		  UMaterialInstanceDynamic* MID =
		      UMaterialInstanceDynamic::Create(BaseMaterial, this);
		  Mesh->SetMaterial(0, MID);
		  
		  MID->SetScalarParameterValue(TEXT("Roughness"), 0.3f);
		  MID->SetVectorParameterValue(TEXT("Color"), FLinearColor::Red);
		  MID->SetTextureParameterValue(TEXT("Albedo"), MyTexture);
		  ```
- # Niagara Particle System
  collapsed:: true
	- ## Overview
	  collapsed:: true
		- ```
		  Niagara is UE5's GPU particle system (replaces Cascade).
		  
		  Structure:
		    System     — top-level asset, contains emitters
		    Emitter    — defines particle behavior
		    Module     — reusable behavior block (spawn rate, velocity, color)
		  
		  Emitter update stages:
		    Emitter Spawn    — runs once when emitter starts
		    Emitter Update   — runs every frame
		    Particle Spawn   — runs when each particle is born
		    Particle Update  — runs every frame per particle
		    Render           — how particles are drawn (sprite, mesh, ribbon)
		  ```
	-
	- ## Controlling Niagara from C++
	  collapsed:: true
		- ```c++
		  #include "NiagaraFunctionLibrary.h"
		  #include "NiagaraComponent.h"
		  
		  UPROPERTY(EditDefaultsOnly)
		  UNiagaraSystem* ExplosionEffect;
		  
		  // Spawn one-shot effect
		  UNiagaraFunctionLibrary::SpawnSystemAtLocation(
		      GetWorld(), ExplosionEffect, GetActorLocation());
		  
		  // Spawn attached (follows actor)
		  UNiagaraComponent* NiagaraComp =
		      UNiagaraFunctionLibrary::SpawnSystemAttached(
		          TrailEffect, RootComponent, NAME_None,
		          FVector::ZeroVector, FRotator::ZeroRotator,
		          EAttachLocation::KeepRelativeOffset, true);
		  
		  // Set parameter
		  NiagaraComp->SetVariableFloat(TEXT("SpawnRate"), 100.f);
		  NiagaraComp->SetVariableLinearColor(TEXT("Color"), FLinearColor::Red);
		  
		  // Stop
		  NiagaraComp->Deactivate();
		  ```
- # Save & Load System
  collapsed:: true
	- ## SaveGame
	  collapsed:: true
		- ```c++
		  // 1. Create SaveGame class
		  UCLASS()
		  class UMySaveGame : public USaveGame
		  {
		      GENERATED_BODY()
		  public:
		      UPROPERTY()
		      int32 Score = 0;
		  
		      UPROPERTY()
		      FVector PlayerPosition;
		  
		      UPROPERTY()
		      TArray<FString> UnlockedLevels;
		  };
		  
		  // 2. Save
		  void SaveGame()
		  {
		      UMySaveGame* SaveData = Cast<UMySaveGame>(
		          UGameplayStatics::CreateSaveGameObject(UMySaveGame::StaticClass()));
		  
		      SaveData->Score = CurrentScore;
		      SaveData->PlayerPosition = GetActorLocation();
		  
		      UGameplayStatics::SaveGameToSlot(SaveData, TEXT("Slot1"), 0);
		  }
		  
		  // 3. Load
		  void LoadGame()
		  {
		      if (UGameplayStatics::DoesSaveGameExist(TEXT("Slot1"), 0))
		      {
		          UMySaveGame* SaveData = Cast<UMySaveGame>(
		              UGameplayStatics::LoadGameFromSlot(TEXT("Slot1"), 0));
		  
		          CurrentScore = SaveData->Score;
		          SetActorLocation(SaveData->PlayerPosition);
		      }
		  }
		  ```
- # Gameplay Ability System (GAS)
  collapsed:: true
	- ## Overview
	  collapsed:: true
		- ```
		  GAS is Unreal's framework for complex ability systems.
		  Used in: Fortnite, Paragon, Lyra Starter Game.
		  
		  Core components:
		    AbilitySystemComponent (ASC) — added to Actor, manages everything
		    GameplayAbility (GA)         — defines an ability (fire, dash, heal)
		    GameplayEffect (GE)          — modifies attributes (damage, buff, debuff)
		    AttributeSet                 — defines stats (Health, Mana, Stamina)
		    GameplayTag                  — hierarchical labels (Status.Burning, Ability.Jump)
		    GameplayCue                  — cosmetic effects (particles, sounds) triggered by tags
		  ```
	-
	- ## AttributeSet
	  collapsed:: true
		- ```c++
		  UCLASS()
		  class UMyAttributeSet : public UAttributeSet
		  {
		      GENERATED_BODY()
		  public:
		      UPROPERTY(BlueprintReadOnly, ReplicatedUsing = OnRep_Health)
		      FGameplayAttributeData Health;
		      ATTRIBUTE_ACCESSORS(UMyAttributeSet, Health)
		  
		      UPROPERTY(BlueprintReadOnly)
		      FGameplayAttributeData MaxHealth;
		      ATTRIBUTE_ACCESSORS(UMyAttributeSet, MaxHealth)
		  
		      virtual void PostGameplayEffectExecute(
		          const FGameplayEffectModCallbackData& Data) override;
		  };
		  ```
	-
	- ## Gameplay Tags
	  collapsed:: true
		- ```
		  Tags are hierarchical strings: "Status.Burning", "Ability.Jump", "Character.Dead"
		  
		  Register in Project Settings → GameplayTags
		  
		  Uses:
		    - Block abilities while stunned: block tag "Status.Stunned"
		    - Cancel abilities: cancel tag "Ability.Jump" cancels jump
		    - Trigger effects: GameplayCue.Explosion
		    - Query: HasMatchingGameplayTag, HasAllMatchingGameplayTags
		  ```
- # World Building Tools
  collapsed:: true
	- ## Landscape
	  collapsed:: true
		- ```
		  Landscape — large outdoor terrain system
		  
		  Workflow:
		  1. Create Landscape (Modes → Landscape → Manage → New)
		  2. Sculpt: raise, lower, smooth, flatten, erosion
		  3. Paint: layer materials (grass, rock, dirt, snow)
		  4. Foliage: scatter trees, rocks, grass automatically
		  
		  Landscape Material:
		    - Layer blend node
		    - Each layer: albedo + normal + roughness
		    - Weight-painted in editor
		  
		  Nanite Tessellation (UE5.1+):
		    - Displace landscape geometry at render time
		    - No pre-tessellation needed
		  ```
	-
	- ## World Partition (UE5 Open World)
	  collapsed:: true
		- ```
		  World Partition replaces World Composition for large worlds.
		  
		  Features:
		    - Automatic streaming — cells load/unload based on player position
		    - One persistent level — no manual sub-level management
		    - Data Layers — toggle content visibility (day/night, seasons)
		    - HLOD (Hierarchical LOD) — distant merged meshes
		  
		  Setup:
		    World Settings → Enable World Partition
		    Set streaming distance per actor class
		  ```
	-
	- ## Procedural Content Generation (PCG) — UE5.2+
	  collapsed:: true
		- ```
		  PCG Framework — node-based procedural placement system
		  
		  Uses:
		    - Scatter foliage along splines
		    - Generate buildings from rules
		    - Populate dungeons procedurally
		    - Runtime generation
		  
		  PCG Graph:
		    Input → Sample Surface → Filter → Spawn Mesh → Output
		  ```
- # Performance & Optimization
  collapsed:: true
	- ## Profiling Tools
	  collapsed:: true
		- ```
		  Stat commands (console ~ key):
		    stat fps           — frame rate
		    stat unit          — frame, game, draw, GPU times
		    stat game          — gameplay tick times
		    stat scenerendering — draw calls, triangles
		    stat memory        — memory usage
		    stat streaming     — asset streaming info
		  
		  Unreal Insights:
		    - Full frame profiler (CPU + GPU)
		    - Network profiling
		    - Memory tracking
		    Run: UnrealInsights.exe, launch game with -trace=cpu,gpu,memory
		  
		  GPU Visualizer (Ctrl+Shift+,):
		    - Per-pass GPU timing breakdown
		  
		  RenderDoc integration:
		    - Full GPU frame capture and analysis
		  ```
	-
	- ## Common Optimizations
	  collapsed:: true
		- ```
		  Draw Calls:
		    - Merge static meshes (HLOD, Merge Actors tool)
		    - Use Instanced Static Mesh (ISM) for repeated objects
		    - Use Hierarchical ISM (HISM) for foliage
		    - Enable Nanite on high-poly static meshes
		  
		  Tick:
		    - Disable tick on actors that don't need it
		      PrimaryActorTick.bCanEverTick = false;
		    - Reduce tick interval
		      PrimaryActorTick.TickInterval = 0.1f; // 10 times/sec
		    - Use timers instead of tick for infrequent updates
		  
		  Memory:
		    - Stream assets (don't load everything upfront)
		    - Use Soft Object References for optional assets
		    - Pool frequently spawned actors
		  
		  Shadows:
		    - Use Virtual Shadow Maps (VSM) — more efficient
		    - Limit dynamic shadow casters
		    - Use baked lightmaps for static geometry
		  ```
	-
	- ## Soft References & Async Loading
	  collapsed:: true
		- ```c++
		  // Hard reference — loads immediately (avoid for large assets)
		  UPROPERTY(EditDefaultsOnly)
		  UTexture2D* Texture;
		  
		  // Soft reference — loads on demand
		  UPROPERTY(EditDefaultsOnly)
		  TSoftObjectPtr<UTexture2D> TextureSoft;
		  
		  // Async load
		  FStreamableManager& Streamable = UAssetManager::GetStreamableManager();
		  Streamable.RequestAsyncLoad(TextureSoft.ToSoftObjectPath(),
		      FStreamableDelegate::CreateUObject(this, &AMyActor::OnTextureLoaded));
		  
		  void AMyActor::OnTextureLoaded()
		  {
		      UTexture2D* Tex = TextureSoft.Get();
		      Mesh->SetMaterial(0, CreateMaterialWithTexture(Tex));
		  }
		  ```
- # Useful Utilities & Helpers
  collapsed:: true
	- ## UGameplayStatics
	  collapsed:: true
		- ```c++
		  #include "Kismet/GameplayStatics.h"
		  
		  // Get player
		  APlayerController* PC = UGameplayStatics::GetPlayerController(this, 0);
		  APawn* Player = UGameplayStatics::GetPlayerPawn(this, 0);
		  ACharacter* Char = UGameplayStatics::GetPlayerCharacter(this, 0);
		  
		  // Load level
		  UGameplayStatics::OpenLevel(this, FName("Level_02"));
		  UGameplayStatics::OpenLevelBySoftObjectPtr(this, LevelRef);
		  
		  // Apply damage
		  UGameplayStatics::ApplyDamage(TargetActor, 25.f, Controller, this, DamageType);
		  UGameplayStatics::ApplyRadialDamage(this, 100.f, Center, 500.f,
		      DamageType, {}, this, Controller);
		  
		  // Slow motion
		  UGameplayStatics::SetGlobalTimeDilation(this, 0.2f);
		  
		  // Get all actors of class
		  TArray<AActor*> Enemies;
		  UGameplayStatics::GetAllActorsOfClass(GetWorld(), AEnemy::StaticClass(), Enemies);
		  ```
	-
	- ## FMath Utilities
	  collapsed:: true
		- ```c++
		  FMath::Clamp(Value, 0.f, 100.f)
		  FMath::Lerp(A, B, Alpha)
		  FMath::InterpTo(Current, Target, DeltaTime, Speed)  // smooth follow
		  FMath::RInterpTo(CurrentRot, TargetRot, DeltaTime, Speed)
		  FMath::VInterpTo(CurrentVec, TargetVec, DeltaTime, Speed)
		  FMath::RandRange(Min, Max)
		  FMath::RandBool()
		  FMath::Abs(Value)
		  FMath::Square(Value)
		  FMath::Sqrt(Value)
		  FMath::Sin(Radians)
		  FMath::Atan2(Y, X)
		  FMath::IsNearlyZero(Value)
		  FMath::IsNearlyEqual(A, B)
		  FVector::Dist(A, B)
		  FVector::DotProduct(A, B)
		  FVector::CrossProduct(A, B)
		  ```
	-
	- ## Debug Helpers
	  collapsed:: true
		- ```c++
		  #include "DrawDebugHelpers.h"
		  
		  DrawDebugLine(World, Start, End, FColor::Red, false, 2.f);
		  DrawDebugSphere(World, Center, Radius, 12, FColor::Green, false, 2.f);
		  DrawDebugBox(World, Center, Extent, FColor::Blue, false, 2.f);
		  DrawDebugCapsule(World, Center, HalfHeight, Radius, Rot, FColor::Yellow, false, 2.f);
		  DrawDebugPoint(World, Location, 10.f, FColor::White, false, 2.f);
		  DrawDebugString(World, Location, TEXT("Hello"), nullptr, FColor::White, 2.f);
		  DrawDebugDirectionalArrow(World, Start, End, 50.f, FColor::Cyan, false, 2.f);
		  ```
- # Cinematics — Sequencer
  collapsed:: true
	- ## Overview
	  collapsed:: true
		- ```
		  Sequencer — Unreal's non-linear animation/cinematic editor (like a timeline).
		  
		  Uses:
		    - Cutscenes and cinematics
		    - Gameplay camera sequences
		    - Animated level events (doors opening, lights flickering)
		    - Virtual production (film/TV)
		  
		  Tracks:
		    Camera Cut    — switch between cameras
		    Actor         — animate any actor property
		    Transform     — position/rotation/scale keyframes
		    Skeletal Mesh — animation clips
		    Audio         — sync sound to sequence
		    Event         — trigger Blueprint events at specific frames
		    Fade          — fade in/out
		  ```
	-
	- ## Playing Sequences from C++
	  collapsed:: true
		- ```c++
		  #include "LevelSequencePlayer.h"
		  #include "LevelSequenceActor.h"
		  
		  UPROPERTY(EditDefaultsOnly)
		  ULevelSequence* CutsceneSequence;
		  
		  void AMyGameMode::PlayCutscene()
		  {
		      FMovieSceneSequencePlaybackSettings Settings;
		      Settings.bAutoPlay = true;
		  
		      ALevelSequenceActor* SeqActor;
		      ULevelSequencePlayer* Player = ULevelSequencePlayer::CreateLevelSequencePlayer(
		          GetWorld(), CutsceneSequence, Settings, SeqActor);
		  
		      Player->Play();
		      Player->OnFinished.AddDynamic(this, &AMyGameMode::OnCutsceneFinished);
		  }
		  ```
- # Libs, Plugins & Resources
  collapsed:: true
	- ## Official
		- [Unreal Engine Docs](https://docs.unrealengine.com/)
		- [Unreal Engine API Reference](https://docs.unrealengine.com/en-US/API/)
		- [Unreal Engine GitHub](https://github.com/EpicGames/UnrealEngine) (requires Epic account)
		- [Fab Marketplace](https://www.fab.com/) (assets, plugins)
		- [Lyra Starter Game](https://www.unrealengine.com/en-US/blog/lyra-starter-game) — production-quality sample project
	-
	- ## Community & Learning
		- [Unreal Online Learning](https://dev.epicgames.com/community/learning)
		- [Tom Looman's C++ Course](https://www.tomlooman.com/unreal-engine-cpp-guide/)
		- [Unreal Source (community)](https://unrealsource.com/)
		- [r/unrealengine](https://www.reddit.com/r/unrealengine/)
		- [Alex Forsythe — Multiplayer in UE](https://www.youtube.com/@AlexForsythe)
	-
	- ## Key Plugins
		- **Gameplay Ability System (GAS)** — built-in, enable in plugins
		- **Enhanced Input** — built-in UE5, replaces legacy input
		- **Chaos Physics** — built-in UE5 physics engine
		- **MetaHuman** — photorealistic human creator
		- **Procedural Content Generation (PCG)** — built-in UE5.2+
		- **CommonUI** — cross-platform UI framework
	-
- # Gameplay Ability System (GAS)
  collapsed:: true
	- ## Overview
	  collapsed:: true
		- ```
		  GAS is Unreal's built-in framework for complex ability systems.
		  Used in: Fortnite, Lyra, most AAA UE games.
		  
		  Core classes:
		    AbilitySystemComponent (ASC) — attached to Actor, owns all GAS data
		    GameplayAbility (GA)         — one ability (jump, fire, dash)
		    GameplayEffect (GE)          — modifies attributes (damage, heal, buff)
		    AttributeSet (AS)            — defines stats (Health, Mana, Stamina)
		    GameplayTag                  — hierarchical string tag (Ability.Fire, State.Dead)
		    GameplayCue                  — cosmetic effects (particles, sounds) triggered by tags
		  ```
	-
	- ## Setup
	  collapsed:: true
		- ```c++
		  // 1. Enable plugin: Edit → Plugins → Gameplay Abilities
		  // 2. Add to Build.cs:
		  PublicDependencyModuleNames.AddRange(new string[] {
		      "GameplayAbilities", "GameplayTags", "GameplayTasks"
		  });
		  
		  // 3. Add ASC to Character
		  UPROPERTY(VisibleAnywhere, BlueprintReadOnly)
		  UAbilitySystemComponent* AbilitySystemComponent;
		  
		  // Implement IAbilitySystemInterface
		  virtual UAbilitySystemComponent* GetAbilitySystemComponent() const override
		  {
		      return AbilitySystemComponent;
		  }
		  ```
	-
	- ## AttributeSet
	  collapsed:: true
		- ```c++
		  UCLASS()
		  class UMyAttributeSet : public UAttributeSet
		  {
		      GENERATED_BODY()
		  public:
		      UPROPERTY(BlueprintReadOnly, ReplicatedUsing = OnRep_Health)
		      FGameplayAttributeData Health;
		      ATTRIBUTE_ACCESSORS(UMyAttributeSet, Health)
		  
		      UPROPERTY(BlueprintReadOnly, ReplicatedUsing = OnRep_MaxHealth)
		      FGameplayAttributeData MaxHealth;
		      ATTRIBUTE_ACCESSORS(UMyAttributeSet, MaxHealth)
		  
		      // Called before attribute change — clamp values here
		      virtual void PreAttributeChange(const FGameplayAttribute& Attribute,
		          float& NewValue) override
		      {
		          if (Attribute == GetHealthAttribute())
		              NewValue = FMath::Clamp(NewValue, 0.f, GetMaxHealth());
		      }
		  
		      // Called after GameplayEffect applied
		      virtual void PostGameplayEffectExecute(
		          const FGameplayEffectModCallbackData& Data) override;
		  };
		  ```
	-
	- ## GameplayAbility
	  collapsed:: true
		- ```c++
		  UCLASS()
		  class UGA_FireWeapon : public UGameplayAbility
		  {
		      GENERATED_BODY()
		  public:
		      UGA_FireWeapon()
		      {
		          // Ability can only be activated once at a time
		          InstancingPolicy = EGameplayAbilityInstancingPolicy::InstancedPerActor;
		          // Tag required on owner to activate
		          ActivationRequiredTags.AddTag(FGameplayTag::RequestGameplayTag("State.Armed"));
		          // Tag applied while active
		          ActivationOwnedTags.AddTag(FGameplayTag::RequestGameplayTag("Ability.Firing"));
		      }
		  
		      virtual void ActivateAbility(const FGameplayAbilitySpecHandle Handle,
		          const FGameplayAbilityActorInfo* ActorInfo,
		          const FGameplayAbilityActivationInfo ActivationInfo,
		          const FGameplayEventData* TriggerEventData) override
		      {
		          // Commit (check/consume cost + cooldown)
		          if (!CommitAbility(Handle, ActorInfo, ActivationInfo))
		          {
		              EndAbility(Handle, ActorInfo, ActivationInfo, true, true);
		              return;
		          }
		          // Do the thing
		          SpawnProjectile();
		          EndAbility(Handle, ActorInfo, ActivationInfo, true, false);
		      }
		  };
		  ```
	-
	- ## GameplayEffect
	  collapsed:: true
		- ```
		  GameplayEffect types:
		    Instant    — apply once (damage, instant heal)
		    Duration   — apply for N seconds (burn, slow)
		    Infinite   — apply until removed (passive buff, aura)
		  
		  Modifiers:
		    Add, Multiply, Override, Divide
		    Target: specific attribute (Health, MoveSpeed)
		  
		  Stacking:
		    AggregateBySource — each source has own stack
		    AggregateByTarget — all sources share one stack
		  
		  Applying in C++:
		    FGameplayEffectContextHandle Context = ASC->MakeEffectContext();
		    FGameplayEffectSpecHandle Spec = ASC->MakeOutgoingSpec(
		        DamageEffectClass, Level, Context);
		    ASC->ApplyGameplayEffectSpecToTarget(*Spec.Data.Get(), TargetASC);
		  ```
	-
	- ## GameplayTags
	  collapsed:: true
		- ```c++
		  // Define tags in DefaultGameplayTags.ini or via editor
		  // Tags are hierarchical: "Ability.Fire" is child of "Ability"
		  
		  // Check tag
		  if (ASC->HasMatchingGameplayTag(
		      FGameplayTag::RequestGameplayTag("State.Dead")))
		  { ... }
		  
		  // Add/remove tag
		  ASC->AddLooseGameplayTag(FGameplayTag::RequestGameplayTag("State.Stunned"));
		  ASC->RemoveLooseGameplayTag(FGameplayTag::RequestGameplayTag("State.Stunned"));
		  
		  // Tag containers
		  FGameplayTagContainer Tags;
		  Tags.AddTag(FGameplayTag::RequestGameplayTag("Ability.Fire"));
		  bool bHasAny = ASC->HasAnyMatchingGameplayTags(Tags);
		  ```
- # Materials & Shaders
  collapsed:: true
	- ## Material Basics
	  collapsed:: true
		- ```
		  Material — shader program defining surface appearance.
		  Material Instance — parameterized copy of a Material (fast, no recompile).
		  Material Function — reusable node subgraph.
		  
		  Blend Modes:
		    Opaque       — solid surface (default, cheapest)
		    Masked       — binary transparency (foliage, fences)
		    Translucent  — full alpha blend (glass, water, particles)
		    Additive     — adds color to background (fire, glow)
		  
		  Shading Models:
		    Default Lit     — standard PBR
		    Unlit           — no lighting (UI, emissive-only)
		    Subsurface      — skin, wax, marble
		    Clear Coat      — car paint, lacquer
		    Two Sided Foliage — leaves with back-face lighting
		    Hair            — Kajiya-Kay hair shading
		    Eye             — realistic eye rendering
		  ```
	-
	- ## PBR Inputs
	  collapsed:: true
		- ```
		  Base Color    — albedo (no lighting). RGB 0-1.
		  Metallic      — 0 = dielectric, 1 = metal. Binary in practice.
		  Roughness     — 0 = mirror, 1 = fully diffuse.
		  Specular      — non-metal specular intensity (default 0.5).
		  Normal        — tangent-space normal map (blue-ish).
		  Emissive      — self-illumination. HDR values drive Bloom.
		  Ambient Occlusion — pre-baked crevice darkening.
		  Opacity       — for Masked/Translucent modes.
		  World Position Offset — vertex displacement (cloth, water waves).
		  ```
	-
	- ## Material Nodes (Key)
	  collapsed:: true
		- ```
		  Texture Sample       — sample texture at UV
		  TextureCoordinate    — UV channel (tiling, offset)
		  Panner               — animate UVs (scrolling water, lava)
		  Rotator              — rotate UVs
		  Lerp                 — blend between A and B by Alpha
		  Multiply / Add       — math on colors/values
		  Fresnel              — rim/edge glow effect
		  VertexColor          — per-vertex color from mesh
		  WorldPosition        — absolute world XYZ of pixel
		  CameraVector         — direction from pixel to camera
		  Time                 — current game time (for animation)
		  Noise                — procedural noise (Perlin, Voronoi, etc.)
		  BreakOutFloat3Components — split RGB into R, G, B
		  MakeFloat3           — combine R, G, B into RGB
		  ```
	-
	- ## Dynamic Material Instances
	  collapsed:: true
		- ```c++
		  // Create dynamic instance at runtime
		  UMaterialInstanceDynamic* DynMat =
		      UMaterialInstanceDynamic::Create(BaseMaterial, this);
		  Mesh->SetMaterial(0, DynMat);
		  
		  // Set scalar parameter
		  DynMat->SetScalarParameterValue(TEXT("Opacity"), 0.5f);
		  
		  // Set vector parameter (color)
		  DynMat->SetVectorParameterValue(TEXT("EmissiveColor"),
		      FLinearColor(1.f, 0.2f, 0.f));
		  
		  // Set texture parameter
		  DynMat->SetTextureParameterValue(TEXT("DiffuseTexture"), MyTexture);
		  ```
	-
	- ## Custom HLSL in Materials
	  collapsed:: true
		- ```hlsl
		  // Custom node in Material Editor — write raw HLSL
		  // Inputs: named pins you define
		  // Output: return value
		  
		  // Example: remap value from [InMin,InMax] to [OutMin,OutMax]
		  // Inputs: Value, InMin, InMax, OutMin, OutMax
		  return OutMin + (Value - InMin) / (InMax - InMin) * (OutMax - OutMin);
		  
		  // Example: triplanar projection
		  float3 weights = abs(Normal);
		  weights = pow(weights, 4.0);
		  weights /= (weights.x + weights.y + weights.z);
		  float4 xTex = tex2D(Texture, WorldPos.yz * Scale);
		  float4 yTex = tex2D(Texture, WorldPos.xz * Scale);
		  float4 zTex = tex2D(Texture, WorldPos.xy * Scale);
		  return xTex * weights.x + yTex * weights.y + zTex * weights.z;
		  ```
- # Niagara VFX System
  collapsed:: true
	- ## Overview
	  collapsed:: true
		- ```
		  Niagara is UE5's particle/VFX system (replaces Cascade).
		  
		  Hierarchy:
		    Niagara System    — top-level asset, contains emitters
		    Niagara Emitter   — one particle type (sparks, smoke, etc.)
		    Niagara Module    — reusable logic block (Initialize, Update, Render)
		  
		  Simulation stages:
		    Emitter Update    — runs once per emitter per frame
		    Particle Spawn    — runs when particle is born
		    Particle Update   — runs every frame per particle
		    Event Handler     — respond to collision/death events
		  ```
	-
	- ## Key Modules
	  collapsed:: true
		- ```
		  Spawn Rate / Burst  — how many particles, when
		  Initialize Particle — set initial position, velocity, color, size, lifetime
		  Add Velocity        — constant or random velocity
		  Gravity Force       — apply gravity
		  Drag                — air resistance
		  Curl Noise Force    — turbulent swirling motion
		  Collision           — particles bounce off world geometry
		  Scale Color         — fade in/out over lifetime
		  Scale Sprite Size   — grow/shrink over lifetime
		  Sprite Renderer     — render as camera-facing quad
		  Mesh Renderer       — render as 3D mesh
		  Ribbon Renderer     — connect particles as ribbon (trails)
		  ```
	-
	- ## Spawning from C++
	  collapsed:: true
		- ```c++
		  #include "NiagaraFunctionLibrary.h"
		  #include "NiagaraComponent.h"
		  
		  UPROPERTY(EditDefaultsOnly)
		  UNiagaraSystem* ExplosionEffect;
		  
		  // Spawn at location (fire and forget)
		  UNiagaraFunctionLibrary::SpawnSystemAtLocation(
		      GetWorld(), ExplosionEffect, GetActorLocation());
		  
		  // Spawn attached (follows actor)
		  UNiagaraComponent* NiagaraComp =
		      UNiagaraFunctionLibrary::SpawnSystemAttached(
		          ExplosionEffect, RootComponent,
		          NAME_None, FVector::ZeroVector,
		          FRotator::ZeroRotator,
		          EAttachLocation::KeepRelativeOffset, true);
		  
		  // Set Niagara parameter from C++
		  NiagaraComp->SetVariableFloat(TEXT("SpawnRate"), 100.f);
		  NiagaraComp->SetVariableLinearColor(TEXT("Color"), FLinearColor::Red);
		  NiagaraComp->SetVariableVec3(TEXT("EmitterVelocity"), Velocity);
		  ```
	-
	- ## GPU Simulation
	  collapsed:: true
		- ```
		  CPU Simulation:
		    - Runs on CPU, flexible, supports full Blueprint/C++ interaction
		    - Max ~100k particles before performance issues
		  
		  GPU Simulation:
		    - Runs entirely on GPU
		    - Millions of particles possible
		    - Limited interaction with CPU (no per-particle C++ callbacks)
		    - Enable: Emitter Properties → Sim Target → GPU Compute Sim
		  
		  GPU Raytracing Particles:
		    - Enable in Project Settings for RT shadows on particles
		  ```
- # Nanite — Virtualized Geometry
  collapsed:: true
	- ## How Nanite Works
	  collapsed:: true
		- ```
		  Nanite is UE5's virtualized micropolygon geometry system.
		  
		  Traditional LOD problem:
		    - Artist creates LOD0 (high), LOD1, LOD2, LOD3 manually
		    - Engine switches between them based on distance
		    - Still limited by triangle budget per frame
		  
		  Nanite solution:
		    - Mesh stored as hierarchical cluster DAG (Directed Acyclic Graph)
		    - At runtime: GPU selects exactly the right detail level per cluster
		    - Clusters are ~128 triangles each
		    - Only clusters covering ~1 pixel are rendered
		    - Result: billions of triangles, no manual LODs needed
		  
		  Limitations:
		    - No skeletal mesh (static meshes only — use for environment, props)
		    - No world position offset (WPO) by default (UE5.1+ has limited WPO)
		    - No translucent/masked materials (opaque only)
		    - Requires DX12 / Vulkan / Metal
		  ```
	-
	- ## Enabling Nanite
	  collapsed:: true
		- ```
		  Per mesh:
		    Static Mesh Editor → Details → Nanite Settings → Enable Nanite ✓
		  
		  Import setting:
		    Import dialog → Nanite → Build Nanite ✓
		  
		  Visualize:
		    Viewport → View Mode → Nanite Visualization → Triangles / Clusters / Overdraw
		  
		  Console commands:
		    r.Nanite 1/0          — enable/disable Nanite
		    r.Nanite.ShowStats 1  — show Nanite stats overlay
		  ```
	-
	- ## Nanite Landscape & Foliage
	  collapsed:: true
		- ```
		  UE5.1+: Nanite Tessellation for landscapes
		    - Landscape → Details → Enable Nanite ✓
		    - Displacement maps drive actual geometry (not just normal maps)
		  
		  Foliage with Nanite:
		    - Foliage Tool → Mesh → Enable Nanite
		    - Millions of foliage instances with full geometric detail
		    - Combine with WPO for wind animation (UE5.1+ WPO support)
		  ```
- # Lumen — Dynamic Global Illumination
  collapsed:: true
	- ## How Lumen Works
	  collapsed:: true
		- ```
		  Lumen is UE5's fully dynamic GI and reflection system.
		  
		  Two rendering paths:
		  
		  Software Lumen (default):
		    - Uses Signed Distance Fields (SDF) of meshes
		    - Screen traces + SDF traces for GI
		    - Works on any DX11+ GPU
		    - Lower quality, faster
		  
		  Hardware Lumen (Ray Tracing):
		    - Uses GPU ray tracing (RTX / RDNA2+)
		    - Higher quality reflections and GI
		    - Enable: Project Settings → Rendering → Lumen → Use Hardware Ray Tracing
		  
		  Lumen covers:
		    - Indirect diffuse lighting (bounced light)
		    - Reflections (replaces reflection captures)
		    - Sky light (dynamic sky GI)
		  ```
	-
	- ## Lumen Settings
	  collapsed:: true
		- ```
		  Project Settings → Rendering → Global Illumination:
		    Dynamic Global Illumination Method → Lumen
		    Reflection Method → Lumen
		  
		  Post Process Volume:
		    Lumen Global Illumination:
		      Final Gather Quality    — 1 (default) to 4 (high quality)
		      Scene Detail            — affects SDF resolution
		    Lumen Reflections:
		      Quality                 — 1-4
		      Ray Lighting Mode       — Surface Cache (fast) / Hit Lighting (accurate)
		  
		  Console commands:
		    r.Lumen.DiffuseIndirect.Allow 1/0
		    r.Lumen.Reflections.Allow 1/0
		    r.Lumen.TraceMeshSDFs 1/0
		  ```
	-
	- ## Lumen Performance Tips
	  collapsed:: true
		- ```
		  - Use Emissive materials to act as area lights (Lumen picks them up)
		  - Sky Atmosphere + Directional Light → Lumen sky GI works automatically
		  - Avoid too many small emissive meshes (expensive SDF updates)
		  - Use Lumen Scene Detail setting to balance quality vs performance
		  - For indoor scenes: place Sky Light with Lumen enabled
		  - Hardware Lumen: requires r.RayTracing 1 and DXR-capable GPU
		  - Lumen doesn't support translucent surfaces as GI emitters
		  ```
- # Chaos Physics
  collapsed:: true
	- ## Overview
	  collapsed:: true
		- ```
		  Chaos is UE5's built-in physics engine (replaced PhysX in UE5).
		  
		  Features:
		    Rigid body simulation    — standard physics objects
		    Chaos Destruction        — real-time fracture/destruction
		    Chaos Cloth              — cloth simulation
		    Chaos Vehicles           — wheeled vehicle physics
		    Chaos Flesh (UE5.1+)     — soft body / muscle simulation
		  ```
	-
	- ## Chaos Destruction (Geometry Collections)
	  collapsed:: true
		- ```
		  Workflow:
		  1. Select static mesh → Fracture Mode (toolbar)
		  2. Fracture: Uniform, Voronoi, Planar, Brick, Cluster
		  3. Generate Geometry Collection asset
		  4. Place in level → add Geometry Collection Component
		  5. Set Damage Threshold — how much force to trigger break
		  
		  In C++:
		  ```
		- ```c++
		  // Apply external strain to trigger fracture
		  #include "GeometryCollection/GeometryCollectionComponent.h"
		  
		  UPROPERTY(VisibleAnywhere)
		  UGeometryCollectionComponent* DestructibleComp;
		  
		  void AMyDestructible::TakeHit(FVector ImpactPoint, float Force)
		  {
		      // Apply radial impulse to trigger fracture
		      DestructibleComp->AddRadialImpulse(
		          ImpactPoint, 200.f, Force, RIF_Linear, true);
		  }
		  ```
	-
	- ## Chaos Cloth
	  collapsed:: true
		- ```
		  Setup:
		  1. Skeletal mesh with cloth mesh section
		  2. Clothing Tool (editor) → paint cloth weights
		     Max Distance — how far vertex can move from animated position
		     Backstop     — prevents cloth from penetrating body
		  3. Cloth Config: stiffness, damping, gravity scale, wind
		  
		  In C++:
		    UClothingAssetBase* ClothAsset = SkeletalMesh->GetClothingAsset(0);
		    // Cloth simulates automatically when SkeletalMeshComponent ticks
		  ```
	-
	- ## Chaos Vehicles
	  collapsed:: true
		- ```c++
		  // Enable plugin: ChaosVehicles
		  // Base class: UChaosWheeledVehicleMovementComponent
		  
		  UPROPERTY(VisibleAnywhere)
		  UChaosWheeledVehicleMovementComponent* VehicleMovement;
		  
		  // In constructor:
		  VehicleMovement = CreateDefaultSubobject<UChaosWheeledVehicleMovementComponent>(
		      TEXT("VehicleMovement"));
		  
		  // Input binding:
		  void AMyVehicle::SetThrottle(float Value)
		  {
		      VehicleMovement->SetThrottleInput(Value);
		  }
		  void AMyVehicle::SetSteering(float Value)
		  {
		      VehicleMovement->SetSteeringInput(Value);
		  }
		  void AMyVehicle::SetBrake(float Value)
		  {
		      VehicleMovement->SetBrakeInput(Value);
		  }
		  ```
- # World Partition & Open World
  collapsed:: true
	- ## World Partition
	  collapsed:: true
		- ```
		  World Partition replaces World Composition for open worlds.
		  
		  How it works:
		    - Level is one large map (no sub-levels needed)
		    - World is divided into cells (configurable size, e.g., 128m x 128m)
		    - Cells stream in/out based on player position
		    - Each cell can have its own loading distance
		  
		  Enable:
		    World Settings → World Partition → Enable World Partition ✓
		  
		  HLOD (Hierarchical LOD):
		    - Distant cells replaced by simplified proxy meshes
		    - Auto-generated: World Partition → HLOD → Build HLODs
		  
		  Data Layers:
		    - Tag actors with Data Layers (Day/Night, Quest states)
		    - Load/unload layers at runtime
		  ```
	-
	- ## Data Layers
	  collapsed:: true
		- ```c++
		  // Load/unload data layer at runtime
		  #include "WorldPartition/DataLayer/DataLayerSubsystem.h"
		  
		  UDataLayerSubsystem* DLS = GetWorld()->GetSubsystem<UDataLayerSubsystem>();
		  
		  // Set layer state
		  DLS->SetDataLayerRuntimeState(DayLayerAsset,
		      EDataLayerRuntimeState::Activated);
		  DLS->SetDataLayerRuntimeState(NightLayerAsset,
		      EDataLayerRuntimeState::Unloaded);
		  ```
	-
	- ## Level Streaming (Legacy)
	  collapsed:: true
		- ```c++
		  // Stream sub-level in/out (pre-World Partition approach)
		  UGameplayStatics::LoadStreamLevel(this,
		      FName("Level_Cave"), true, false, FLatentActionInfo());
		  
		  UGameplayStatics::UnloadStreamLevel(this,
		      FName("Level_Cave"), FLatentActionInfo(), false);
		  
		  // Check if loaded
		  ULevelStreaming* StreamingLevel = UGameplayStatics::GetStreamingLevel(
		      this, FName("Level_Cave"));
		  bool bLoaded = StreamingLevel && StreamingLevel->IsLevelLoaded();
		  ```
- # Procedural Content Generation (PCG)
  collapsed:: true
	- ## Overview
	  collapsed:: true
		- ```
		  PCG Framework (UE5.2+) — node-based procedural generation.
		  
		  Use cases:
		    - Scatter foliage/rocks along splines
		    - Generate roads, rivers, paths
		    - Populate open worlds with props
		    - Runtime procedural level generation
		  
		  Core concepts:
		    PCG Graph     — node graph defining generation logic
		    PCG Component — attached to Actor, runs the graph
		    Point Data    — set of 3D points with attributes (position, rotation, scale)
		    Attribute     — custom data per point (type, density, etc.)
		  ```
	-
	- ## Key PCG Nodes
	  collapsed:: true
		- ```
		  Get Spline Data       — sample points along a spline
		  Get Landscape Data    — sample landscape surface
		  Surface Sampler       — scatter points on a surface
		  Density Filter        — remove points by density/noise
		  Projection            — project points onto surface
		  Static Mesh Spawner   — spawn meshes at point positions
		  Transform Points      — offset/rotate/scale points
		  Difference            — subtract one point set from another
		  Intersection          — keep only overlapping points
		  Attribute Operation   — math on point attributes
		  ```
	-
	- ## PCG from C++
	  collapsed:: true
		- ```c++
		  // Custom PCG node
		  UCLASS()
		  class UPCGMyCustomNode : public UPCGSettings
		  {
		      GENERATED_BODY()
		  
		      UPROPERTY(EditAnywhere, BlueprintReadWrite)
		      float Radius = 100.f;
		  
		  #if WITH_EDITOR
		      virtual FName GetDefaultNodeName() const override
		      { return FName("MyCustomNode"); }
		  #endif
		  
		      virtual TArray<FPCGPinProperties> InputPinProperties() const override;
		      virtual TArray<FPCGPinProperties> OutputPinProperties() const override;
		      virtual FPCGElementPtr CreateElement() const override;
		  };
		  ```
- # Mass Entity System (ECS)
  collapsed:: true
	- ## Overview
	  collapsed:: true
		- ```
		  Mass Entity is UE5's data-oriented ECS framework.
		  Used for: large crowds, flocks, traffic, thousands of AI agents.
		  
		  Core concepts:
		    Entity          — lightweight ID (no components directly)
		    Fragment        — data struct (like ECS component)
		    Tag             — zero-size marker fragment
		    Archetype       — unique combination of fragments
		    Processor       — system that queries and processes entities
		    EntityManager   — owns all entities and archetypes
		  
		  Plugins needed:
		    MassEntity, MassGameplay, MassAI, MassSpawner, ZoneGraph
		  ```
	-
	- ## Fragments & Processors
	  collapsed:: true
		- ```c++
		  // Define a Fragment (pure data)
		  USTRUCT()
		  struct FMassVelocityFragment : public FMassFragment
		  {
		      GENERATED_BODY()
		      FVector Value = FVector::ZeroVector;
		  };
		  
		  // Define a Processor (system)
		  UCLASS()
		  class UMassMovementProcessor : public UMassProcessor
		  {
		      GENERATED_BODY()
		  public:
		      UMassMovementProcessor();
		  
		      virtual void ConfigureQueries() override
		      {
		          // Query entities that have both Transform and Velocity
		          EntityQuery.AddRequirement<FTransformFragment>(
		              EMassFragmentAccess::ReadWrite);
		          EntityQuery.AddRequirement<FMassVelocityFragment>(
		              EMassFragmentAccess::ReadOnly);
		      }
		  
		      virtual void Execute(FMassEntityManager& EntityManager,
		          FMassExecutionContext& Context) override
		      {
		          EntityQuery.ForEachEntityChunk(EntityManager, Context,
		              [](FMassExecutionContext& Ctx)
		          {
		              auto Transforms = Ctx.GetMutableFragmentView<FTransformFragment>();
		              auto Velocities = Ctx.GetFragmentView<FMassVelocityFragment>();
		              float DeltaTime = Ctx.GetDeltaTimeSeconds();
		  
		              for (int32 i = 0; i < Ctx.GetNumEntities(); i++)
		              {
		                  Transforms[i].GetMutableTransform().AddToTranslation(
		                      Velocities[i].Value * DeltaTime);
		              }
		          });
		      }
		  };
		  ```
	-
	- ## Mass + Smart Objects + ZoneGraph
	  collapsed:: true
		- ```
		  ZoneGraph:
		    - Defines lanes/paths for Mass agents to follow
		    - Replaces NavMesh for large-scale crowd movement
		    - Zones: roads, sidewalks, corridors
		  
		  Smart Objects:
		    - Interactable world objects (bench, vending machine, door)
		    - Mass agents claim and interact with Smart Objects
		    - Handles concurrent access (only N agents at once)
		  
		  MassSpawner:
		    - Spawns thousands of entities efficiently
		    - Configures entity templates (fragment sets)
		    - Integrates with World Partition for streaming
		  ```
- # Advanced C++ Patterns
  collapsed:: true
	- ## Subsystems
	  collapsed:: true
		- ```c++
		  // Subsystems are auto-instanced singletons tied to a lifetime scope
		  // Cleaner alternative to GameInstance variables or static singletons
		  
		  // Types:
		  //   UGameInstanceSubsystem  — lives as long as GameInstance
		  //   UWorldSubsystem         — lives as long as World
		  //   ULocalPlayerSubsystem   — per local player
		  //   UEngineSubsystem        — lives as long as engine
		  
		  UCLASS()
		  class UInventorySubsystem : public UGameInstanceSubsystem
		  {
		      GENERATED_BODY()
		  public:
		      virtual void Initialize(FSubsystemCollectionBase& Collection) override;
		      virtual void Deinitialize() override;
		  
		      void AddItem(FName ItemID, int32 Count);
		      int32 GetItemCount(FName ItemID) const;
		  
		  private:
		      TMap<FName, int32> Inventory;
		  };
		  
		  // Access from anywhere:
		  UInventorySubsystem* Inv = GetGameInstance()
		      ->GetSubsystem<UInventorySubsystem>();
		  Inv->AddItem("Sword", 1);
		  ```
	-
	- ## Object Pooling in UE
	  collapsed:: true
		- ```c++
		  // UE-style object pool using TArray
		  UCLASS()
		  class UBulletPoolSubsystem : public UWorldSubsystem
		  {
		      GENERATED_BODY()
		  
		      TArray<ABullet*> Pool;
		  
		  public:
		      ABullet* Acquire(FVector Location, FRotator Rotation)
		      {
		          ABullet* Bullet = nullptr;
		          if (Pool.Num() > 0)
		          {
		              Bullet = Pool.Pop();
		              Bullet->SetActorLocationAndRotation(Location, Rotation);
		              Bullet->SetActorHiddenInGame(false);
		              Bullet->SetActorEnableCollision(true);
		          }
		          else
		          {
		              FActorSpawnParameters Params;
		              Bullet = GetWorld()->SpawnActor<ABullet>(
		                  ABullet::StaticClass(), Location, Rotation, Params);
		          }
		          return Bullet;
		      }
		  
		      void Release(ABullet* Bullet)
		      {
		          Bullet->SetActorHiddenInGame(true);
		          Bullet->SetActorEnableCollision(false);
		          Pool.Add(Bullet);
		      }
		  };
		  ```
	-
	- ## Async Tasks & Background Work
	  collapsed:: true
		- ```c++
		  // Async task on background thread
		  AsyncTask(ENamedThreads::AnyBackgroundThreadNormalTask, [this]()
		  {
		      // Heavy computation here (NOT game thread)
		      TArray<FVector> Result = ComputePathfinding();
		  
		      // Return to game thread
		      AsyncTask(ENamedThreads::GameThread, [this, Result]()
		      {
		          ApplyPath(Result);
		      });
		  });
		  
		  // UE Task Graph (UE5.1+)
		  UE::Tasks::Launch(TEXT("MyTask"),
		      [this]()
		      {
		          DoHeavyWork();
		      },
		      UE::Tasks::ETaskPriority::BackgroundNormal);
		  
		  // Async loading assets
		  FStreamableManager& Streamable = UAssetManager::GetStreamableManager();
		  Streamable.RequestAsyncLoad(SoftObjectPath,
		      FStreamableDelegate::CreateUObject(this, &AMyActor::OnAssetLoaded));
		  ```
	-
	- ## Soft References & Asset Manager
	  collapsed:: true
		- ```c++
		  // Hard reference — always loaded (avoid for large assets)
		  UPROPERTY(EditDefaultsOnly)
		  UTexture2D* HardRef;  // loaded when class loads
		  
		  // Soft reference — path only, load on demand
		  UPROPERTY(EditDefaultsOnly)
		  TSoftObjectPtr<UTexture2D> SoftRef;
		  
		  UPROPERTY(EditDefaultsOnly)
		  TSoftClassPtr<AEnemy> EnemyClass;
		  
		  // Load synchronously (blocks — use sparingly)
		  UTexture2D* Tex = SoftRef.LoadSynchronous();
		  
		  // Load asynchronously (preferred)
		  FStreamableManager& SM = UAssetManager::GetStreamableManager();
		  SM.RequestAsyncLoad(SoftRef.ToSoftObjectPath(),
		      [this]() { OnTextureLoaded(); });
		  
		  // Spawn from soft class
		  TSubclassOf<AEnemy> LoadedClass = EnemyClass.LoadSynchronous();
		  GetWorld()->SpawnActor<AEnemy>(LoadedClass, SpawnTransform);
		  ```
- # Save System
  collapsed:: true
	- ## SaveGame Class
	  collapsed:: true
		- ```c++
		  // 1. Create SaveGame class
		  UCLASS()
		  class UMySaveGame : public USaveGame
		  {
		      GENERATED_BODY()
		  public:
		      UPROPERTY()
		      FString PlayerName;
		  
		      UPROPERTY()
		      int32 Level = 1;
		  
		      UPROPERTY()
		      float Health = 100.f;
		  
		      UPROPERTY()
		      FVector LastPosition;
		  
		      UPROPERTY()
		      TArray<FName> UnlockedAbilities;
		  };
		  
		  // 2. Save
		  UMySaveGame* SaveData = Cast<UMySaveGame>(
		      UGameplayStatics::CreateSaveGameObject(UMySaveGame::StaticClass()));
		  SaveData->PlayerName = "VR";
		  SaveData->Level = 5;
		  UGameplayStatics::SaveGameToSlot(SaveData, TEXT("Slot1"), 0);
		  
		  // 3. Load
		  UMySaveGame* Loaded = Cast<UMySaveGame>(
		      UGameplayStatics::LoadGameFromSlot(TEXT("Slot1"), 0));
		  if (Loaded)
		  {
		      PlayerLevel = Loaded->Level;
		  }
		  
		  // 4. Delete
		  UGameplayStatics::DeleteGameInSlot(TEXT("Slot1"), 0);
		  
		  // 5. Check exists
		  bool bExists = UGameplayStatics::DoesSaveGameExist(TEXT("Slot1"), 0);
		  ```
	-
	- ## Async Save/Load
	  collapsed:: true
		- ```c++
		  // Async save (non-blocking)
		  UGameplayStatics::AsyncSaveGameToSlot(SaveData, TEXT("Slot1"), 0,
		      FAsyncSaveGameToSlotDelegate::CreateUObject(
		          this, &AMyGameMode::OnSaveComplete));
		  
		  void AMyGameMode::OnSaveComplete(const FString& SlotName,
		      int32 UserIndex, bool bSuccess)
		  {
		      UE_LOG(LogTemp, Log, TEXT("Save %s: %s"),
		          *SlotName, bSuccess ? TEXT("OK") : TEXT("FAILED"));
		  }
		  
		  // Async load
		  UGameplayStatics::AsyncLoadGameFromSlot(TEXT("Slot1"), 0,
		      FAsyncLoadGameFromSlotDelegate::CreateUObject(
		          this, &AMyGameMode::OnLoadComplete));
		  ```
- # Performance Profiling & Optimization
  collapsed:: true
	- ## Profiling Tools
	  collapsed:: true
		- ```
		  Unreal Insights:
		    - Full-featured profiler (CPU, GPU, memory, networking)
		    - Launch: UnrealInsights.exe
		    - In game: -trace=cpu,gpu,memory,log
		    - Trace channels: CPU, GPU, Frame, Log, Bookmark, Object
		  
		  Stat Commands (in-game console ~):
		    stat fps              — FPS + frame time
		    stat unit             — Game/Draw/GPU thread times
		    stat unitgraph        — frame time graph
		    stat game             — game thread breakdown
		    stat gpu              — GPU pass breakdown
		    stat scenerendering   — draw calls, triangles
		    stat memory           — memory usage
		    stat streaming        — asset streaming stats
		    stat particles        — particle system stats
		  
		  GPU Visualizer:
		    Ctrl+Shift+, (comma) — open GPU frame breakdown
		  ```
	-
	- ## CPU Optimization
	  collapsed:: true
		- ```
		  Tick optimization:
		    - Disable tick on actors that don't need it:
		      PrimaryActorTick.bCanEverTick = false;
		    - Reduce tick interval:
		      PrimaryActorTick.TickInterval = 0.1f; // 10 times/sec
		    - Use timers instead of Tick for infrequent logic
		  
		  Blueprint vs C++:
		    - Move hot-path Blueprint logic to C++
		    - Blueprint function calls have overhead (~10x vs C++)
		  
		  Collision:
		    - Use simple collision shapes (capsule > convex > mesh)
		    - Disable complex collision on non-interactive meshes
		    - Use async line traces for non-critical queries
		  
		  AI:
		    - Stagger AI updates (not all AI every frame)
		    - Use Mass Entity for large crowds
		    - Sleep distant AI (LOD AI system)
		  ```
	-
	- ## GPU Optimization
	  collapsed:: true
		- ```
		  Draw Calls:
		    - Merge static meshes (HLOD, Merge Actors tool)
		    - Use Instanced Static Mesh (ISM) for repeated objects
		    - Use Hierarchical ISM (HISM) for foliage
		    - Nanite eliminates LOD draw call overhead
		  
		  Shader complexity:
		    - View Mode → Shader Complexity (green=cheap, red=expensive)
		    - Reduce instruction count in hot materials
		    - Use Material LOD (simpler material at distance)
		  
		  Overdraw:
		    - View Mode → Quad Overdraw
		    - Sort translucent objects back-to-front
		    - Use Depth Fade for soft particle edges (cheaper than full blend)
		  
		  Texture:
		    - Use texture streaming (enabled by default)
		    - Set correct LOD Bias per texture
		    - Use texture atlases for small UI/decal textures
		  ```
	-
	- ## Memory Optimization
	  collapsed:: true
		- ```
		  Asset audit:
		    - Window → Developer Tools → Asset Audit
		    - Find oversized textures, duplicate assets
		  
		  Texture compression:
		    - Use BC7 for color, BC5 for normals, BC4 for grayscale
		    - Set max texture size per platform
		  
		  Mesh:
		    - Remove unused UV channels
		    - Reduce vertex count on distant/small meshes
		  
		  Memory tracking:
		    stat memory
		    memreport -full  — detailed memory report to log
		    obj list class=Texture2D — list all loaded textures
		  ```
- # Rendering Pipeline Internals
  collapsed:: true
	- ## UE Rendering Architecture
	  collapsed:: true
		- ```
		  Threads:
		    Game Thread    — gameplay logic, actor ticks, Blueprint
		    Render Thread  — builds render commands, manages scene proxy
		    RHI Thread     — translates to DX12/Vulkan/Metal API calls
		    GPU            — executes draw calls
		  
		  Scene Proxy:
		    - Each UPrimitiveComponent has a FPrimitiveSceneProxy on render thread
		    - Game thread sends data via render commands (ENQUEUE_RENDER_COMMAND)
		    - Never access UObjects from render thread directly
		  
		  Render passes (simplified):
		    1. PrePass (Depth)       — early-Z for occlusion
		    2. Base Pass             — GBuffer fill (deferred) or lit (forward)
		    3. Lighting              — deferred lighting passes
		    4. Lumen GI              — indirect lighting
		    5. Reflections           — Lumen / SSR / reflection captures
		    6. Translucency          — forward-rendered transparent objects
		    7. Post Processing       — bloom, DOF, tone mapping, AA
		    8. UI                    — Slate / UMG rendered last
		  ```
	-
	- ## Custom Render Pass (Advanced)
	  collapsed:: true
		- ```c++
		  // Add custom pass via SceneViewExtension
		  class FMySceneViewExtension : public FSceneViewExtensionBase
		  {
		  public:
		      FMySceneViewExtension(const FAutoRegister& AutoRegister)
		          : FSceneViewExtensionBase(AutoRegister) {}
		  
		      virtual void PrePostProcessPass_RenderThread(
		          FRDGBuilder& GraphBuilder,
		          const FSceneView& View,
		          const FPostProcessingInputs& Inputs) override
		      {
		          // Add custom RDG passes here
		          // RDG = Render Dependency Graph (UE5 render API)
		          AddPass(GraphBuilder, RDG_EVENT_NAME("MyCustomPass"),
		              [](FRHICommandList& RHICmdList)
		          {
		              // Raw RHI commands
		          });
		      }
		  };
		  
		  // Register:
		  TSharedRef<FMySceneViewExtension> Ext =
		      FSceneViewExtensions::NewExtension<FMySceneViewExtension>();
		  ```
	-
	- ## Global Shaders
	  collapsed:: true
		- ```c++
		  // Define a global shader (runs outside material system)
		  class FMyComputeShader : public FGlobalShader
		  {
		      DECLARE_GLOBAL_SHADER(FMyComputeShader)
		      SHADER_USE_PARAMETER_STRUCT(FMyComputeShader, FGlobalShader)
		  
		      BEGIN_SHADER_PARAMETER_STRUCT(FParameters, )
		          SHADER_PARAMETER_RDG_BUFFER_UAV(RWBuffer<float4>, OutputBuffer)
		          SHADER_PARAMETER(uint32, NumElements)
		      END_SHADER_PARAMETER_STRUCT()
		  
		      static bool ShouldCompilePermutation(
		          const FGlobalShaderPermutationParameters& Parameters)
		      {
		          return IsFeatureLevelSupported(Parameters.Platform, ERHIFeatureLevel::SM5);
		      }
		  };
		  IMPLEMENT_GLOBAL_SHADER(FMyComputeShader,
		      "/Project/Shaders/MyCompute.usf", "MainCS", SF_Compute);
		  ```
- # Engine Modules & Plugin Development
  collapsed:: true
	- ## Module Structure
	  collapsed:: true
		- ```
		  Every UE project/plugin is made of modules.
		  
		  Module types:
		    Runtime       — ships with game (gameplay code)
		    Editor        — editor-only tools (never ships)
		    Developer     — tools for both editor and non-editor builds
		    ThirdParty    — external libraries
		  
		  Module files:
		    MyModule/
		      Public/           — headers exposed to other modules
		      Private/          — implementation files
		      MyModule.Build.cs — dependency declarations
		      MyModule.h        — module interface
		      MyModule.cpp      — StartupModule / ShutdownModule
		  ```
	-
	- ## Build.cs
	  collapsed:: true
		- ```csharp
		  public class MyModule : ModuleRules
		  {
		      public MyModule(ReadOnlyTargetRules Target) : base(Target)
		      {
		          PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;
		  
		          PublicDependencyModuleNames.AddRange(new string[] {
		              "Core", "CoreUObject", "Engine", "InputCore"
		          });
		  
		          PrivateDependencyModuleNames.AddRange(new string[] {
		              "Slate", "SlateCore",
		              "GameplayAbilities", "GameplayTags"
		          });
		  
		          // Editor-only dependency
		          if (Target.bBuildEditor)
		          {
		              PrivateDependencyModuleNames.Add("UnrealEd");
		          }
		  
		          // Third-party library
		          PublicIncludePaths.Add(Path.Combine(ModuleDirectory,
		              "ThirdParty/MyLib/include"));
		          PublicAdditionalLibraries.Add(Path.Combine(ModuleDirectory,
		              "ThirdParty/MyLib/lib/MyLib.lib"));
		      }
		  }
		  ```
	-
	- ## Editor Tools (Detail Customization)
	  collapsed:: true
		- ```c++
		  // Custom Details panel for a class
		  class FMyActorDetails : public IDetailCustomization
		  {
		  public:
		      static TSharedRef<IDetailCustomization> MakeInstance()
		      {
		          return MakeShareable(new FMyActorDetails);
		      }
		  
		      virtual void CustomizeDetails(IDetailLayoutBuilder& DetailBuilder) override
		      {
		          IDetailCategoryBuilder& Category =
		              DetailBuilder.EditCategory("MyCategory");
		  
		          Category.AddCustomRow(FText::FromString("My Button"))
		          [
		              SNew(SButton)
		              .Text(FText::FromString("Do Something"))
		              .OnClicked_Lambda([&DetailBuilder]()
		              {
		                  // Custom editor action
		                  return FReply::Handled();
		              })
		          ];
		      }
		  };
		  
		  // Register in module StartupModule:
		  FPropertyEditorModule& PropModule =
		      FModuleManager::LoadModuleChecked<FPropertyEditorModule>("PropertyEditor");
		  PropModule.RegisterCustomClassLayout(
		      AMyActor::StaticClass()->GetFName(),
		      FOnGetDetailCustomizationInstance::CreateStatic(
		          &FMyActorDetails::MakeInstance));
		  ```
- # Advanced Networking
  collapsed:: true
	- ## Network Roles
	  collapsed:: true
		- ```
		  Every Actor has a Role and RemoteRole:
		  
		  ROLE_Authority     — server owns this actor (authoritative)
		  ROLE_SimulatedProxy — client simulates movement (other players)
		  ROLE_AutonomousProxy — client controls this actor (local player)
		  ROLE_None          — not replicated
		  
		  Check in C++:
		    HasAuthority()           — true on server
		    IsLocallyControlled()    — true on owning client
		    GetLocalRole()           — this machine's role
		    GetRemoteRole()          — other machine's role
		  
		  Common pattern:
		    if (HasAuthority()) { /* server logic */ }
		    if (IsLocallyControlled()) { /* local player input */ }
		  ```
	-
	- ## Prediction & Reconciliation
	  collapsed:: true
		- ```
		  UCharacterMovementComponent has built-in prediction:
		    - Client predicts movement locally
		    - Server validates and corrects
		    - Handles latency transparently
		  
		  Custom prediction (advanced):
		    - Override PredictedMoveAbility in GAS
		    - Use FPredictionKey to correlate client/server actions
		    - Rollback state on misprediction
		  
		  Network smoothing:
		    NetworkSmoothingMode:
		      Disabled   — snap to server position
		      Linear     — lerp to server position
		      Exponential — smooth exponential correction (default)
		  ```
	-
	- ## Iris Replication System (UE5.1+)
	  collapsed:: true
		- ```
		  Iris is UE5's next-gen replication system (replaces legacy replication).
		  
		  Key improvements:
		    - Batch replication (fewer RPCs, better bandwidth)
		    - Prioritization per connection
		    - Filtering (don't send irrelevant data to clients)
		    - Delta compression
		  
		  Enable:
		    Project Settings → Network → Use Iris Replication System ✓
		  
		  Iris ReplicationFragment (replaces GetLifetimeReplicatedProps):
		    - Define replication state as structs
		    - Automatic delta serialization
		  ```
	-
	- ## Dedicated Server Build
	  collapsed:: true
		- ```
		  Build dedicated server:
		    UnrealBuildTool MyGame Win64 Development -Server
		  
		  Server-only code:
		    #if UE_SERVER
		        // Only compiled in server builds
		    #endif
		  
		    if (IsRunningDedicatedServer()) { ... }
		  
		  Listen server vs Dedicated server:
		    Listen server  — one player hosts + plays (peer hosting)
		    Dedicated server — headless server, no local player
		  
		  Online Subsystem:
		    IOnlineSubsystem* OSS = IOnlineSubsystem::Get();
		    IOnlineSessionPtr Sessions = OSS->GetSessionInterface();
		    // Create/find/join sessions (Steam, EOS, NULL)
		  ```
- # MetaHuman & Animation Advanced
  collapsed:: true
	- ## MetaHuman
	  collapsed:: true
		- ```
		  MetaHuman Creator — web-based photorealistic human creator.
		  
		  Workflow:
		  1. Create at metahuman.unrealengine.com
		  2. Download via Quixel Bridge in UE editor
		  3. MetaHuman comes with:
		     - Full body skeletal mesh (LOD0-LOD3)
		     - Face rig with 330+ blend shapes
		     - Hair groom (Strand-based)
		     - Clothing meshes
		     - Animation Blueprint (face + body)
		  
		  Performance:
		    LOD0 — ~80k triangles (cinematic, close-up)
		    LOD1 — ~30k triangles (gameplay)
		    LOD2 — ~10k triangles (background)
		    LOD3 — ~3k triangles (crowd)
		  ```
	-
	- ## Control Rig
	  collapsed:: true
		- ```
		  Control Rig — procedural animation system in UE5.
		  
		  Use cases:
		    - Full-body IK (FBIK)
		    - Procedural secondary motion (tail, ears, cloth)
		    - Custom rig controls for animators
		    - Runtime deformation (muscle bulge, squash/stretch)
		  
		  Key nodes:
		    FABRIK          — Forward And Backward Reaching IK
		    CCDIK           — Cyclic Coordinate Descent IK
		    Spline IK       — spine/tail along spline
		    Look At         — bone tracks target
		    Point At        — aim constraint
		    Twist Corrective — fix elbow/knee twist artifacts
		  ```
	-
	- ## Motion Matching (UE5.3+)
	  collapsed:: true
		- ```
		  Motion Matching — data-driven animation selection.
		  Replaces hand-crafted state machines with pose search.
		  
		  How it works:
		    1. Large animation database (mocap clips)
		    2. Each frame: search database for best matching pose
		       based on: current pose + desired trajectory
		    3. Blend to best match
		  
		  Result:
		    - Natural transitions without explicit state machine
		    - Handles complex locomotion (turns, starts, stops)
		    - Used in Fortnite Chapter 4+
		  
		  Setup:
		    - PoseSearch plugin (enable in plugins)
		    - Create PoseSearchDatabase asset
		    - Add animation clips
		    - Use MotionMatching node in Anim Graph
		  ```
	-
	- ## Sequencer (Cinematics)
	  collapsed:: true
		- ```
		  Sequencer — UE's non-linear animation/cinematic editor.
		  
		  Track types:
		    Actor Track       — animate any actor property
		    Camera Cut Track  — switch between cameras
		    Skeletal Animation — play animation clips on characters
		    Audio Track       — sync audio to sequence
		    Event Track       — fire Blueprint events at specific frames
		    Fade Track        — fade in/out
		    Level Visibility  — show/hide levels
		  
		  In C++:
		  ```
		- ```c++
		  // Play sequence from C++
		  #include "LevelSequencePlayer.h"
		  
		  UPROPERTY(EditDefaultsOnly)
		  ULevelSequence* CinematicSequence;
		  
		  void AMyGameMode::PlayCinematic()
		  {
		      ALevelSequenceActor* SeqActor;
		      ULevelSequencePlayer* Player =
		          ULevelSequencePlayer::CreateLevelSequencePlayer(
		              GetWorld(), CinematicSequence,
		              FMovieSceneSequencePlaybackSettings(), SeqActor);
		      Player->Play();
		  }
		  ```
- # Common Patterns & Best Practices
  collapsed:: true
	- ## Project Architecture
	  collapsed:: true
		- ```
		  Recommended folder structure:
		  Content/
		    _Core/          — base classes, game mode, player controller
		    Characters/     — player, enemies, NPCs
		    Weapons/        — weapon actors, projectiles
		    UI/             — widgets, HUD
		    Environment/    — meshes, materials, landscapes
		    VFX/            — Niagara systems, materials
		    Audio/          — sound waves, cues, MetaSounds
		    Blueprints/     — gameplay blueprints
		    Maps/           — levels
		  
		  Naming conventions (Epic standard):
		    BP_   — Blueprint class (BP_PlayerCharacter)
		    SM_   — Static Mesh (SM_Rock_01)
		    SK_   — Skeletal Mesh (SK_Mannequin)
		    ABP_  — Animation Blueprint (ABP_Character)
		    M_    — Material (M_Rock_Mossy)
		    MI_   — Material Instance (MI_Rock_Mossy_Wet)
		    T_    — Texture (T_Rock_D, T_Rock_N)
		    NS_   — Niagara System (NS_Explosion)
		    WBP_  — Widget Blueprint (WBP_HUD)
		    DA_   — Data Asset (DA_WeaponStats)
		  ```
	-
	- ## Data Assets
	  collapsed:: true
		- ```c++
		  // Data Asset — config/data container (no gameplay logic)
		  // Better than Blueprint defaults for data-heavy configs
		  
		  UCLASS(BlueprintType)
		  class UWeaponDataAsset : public UPrimaryDataAsset
		  {
		      GENERATED_BODY()
		  public:
		      UPROPERTY(EditDefaultsOnly, BlueprintReadOnly)
		      FText WeaponName;
		  
		      UPROPERTY(EditDefaultsOnly, BlueprintReadOnly)
		      float Damage = 25.f;
		  
		      UPROPERTY(EditDefaultsOnly, BlueprintReadOnly)
		      float FireRate = 0.1f;
		  
		      UPROPERTY(EditDefaultsOnly, BlueprintReadOnly)
		      int32 MagazineSize = 30;
		  
		      UPROPERTY(EditDefaultsOnly, BlueprintReadOnly)
		      TSoftObjectPtr<USkeletalMesh> WeaponMesh;
		  
		      UPROPERTY(EditDefaultsOnly, BlueprintReadOnly)
		      TSoftObjectPtr<USoundBase> FireSound;
		  
		      // Required for Asset Manager
		      virtual FPrimaryAssetId GetPrimaryAssetId() const override
		      {
		          return FPrimaryAssetId("WeaponData", GetFName());
		      }
		  };
		  ```
	-
	- ## Interface Pattern
	  collapsed:: true
		- ```c++
		  // UE Interface — cleaner than Cast for interaction
		  UINTERFACE(MinimalAPI, BlueprintType)
		  class UInteractable : public UInterface
		  {
		      GENERATED_BODY()
		  };
		  
		  class IInteractable
		  {
		      GENERATED_BODY()
		  public:
		      UFUNCTION(BlueprintNativeEvent, BlueprintCallable)
		      void Interact(APlayerCharacter* Interactor);
		  
		      UFUNCTION(BlueprintNativeEvent, BlueprintCallable)
		      FText GetInteractPrompt();
		  };
		  
		  // Implement on any Actor:
		  class AChest : public AActor, public IInteractable
		  {
		      void Interact_Implementation(APlayerCharacter* Interactor) override
		      {
		          OpenChest();
		      }
		  };
		  
		  // Call without knowing exact type:
		  if (HitActor->Implements<UInteractable>())
		  {
		      IInteractable::Execute_Interact(HitActor, PlayerCharacter);
		  }
		  ```
	-
	- ## Debug Helpers
	  collapsed:: true
		- ```c++
		  // Draw debug shapes (editor + PIE only in shipping builds)
		  #include "DrawDebugHelpers.h"
		  
		  DrawDebugLine(World, Start, End, FColor::Red, false, 2.f, 0, 2.f);
		  DrawDebugSphere(World, Center, Radius, 12, FColor::Green, false, 2.f);
		  DrawDebugBox(World, Center, Extent, FColor::Blue, false, 2.f);
		  DrawDebugCapsule(World, Center, HalfHeight, Radius,
		      FQuat::Identity, FColor::Yellow, false, 2.f);
		  DrawDebugString(World, Location, TEXT("Hello"), nullptr,
		      FColor::White, 2.f);
		  DrawDebugDirectionalArrow(World, Start, End, 50.f,
		      FColor::Cyan, false, 2.f);
		  
		  // Conditional debug (only in non-shipping)
		  #if !UE_BUILD_SHIPPING
		      DrawDebugSphere(GetWorld(), GetActorLocation(), 50.f, 8,
		          FColor::Red, false, -1.f);
		  #endif
		  ```
- # Packaging & Shipping
  collapsed:: true
	- ## Build Configurations
	  collapsed:: true
		- ```
		  Debug          — full debug info, no optimization. Slow.
		  DebugGame      — engine optimized, game code debug. Good for gameplay debugging.
		  Development    — optimized, some debug info. Default for development.
		  Shipping       — fully optimized, no debug. For release builds.
		  Test           — like Shipping but with some profiling enabled.
		  
		  Build targets:
		    Editor        — runs in UE editor
		    Game          — standalone game
		    Server        — dedicated server (no rendering)
		    Client        — client-only (no server code)
		  ```
	-
	- ## Packaging
	  collapsed:: true
		- ```
		  Package project:
		    Platforms → Windows → Package Project
		    or: File → Package Project → [Platform]
		  
		  Key settings (Project Settings → Packaging):
		    Build Configuration  → Shipping (for release)
		    Cook only maps       → list maps to include
		    Compress content     → smaller package size
		    Use Pak File         → bundle assets into .pak
		    Encrypt Pak          → protect assets
		  
		  Command line packaging:
		    RunUAT.bat BuildCookRun
		      -project="MyGame.uproject"
		      -platform=Win64
		      -configuration=Shipping
		      -cook -build -stage -pak -archive
		      -archivedirectory="D:/Build"
		  ```
	-
	- ## Platform-Specific
	  collapsed:: true
		- ```
		  Console (PS5/Xbox):
		    - Requires platform SDK + dev kit
		    - NDA with Sony/Microsoft required
		    - Epic provides platform-specific plugins
		  
		  Mobile (iOS/Android):
		    - Android: requires Android Studio + NDK
		    - iOS: requires Mac + Xcode + Apple Developer account
		    - Use Mobile Preview in editor for quick testing
		    - Reduce texture sizes, disable Lumen/Nanite for mobile
		    - Use Forward Rendering for mobile (better performance)
		  
		  VR/XR:
		    - Enable XR plugin (OpenXR, Oculus, SteamVR)
		    - Use VR Preview in editor
		    - Target 90Hz (11ms frame budget)
		    - Use Instanced Stereo Rendering
		    - Disable expensive post-process (DOF, motion blur)
		  ```
- # Testing & Automation
  collapsed:: true
	- ## Automation Testing
	  collapsed:: true
		- ```c++
		  // Unit test with UE Automation Framework
		  #include "Misc/AutomationTest.h"
		  
		  IMPLEMENT_SIMPLE_AUTOMATION_TEST(FMyMathTest,
		      "MyGame.Math.VectorNormalize",
		      EAutomationTestFlags::ApplicationContextMask |
		      EAutomationTestFlags::ProductFilter)
		  
		  bool FMyMathTest::RunTest(const FString& Parameters)
		  {
		      FVector v(3.f, 4.f, 0.f);
		      FVector normalized = v.GetSafeNormal();
		  
		      TestEqual("Length should be 1", normalized.Size(), 1.f, 0.001f);
		      TestTrue("X should be 0.6", FMath::IsNearlyEqual(normalized.X, 0.6f));
		      TestTrue("Y should be 0.8", FMath::IsNearlyEqual(normalized.Y, 0.8f));
		  
		      return true;
		  }
		  
		  // Run tests:
		  // Session Frontend → Automation tab
		  // or: -ExecCmds="Automation RunTests MyGame"
		  ```
	-
	- ## Functional Tests
	  collapsed:: true
		- ```
		  Functional Test Actor — place in level, runs gameplay tests.
		  
		  1. Place AFunctionalTest actor in test level
		  2. Override StartTest() in Blueprint or C++
		  3. Use AssertEqual, AssertTrue, FinishTest(Success/Failed)
		  
		  Good for:
		    - Testing gameplay mechanics in context
		    - Regression testing level setups
		    - CI/CD integration
		  ```
	-
	- ## Gauntlet (CI Testing)
	  collapsed:: true
		- ```
		  Gauntlet — UE's automated test framework for CI/CD.
		  
		  Runs tests on:
		    - Multiple platforms simultaneously
		    - Dedicated server + client configurations
		    - Performance benchmarks
		  
		  Integration:
		    RunUAT.bat RunUnreal
		      -project=MyGame.uproject
		      -platform=Win64
		      -configuration=Development
		      -test=MyGame.FunctionalTests
		  ```
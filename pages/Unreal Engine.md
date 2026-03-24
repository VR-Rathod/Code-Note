# History
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
		- ```cpp
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
	- ## Related Pages
		- [[Game Development]] — Core game dev concepts (ECS, rendering pipeline, physics, AI)
		- [[C++]] — C++ fundamentals for Unreal development
		- [[Godot]] — Godot engine A-Z reference
		- [[PathTracer Learning]] — GPU path tracing and rendering research
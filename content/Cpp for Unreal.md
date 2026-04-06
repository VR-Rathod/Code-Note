
---
seoTitle: C++ for Unreal Engine – Complete UE5 C++ Scripting Reference
description: "Complete C++ for Unreal Engine 5 reference covering UObject system, UPROPERTY/UFUNCTION macros, gameplay framework, GAS, networking, async, memory management, and advanced patterns."
keywords: "C++ Unreal Engine, UE5 C++, UObject, UPROPERTY, UFUNCTION, UCLASS, Unreal C++ scripting, gameplay framework, GAS, networking replication, Unreal macros, Unreal memory, TArray, TMap, cpp unreal guide, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: C++ for Unreal Engine
---

- # Introduction
  collapsed:: true
	- This page covers **Unreal Engine-specific C++ patterns** — the UObject system, reflection macros, engine APIs, and idioms that differ from standard C++.
	- For the full C++ language reference (STL, templates, smart pointers, move semantics, etc.) see [[Cpp]].
	- For the full Unreal Engine reference (editor, Blueprints, Nanite, Lumen, AI, networking, etc.) see [[Unreal Engine]].

- # UObject System & Reflection
  collapsed:: true
	- ## Why UObject?
	  collapsed:: true
		- ```
		  Unreal's UObject system provides:
		    Reflection    — inspect class/property info at runtime
		    Serialization — save/load objects to disk automatically
		    Garbage Collection — automatic memory management (no delete needed)
		    Blueprint Exposure — expose C++ to visual scripting
		    Networking — automatic replication of marked properties
		    CDO (Class Default Object) — default values per class
		  
		  Rule: Any class that needs these features must inherit from UObject.
		  Plain C++ structs/classes (no UObject) are fine for pure data/algorithms.
		  ```
	-
	- ## Class Hierarchy
	  collapsed:: true
		- ```
		  UObject                    — base of all Unreal objects (GC, reflection)
		  ├── UActorComponent        — component attached to an Actor
		  │   ├── USceneComponent    — component with a transform
		  │   │   ├── UMeshComponent
		  │   │   └── UCameraComponent
		  │   └── UMovementComponent
		  ├── AActor                 — anything placed in a level
		  │   ├── APawn              — actor that can be possessed
		  │   │   └── ACharacter     — pawn with mesh + movement
		  │   ├── AController        — controls a Pawn
		  │   │   ├── APlayerController
		  │   │   └── AAIController
		  │   ├── AGameModeBase      — game rules
		  │   └── AInfo              — non-visual actors (GameState, PlayerState)
		  └── UGameInstance          — persistent across levels
		  ```
	-
	- ## UCLASS Macro
	  collapsed:: true
		- ```cpp
		  // UCLASS — registers class with Unreal's reflection system
		  // Must be placed immediately before the class declaration
		  // GENERATED_BODY() must be first line inside the class
		  
		  UCLASS()                          // minimal — just registers
		  UCLASS(Blueprintable)             // can be subclassed in Blueprint
		  UCLASS(BlueprintType)             // can be used as a variable type in Blueprint
		  UCLASS(Abstract)                  // cannot be instantiated directly
		  UCLASS(NotBlueprintable)          // C++ only, no Blueprint subclassing
		  UCLASS(Config=Game)               // reads/writes to config .ini file
		  UCLASS(Within=UGameInstance)      // can only exist inside a GameInstance
		  UCLASS(Transient)                 // not saved to disk
		  UCLASS(MinimalAPI)                // only exports a few symbols (for modules)
		  
		  // Full example
		  UCLASS(Blueprintable, BlueprintType, ClassGroup=(Custom), meta=(BlueprintSpawnableComponent))
		  class MYGAME_API UMyComponent : public UActorComponent
		  {
		      GENERATED_BODY()
		  public:
		      UMyComponent();
		  };
		  ```
	-
	- ## UPROPERTY Specifiers — Complete Reference
	  collapsed:: true
		- ```cpp
		  // ── Editor Visibility ──────────────────────────────────────────
		  UPROPERTY(EditAnywhere)          // editable in editor (instance + CDO)
		  UPROPERTY(EditDefaultsOnly)      // editable only in Blueprint/CDO defaults
		  UPROPERTY(EditInstanceOnly)      // editable only on placed instances
		  UPROPERTY(VisibleAnywhere)       // visible but read-only in editor
		  UPROPERTY(VisibleDefaultsOnly)   // visible only in defaults
		  UPROPERTY(VisibleInstanceOnly)   // visible only on instances
		  
		  // ── Blueprint Access ───────────────────────────────────────────
		  UPROPERTY(BlueprintReadWrite)    // read + write from Blueprint
		  UPROPERTY(BlueprintReadOnly)     // read only from Blueprint
		  UPROPERTY(BlueprintAssignable)   // delegate can be bound in Blueprint
		  UPROPERTY(BlueprintCallable)     // delegate can be called from Blueprint
		  
		  // ── Networking ─────────────────────────────────────────────────
		  UPROPERTY(Replicated)                        // replicated to clients
		  UPROPERTY(ReplicatedUsing = OnRep_Health)    // replicated with callback
		  UPROPERTY(NotReplicated)                     // explicitly not replicated
		  
		  // ── Serialization ──────────────────────────────────────────────
		  UPROPERTY(Transient)             // not saved to disk, not replicated
		  UPROPERTY(SaveGame)              // included in SaveGame serialization
		  UPROPERTY(Config)                // read from .ini config file
		  UPROPERTY(GlobalConfig)          // read from global config
		  
		  // ── Garbage Collection ─────────────────────────────────────────
		  // Any UPROPERTY UObject* is automatically tracked by GC
		  // Raw UObject* without UPROPERTY will be GC'd unexpectedly!
		  UPROPERTY() UMyObject* SafeRef;  // GC-tracked
		  UMyObject* UnsafeRef;            // DANGER — may become dangling pointer
		  
		  // ── Organization ───────────────────────────────────────────────
		  UPROPERTY(Category = "Combat")
		  UPROPERTY(Category = "Combat|Weapons")  // subcategory
		  UPROPERTY(DisplayName = "Max HP")
		  
		  // ── Meta Specifiers ────────────────────────────────────────────
		  UPROPERTY(meta = (ClampMin = "0.0", ClampMax = "100.0"))
		  UPROPERTY(meta = (UIMin = "0", UIMax = "1"))
		  UPROPERTY(meta = (AllowPrivateAccess = "true"))  // expose private to BP
		  UPROPERTY(meta = (MakeEditWidget))               // show transform widget
		  UPROPERTY(meta = (ExposeOnSpawn = "true"))       // show on SpawnActor node
		  UPROPERTY(meta = (InlineEditConditionToggle))    // checkbox to enable field
		  UPROPERTY(meta = (EditCondition = "bEnabled"))   // only editable if bEnabled
		  
		  // ── Combined Example ───────────────────────────────────────────
		  UPROPERTY(EditAnywhere, BlueprintReadWrite, Replicated,
		            Category = "Combat", meta = (ClampMin = "0", ClampMax = "1000"))
		  float Health = 100.f;
		  ```
	-
	- ## UFUNCTION Specifiers — Complete Reference
	  collapsed:: true
		- ```cpp
		  // ── Blueprint ──────────────────────────────────────────────────
		  UFUNCTION(BlueprintCallable, Category = "Combat")
		  void Attack();                   // callable from Blueprint (has exec pin)
		  
		  UFUNCTION(BlueprintPure, Category = "Stats")
		  float GetHealthPercent() const;  // no exec pin, no side effects
		  
		  UFUNCTION(BlueprintImplementableEvent)
		  void OnDeath();                  // implemented in Blueprint, called from C++
		  // Note: no C++ body needed (or allowed)
		  
		  UFUNCTION(BlueprintNativeEvent)
		  void OnHit(float Damage);        // C++ default + Blueprint can override
		  virtual void OnHit_Implementation(float Damage); // C++ body goes here
		  
		  // ── Networking (RPCs) ──────────────────────────────────────────
		  UFUNCTION(Server, Reliable, WithValidation)
		  void ServerFire(FVector Direction);
		  void ServerFire_Implementation(FVector Direction);
		  bool ServerFire_Validate(FVector Direction) { return true; }
		  
		  UFUNCTION(Client, Reliable)
		  void ClientShowEffect(FVector Location);
		  void ClientShowEffect_Implementation(FVector Location);
		  
		  UFUNCTION(NetMulticast, Unreliable)
		  void MulticastPlaySound(USoundBase* Sound);
		  void MulticastPlaySound_Implementation(USoundBase* Sound);
		  
		  // ── Editor ─────────────────────────────────────────────────────
		  UFUNCTION(CallInEditor, Category = "Tools")
		  void BakeNavMesh();              // button appears in Details panel
		  
		  UFUNCTION(Exec)
		  void SetGodMode(bool bEnabled);  // console command: SetGodMode true
		  
		  // ── Meta ───────────────────────────────────────────────────────
		  UFUNCTION(BlueprintCallable, meta = (DisplayName = "Take Damage (Custom)"))
		  void TakeDamageCustom(float Amount);
		  
		  UFUNCTION(BlueprintCallable, meta = (ExpandEnumAsExecs = "Result"))
		  void CheckState(EMyState& Result);  // creates separate exec pins per enum value
		  ```
	-
	- ## USTRUCT
	  collapsed:: true
		- ```cpp
		  // USTRUCT — plain data struct with reflection
		  // No GC, no inheritance from UObject, no virtual functions
		  // Great for: inventory items, stats, config data, network messages
		  
		  USTRUCT(BlueprintType)
		  struct FWeaponStats
		  {
		      GENERATED_BODY()
		  
		      UPROPERTY(EditAnywhere, BlueprintReadWrite)
		      float Damage = 25.f;
		  
		      UPROPERTY(EditAnywhere, BlueprintReadWrite)
		      float FireRate = 0.5f;
		  
		      UPROPERTY(EditAnywhere, BlueprintReadWrite)
		      float Range = 1000.f;
		  
		      UPROPERTY(EditAnywhere, BlueprintReadWrite)
		      int32 MagazineSize = 30;
		  
		      // Constructors and methods are fine
		      FWeaponStats() = default;
		      FWeaponStats(float D, float FR) : Damage(D), FireRate(FR) {}
		  
		      bool IsValid() const { return Damage > 0.f && FireRate > 0.f; }
		  };
		  
		  // Usage
		  FWeaponStats Stats;
		  Stats.Damage = 50.f;
		  
		  // In UPROPERTY
		  UPROPERTY(EditAnywhere, BlueprintReadWrite)
		  FWeaponStats WeaponStats;
		  ```
	-
	- ## UENUM
	  collapsed:: true
		- ```cpp
		  // UENUM — enum with reflection, usable in Blueprint
		  
		  UENUM(BlueprintType)
		  enum class ECharacterState : uint8
		  {
		      Idle        UMETA(DisplayName = "Idle"),
		      Walking     UMETA(DisplayName = "Walking"),
		      Running     UMETA(DisplayName = "Running"),
		      Jumping     UMETA(DisplayName = "Jumping"),
		      Attacking   UMETA(DisplayName = "Attacking"),
		      Dead        UMETA(DisplayName = "Dead")
		  };
		  
		  // Usage
		  UPROPERTY(EditAnywhere, BlueprintReadWrite)
		  ECharacterState State = ECharacterState::Idle;
		  
		  // Switch
		  switch (State)
		  {
		      case ECharacterState::Idle:     HandleIdle();    break;
		      case ECharacterState::Attacking: HandleAttack(); break;
		      default: break;
		  }
		  
		  // Get string name
		  FString StateName = UEnum::GetValueAsString(State); // "ECharacterState::Idle"
		  ```

- # Unreal Container Types
  collapsed:: true
	- ## TArray — Dynamic Array
	  collapsed:: true
		- ```cpp
		  // TArray<T> — Unreal's equivalent of std::vector
		  // Supports UPROPERTY, replication, Blueprint exposure
		  
		  TArray<int32> Numbers = {1, 2, 3, 4, 5};
		  TArray<AActor*> Actors;
		  TArray<FString> Names;
		  
		  // Add / Remove
		  Numbers.Add(6);
		  Numbers.AddUnique(3);          // only adds if not present
		  Numbers.Insert(99, 2);         // insert at index 2
		  Numbers.Remove(3);             // remove first occurrence of value
		  Numbers.RemoveAt(0);           // remove at index
		  Numbers.RemoveAll([](int32 N) { return N < 3; }); // remove matching
		  Numbers.Empty();               // clear all
		  Numbers.Reset();               // clear but keep allocation
		  
		  // Access
		  int32 First = Numbers[0];
		  int32 Last  = Numbers.Last();
		  int32 Last2 = Numbers.Last(1); // second to last
		  int32 Num   = Numbers.Num();   // count
		  bool bEmpty = Numbers.IsEmpty();
		  bool bValid = Numbers.IsValidIndex(3);
		  
		  // Search
		  bool bHas = Numbers.Contains(5);
		  int32 Idx = Numbers.Find(5);           // -1 if not found
		  int32 Idx2 = Numbers.IndexOfByKey(5);
		  int32 Idx3 = Numbers.IndexOfByPredicate([](int32 N) { return N > 3; });
		  
		  // Sort
		  Numbers.Sort();
		  Numbers.Sort([](int32 A, int32 B) { return A > B; }); // descending
		  Numbers.StableSort();
		  
		  // Iteration
		  for (int32 N : Numbers) { UE_LOG(LogTemp, Log, TEXT("%d"), N); }
		  for (int32 i = 0; i < Numbers.Num(); i++) { Numbers[i] *= 2; }
		  
		  // Functional
		  TArray<int32> Evens = Numbers.FilterByPredicate([](int32 N) { return N % 2 == 0; });
		  
		  // Append / Combine
		  TArray<int32> More = {7, 8, 9};
		  Numbers.Append(More);
		  Numbers += More;
		  
		  // Reserve memory
		  Numbers.Reserve(100);
		  Numbers.SetNum(10);            // resize (fills with default)
		  Numbers.SetNumZeroed(10);      // resize and zero-fill
		  
		  // Slice
		  TArray<int32> Slice = TArray<int32>(Numbers.GetData() + 2, 3); // 3 elements from index 2
		  ```
	-
	- ## TMap — Hash Map
	  collapsed:: true
		- ```cpp
		  // TMap<K,V> — Unreal's equivalent of std::unordered_map
		  
		  TMap<FString, int32> Scores;
		  TMap<int32, AActor*> ActorById;
		  
		  // Add / Set
		  Scores.Add(TEXT("Alice"), 95);
		  Scores.Add(TEXT("Bob"),   87);
		  Scores.Emplace(TEXT("Charlie"), 92);
		  Scores.FindOrAdd(TEXT("Dave")) = 78; // add if missing, return ref
		  
		  // Access
		  int32* pScore = Scores.Find(TEXT("Alice"));    // nullptr if not found
		  int32  Score  = Scores.FindRef(TEXT("Alice")); // 0 if not found
		  int32& Ref    = Scores[TEXT("Alice")];         // assert if not found
		  
		  // Check
		  bool bHas = Scores.Contains(TEXT("Alice"));
		  int32 Num = Scores.Num();
		  
		  // Remove
		  Scores.Remove(TEXT("Bob"));
		  Scores.Empty();
		  
		  // Iterate
		  for (auto& [Key, Value] : Scores)
		  {
		      UE_LOG(LogTemp, Log, TEXT("%s: %d"), *Key, Value);
		  }
		  
		  for (auto It = Scores.CreateIterator(); It; ++It)
		  {
		      UE_LOG(LogTemp, Log, TEXT("%s: %d"), *It.Key(), It.Value());
		      // It.RemoveCurrent(); // safe removal during iteration
		  }
		  
		  // Keys / Values
		  TArray<FString> Keys;
		  Scores.GetKeys(Keys);
		  TArray<int32> Values;
		  Scores.GenerateValueArray(Values);
		  ```
	-
	- ## TSet — Hash Set
	  collapsed:: true
		- ```cpp
		  TSet<FString> Tags;
		  
		  Tags.Add(TEXT("Enemy"));
		  Tags.Add(TEXT("Boss"));
		  Tags.Add(TEXT("Enemy")); // duplicate — ignored
		  
		  bool bHas = Tags.Contains(TEXT("Boss")); // true
		  Tags.Remove(TEXT("Enemy"));
		  int32 Num = Tags.Num();
		  
		  for (const FString& Tag : Tags) { UE_LOG(LogTemp, Log, TEXT("%s"), *Tag); }
		  
		  // Set operations
		  TSet<FString> A = {TEXT("a"), TEXT("b"), TEXT("c")};
		  TSet<FString> B = {TEXT("b"), TEXT("c"), TEXT("d")};
		  TSet<FString> Union     = A.Union(B);        // {a,b,c,d}
		  TSet<FString> Intersect = A.Intersect(B);    // {b,c}
		  TSet<FString> Diff      = A.Difference(B);   // {a}
		  ```
	-
	- ## TOptional, TVariant, TSharedPtr
	  collapsed:: true
		- ```cpp
		  // TOptional<T> — may or may not have a value (like std::optional)
		  TOptional<float> MaybeHealth;
		  MaybeHealth = 75.f;
		  
		  if (MaybeHealth.IsSet())
		      UE_LOG(LogTemp, Log, TEXT("Health: %f"), MaybeHealth.GetValue());
		  
		  float Val = MaybeHealth.Get(100.f); // default if not set
		  MaybeHealth.Reset();                // clear value
		  
		  // TSharedPtr<T> — ref-counted smart pointer for non-UObject types
		  // Use for plain C++ classes that don't inherit UObject
		  TSharedPtr<FMyData> Data = MakeShared<FMyData>();
		  TSharedRef<FMyData> Ref  = MakeShared<FMyData>(); // never null
		  TWeakPtr<FMyData>   Weak = Data;                  // non-owning
		  
		  if (TSharedPtr<FMyData> Locked = Weak.Pin()) // lock weak ptr
		  {
		      Locked->DoSomething();
		  }
		  
		  // TUniquePtr<T> — exclusive ownership (like std::unique_ptr)
		  TUniquePtr<FMyData> Unique = MakeUnique<FMyData>();
		  TUniquePtr<FMyData> Moved  = MoveTemp(Unique); // transfer ownership
		  ```

- # Unreal String Types
  collapsed:: true
	- ## FString, FName, FText
	  collapsed:: true
		- ```cpp
		  // FString — mutable, heap-allocated, general purpose
		  FString Name = TEXT("Alice");
		  FString Greeting = FString::Printf(TEXT("Hello, %s! HP: %.1f"), *Name, 100.f);
		  
		  Name.Len();                          // length
		  Name.IsEmpty();                      // check empty
		  Name.ToUpper();                      // uppercase copy
		  Name.ToLower();                      // lowercase copy
		  Name.Contains(TEXT("Ali"));          // substring check
		  Name.StartsWith(TEXT("Al"));
		  Name.EndsWith(TEXT("ce"));
		  Name.Replace(TEXT("Alice"), TEXT("Bob"));
		  Name.Left(3);                        // "Ali"
		  Name.Right(3);                       // "ice"
		  Name.Mid(1, 3);                      // "lic"
		  
		  TArray<FString> Parts;
		  Name.ParseIntoArray(Parts, TEXT(","), true); // split by delimiter
		  FString Joined = FString::Join(Parts, TEXT(", "));
		  
		  // Convert
		  int32 N = FCString::Atoi(*Name);     // string to int
		  float F = FCString::Atof(*Name);     // string to float
		  FString FromInt = FString::FromInt(42);
		  FString FromFloat = FString::SanitizeFloat(3.14f);
		  
		  // Dereference with * to get TCHAR*
		  UE_LOG(LogTemp, Log, TEXT("Name: %s"), *Name);
		  
		  // FName — immutable, hashed, fast comparison, case-insensitive
		  // Use for: asset names, bone names, socket names, parameter names
		  FName BoneName = TEXT("spine_01");
		  FName SocketName = FName(TEXT("MuzzleSocket"));
		  bool bSame = (BoneName == FName(TEXT("SPINE_01"))); // true (case-insensitive)
		  FString AsString = BoneName.ToString();
		  
		  // FText — localized, display-only text
		  // Use for: UI text, subtitles, anything shown to the player
		  FText DisplayName = FText::FromString(TEXT("Player One"));
		  FText Formatted   = FText::Format(
		      LOCTEXT("ScoreFormat", "Score: {0}"),
		      FText::AsNumber(Score)
		  );
		  FString Raw = DisplayName.ToString(); // extract raw string
		  
		  // Summary:
		  // FString  — general string manipulation, file paths, debug
		  // FName    — identifiers, asset/bone/socket names (fast compare)
		  // FText    — player-facing text (localization support)
		  ```

- # Memory Management & Garbage Collection
  collapsed:: true
	- ## GC Rules
	  collapsed:: true
		- ```cpp
		  // Unreal uses a mark-and-sweep GC for UObjects
		  // GC runs periodically — objects with no references are destroyed
		  
		  // RULE 1: UObject* must be in a UPROPERTY to be GC-safe
		  UPROPERTY() UMyObject* SafeRef;    // GC tracks this
		  UMyObject* UnsafeRef;              // GC may destroy this unexpectedly!
		  
		  // RULE 2: Never use raw new/delete for UObjects
		  // BAD:
		  UMyObject* Obj = new UMyObject();  // wrong!
		  delete Obj;                        // wrong!
		  
		  // GOOD:
		  UMyObject* Obj = NewObject<UMyObject>(this); // correct
		  Obj->ConditionalBeginDestroy();    // request destruction (rarely needed)
		  
		  // RULE 3: Use TWeakObjectPtr for non-owning references
		  TWeakObjectPtr<AActor> WeakRef = SomeActor;
		  if (WeakRef.IsValid())
		  {
		      WeakRef->DoSomething(); // safe — checks validity
		  }
		  
		  // RULE 4: Use TObjectPtr<T> for UPROPERTY members (UE5+)
		  UPROPERTY()
		  TObjectPtr<UStaticMeshComponent> Mesh; // preferred over raw pointer in UE5
		  
		  // RULE 5: Actors are destroyed with Destroy(), not GC
		  SomeActor->Destroy();              // removes from world, GC cleans up later
		  ```
	-
	- ## Object Creation
	  collapsed:: true
		- ```cpp
		  // NewObject — create UObject (not Actor)
		  UMyObject* Obj = NewObject<UMyObject>(this);                    // outer = this
		  UMyObject* Obj2 = NewObject<UMyObject>(this, UMyObject::StaticClass());
		  UMyObject* Obj3 = NewObject<UMyObject>(this, TEXT("MyObjName")); // named
		  
		  // CreateDefaultSubobject — create component in constructor ONLY
		  Mesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Mesh"));
		  
		  // SpawnActor — create Actor in the world
		  FActorSpawnParameters Params;
		  Params.Owner = this;
		  Params.SpawnCollisionHandlingOverride =
		      ESpawnActorCollisionHandlingMethod::AdjustIfPossibleButAlwaysSpawn;
		  
		  AMyActor* Actor = GetWorld()->SpawnActor<AMyActor>(
		      AMyActor::StaticClass(), SpawnLocation, SpawnRotation, Params);
		  
		  // Deferred spawn — set properties before BeginPlay fires
		  AMyActor* Actor = GetWorld()->SpawnActorDeferred<AMyActor>(
		      AMyActor::StaticClass(), SpawnTransform, Owner, Instigator);
		  Actor->Health = 500.f;
		  Actor->Team = ETeam::Red;
		  UGameplayStatics::FinishSpawningActor(Actor, SpawnTransform);
		  
		  // Load class from soft reference (async-friendly)
		  TSoftClassPtr<AMyActor> SoftClass;
		  TSubclassOf<AMyActor> LoadedClass = SoftClass.LoadSynchronous();
		  ```

- # Actor & Component Lifecycle
  collapsed:: true
	- ## Full Lifecycle
	  collapsed:: true
		- ```cpp
		  class AMyActor : public AActor
		  {
		      GENERATED_BODY()
		  public:
		      // ── Construction ──────────────────────────────────────────
		      AMyActor();
		      // Called when CDO is created and when actor is placed in editor.
		      // CreateDefaultSubobject goes here. No world access.
		  
		      virtual void PostInitProperties() override;
		      // After properties are initialized from CDO.
		  
		      virtual void PostLoad() override;
		      // After actor is loaded from disk (level load).
		  
		      // ── World Entry ───────────────────────────────────────────
		      virtual void PreInitializeComponents() override;
		      // Before components are initialized.
		  
		      virtual void PostInitializeComponents() override;
		      // After all components are initialized. Safe to access components.
		  
		      virtual void BeginPlay() override;
		      // Actor is fully in the world. Game is running.
		      // Call Super::BeginPlay() first!
		  
		      // ── Per Frame ─────────────────────────────────────────────
		      virtual void Tick(float DeltaTime) override;
		      // Called every frame if PrimaryActorTick.bCanEverTick = true.
		      // Call Super::Tick(DeltaTime) first!
		  
		      // ── Destruction ───────────────────────────────────────────
		      virtual void EndPlay(const EEndPlayReason::Type Reason) override;
		      // Actor is leaving the world (destroyed, level unloaded, PIE ended).
		      // Reason: Destroyed, LevelTransition, EndPlayInEditor, Quit, RemovedFromWorld
		  
		      virtual void BeginDestroy() override;
		      // GC is about to destroy this object. Don't access other UObjects here.
		  };
		  
		  // Component lifecycle
		  class UMyComponent : public UActorComponent
		  {
		      GENERATED_BODY()
		  public:
		      virtual void InitializeComponent() override; // after PostInitializeComponents
		      virtual void BeginPlay() override;
		      virtual void TickComponent(float DeltaTime,
		          ELevelTick TickType,
		          FActorComponentTickFunction* ThisTickFunction) override;
		      virtual void EndPlay(const EEndPlayReason::Type Reason) override;
		      virtual void OnComponentDestroyed(bool bDestroyingHierarchy) override;
		  };
		  ```
	-
	- ## Tick Configuration
	  collapsed:: true
		- ```cpp
		  AMyActor::AMyActor()
		  {
		      // Enable tick (disabled by default for performance)
		      PrimaryActorTick.bCanEverTick = true;
		      PrimaryActorTick.bStartWithTickEnabled = true;
		      PrimaryActorTick.TickInterval = 0.1f; // tick every 0.1s instead of every frame
		      PrimaryActorTick.TickGroup = TG_PostPhysics; // TG_PrePhysics, TG_DuringPhysics, TG_PostPhysics
		  
		      // Component tick
		      MyComp->PrimaryComponentTick.bCanEverTick = true;
		      MyComp->PrimaryComponentTick.TickInterval = 0.5f;
		  }
		  
		  // Enable/disable tick at runtime
		  SetActorTickEnabled(false);
		  SetActorTickInterval(0.2f);
		  MyComp->SetComponentTickEnabled(false);
		  
		  // Add tick dependency (this ticks after OtherActor)
		  AddTickPrerequisiteActor(OtherActor);
		  AddTickPrerequisiteComponent(OtherComp);
		  ```

- # Delegates & Events
  collapsed:: true
	- ## Delegate Types
	  collapsed:: true
		- ```cpp
		  // Single-cast delegates (one binding at a time)
		  DECLARE_DELEGATE(FOnSimpleEvent);
		  DECLARE_DELEGATE_OneParam(FOnDamage, float);
		  DECLARE_DELEGATE_TwoParams(FOnHit, AActor*, float);
		  DECLARE_DELEGATE_RetVal(bool, FOnValidate);
		  DECLARE_DELEGATE_RetVal_OneParam(bool, FOnValidateActor, AActor*);
		  
		  // Multi-cast delegates (multiple bindings)
		  DECLARE_MULTICAST_DELEGATE(FOnGameStart);
		  DECLARE_MULTICAST_DELEGATE_OneParam(FOnScoreChanged, int32);
		  
		  // Dynamic delegates (Blueprint-bindable, slower)
		  DECLARE_DYNAMIC_DELEGATE_OneParam(FOnHealthChanged, float, NewHealth);
		  DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnDeath, AActor*, Killer);
		  
		  // Dynamic multicast — use with UPROPERTY(BlueprintAssignable)
		  UPROPERTY(BlueprintAssignable)
		  FOnDeath OnDeath;
		  ```
	-
	- ## Binding & Broadcasting
	  collapsed:: true
		- ```cpp
		  // Single-cast binding
		  FOnDamage OnDamage;
		  OnDamage.BindUObject(this, &AMyActor::HandleDamage);
		  OnDamage.BindLambda([](float D) { UE_LOG(LogTemp, Log, TEXT("Damage: %f"), D); });
		  OnDamage.BindStatic(&MyStaticFunction);
		  OnDamage.BindRaw(RawPtr, &FMyClass::Method); // raw C++ pointer (no GC safety)
		  
		  // Execute
		  OnDamage.ExecuteIfBound(25.f);  // safe — checks if bound
		  OnDamage.Execute(25.f);         // asserts if not bound
		  bool bBound = OnDamage.IsBound();
		  OnDamage.Unbind();
		  
		  // Multi-cast binding
		  FOnScoreChanged OnScoreChanged;
		  FDelegateHandle Handle = OnScoreChanged.AddUObject(this, &AMyHUD::UpdateScore);
		  OnScoreChanged.AddLambda([](int32 S) { UE_LOG(LogTemp, Log, TEXT("Score: %d"), S); });
		  
		  // Broadcast to all bound functions
		  OnScoreChanged.Broadcast(NewScore);
		  
		  // Remove specific binding
		  OnScoreChanged.Remove(Handle);
		  OnScoreChanged.RemoveAll(this); // remove all bindings from this object
		  
		  // Dynamic multicast (Blueprint-compatible)
		  OnDeath.AddDynamic(this, &AMyActor::HandleDeath);
		  OnDeath.RemoveDynamic(this, &AMyActor::HandleDeath);
		  OnDeath.Broadcast(Killer);
		  ```

- # Timers
  collapsed:: true
	- ## FTimerManager
	  collapsed:: true
		- ```cpp
		  FTimerHandle SpawnTimer;
		  FTimerHandle RegenTimer;
		  
		  void AMyActor::BeginPlay()
		  {
		      Super::BeginPlay();
		  
		      // One-shot timer — fire once after 2 seconds
		      GetWorldTimerManager().SetTimer(
		          SpawnTimer,
		          this,
		          &AMyActor::SpawnEnemy,
		          2.0f,   // delay
		          false   // loop?
		      );
		  
		      // Looping timer — fire every 5 seconds
		      GetWorldTimerManager().SetTimer(
		          RegenTimer,
		          this,
		          &AMyActor::RegenerateHealth,
		          5.0f,
		          true    // loop
		      );
		  
		      // Lambda timer
		      FTimerHandle LambdaTimer;
		      GetWorldTimerManager().SetTimer(LambdaTimer, [this]()
		      {
		          UE_LOG(LogTemp, Log, TEXT("Lambda timer fired"));
		      }, 1.0f, false);
		  
		      // Timer with initial delay different from interval
		      GetWorldTimerManager().SetTimer(SpawnTimer, this,
		          &AMyActor::SpawnEnemy, 5.0f, true, 2.0f); // interval=5s, first=2s
		  }
		  
		  void AMyActor::EndPlay(const EEndPlayReason::Type Reason)
		  {
		      // Always clear timers in EndPlay
		      GetWorldTimerManager().ClearTimer(SpawnTimer);
		      GetWorldTimerManager().ClearTimer(RegenTimer);
		      Super::EndPlay(Reason);
		  }
		  
		  // Query timers
		  bool bActive   = GetWorldTimerManager().IsTimerActive(SpawnTimer);
		  bool bPaused   = GetWorldTimerManager().IsTimerPaused(SpawnTimer);
		  float Elapsed  = GetWorldTimerManager().GetTimerElapsed(SpawnTimer);
		  float Remaining = GetWorldTimerManager().GetTimerRemaining(SpawnTimer);
		  
		  // Pause / Resume
		  GetWorldTimerManager().PauseTimer(SpawnTimer);
		  GetWorldTimerManager().UnPauseTimer(SpawnTimer);
		  ```

- # Async & Latent Actions
  collapsed:: true
	- ## Async Tasks
	  collapsed:: true
		- ```cpp
		  #include "Async/Async.h"
		  
		  // Run on background thread
		  Async(EAsyncExecution::ThreadPool, []()
		  {
		      // Heavy computation — runs on thread pool
		      FPlatformProcess::Sleep(1.0f);
		      UE_LOG(LogTemp, Log, TEXT("Background work done"));
		  });
		  
		  // Run on background thread, then callback on game thread
		  Async(EAsyncExecution::ThreadPool, []() -> int32
		  {
		      return HeavyComputation();
		  })
		  .Then([](TFuture<int32> Future)
		  {
		      int32 Result = Future.Get();
		      // Back on calling thread — may not be game thread
		  });
		  
		  // Run on game thread (from any thread)
		  AsyncTask(ENamedThreads::GameThread, [this]()
		  {
		      // Safe to access UObjects here
		      Health = 100.f;
		  });
		  
		  // TFuture / TPromise
		  TPromise<FString> Promise;
		  TFuture<FString> Future = Promise.GetFuture();
		  
		  Async(EAsyncExecution::ThreadPool, [Promise = MoveTemp(Promise)]() mutable
		  {
		      FString Result = DoWork();
		      Promise.SetValue(Result);
		  });
		  
		  FString Value = Future.Get(); // blocks until ready
		  ```
	-
	- ## Latent Actions (Blueprint-compatible async)
	  collapsed:: true
		- ```cpp
		  // Latent action — async operation that shows as a node with exec pins in Blueprint
		  
		  UFUNCTION(BlueprintCallable, meta = (Latent, LatentInfo = "LatentInfo",
		      WorldContext = "WorldContextObject"), Category = "Async")
		  static void LoadDataAsync(
		      UObject* WorldContextObject,
		      FLatentActionInfo LatentInfo,
		      FString DataPath,
		      FString& OutData);
		  
		  // Implementation
		  void UMyBlueprintLibrary::LoadDataAsync(
		      UObject* WorldContextObject,
		      FLatentActionInfo LatentInfo,
		      FString DataPath,
		      FString& OutData)
		  {
		      if (UWorld* World = GEngine->GetWorldFromContextObject(WorldContextObject,
		          EGetWorldErrorMode::LogAndReturnNull))
		      {
		          FLatentActionManager& LAM = World->GetLatentActionManager();
		          if (!LAM.FindExistingAction<FMyLatentAction>(
		              LatentInfo.CallbackTarget, LatentInfo.UUID))
		          {
		              LAM.AddNewAction(LatentInfo.CallbackTarget, LatentInfo.UUID,
		                  new FMyLatentAction(LatentInfo, DataPath, OutData));
		          }
		      }
		  }
		  ```

- # Interfaces
  collapsed:: true
	- ## UInterface
	  collapsed:: true
		- ```cpp
		  // Declare interface — two classes needed
		  UINTERFACE(MinimalAPI, Blueprintable)
		  class UDamageable : public UInterface
		  {
		      GENERATED_BODY()
		  };
		  
		  class IDamageable
		  {
		      GENERATED_BODY()
		  public:
		      // Pure virtual — must implement in C++
		      virtual void TakeDamage(float Amount) = 0;
		  
		      // BlueprintNativeEvent — C++ default, Blueprint can override
		      UFUNCTION(BlueprintNativeEvent, BlueprintCallable)
		      void OnDamaged(float Amount, AActor* DamageCauser);
		      virtual void OnDamaged_Implementation(float Amount, AActor* DamageCauser) {}
		  
		      // BlueprintImplementableEvent — implemented in Blueprint only
		      UFUNCTION(BlueprintImplementableEvent, BlueprintCallable)
		      void OnHealed(float Amount);
		  };
		  
		  // Implement in a class
		  UCLASS()
		  class AEnemy : public ACharacter, public IDamageable
		  {
		      GENERATED_BODY()
		  public:
		      virtual void TakeDamage(float Amount) override;
		      virtual void OnDamaged_Implementation(float Amount, AActor* Causer) override;
		  };
		  
		  // Call interface function (works on any actor, even Blueprint-only)
		  void AWeapon::Hit(AActor* Target)
		  {
		      // Check if implements interface
		      if (Target->Implements<UDamageable>())
		      {
		          IDamageable::Execute_OnDamaged(Target, Damage, this); // dynamic dispatch
		      }
		  
		      // Or cast (C++ only)
		      if (IDamageable* Damageable = Cast<IDamageable>(Target))
		      {
		          Damageable->TakeDamage(Damage);
		      }
		  }
		  ```

- # Subsystems
  collapsed:: true
	- ## USubsystem Types
	  collapsed:: true
		- ```cpp
		  // Subsystems — auto-created singletons scoped to their owner
		  // No manual registration needed — engine creates/destroys automatically
		  
		  // UGameInstanceSubsystem — lives as long as GameInstance (across levels)
		  UCLASS()
		  class UInventorySubsystem : public UGameInstanceSubsystem
		  {
		      GENERATED_BODY()
		  public:
		      virtual void Initialize(FSubsystemCollectionBase& Collection) override;
		      virtual void Deinitialize() override;
		  
		      UFUNCTION(BlueprintCallable)
		      void AddItem(FName ItemId, int32 Quantity);
		  
		      UFUNCTION(BlueprintCallable, BlueprintPure)
		      int32 GetItemCount(FName ItemId) const;
		  
		  private:
		      TMap<FName, int32> Inventory;
		  };
		  
		  // Access from anywhere
		  UGameInstance* GI = GetGameInstance();
		  UInventorySubsystem* Inv = GI->GetSubsystem<UInventorySubsystem>();
		  Inv->AddItem(TEXT("Sword"), 1);
		  
		  // UWorldSubsystem — one per World (level)
		  UCLASS()
		  class USpawnSubsystem : public UWorldSubsystem
		  {
		      GENERATED_BODY()
		  public:
		      virtual void OnWorldBeginPlay(UWorld& InWorld) override;
		      void RegisterSpawnPoint(ASpawnPoint* Point);
		  };
		  
		  // Access
		  USpawnSubsystem* Spawner = GetWorld()->GetSubsystem<USpawnSubsystem>();
		  
		  // ULocalPlayerSubsystem — one per local player
		  // UEngineSubsystem — one for the entire engine lifetime
		  ```

- # Networking — Replication In Depth
  collapsed:: true
	- ## Replication Setup
	  collapsed:: true
		- ```cpp
		  AMyCharacter::AMyCharacter()
		  {
		      bReplicates = true;              // replicate actor existence
		      SetReplicateMovement(true);      // replicate transform
		  }
		  
		  // GetLifetimeReplicatedProps — declare which properties replicate
		  void AMyCharacter::GetLifetimeReplicatedProps(
		      TArray<FLifetimeProperty>& OutLifetimeProps) const
		  {
		      Super::GetLifetimeReplicatedProps(OutLifetimeProps);
		  
		      DOREPLIFETIME(AMyCharacter, Health);           // replicate to all
		      DOREPLIFETIME_CONDITION(AMyCharacter, Ammo,
		          COND_OwnerOnly);                           // only to owning client
		      DOREPLIFETIME_CONDITION(AMyCharacter, bIsAiming,
		          COND_SkipOwner);                           // all except owner
		      DOREPLIFETIME_CONDITION(AMyCharacter, TeamColor,
		          COND_InitialOnly);                         // only on initial replication
		      DOREPLIFETIME_CONDITION_NOTIFY(AMyCharacter, Shield,
		          COND_None, REPNOTIFY_Always);              // always call OnRep even if value unchanged
		  }
		  ```
	-
	- ## Network Roles & Authority
	  collapsed:: true
		- ```cpp
		  // Check network role
		  bool bIsServer  = HasAuthority();                          // true on server
		  bool bIsClient  = !HasAuthority();
		  bool bIsOwner   = IsLocallyControlled();                   // true on owning client
		  
		  ENetRole Role = GetLocalRole();
		  // ROLE_Authority       — server (owns the actor)
		  // ROLE_AutonomousProxy — owning client (player's own character)
		  // ROLE_SimulatedProxy  — non-owning client (other players)
		  // ROLE_None            — not replicated
		  
		  // Common pattern
		  void AMyCharacter::TakeDamage(float Amount)
		  {
		      if (!HasAuthority()) return; // only server modifies health
		  
		      Health -= Amount;
		      if (Health <= 0.f) Die();
		  }
		  
		  // RPC patterns
		  void AMyCharacter::Fire()
		  {
		      if (IsLocallyControlled())
		      {
		          PlayFireAnimation();        // local cosmetic
		          ServerFire(GetAimDir());    // tell server
		      }
		  }
		  
		  void AMyCharacter::ServerFire_Implementation(FVector Dir)
		  {
		      // Server: authoritative logic
		      SpawnProjectile(Dir);
		      MulticastFireEffect(GetActorLocation()); // tell all clients
		  }
		  
		  void AMyCharacter::MulticastFireEffect_Implementation(FVector Loc)
		  {
		      // All clients: cosmetic effects
		      UGameplayStatics::SpawnEmitterAtLocation(GetWorld(), MuzzleFlash, Loc);
		      UGameplayStatics::PlaySoundAtLocation(GetWorld(), FireSound, Loc);
		  }
		  ```

- # Asset Management
  collapsed:: true
	- ## Soft References & Async Loading
	  collapsed:: true
		- ```cpp
		  // Hard reference — always loaded in memory
		  UPROPERTY(EditDefaultsOnly)
		  UStaticMesh* HardMesh;  // loads when this object loads
		  
		  // Soft reference — path only, load on demand
		  UPROPERTY(EditDefaultsOnly)
		  TSoftObjectPtr<UStaticMesh> SoftMesh;
		  
		  UPROPERTY(EditDefaultsOnly)
		  TSoftClassPtr<AEnemy> SoftEnemyClass;
		  
		  // Synchronous load (blocks game thread — avoid in gameplay)
		  UStaticMesh* Mesh = SoftMesh.LoadSynchronous();
		  
		  // Async load (non-blocking — preferred)
		  void AMyActor::LoadMeshAsync()
		  {
		      TArray<FSoftObjectPath> AssetsToLoad;
		      AssetsToLoad.Add(SoftMesh.ToSoftObjectPath());
		  
		      FStreamableManager& Streamable = UAssetManager::GetStreamableManager();
		      Streamable.RequestAsyncLoad(AssetsToLoad,
		          FStreamableDelegate::CreateUObject(this, &AMyActor::OnMeshLoaded));
		  }
		  
		  void AMyActor::OnMeshLoaded()
		  {
		      if (UStaticMesh* Mesh = SoftMesh.Get())
		      {
		          GetStaticMeshComponent()->SetStaticMesh(Mesh);
		      }
		  }
		  
		  // Primary Asset — managed by Asset Manager
		  // Override UPrimaryDataAsset for items, characters, levels
		  UCLASS()
		  class UItemDefinition : public UPrimaryDataAsset
		  {
		      GENERATED_BODY()
		  public:
		      virtual FPrimaryAssetId GetPrimaryAssetId() const override
		      {
		          return FPrimaryAssetId(TEXT("Item"), GetFName());
		      }
		  
		      UPROPERTY(EditDefaultsOnly)
		      FText DisplayName;
		  
		      UPROPERTY(EditDefaultsOnly)
		      TSoftObjectPtr<UTexture2D> Icon;
		  };
		  ```

- # Common Unreal C++ Patterns
  collapsed:: true
	- ## Component Pattern
	  collapsed:: true
		- ```cpp
		  // Prefer composition over inheritance — add components for features
		  
		  UCLASS()
		  class UHealthComponent : public UActorComponent
		  {
		      GENERATED_BODY()
		  public:
		      UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Health")
		      float MaxHealth = 100.f;
		  
		      UPROPERTY(BlueprintReadOnly, Replicated, Category = "Health")
		      float CurrentHealth;
		  
		      DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(
		          FOnHealthChanged, float, NewHealth, float, Delta);
		      UPROPERTY(BlueprintAssignable)
		      FOnHealthChanged OnHealthChanged;
		  
		      DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnDeath);
		      UPROPERTY(BlueprintAssignable)
		      FOnDeath OnDeath;
		  
		      virtual void BeginPlay() override;
		  
		      UFUNCTION(BlueprintCallable, Category = "Health")
		      void ApplyDamage(float Amount);
		  
		      UFUNCTION(BlueprintCallable, Category = "Health")
		      void Heal(float Amount);
		  
		      UFUNCTION(BlueprintPure, Category = "Health")
		      float GetHealthPercent() const { return CurrentHealth / MaxHealth; }
		  
		      UFUNCTION(BlueprintPure, Category = "Health")
		      bool IsDead() const { return CurrentHealth <= 0.f; }
		  
		  private:
		      void SetHealth(float NewHealth);
		  };
		  
		  // Usage — any actor can have health by adding this component
		  // AEnemy, APlayer, ADestructibleProp — all use the same component
		  ```
	-
	- ## Data Asset Pattern
	  collapsed:: true
		- ```cpp
		  // UDataAsset — ScriptableObject equivalent for Unreal
		  // Create in editor, reference in actors, no world dependency
		  
		  UCLASS(BlueprintType)
		  class UEnemyData : public UDataAsset
		  {
		      GENERATED_BODY()
		  public:
		      UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Identity")
		      FText EnemyName;
		  
		      UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Stats")
		      float MaxHealth = 100.f;
		  
		      UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Stats")
		      float MoveSpeed = 300.f;
		  
		      UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Stats")
		      float AttackDamage = 25.f;
		  
		      UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Stats")
		      float AttackRange = 150.f;
		  
		      UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Rewards")
		      int32 ScoreValue = 100;
		  
		      UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Rewards")
		      TSoftObjectPtr<UStaticMesh> DropMesh;
		  };
		  
		  // In enemy class
		  UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Config")
		  UEnemyData* EnemyData;
		  
		  void AEnemy::BeginPlay()
		  {
		      Super::BeginPlay();
		      if (EnemyData)
		      {
		          HealthComp->MaxHealth = EnemyData->MaxHealth;
		          GetCharacterMovement()->MaxWalkSpeed = EnemyData->MoveSpeed;
		      }
		  }
		  ```
	-
	- ## Object Pool Pattern
	  collapsed:: true
		- ```cpp
		  UCLASS()
		  class UActorPool : public UObject
		  {
		      GENERATED_BODY()
		  public:
		      void Initialize(TSubclassOf<AActor> InClass, int32 PoolSize, UWorld* World)
		      {
		          ActorClass = InClass;
		          for (int32 i = 0; i < PoolSize; i++)
		          {
		              AActor* Actor = World->SpawnActor<AActor>(ActorClass);
		              Actor->SetActorHiddenInGame(true);
		              Actor->SetActorEnableCollision(false);
		              Pool.Add(Actor);
		          }
		      }
		  
		      AActor* Get(FVector Location, FRotator Rotation)
		      {
		          if (Pool.IsEmpty())
		          {
		              // Expand pool if needed
		              AActor* New = GetWorld()->SpawnActor<AActor>(ActorClass);
		              Pool.Add(New);
		          }
		          AActor* Actor = Pool.Pop();
		          Actor->SetActorLocationAndRotation(Location, Rotation);
		          Actor->SetActorHiddenInGame(false);
		          Actor->SetActorEnableCollision(true);
		          Active.Add(Actor);
		          return Actor;
		      }
		  
		      void Return(AActor* Actor)
		      {
		          Active.Remove(Actor);
		          Actor->SetActorHiddenInGame(true);
		          Actor->SetActorEnableCollision(false);
		          Pool.Add(Actor);
		      }
		  
		  private:
		      TSubclassOf<AActor> ActorClass;
		      TArray<AActor*> Pool;
		      TArray<AActor*> Active;
		  };
		  ```
	-
	- ## State Machine Pattern
	  collapsed:: true
		- ```cpp
		  // Clean state machine using UObject states
		  UCLASS(Abstract)
		  class UEnemyState : public UObject
		  {
		      GENERATED_BODY()
		  public:
		      virtual void Enter(AEnemy* Enemy) {}
		      virtual void Update(AEnemy* Enemy, float DeltaTime) {}
		      virtual void Exit(AEnemy* Enemy) {}
		  };
		  
		  UCLASS()
		  class UIdleState : public UEnemyState
		  {
		      GENERATED_BODY()
		  public:
		      virtual void Enter(AEnemy* Enemy) override
		      {
		          Enemy->GetCharacterMovement()->StopMovementImmediately();
		          Enemy->PlayAnimation(Enemy->IdleAnim);
		      }
		      virtual void Update(AEnemy* Enemy, float DeltaTime) override
		      {
		          if (Enemy->CanSeePlayer())
		              Enemy->ChangeState(NewObject<UChaseState>(Enemy));
		      }
		  };
		  
		  // In AEnemy
		  UPROPERTY()
		  UEnemyState* CurrentState;
		  
		  void AEnemy::ChangeState(UEnemyState* NewState)
		  {
		      if (CurrentState) CurrentState->Exit(this);
		      CurrentState = NewState;
		      if (CurrentState) CurrentState->Enter(this);
		  }
		  
		  void AEnemy::Tick(float DeltaTime)
		  {
		      Super::Tick(DeltaTime);
		      if (CurrentState) CurrentState->Update(this, DeltaTime);
		  }
		  ```

- # Debugging & Logging
  collapsed:: true
	- ## UE_LOG & Debug Helpers
	  collapsed:: true
		- ```cpp
		  // UE_LOG(Category, Verbosity, Format, ...)
		  UE_LOG(LogTemp, Log,     TEXT("Info: %s"), *Name);
		  UE_LOG(LogTemp, Warning, TEXT("Health low: %f"), Health);
		  UE_LOG(LogTemp, Error,   TEXT("Null ref in %s"), *GetName());
		  UE_LOG(LogTemp, Fatal,   TEXT("Critical failure")); // crashes
		  
		  // Custom log category (in header)
		  DECLARE_LOG_CATEGORY_EXTERN(LogMyGame, Log, All);
		  // In .cpp:
		  DEFINE_LOG_CATEGORY(LogMyGame);
		  // Usage:
		  UE_LOG(LogMyGame, Warning, TEXT("Custom category log"));
		  
		  // Conditional log (only in debug builds)
		  UE_LOG(LogTemp, VeryVerbose, TEXT("Verbose: %f"), Value);
		  // Set log verbosity: LogTemp VeryVerbose (in console or ini)
		  
		  // On-screen messages
		  GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Red,
		      FString::Printf(TEXT("Health: %.1f"), Health));
		  GEngine->AddOnScreenDebugMessage(1, 0.f, FColor::Green,
		      TEXT("Key=1 persists until overwritten"));
		  
		  // Debug draw
		  DrawDebugSphere(GetWorld(), Location, 50.f, 12, FColor::Red, false, 2.f);
		  DrawDebugBox(GetWorld(), Center, Extent, FColor::Blue, false, 1.f);
		  DrawDebugLine(GetWorld(), Start, End, FColor::Green, false, 1.f, 0, 2.f);
		  DrawDebugPoint(GetWorld(), Point, 10.f, FColor::Yellow, false, 2.f);
		  DrawDebugString(GetWorld(), Location, TEXT("Label"), nullptr, FColor::White, 2.f);
		  DrawDebugDirectionalArrow(GetWorld(), Start, End, 50.f, FColor::Cyan, false, 2.f);
		  
		  // Ensure / check macros
		  check(Pointer != nullptr);           // crash in all builds if false
		  checkf(Health > 0, TEXT("Dead!"));   // crash with message
		  ensure(Value > 0);                   // log + continue in non-shipping
		  ensureMsgf(Value > 0, TEXT("Bad value: %f"), Value);
		  verify(DoSomething());               // like check but evaluates in shipping
		  ```

- # More Learn
	- [[Cpp]] - Full C++ language reference (STL, templates, smart pointers, move semantics)
	- [[Unreal Engine]] - Full Unreal Engine reference (editor, Blueprints, Nanite, Lumen, GAS, networking)
	- [Unreal Engine C++ API Reference](https://docs.unrealengine.com/5.0/en-US/API/)
	- [Unreal Engine C++ Programming Guide](https://docs.unrealengine.com/5.0/en-US/programming-and-scripting/programming-with-cplusplus/)
	- [Unreal C++ Gameplay Framework](https://docs.unrealengine.com/5.0/en-US/gameplay-framework-in-unreal-engine/)
	- [Unreal Source Code (GitHub)](https://github.com/EpicGames/UnrealEngine)
	- [Benui — UE5 C++ Tips](https://benui.ca/)
	- [Unreal Community Wiki](https://unrealcommunity.wiki/)
	- [Tom Looman — UE5 C++ Course](https://www.tomlooman.com/)

---
seoTitle: Association in OOP – Complete In-Depth Guide | Uses-A Relationship, Directionality, Multiplicity
description: "Deep dive into Association in OOP. Covers the uses-a relationship, unidirectional vs bidirectional association, multiplicity (one-to-one, one-to-many), difference from aggregation and composition, and examples in Python, C++, Java, JavaScript, and C#."
keywords: "association, OOP, uses-a relationship, object relationship, unidirectional association, bidirectional association, multiplicity, one-to-many, Python association, Java association, VR-Rathod, Code-Note"
displayTitle: Association
treeTitle: DSA - OOP - Association
---

> [!info] What is Association?
> **Association** is the most general **object relationship** in OOP — it models a **"uses-a"** relationship between two classes. One class uses or interacts with another, but neither owns the other. Both objects have **independent lifecycles** and the relationship may be temporary or permanent.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- A **Doctor** and a **Patient** have an association — the doctor treats the patient, the patient visits the doctor. They use each other, but neither owns the other. The doctor can exist without that patient, and the patient can switch doctors.
		- | Real World | OOP |
		  |---|---|
		  | Doctor ↔ Patient | **Association** — uses each other |
		  | Teacher ↔ Student | **Association** — loose relationship |
		  | Company ↔ Customer | **Association** — interact, don't own |
	-
	- ## Types of Association
	  collapsed:: true
		- | Type | Description | Example |
		  |---|---|---|
		  | **Unidirectional** | A knows about B, but B doesn't know A | `Order` → `Product` |
		  | **Bidirectional** | A knows B and B knows A | `Teacher` ↔ `Student` |
		  | **One-to-One** | One A associated with one B | `Person` — `Passport` |
		  | **One-to-Many** | One A associated with many Bs | `Teacher` → many `Students` |
		  | **Many-to-Many** | Many As associated with many Bs | `Students` ↔ `Courses` |
	-
	- ## Association vs Aggregation vs Composition
	  collapsed:: true
		- ```mermaid
		  flowchart LR
		      A["Association\n(uses-a)\nLoose coupling\nNo ownership\nIndependent lifecycle"]
		      B["Aggregation\n(has-a, weak)\nWeak ownership\nChild can exist independently"]
		      C["Composition\n(has-a, strong)\nStrong ownership\nChild destroyed with parent"]
		      A -->|"stronger"| B -->|"stronger"| C
		  ```
		- | | Association | Aggregation | Composition |
		  |---|---|---|---|
		  | Ownership | None | Weak | Strong |
		  | Lifecycle | Independent | Independent | Dependent |
		  | Example | Doctor–Patient | Team–Player | Car–Engine |
		  | UML | Simple line | ◇ empty diamond | ◆ filled diamond |
- # Implementation
  collapsed:: true
	- > [!note] A `Doctor`–`Patient` bidirectional association and `Teacher`–`Student` one-to-many association.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  from __future__ import annotations
	  from typing import Optional
	  
	  class Doctor:
	      def __init__(self, name: str, specialty: str):
	          self.name = name
	          self.specialty = specialty
	          self._patients: list[Patient] = []
	  
	      def add_patient(self, patient: Patient) -> None:
	          if patient not in self._patients:
	              self._patients.append(patient)
	              patient.set_doctor(self)  # bidirectional link
	  
	      def remove_patient(self, patient: Patient) -> None:
	          if patient in self._patients:
	              self._patients.remove(patient)
	              patient.set_doctor(None)
	  
	      def treat_patient(self, patient: Patient) -> str:
	          return f"Dr. {self.name} ({self.specialty}) treating {patient.name}"
	  
	      def list_patients(self) -> list[str]:
	          return [p.name for p in self._patients]
	  
	      def __repr__(self) -> str:
	          return f"Doctor(name={self.name!r}, specialty={self.specialty!r})"
	  
	  
	  class Patient:
	      def __init__(self, name: str, age: int):
	          self.name = name
	          self.age = age
	          self._doctor: Optional[Doctor] = None  # association reference (not owned)
	  
	      def set_doctor(self, doctor: Optional[Doctor]) -> None:
	          self._doctor = doctor
	  
	      @property
	      def doctor(self) -> Optional[Doctor]:
	          return self._doctor
	  
	      def consult(self) -> str:
	          if self._doctor:
	              return self._doctor.treat_patient(self)
	          return f"{self.name} has no doctor assigned."
	  
	      def __repr__(self) -> str:
	          return f"Patient(name={self.name!r}, age={self.age})"
	  
	  
	  # Usage
	  doc1 = Doctor("Smith", "Cardiology")
	  doc2 = Doctor("Lee", "Neurology")
	  
	  p1 = Patient("Alice", 34)
	  p2 = Patient("Bob", 52)
	  p3 = Patient("Carol", 28)
	  
	  doc1.add_patient(p1)
	  doc1.add_patient(p2)
	  doc2.add_patient(p3)
	  
	  print(p1.consult())         # Dr. Smith (Cardiology) treating Alice
	  print(p2.consult())         # Dr. Smith (Cardiology) treating Bob
	  print(p3.consult())         # Dr. Lee (Neurology) treating Carol
	  print(doc1.list_patients()) # ['Alice', 'Bob']
	  
	  doc1.remove_patient(p2)
	  doc2.add_patient(p2)        # Patient switches doctors
	  print(p2.consult())         # Dr. Lee (Neurology) treating Bob
	  
	  # Both objects exist independently — no ownership
	  del doc1
	  print(p1)  # Patient still exists: Patient(name='Alice', age=34)
	  print(p1.doctor)  # None — association cleaned up
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <string>
	  #include <vector>
	  #include <algorithm>
	  
	  class Patient;  // Forward declaration
	  
	  class Doctor {
	      std::string name_, specialty_;
	      std::vector<Patient*> patients_;  // Pointers — no ownership
	  public:
	      Doctor(std::string name, std::string specialty)
	          : name_(name), specialty_(specialty) {}
	  
	      void addPatient(Patient* p);
	      std::string treat(const std::string& patientName) const {
	          return "Dr. " + name_ + " treating " + patientName;
	      }
	      std::string getName() const { return name_; }
	      ~Doctor() { std::cout << "[Doctor " << name_ << " removed]\n"; }
	  };
	  
	  class Patient {
	      std::string name_;
	      int age_;
	      Doctor* doctor_ = nullptr;  // Pointer — association (no ownership)
	  public:
	      Patient(std::string name, int age) : name_(name), age_(age) {}
	      void setDoctor(Doctor* d) { doctor_ = d; }
	      std::string consult() const {
	          if (doctor_) return doctor_->treat(name_);
	          return name_ + " has no doctor.";
	      }
	      std::string getName() const { return name_; }
	  };
	  
	  void Doctor::addPatient(Patient* p) {
	      patients_.push_back(p);
	      p->setDoctor(this);
	  }
	  
	  int main() {
	      Doctor doc("Smith", "Cardiology");
	      Patient p1("Alice", 34), p2("Bob", 52);
	      doc.addPatient(&p1);
	      doc.addPatient(&p2);
	      std::cout << p1.consult() << "\n";  // Dr. Smith treating Alice
	      std::cout << p2.consult() << "\n";  // Dr. Smith treating Bob
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  import java.util.*;
	  
	  class Doctor {
	      private String name, specialty;
	      private List<Patient> patients = new ArrayList<>();
	  
	      Doctor(String name, String specialty) { this.name = name; this.specialty = specialty; }
	  
	      public void addPatient(Patient p) {
	          if (!patients.contains(p)) {
	              patients.add(p);
	              p.setDoctor(this);
	          }
	      }
	      public String treat(String patientName) {
	          return "Dr. " + name + " (" + specialty + ") treating " + patientName;
	      }
	      public String getName() { return name; }
	  }
	  
	  class Patient {
	      private String name;
	      private int age;
	      private Doctor doctor;  // Association — not owned
	  
	      Patient(String name, int age) { this.name = name; this.age = age; }
	      public void setDoctor(Doctor d) { this.doctor = d; }
	      public String consult() {
	          return doctor != null ? doctor.treat(name) : name + " has no doctor.";
	      }
	      public String getName() { return name; }
	  }
	  
	  class AssociationDemo {
	      public static void main(String[] args) {
	          Doctor doc = new Doctor("Smith", "Cardiology");
	          Patient p1 = new Patient("Alice", 34);
	          Patient p2 = new Patient("Bob", 52);
	          doc.addPatient(p1);
	          doc.addPatient(p2);
	          System.out.println(p1.consult());
	          System.out.println(p2.consult());
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  class Doctor {
	      constructor(name, specialty) {
	          this.name = name;
	          this.specialty = specialty;
	          this._patients = [];
	      }
	  
	      addPatient(patient) {
	          if (!this._patients.includes(patient)) {
	              this._patients.push(patient);
	              patient.setDoctor(this);
	          }
	      }
	  
	      treat(patientName) {
	          return `Dr. ${this.name} (${this.specialty}) treating ${patientName}`;
	      }
	  
	      get patients() { return this._patients.map(p => p.name); }
	  }
	  
	  class Patient {
	      constructor(name, age) {
	          this.name = name;
	          this.age = age;
	          this._doctor = null;
	      }
	  
	      setDoctor(doctor) { this._doctor = doctor; }
	  
	      consult() {
	          return this._doctor
	              ? this._doctor.treat(this.name)
	              : `${this.name} has no doctor.`;
	      }
	  }
	  
	  const doc = new Doctor("Smith", "Cardiology");
	  const p1 = new Patient("Alice", 34);
	  const p2 = new Patient("Bob", 52);
	  doc.addPatient(p1);
	  doc.addPatient(p2);
	  console.log(p1.consult());   // Dr. Smith (Cardiology) treating Alice
	  console.log(doc.patients);   // ['Alice', 'Bob']
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  using System.Collections.Generic;
	  
	  class Doctor {
	      public string Name { get; }
	      public string Specialty { get; }
	      private List<Patient> patients = new();
	  
	      public Doctor(string name, string specialty) { Name = name; Specialty = specialty; }
	  
	      public void AddPatient(Patient p) {
	          if (!patients.Contains(p)) {
	              patients.Add(p);
	              p.SetDoctor(this);
	          }
	      }
	      public string Treat(string patientName) =>
	          $"Dr. {Name} ({Specialty}) treating {patientName}";
	  }
	  
	  class Patient {
	      public string Name { get; }
	      private Doctor? doctor;
	  
	      public Patient(string name) { Name = name; }
	      public void SetDoctor(Doctor? d) => doctor = d;
	      public string Consult() =>
	          doctor != null ? doctor.Treat(Name) : $"{Name} has no doctor.";
	  
	      static void Main() {
	          var doc = new Doctor("Smith", "Cardiology");
	          var p1 = new Patient("Alice");
	          var p2 = new Patient("Bob");
	          doc.AddPatient(p1);
	          doc.AddPatient(p2);
	          Console.WriteLine(p1.Consult());
	          Console.WriteLine(p2.Consult());
	      }
	  }
	  ```
	  
	  :::
- # Key Takeaways
  collapsed:: true
	- **Association** = loosest relationship — one class "uses" another, no ownership.
	- Both objects have **independent lifecycles** — destroying one doesn't destroy the other.
	- Can be **unidirectional** (A → B) or **bidirectional** (A ↔ B).
	- Association links are represented as **references/pointers** — not embedded instances.
	- Hierarchy of coupling: **Association < [[Aggregation]] < [[Composition]]**
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks — Association in OOP](https://www.geeksforgeeks.org/association-composition-aggregation-in-java/)
		- [UML Associations — IBM](https://developer.ibm.com/articles/the-class-diagram/)
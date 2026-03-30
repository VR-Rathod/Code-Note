---
seoTitle: Observer Pattern – Behavioral Design Pattern Reference Guide
description: "Observer pattern defines a one-to-many dependency for event notification. Covers subject, observer, publish-subscribe, event systems, and reactive programming."
keywords: "observer pattern, design pattern, behavioral pattern, subject, observer, publish-subscribe, event system, reactive programming, OOP, software design, event-driven"
---

- # Explanation
	- The **Observer Pattern** is a behavioral design pattern where an object (the **subject**) maintains a list of observers that need to be notified when the subject’s state changes.
	- **"Subject-Observer"**: The subject is responsible for notifying its observers about changes.
	- **Use Case**: Ideal for event-driven systems, where you need to update multiple components when the state of an object changes.
-
- # Steps
	- Define a **Subject** class that keeps track of its observers.
	-
	- Define an **Observer** interface that receives updates from the subject.
	-
	- Implement concrete **Observers** that react to changes.
-
- ```python
  class Observer:
      def update(self, state):
          pass
  
  class ConcreteObserver(Observer):
      def update(self, state):
          print(f"State updated to: {state}")
  
  class Subject:
      def __init__(self):
          self._observers = []
          self._state = None
  
      def add_observer(self, observer):
          self._observers.append(observer)
  
      def set_state(self, state):
          self._state = state
          self.notify()
  
      def notify(self):
          for observer in self._observers:
              observer.update(self._state)
  
  # Observer pattern usage
  subject = Subject()
  observer1 = ConcreteObserver()
  subject.add_observer(observer1)
  
  subject.set_state(10)  # Output: State updated to: 10
  ```
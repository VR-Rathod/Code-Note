---
seoTitle: Iterator Pattern in OOP – Complete In-Depth Guide | Behavioral Design Pattern, Traversal
description: "Deep dive into the Iterator design pattern. Covers sequential access to collections without exposing structure, custom iterators, Python iterators protocol, and examples in Python, C++, Java, JavaScript, and C#."
keywords: "iterator pattern, behavioral design pattern, iteration protocol, collection traversal, custom iterator, Python iterator, Java iterator, C++ iterator, GoF, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Iterator Pattern
---

> [!info] What is the Iterator Pattern?
> The **Iterator Pattern** is a **behavioral design pattern** that provides a way to **sequentially access elements of a collection** without exposing its underlying structure (array, tree, graph, etc.). It decouples the traversal algorithm from the collection, allowing the same iteration interface to work with lists, trees, databases, or any custom structure.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Think of a **TV remote** 📺:
		  - You press "Next" to go to the next channel — you don't know if channels are stored in an array, a linked list, or fetched from a server.
		  - The remote (iterator) abstracts "what's next" from "how they're stored."
		  - Or: a **book page turner** 📖 — you turn pages without needing to understand the book's binding mechanism.
	-
	- ## The Iterator Protocol
	  collapsed:: true
		- | Method | Purpose |
		  |---|---|
		  | `hasNext()` / `__iter__` | Is there another element? |
		  | `next()` / `__next__` | Return next element, advance cursor |
		  | `reset()` | Go back to the beginning (optional) |
	-
	- ## UML Structure
	  collapsed:: true
		- ```mermaid
		  classDiagram
		      class Iterator {
		          <<interface>>
		          +hasNext() bool
		          +next() T
		          +reset()
		      }
		      class Collection {
		          <<interface>>
		          +createIterator() Iterator
		      }
		      class ConcreteIterator {
		          -collection
		          -index: int
		          +hasNext() bool
		          +next() T
		      }
		      class ConcreteCollection {
		          -items[]
		          +createIterator() ConcreteIterator
		          +add(item)
		      }
		      Iterator <|.. ConcreteIterator
		      Collection <|.. ConcreteCollection
		      ConcreteCollection --> ConcreteIterator : creates
		      ConcreteIterator --> ConcreteCollection : traverses
		  ```

- # Implementation
  collapsed:: true
	- > [!note] Custom playlist iterator — traverse song collections in different orders (forward, shuffle) without changing the Playlist class.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  # Python has built-in iterator protocol: __iter__ + __next__
	  from __future__ import annotations
	  from dataclasses import dataclass
	  from typing import Iterator
	  import random
	  
	  @dataclass
	  class Song:
	      title: str
	      artist: str
	      duration: int  # seconds
	  
	      def __str__(self) -> str:
	          mins, secs = divmod(self.duration, 60)
	          return f"♪ {self.title} — {self.artist} ({mins}:{secs:02d})"
	  
	  
	  # ── Forward Iterator ──────────────────────────────────────────────────
	  class ForwardPlaylistIterator:
	      """Iterate songs in order."""
	      def __init__(self, songs: list[Song]):
	          self._songs = songs
	          self._index = 0
	  
	      def __iter__(self) -> ForwardPlaylistIterator:
	          return self
	  
	      def __next__(self) -> Song:
	          if self._index >= len(self._songs):
	              raise StopIteration
	          song = self._songs[self._index]
	          self._index += 1
	          return song
	  
	  
	  # ── Shuffle Iterator ──────────────────────────────────────────────────
	  class ShufflePlaylistIterator:
	      """Iterate songs in random order."""
	      def __init__(self, songs: list[Song]):
	          self._songs = songs[:]
	          random.shuffle(self._songs)
	          self._index = 0
	  
	      def __iter__(self) -> ShufflePlaylistIterator:
	          return self
	  
	      def __next__(self) -> Song:
	          if self._index >= len(self._songs):
	              raise StopIteration
	          song = self._songs[self._index]
	          self._index += 1
	          return song
	  
	  
	  # ── Playlist (Collection) ─────────────────────────────────────────────
	  class Playlist:
	      def __init__(self, name: str):
	          self.name = name
	          self._songs: list[Song] = []
	  
	      def add(self, song: Song) -> None:
	          self._songs.append(song)
	  
	      def __len__(self) -> int:
	          return len(self._songs)
	  
	      def forward(self) -> ForwardPlaylistIterator:
	          return ForwardPlaylistIterator(self._songs)
	  
	      def shuffle(self) -> ShufflePlaylistIterator:
	          return ShufflePlaylistIterator(self._songs)
	  
	      def __iter__(self) -> ForwardPlaylistIterator:
	          return self.forward()   # Default iteration = forward
	  
	  
	  # ── Client ─────────────────────────────────────────────────────────
	  playlist = Playlist("My Playlist")
	  playlist.add(Song("Bohemian Rhapsody", "Queen", 355))
	  playlist.add(Song("Stairway to Heaven", "Led Zeppelin", 482))
	  playlist.add(Song("Hotel California", "Eagles", 391))
	  playlist.add(Song("Smells Like Teen Spirit", "Nirvana", 301))
	  
	  print(f"=== Forward ({len(playlist)} songs) ===")
	  for song in playlist:               # Uses __iter__ → forward iterator
	      print(song)
	  
	  print("\n=== Shuffle ===")
	  for song in playlist.shuffle():
	      print(song)
	  
	  # Python generator as iterator (elegant alternative)
	  def long_songs(pl: Playlist) -> Iterator[Song]:
	      """Generator iterator: only yields songs > 5 minutes."""
	      for song in pl:
	          if song.duration > 360:
	              yield song
	  
	  print("\n=== Long Songs (>6 min) ===")
	  for song in long_songs(playlist):
	      print(song)
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <string>
	  #include <vector>
	  #include <memory>
	  
	  struct Song {
	      std::string title, artist;
	      int duration;
	      void print() const {
	          std::cout << "♪ " << title << " — " << artist
	                    << " (" << duration/60 << ":" << duration%60 << ")\n";
	      }
	  };
	  
	  // ── Iterator Interface ────────────────────────────────────────────────
	  class SongIterator {
	  public:
	      virtual bool hasNext() const = 0;
	      virtual Song next() = 0;
	      virtual ~SongIterator() = default;
	  };
	  
	  // ── Forward Iterator ──────────────────────────────────────────────────
	  class ForwardIterator : public SongIterator {
	      const std::vector<Song>& songs_;
	      size_t index_ = 0;
	  public:
	      ForwardIterator(const std::vector<Song>& songs) : songs_(songs) {}
	      bool hasNext() const override { return index_ < songs_.size(); }
	      Song next() override          { return songs_[index_++]; }
	  };
	  
	  // ── Playlist (Collection) ─────────────────────────────────────────────
	  class Playlist {
	      std::vector<Song> songs_;
	  public:
	      void add(Song song) { songs_.push_back(std::move(song)); }
	  
	      std::unique_ptr<SongIterator> createForwardIterator() const {
	          return std::make_unique<ForwardIterator>(songs_);
	      }
	  
	      // C++ range-based for loop support
	      auto begin() const { return songs_.begin(); }
	      auto end()   const { return songs_.end(); }
	  };
	  
	  int main() {
	      Playlist pl;
	      pl.add({"Bohemian Rhapsody", "Queen", 355});
	      pl.add({"Stairway to Heaven", "Led Zeppelin", 482});
	      pl.add({"Hotel California", "Eagles", 391});
	  
	      // Using custom iterator
	      auto it = pl.createForwardIterator();
	      std::cout << "=== Custom Iterator ===\n";
	      while (it->hasNext()) it->next().print();
	  
	      // Using range-based for (STL iterators)
	      std::cout << "\n=== Range-based for ===\n";
	      for (const auto& song : pl) song.print();
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  import java.util.*;
	  
	  record Song(String title, String artist, int duration) {
	      @Override public String toString() {
	          return String.format("♪ %s — %s (%d:%02d)", title, artist, duration/60, duration%60);
	      }
	  }
	  
	  // ── Forward Iterator ──────────────────────────────────────────────────
	  class ForwardPlaylistIterator implements Iterator<Song> {
	      private final List<Song> songs;
	      private int index = 0;
	  
	      ForwardPlaylistIterator(List<Song> songs) { this.songs = songs; }
	  
	      @Override public boolean hasNext() { return index < songs.size(); }
	      @Override public Song next()       { return songs.get(index++); }
	  }
	  
	  // ── Playlist (Iterable Collection) ────────────────────────────────────
	  class Playlist implements Iterable<Song> {
	      private final List<Song> songs = new ArrayList<>();
	      private final String name;
	  
	      Playlist(String name) { this.name = name; }
	      void add(Song song)   { songs.add(song); }
	      int size()            { return songs.size(); }
	  
	      @Override
	      public Iterator<Song> iterator() {
	          return new ForwardPlaylistIterator(songs);  // Default: forward
	      }
	  
	      public Iterator<Song> shuffleIterator() {
	          List<Song> shuffled = new ArrayList<>(songs);
	          Collections.shuffle(shuffled);
	          return new ForwardPlaylistIterator(shuffled);
	      }
	  }
	  
	  class IteratorDemo {
	      public static void main(String[] args) {
	          Playlist pl = new Playlist("Classics");
	          pl.add(new Song("Bohemian Rhapsody", "Queen", 355));
	          pl.add(new Song("Stairway to Heaven", "Led Zeppelin", 482));
	          pl.add(new Song("Hotel California", "Eagles", 391));
	  
	          System.out.println("=== Forward ===");
	          for (Song s : pl) System.out.println(s);     // Uses Iterable<Song>
	  
	          System.out.println("\n=== Shuffle ===");
	          var it = pl.shuffleIterator();
	          while (it.hasNext()) System.out.println(it.next());
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  // JS has built-in iteration protocol: Symbol.iterator + next()
	  
	  class Song {
	      constructor(title, artist, duration) {
	          this.title = title; this.artist = artist; this.duration = duration;
	      }
	      toString() {
	          const m = Math.floor(this.duration / 60);
	          const s = String(this.duration % 60).padStart(2, '0');
	          return `♪ ${this.title} — ${this.artist} (${m}:${s})`;
	      }
	  }
	  
	  class Playlist {
	      #songs = [];
	  
	      add(song)    { this.#songs.push(song); return this; }
	      get length() { return this.#songs.length; }
	  
	      // Default forward iterator — enables for...of
	      [Symbol.iterator]() {
	          let index = 0;
	          const songs = this.#songs;
	          return {
	              next() {
	                  if (index < songs.length)
	                      return { value: songs[index++], done: false };
	                  return { value: undefined, done: true };
	              }
	          };
	      }
	  
	      // Shuffle iterator
	      *shuffle() {
	          const copy = [...this.#songs].sort(() => Math.random() - 0.5);
	          yield* copy;  // Generator as iterator
	      }
	  
	      // Filter iterator — only long songs
	      *longSongs(minSeconds = 360) {
	          for (const song of this) {
	              if (song.duration > minSeconds) yield song;
	          }
	      }
	  }
	  
	  const pl = new Playlist();
	  pl.add(new Song("Bohemian Rhapsody", "Queen", 355))
	    .add(new Song("Stairway to Heaven", "Led Zeppelin", 482))
	    .add(new Song("Hotel California", "Eagles", 391));
	  
	  console.log("=== Forward ===");
	  for (const song of pl) console.log(song.toString());  // Uses Symbol.iterator
	  
	  console.log("\n=== Shuffle ===");
	  for (const song of pl.shuffle()) console.log(song.toString());
	  
	  console.log("\n=== Long Songs ===");
	  for (const song of pl.longSongs()) console.log(song.toString());
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  using System.Collections;
	  using System.Collections.Generic;
	  using System.Linq;
	  
	  record Song(string Title, string Artist, int Duration) {
	      public override string ToString() =>
	          $"♪ {Title} — {Artist} ({Duration/60}:{Duration%60:D2})";
	  }
	  
	  // Playlist implements IEnumerable<Song> for foreach support
	  class Playlist : IEnumerable<Song> {
	      readonly List<Song> songs = new();
	      readonly string name;
	  
	      public Playlist(string name) { this.name = name; }
	      public void Add(Song song) { songs.Add(song); }
	      public int Count => songs.Count;
	  
	      // Default forward iterator
	      public IEnumerator<Song> GetEnumerator() => songs.GetEnumerator();
	      IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
	  
	      // Shuffle iterator
	      public IEnumerable<Song> Shuffle() => songs.OrderBy(_ => Guid.NewGuid());
	  
	      // Filter iterator
	      public IEnumerable<Song> LongSongs(int minSeconds = 360) =>
	          songs.Where(s => s.Duration > minSeconds);
	  }
	  
	  class IteratorDemo {
	      static void Main() {
	          var pl = new Playlist("Classics");
	          pl.Add(new Song("Bohemian Rhapsody", "Queen", 355));
	          pl.Add(new Song("Stairway to Heaven", "Led Zeppelin", 482));
	          pl.Add(new Song("Hotel California", "Eagles", 391));
	  
	          Console.WriteLine("=== Forward ===");
	          foreach (var s in pl) Console.WriteLine(s);
	  
	          Console.WriteLine("\n=== Shuffle ===");
	          foreach (var s in pl.Shuffle()) Console.WriteLine(s);
	  
	          Console.WriteLine("\n=== Long Songs ===");
	          foreach (var s in pl.LongSongs()) Console.WriteLine(s);
	      }
	  }
	  ```
	  
	  :::

- # Key Takeaways
  collapsed:: true
	- Provides **sequential access** to collection elements without exposing the underlying structure.
	- Decouples traversal logic from the collection — multiple iterators can coexist on the same collection.
	- Modern languages have built-in iterator protocols: Python `__iter__`/`__next__`, JS `Symbol.iterator`, Java `Iterable<T>`, C# `IEnumerable<T>`.
	- **Generator functions** (`yield`) are the elegant modern alternative to explicit iterator classes.
	- Related: [[Observer Pattern]], [[Composite Pattern]], [[Template Method Pattern]]

- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Refactoring Guru — Iterator](https://refactoring.guru/design-patterns/iterator)
		- [GoF Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)

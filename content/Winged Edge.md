---
seoTitle: Winged-Edge Data Structure – 3D Polygon Mesh Representation
description: "A complete guide to the Winged-Edge data structure for 3D polygon meshes. Covers vertex, face, edge structures, adjacency traversal algorithms, and Python/C++ implementations."
keywords: "winged-edge, polygon mesh, mesh traversal, half-edge, 3D computer graphics, computational geometry, boundary representation, boundary edges, VR-Rathod, Code-Note, code note vr, vr book"
treeTitle: DSA - Advanced Data Structures - Winged Edge
---

> [!info] What is the Winged-Edge Data Structure?
> The **Winged-Edge** is a boundary representation (B-rep) data structure used to describe the topology of a **polygon mesh** (specifically, 2-manifold meshes).
> It is centered around the **edge** as the primary record, storing references to its end vertices, its adjacent faces, and four "wing" pointers to the adjacent edges along the face loops.

- # Explanation
	- In computer graphics and geometric modeling, meshes must be traversed efficiently. For example, we might need to find all faces sharing a vertex (e.g. for calculating vertex normals), or find all edges connected to a vertex.
	- A naive index buffer representation (Vertex-Face list) requires scanning the entire index list ($O(F)$ time) to answer these topological questions.
	- The Winged-Edge structure solves this by storing explicit adjacency pointers. By linking edges to their neighboring edges, faces, and vertices, topological queries can be resolved in $O(1)$ constant time per step, enabling extremely fast mesh traversals and editing operations (e.g., edge splits, face flips).
	-
	- ## Real-World Analogy
		- **A Road Network Navigation System**: Imagine a highway system where the intersections are vertices, the road segments are edges, and the blocks of land between them are faces. Instead of searching a global map database to find out which blocks you can reach from a road segment, every road segment contains a local sign: "If you turn left at the next intersection, you enter Highway A; if you turn right, you enter Highway B." This is exactly how the winged edge points to its neighbors.
- # How It Works
  collapsed:: true
	- ## Core Structure
		- The Winged-Edge structure links three primitive types: **Vertices**, **Faces**, and **Edges**.
		-
		- ### 1. Vertex Record
			- Each vertex contains coordinate values ($x, y, z$) and a reference to **any single edge** incident to it.
		-
		- ### 2. Face Record
			- Each face contains a reference to **any single edge** forming its boundary loop.
		-
		- ### 3. Edge Record (The Central Pivot)
			- Each edge is directed (oriented from $v_1$ to $v_2$). An edge record contains **8 pointers**:
				- **Vertices**: Start vertex $v_1$, End vertex $v_2$.
				- **Faces**: Left face $f_{\text{left}}$, Right face $f_{\text{right}}$ (relative to the edge direction).
				- **Left Wings**:
					- `left_pred`: The predecessor edge when traversing $f_{\text{left}}$ counter-clockwise.
					- `left_succ`: The successor edge when traversing $f_{\text{left}}$ counter-clockwise.
				- **Right Wings**:
					- `right_pred`: The predecessor edge when traversing $f_{\text{right}}$ counter-clockwise (flowing $v_2 \to v_1$).
					- `right_succ`: The successor edge when traversing $f_{\text{right}}$ counter-clockwise (flowing $v_2 \to v_1$).
	-
	- ## Visualizing the "Wings"
		- For an edge $e$ oriented from $v_1$ to $v_2$:
		  ```
		         \       /
		        e_ls   e_rp
		          \   /
		           v_2
		            |
		            | e (oriented v_1 -> v_2)
		            | (Left face f_left | Right face f_right)
		            |
		           v_1
		          /   \
		        e_lp   e_rs
		         /       \
		  ```
			- `e_lp` (`left_pred`): Predecessor edge entering $v_1$ on the left face.
			- `e_ls` (`left_succ`): Successor edge leaving $v_2$ on the left face.
			- `e_rp` (`right_pred`): Predecessor edge entering $v_2$ on the right face.
			- `e_rs` (`right_succ`): Successor edge leaving $v_1$ on the right face.
- # Time & Space Complexity
  collapsed:: true
	- | Operation / Representation | Face-Vertex List (Naive) | Winged-Edge | Half-Edge (Modern) |
	  |---|---|---|---|
	  | **Get Vertices of Face $F$** | $O(1)$ | $O(\text{deg}(F))$ | $O(\text{deg}(F))$ |
	  | **Get Faces Sharing Vertex $V$** | $O(F)$ | $O(\text{deg}(V))$ | $O(\text{deg}(V))$ |
	  | **Get Edges Sharing Vertex $V$** | $O(E)$ | $O(\text{deg}(V))$ | $O(\text{deg}(V))$ |
	  | **Direct Edge Traversal / Loop** | $O(F)$ | $O(1)$ | $O(1)$ |
	  | **Space Complexity** | $3V + 3F$ integers | $3V + F + 8E$ pointers | $3V + F + 6E$ pointers |
		- *$\text{deg}(F)$ is the degree (number of edges) of the face; $\text{deg}(V)$ is the valence (number of connected edges) of the vertex.*
- # Implementation
  collapsed:: true
	- :::code-tabs
	  
	  ```python
	  class Vertex:
	      def __init__(self, name, x, y, z):
	          self.name = name
	          self.x = x
	          self.y = y
	          self.z = z
	          self.edge = None  # Reference to one incident edge
	  
	  class Face:
	      def __init__(self, name):
	          self.name = name
	          self.edge = None  # Reference to one boundary edge
	  
	  class Edge:
	      def __init__(self, name, v1, v2):
	          self.name = name
	          self.v1 = v1  # Start vertex
	          self.v2 = v2  # End vertex
	          self.f_left = None
	          self.f_right = None
	          self.left_pred = None
	          self.left_succ = None
	          self.right_pred = None
	          self.right_succ = None
	  
	  class WingedEdgeMesh:
	      def __init__(self):
	          self.vertices = {}
	          self.faces = {}
	          self.edges = {}
	  
	      def add_vertex(self, name, x, y, z):
	          v = Vertex(name, x, y, z)
	          self.vertices[name] = v
	          return v
	  
	      def add_face(self, name):
	          f = Face(name)
	          self.faces[name] = f
	          return f
	  
	      def add_edge(self, name, v1_name, v2_name):
	          e = Edge(name, self.vertices[v1_name], self.vertices[v2_name])
	          self.edges[name] = e
	          return e
	  
	      def get_face_vertices(self, face_name):
	          """Traverses the boundary of a face to find its vertices in CCW order."""
	          face = self.faces[face_name]
	          start_edge = face.edge
	          curr_edge = start_edge
	          vertices = []
	          
	          while True:
	              if curr_edge.f_left == face:
	                  vertices.append(curr_edge.v2.name)
	                  curr_edge = curr_edge.left_succ
	              elif curr_edge.f_right == face:
	                  vertices.append(curr_edge.v1.name)
	                  curr_edge = curr_edge.right_succ
	              else:
	                  raise ValueError("Edge not associated with face")
	              
	              if curr_edge == start_edge:
	                  break
	          return vertices
	  
	      def get_vertex_adjacent_faces(self, vertex_name):
	          """Traverses all incident faces around a vertex using winged-edge pointers."""
	          vertex = self.vertices[vertex_name]
	          start_edge = vertex.edge
	          curr_edge = start_edge
	          faces = set()
	          
	          while True:
	              if curr_edge.v1 == vertex:
	                  if curr_edge.f_left:
	                      faces.add(curr_edge.f_left.name)
	                  curr_edge = curr_edge.left_pred
	              else:  # curr_edge.v2 == vertex
	                  if curr_edge.f_right:
	                      faces.add(curr_edge.f_right.name)
	                  curr_edge = curr_edge.right_pred
	                  
	              if curr_edge == start_edge:
	                  break
	          return sorted(list(faces))
	  
	  # Demonstration building a closed tetrahedron
	  if __name__ == "__main__":
	      mesh = WingedEdgeMesh()
	      mesh.add_vertex("v0", 0, 0, 0)
	      mesh.add_vertex("v1", 1, 0, 0)
	      mesh.add_vertex("v2", 0.5, 0.866, 0)
	      mesh.add_vertex("v3", 0.5, 0.288, 0.816)
	      
	      f0 = mesh.add_face("f0")
	      f1 = mesh.add_face("f1")
	      f2 = mesh.add_face("f2")
	      f3 = mesh.add_face("f3")
	      
	      e0 = mesh.add_edge("e0", "v0", "v1")
	      e1 = mesh.add_edge("e1", "v1", "v2")
	      e2 = mesh.add_edge("e2", "v2", "v0")
	      e3 = mesh.add_edge("e3", "v0", "v3")
	      e4 = mesh.add_edge("e4", "v1", "v3")
	      e5 = mesh.add_edge("e5", "v2", "v3")
	      
	      # Vertex-edge connections
	      mesh.vertices["v0"].edge = e0
	      mesh.vertices["v1"].edge = e1
	      mesh.vertices["v2"].edge = e2
	      mesh.vertices["v3"].edge = e3
	      
	      # Face-edge connections
	      f0.edge = e0
	      f1.edge = e0
	      f2.edge = e1
	      f3.edge = e2
	      
	      # Edge topological wiring
	      # e0 (v0 -> v1)
	      e0.f_left = f0; e0.f_right = f1
	      e0.left_pred = e2; e0.left_succ = e1
	      e0.right_pred = e4; e0.right_succ = e3
	      
	      # e1 (v1 -> v2)
	      e1.f_left = f0; e1.f_right = f2
	      e1.left_pred = e0; e1.left_succ = e2
	      e1.right_pred = e5; e1.right_succ = e4
	      
	      # e2 (v2 -> v0)
	      e2.f_left = f0; e2.f_right = f3
	      e2.left_pred = e1; e2.left_succ = e0
	      e2.right_pred = e3; e2.right_succ = e5
	      
	      # e3 (v0 -> v3)
	      e3.f_left = f1; e3.f_right = f3
	      e3.left_pred = e0; e3.left_succ = e4
	      e3.right_pred = e5; e3.right_succ = e2
	      
	      # e4 (v1 -> v3)
	      e4.f_left = f2; e4.f_right = f1
	      e4.left_pred = e1; e4.left_succ = e5
	      e4.right_pred = e3; e4.right_succ = e0
	      
	      # e5 (v2 -> v3)
	      e5.f_left = f3; e5.f_right = f2
	      e5.left_pred = e2; e5.left_succ = e3
	      e5.right_pred = e4; e5.right_succ = e1
	      
	      print("Face f0 boundary vertices CCW:")
	      print(mesh.get_face_vertices("f0"))
	      
	      print("\nAdjacent faces sharing vertex v0:")
	      print(mesh.get_vertex_adjacent_faces("v0"))
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <string>
	  #include <vector>
	  #include <map>
	  #include <set>
	  #include <algorithm>
	  
	  struct Edge;
	  
	  struct Vertex {
	      std::string name;
	      double x, y, z;
	      Edge* edge = nullptr;
	      Vertex(std::string name, double x, double y, double z)
	          : name(name), x(x), y(y), z(z) {}
	  };
	  
	  struct Face {
	      std::string name;
	      Edge* edge = nullptr;
	      Face(std::string name) : name(name) {}
	  };
	  
	  struct Edge {
	      std::string name;
	      Vertex* v1 = nullptr;
	      Vertex* v2 = nullptr;
	      Face* f_left = nullptr;
	      Face* f_right = nullptr;
	      Edge* left_pred = nullptr;
	      Edge* left_succ = nullptr;
	      Edge* right_pred = nullptr;
	      Edge* right_succ = nullptr;
	      
	      Edge(std::string name, Vertex* v1, Vertex* v2)
	          : name(name), v1(v1), v2(v2) {}
	  };
	  
	  class WingedEdgeMesh {
	  public:
	      std::map<std::string, Vertex*> vertices;
	      std::map<std::string, Face*> faces;
	      std::map<std::string, Edge*> edges;
	  
	      ~WingedEdgeMesh() {
	          for (auto& [name, v] : vertices) delete v;
	          for (auto& [name, f] : faces) delete f;
	          for (auto& [name, e] : edges) delete e;
	      }
	  
	      Vertex* addVertex(std::string name, double x, double y, double z) {
	          Vertex* v = new Vertex(name, x, y, z);
	          vertices[name] = v;
	          return v;
	      }
	  
	      Face* addFace(std::string name) {
	          Face* f = new Face(name);
	          faces[name] = f;
	          return f;
	      }
	  
	      Edge* addEdge(std::string name, std::string v1Name, std::string v2Name) {
	          Edge* e = new Edge(name, vertices[v1Name], vertices[v2Name]);
	          edges[name] = e;
	          return e;
	      }
	  
	      std::vector<std::string> getFaceVertices(std::string faceName) {
	          Face* face = faces[faceName];
	          Edge* startEdge = face->edge;
	          Edge* currEdge = startEdge;
	          std::vector<std::string> faceVertices;
	          
	          while (true) {
	              if (currEdge->f_left == face) {
	                  faceVertices.push_back(currEdge->v2->name);
	                  currEdge = currEdge->left_succ;
	              } else if (currEdge->f_right == face) {
	                  faceVertices.push_back(currEdge->v1->name);
	                  currEdge = currEdge->right_succ;
	              } else {
	                  throw std::runtime_error("Edge not associated with face");
	              }
	              
	              if (currEdge == startEdge) break;
	          }
	          return faceVertices;
	      }
	  
	      std::vector<std::string> getVertexAdjacentFaces(std::string vertexName) {
	          Vertex* vertex = vertices[vertexName];
	          Edge* startEdge = vertex->edge;
	          Edge* currEdge = startEdge;
	          std::set<std::string> adjacentFaces;
	          
	          while (true) {
	              if (currEdge->v1 == vertex) {
	                  if (currEdge->f_left) adjacentFaces.insert(currEdge->f_left->name);
	                  currEdge = currEdge->left_pred;
	              } else { // currEdge->v2 == vertex
	                  if (currEdge->f_right) adjacentFaces.insert(currEdge->f_right->name);
	                  currEdge = currEdge->right_pred;
	              }
	              
	              if (currEdge == startEdge) break;
	          }
	          std::vector<std::string> result(adjacentFaces.begin(), adjacentFaces.end());
	          return result;
	      }
	  };
	  
	  int main() {
	      WingedEdgeMesh mesh;
	      mesh.addVertex("v0", 0, 0, 0);
	      mesh.addVertex("v1", 1, 0, 0);
	      mesh.addVertex("v2", 0.5, 0.866, 0);
	      mesh.addVertex("v3", 0.5, 0.288, 0.816);
	      
	      Face* f0 = mesh.addFace("f0");
	      Face* f1 = mesh.addFace("f1");
	      Face* f2 = mesh.addFace("f2");
	      Face* f3 = mesh.addFace("f3");
	      
	      Edge* e0 = mesh.addEdge("e0", "v0", "v1");
	      Edge* e1 = mesh.addEdge("e1", "v1", "v2");
	      Edge* e2 = mesh.addEdge("e2", "v2", "v0");
	      Edge* e3 = mesh.addEdge("e3", "v0", "v3");
	      Edge* e4 = mesh.addEdge("e4", "v1", "v3");
	      Edge* e5 = mesh.addEdge("e5", "v2", "v3");
	      
	      mesh.vertices["v0"]->edge = e0;
	      mesh.vertices["v1"]->edge = e1;
	      mesh.vertices["v2"]->edge = e2;
	      mesh.vertices["v3"]->edge = e3;
	      
	      f0->edge = e0;
	      f1->edge = e0;
	      f2->edge = e1;
	      f3->edge = e2;
	      
	      // Connect e0
	      e0->f_left = f0; e0->f_right = f1;
	      e0->left_pred = e2; e0->left_succ = e1;
	      e0->right_pred = e4; e0->right_succ = e3;
	      
	      // Connect e1
	      e1->f_left = f0; e1->f_right = f2;
	      e1->left_pred = e0; e1->left_succ = e2;
	      e1->right_pred = e5; e1->right_succ = e4;
	      
	      // Connect e2
	      e2->f_left = f0; e2->f_right = f3;
	      e2->left_pred = e1; e2->left_succ = e0;
	      e2->right_pred = e3; e2->right_succ = e5;
	      
	      // Connect e3
	      e3->f_left = f1; e3->f_right = f3;
	      e3->left_pred = e0; e3->left_succ = e4;
	      e3->right_pred = e5; e3->right_succ = e2;
	      
	      // Connect e4
	      e4->f_left = f2; e4->f_right = f1;
	      e4->left_pred = e1; e4->left_succ = e5;
	      e4->right_pred = e3; e4->right_succ = e0;
	      
	      // Connect e5
	      e5->f_left = f3; e5->f_right = f2;
	      e5->left_pred = e2; e5->left_succ = e3;
	      e5->right_pred = e4; e5->right_succ = e1;
	      
	      std::cout << "Face f0 boundary vertices CCW:\n";
	      for (const auto& vName : mesh.getFaceVertices("f0")) {
	          std::cout << vName << " ";
	      }
	      std::cout << "\n\nAdjacent faces sharing vertex v0:\n";
	      for (const auto& fName : mesh.getVertexAdjacentFaces("v0")) {
	          std::cout << fName << " ";
	      }
	      std::cout << "\n";
	      return 0;
	  }
	  ```
	  
	  :::
- # When to Use
  collapsed:: true
	- ## ✅ Use Winged-Edge When:
		- You are implementing mesh editing algorithms where edge updates, edge collapses, or mesh subdivisions (like Loop or Catmull-Clark subdivision) are performed frequently.
		- You need to render or process static, manifold, orientable polygon meshes where quick adjacency lookups (e.g. vertices of face, faces of vertex) are required.
	- ## ❌ Do NOT Use Winged-Edge When:
		- The mesh is non-manifold (e.g. an edge shared by more than two faces). The Winged-Edge structure strictly assumes a 2-manifold topology.
		- You want a lighter footprint memory structure. Modern graphics engines prefer the **Half-Edge** structure because storing directed half-edges simplifies traversal and requires fewer pointers per edge.
- # Variations & Related Concepts
  collapsed:: true
	- **Half-Edge (Doubly Connected Edge List - DCEL)**: Splitting every edge into two oppositely-oriented "half-edges". This is the de-facto standard in modern geometry libraries because it avoids complex branch logic (no left vs right state, every traversal moves CCW along "next" pointers).
	- **Quad-Edge**: A structure designed for representing both a mesh and its dual graph simultaneously. Extremely useful for Voronoi diagrams and Delaunay triangulations.
	- **Corner Table**: A highly compressed triangular mesh representation optimized for graphics pipelines, indexing corners instead of full edges.
- # Key Takeaways
  collapsed:: true
	- The Winged-Edge structure uses the **edge** as its core primitive to link vertices, faces, and adjacent edges.
	- Each edge stores 8 pointers, providing $O(1)$ constant-time traversal to neighboring elements in the mesh.
	- It works strictly on 2-manifold orientable meshes, offering direct topological lookups without global database scanning.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Wikipedia -> Winged edge](https://en.wikipedia.org/wiki/Winged_edge)
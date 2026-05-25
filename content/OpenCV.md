---
date: 2024-12-11T09:49:49+05:30
lastmod: 2026-05-18T10:12:55+05:30

seoTitle: OpenCV – Computer Vision Library Complete Reference
description: "Comprehensive OpenCV reference covering image I/O, color spaces, filtering, morphology, contours, feature detection, object detection, video capture, and deep learning integration."
keywords: "OpenCV, computer vision, image processing, cv2, object detection, feature detection, contours, video capture, deep learning, YOLO, face detection, C++ OpenCV, Python OpenCV, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: OpenCV
---

- # History
  collapsed:: true
	- **Who**: Originally developed by Intel. Now maintained by the OpenCV Foundation and community.
	- **Why**: To provide a common infrastructure for computer vision applications and accelerate the use of machine perception in commercial products.
	- **When**: First released in 2000. OpenCV 4.x is the current major version.
- # Introduction
  collapsed:: true
	- ## What is OpenCV?
		- Open Source Computer Vision Library — the most widely used computer vision library in the world.
		- Supports C++, Python, Java, and MATLAB interfaces.
		- Runs on Windows, Linux, macOS, iOS, Android.
		- Website: [opencv.org](https://opencv.org/) | Docs: [docs.opencv.org](https://docs.opencv.org/)
	-
	- ## Advantages
	  collapsed:: true
		- 2500+ optimized algorithms for real-time computer vision.
		- Hardware-accelerated via CUDA, OpenCL, and NEON (ARM).
		- Huge community — most computer vision tutorials use OpenCV.
		- Deep learning module (dnn) supports ONNX, TensorFlow, PyTorch models.
		- Free and open-source (Apache 2 license).
	-
	- ## Disadvantages
	  collapsed:: true
		- C++ API can be verbose; Python API is easier but slower.
		- GPU support (CUDA) requires separate build from source.
		- Some algorithms are patented and not in the main build.
- # Installation & Setup
  collapsed:: true
	- ## Python
		- ```bash
		  pip install opencv-python          # core
		  pip install opencv-contrib-python  # core + extra modules (SIFT, etc.)
		  ```
		- ```python
		  import cv2
		  print(cv2.__version__)  # e.g. 4.9.0
		  ```
	-
	- ## C++ (Linux apt)
		- ```bash
		  sudo apt install libopencv-dev
		  ```
	-
	- ## C++ (vcpkg)
		- ```bash
		  vcpkg install opencv4
		  ```
	-
	- ## C++ CMake
		- ```cmake
		  find_package(OpenCV REQUIRED)
		  target_link_libraries(MyApp ${OpenCV_LIBS})
		  target_include_directories(MyApp PRIVATE ${OpenCV_INCLUDE_DIRS})
		  ```
- # Core Concepts
  collapsed:: true
	- ## Reading, Writing & Displaying Images
	  collapsed:: true
		- ```cpp
		  // C++
		  #include <opencv2/opencv.hpp>
		  
		  cv::Mat img = cv::imread("photo.jpg");           // load image
		  cv::Mat gray = cv::imread("photo.jpg", cv::IMREAD_GRAYSCALE); // grayscale
		  
		  if (img.empty()) {
		      std::cerr << "Could not load image\n";
		      return -1;
		  }
		  
		  cv::imshow("Window", img);   // display
		  cv::waitKey(0);              // wait for keypress (0 = forever)
		  cv::destroyAllWindows();
		  
		  cv::imwrite("output.jpg", img); // save
		  ```
		- ```python
		  # Python
		  import cv2
		  
		  img = cv2.imread("photo.jpg")           # BGR by default
		  gray = cv2.imread("photo.jpg", cv2.IMREAD_GRAYSCALE)
		  
		  cv2.imshow("Window", img)
		  cv2.waitKey(0)
		  cv2.destroyAllWindows()
		  
		  cv2.imwrite("output.jpg", img)
		  ```
	-
	- ## The Mat Object (C++)
	  collapsed:: true
		- ```cpp
		  cv::Mat img(480, 640, CV_8UC3);  // 480x640, 3-channel uint8
		  cv::Mat zeros = cv::Mat::zeros(100, 100, CV_8UC1);
		  cv::Mat ones  = cv::Mat::ones(100, 100, CV_32F);
		  
		  std::cout << "Size: " << img.size() << "\n";   // [640 x 480]
		  std::cout << "Rows: " << img.rows << "\n";     // 480
		  std::cout << "Cols: " << img.cols << "\n";     // 640
		  std::cout << "Channels: " << img.channels() << "\n"; // 3
		  std::cout << "Type: " << img.type() << "\n";   // 16 (CV_8UC3)
		  
		  // Pixel access
		  cv::Vec3b pixel = img.at<cv::Vec3b>(100, 200); // row, col
		  pixel[0] = 255; // Blue
		  pixel[1] = 0;   // Green
		  pixel[2] = 0;   // Red
		  img.at<cv::Vec3b>(100, 200) = pixel;
		  ```
- # Color Spaces
  collapsed:: true
	- ```cpp
	  // C++
	  cv::Mat bgr = cv::imread("img.jpg");
	  cv::Mat gray, hsv, lab;
	  
	  cv::cvtColor(bgr, gray, cv::COLOR_BGR2GRAY);
	  cv::cvtColor(bgr, hsv,  cv::COLOR_BGR2HSV);
	  cv::cvtColor(bgr, lab,  cv::COLOR_BGR2Lab);
	  
	  // BGR → RGB (for display with matplotlib in Python)
	  cv::Mat rgb;
	  cv::cvtColor(bgr, rgb, cv::COLOR_BGR2RGB);
	  ```
	- ```python
	  # Python
	  import cv2
	  
	  img = cv2.imread("img.jpg")  # BGR
	  gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
	  hsv  = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
	  rgb  = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
	  
	  # Split channels
	  b, g, r = cv2.split(img)
	  merged = cv2.merge([b, g, r])
	  ```
- # Drawing
  collapsed:: true
	- ```python
	  import cv2
	  import numpy as np
	  
	  canvas = np.zeros((400, 600, 3), dtype=np.uint8)  # black image
	  
	  # Line
	  cv2.line(canvas, (0, 0), (600, 400), (0, 255, 0), 2)  # green, thickness 2
	  
	  # Rectangle
	  cv2.rectangle(canvas, (50, 50), (200, 150), (255, 0, 0), 3)  # blue
	  
	  # Circle
	  cv2.circle(canvas, (300, 200), 80, (0, 0, 255), -1)  # red, filled (-1)
	  
	  # Ellipse
	  cv2.ellipse(canvas, (300, 200), (100, 50), 45, 0, 360, (255, 255, 0), 2)
	  
	  # Text
	  cv2.putText(canvas, "OpenCV", (50, 350),
	      cv2.FONT_HERSHEY_SIMPLEX, 1.5, (255, 255, 255), 2)
	  
	  cv2.imshow("Canvas", canvas)
	  cv2.waitKey(0)
	  ```
- # Image Filtering
  collapsed:: true
	- ## Blurring
	  collapsed:: true
		- ```python
		  img = cv2.imread("photo.jpg")
		  
		  blur    = cv2.blur(img, (5, 5))                  # average blur
		  gauss   = cv2.GaussianBlur(img, (5, 5), 0)       # gaussian blur
		  median  = cv2.medianBlur(img, 5)                  # median blur (good for salt & pepper noise)
		  bilat   = cv2.bilateralFilter(img, 9, 75, 75)     # edge-preserving blur
		  ```
	-
	- ## Edge Detection
	  collapsed:: true
		- ```python
		  gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
		  
		  # Canny edge detector
		  edges = cv2.Canny(gray, 100, 200)  # low threshold, high threshold
		  
		  # Sobel gradients
		  sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)  # x direction
		  sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)  # y direction
		  
		  # Laplacian
		  laplacian = cv2.Laplacian(gray, cv2.CV_64F)
		  ```
	-
	- ## Morphological Operations
	  collapsed:: true
		- ```python
		  import numpy as np
		  
		  kernel = np.ones((5, 5), np.uint8)
		  
		  eroded  = cv2.erode(img, kernel, iterations=1)   # shrink bright regions
		  dilated = cv2.dilate(img, kernel, iterations=1)  # expand bright regions
		  opened  = cv2.morphologyEx(img, cv2.MORPH_OPEN, kernel)   # erode then dilate
		  closed  = cv2.morphologyEx(img, cv2.MORPH_CLOSE, kernel)  # dilate then erode
		  grad    = cv2.morphologyEx(img, cv2.MORPH_GRADIENT, kernel) # outline
		  ```
	-
	- ## Thresholding
	  collapsed:: true
		- ```python
		  gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
		  
		  # Simple threshold
		  _, thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
		  _, inv    = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY_INV)
		  
		  # Otsu's method (auto threshold)
		  _, otsu = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
		  
		  # Adaptive threshold (handles uneven lighting)
		  adaptive = cv2.adaptiveThreshold(
		      gray, 255,
		      cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
		      cv2.THRESH_BINARY, 11, 2
		  )
		  ```
- # Contours
  collapsed:: true
	- ```python
	  gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
	  _, thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
	  
	  # Find contours
	  contours, hierarchy = cv2.findContours(
	      thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
	  )
	  
	  print(f"Found {len(contours)} contours")
	  
	  # Draw all contours
	  cv2.drawContours(img, contours, -1, (0, 255, 0), 2)
	  
	  # Contour properties
	  for cnt in contours:
	      area      = cv2.contourArea(cnt)
	      perimeter = cv2.arcLength(cnt, True)
	      x, y, w, h = cv2.boundingRect(cnt)  # bounding box
	      (cx, cy), radius = cv2.minEnclosingCircle(cnt)
	  
	      # Approximate polygon
	      epsilon = 0.02 * perimeter
	      approx = cv2.approxPolyDP(cnt, epsilon, True)
	      if len(approx) == 3:
	          print("Triangle")
	      elif len(approx) == 4:
	          print("Rectangle/Square")
	  ```
- # Feature Detection
  collapsed:: true
	- ## Harris Corner Detection
	  collapsed:: true
		- ```python
		  gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
		  gray = np.float32(gray)
		  
		  corners = cv2.cornerHarris(gray, blockSize=2, ksize=3, k=0.04)
		  corners = cv2.dilate(corners, None)
		  
		  img[corners > 0.01 * corners.max()] = [0, 0, 255]  # mark corners red
		  ```
	-
	- ## SIFT — Scale-Invariant Feature Transform (requires opencv-contrib)
	  collapsed:: true
		- ```python
		  sift = cv2.SIFT_create()
		  keypoints, descriptors = sift.detectAndCompute(gray, None)
		  
		  img_kp = cv2.drawKeypoints(img, keypoints, None,
		      flags=cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS)
		  cv2.imshow("SIFT", img_kp)
		  ```
	-
	- ## ORB — Fast Alternative to SIFT (free, no patent)
	  collapsed:: true
		- ```python
		  orb = cv2.ORB_create()
		  keypoints, descriptors = orb.detectAndCompute(gray, None)
		  
		  img_kp = cv2.drawKeypoints(img, keypoints, None, color=(0, 255, 0))
		  ```
	-
	- ## Feature Matching
	  collapsed:: true
		- ```python
		  img1 = cv2.imread("img1.jpg", cv2.IMREAD_GRAYSCALE)
		  img2 = cv2.imread("img2.jpg", cv2.IMREAD_GRAYSCALE)
		  
		  orb = cv2.ORB_create()
		  kp1, des1 = orb.detectAndCompute(img1, None)
		  kp2, des2 = orb.detectAndCompute(img2, None)
		  
		  # Brute-force matcher
		  bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
		  matches = bf.match(des1, des2)
		  matches = sorted(matches, key=lambda x: x.distance)
		  
		  result = cv2.drawMatches(img1, kp1, img2, kp2, matches[:20], None,
		      flags=cv2.DrawMatchesFlags_NOT_DRAW_SINGLE_POINTS)
		  cv2.imshow("Matches", result)
		  ```
- # Object Detection
  collapsed:: true
	- ## Haar Cascade — Face Detection
	  collapsed:: true
		- ```python
		  face_cascade = cv2.CascadeClassifier(
		      cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
		  )
		  
		  gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
		  faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
		  
		  for (x, y, w, h) in faces:
		      cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)
		  
		  cv2.imshow("Faces", img)
		  ```
	-
	- ## Color-Based Object Detection (HSV masking)
	  collapsed:: true
		- ```python
		  hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
		  
		  # Detect red objects
		  lower_red = np.array([0, 120, 70])
		  upper_red = np.array([10, 255, 255])
		  mask = cv2.inRange(hsv, lower_red, upper_red)
		  
		  result = cv2.bitwise_and(img, img, mask=mask)
		  cv2.imshow("Red Objects", result)
		  ```
- # Video Capture
  collapsed:: true
	- ```python
	  import cv2
	  
	  # Open webcam (0 = default camera)
	  cap = cv2.VideoCapture(0)
	  # Or open video file:
	  # cap = cv2.VideoCapture("video.mp4")
	  
	  if not cap.isOpened():
	      print("Cannot open camera")
	      exit()
	  
	  while True:
	      ret, frame = cap.read()  # ret = success flag
	      if not ret:
	          break
	  
	      gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
	      cv2.imshow("Webcam", gray)
	  
	      if cv2.waitKey(1) & 0xFF == ord('q'):  # press Q to quit
	          break
	  
	  cap.release()
	  cv2.destroyAllWindows()
	  
	  # Video properties
	  fps    = cap.get(cv2.CAP_PROP_FPS)
	  width  = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
	  height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
	  ```
- # Deep Learning (dnn module)
  collapsed:: true
	- ## Load & Run ONNX / Pre-trained Model
	  collapsed:: true
		- ```python
		  # Load a pre-trained model (ONNX format)
		  net = cv2.dnn.readNetFromONNX("model.onnx")
		  
		  # Preprocess image
		  blob = cv2.dnn.blobFromImage(
		      img,
		      scalefactor=1.0/255.0,  # normalize to [0,1]
		      size=(224, 224),         # resize to model input
		      mean=(0.485, 0.456, 0.406),
		      swapRB=True,             # BGR → RGB
		      crop=False
		  )
		  
		  net.setInput(blob)
		  output = net.forward()  # run inference
		  ```
	-
	- ## YOLO Object Detection
	  collapsed:: true
		- ```python
		  # Load YOLOv4
		  net = cv2.dnn.readNet("yolov4.weights", "yolov4.cfg")
		  layer_names = net.getLayerNames()
		  output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]
		  
		  blob = cv2.dnn.blobFromImage(img, 1/255.0, (416, 416), swapRB=True, crop=False)
		  net.setInput(blob)
		  outputs = net.forward(output_layers)
		  
		  # Parse detections
		  h, w = img.shape[:2]
		  for output in outputs:
		      for detection in output:
		          scores = detection[5:]
		          class_id = np.argmax(scores)
		          confidence = scores[class_id]
		          if confidence > 0.5:
		              cx, cy, bw, bh = (detection[:4] * [w, h, w, h]).astype(int)
		              x, y = cx - bw//2, cy - bh//2
		              cv2.rectangle(img, (x, y), (x+bw, y+bh), (0, 255, 0), 2)
		  ```
- # Geometric Transformations
  collapsed:: true
	- ```python
	  h, w = img.shape[:2]
	  
	  # Resize
	  resized = cv2.resize(img, (320, 240))
	  resized2 = cv2.resize(img, None, fx=0.5, fy=0.5)  # 50% scale
	  
	  # Rotate
	  center = (w // 2, h // 2)
	  M = cv2.getRotationMatrix2D(center, angle=45, scale=1.0)
	  rotated = cv2.warpAffine(img, M, (w, h))
	  
	  # Flip
	  flipped_h = cv2.flip(img, 1)   # horizontal
	  flipped_v = cv2.flip(img, 0)   # vertical
	  flipped_b = cv2.flip(img, -1)  # both
	  
	  # Crop (numpy slicing)
	  cropped = img[100:300, 200:400]  # [y1:y2, x1:x2]
	  
	  # Perspective transform
	  src_pts = np.float32([[0,0],[w,0],[0,h],[w,h]])
	  dst_pts = np.float32([[50,50],[w-50,30],[30,h-50],[w-30,h-30]])
	  M = cv2.getPerspectiveTransform(src_pts, dst_pts)
	  warped = cv2.warpPerspective(img, M, (w, h))
	  ```
- # More Learn
	- [OpenCV Official Docs](https://docs.opencv.org/)
	- [OpenCV Python Tutorials](https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html)
	- [OpenCV GitHub](https://github.com/opencv/opencv)
	- [OpenCV C++ Tutorials](https://docs.opencv.org/4.x/d9/df8/tutorial_root.html)
	- [Practical OpenCV (YouTube)](https://www.youtube.com/results?search_query=opencv+tutorial)
---
seoTitle: Machine Learning Complete Guide – From Math to Production AI
description: "Comprehensive machine learning reference covering mathematical foundations, supervised learning, unsupervised learning, deep learning, neural networks, transformers, LLMs, computer vision, NLP, reinforcement learning, MLOps, and production AI deployment."
keywords: "machine learning, deep learning, neural networks, transformers, LLMs, GPT, computer vision, NLP, reinforcement learning, scikit-learn, PyTorch, TensorFlow, MLOps, feature engineering, model evaluation, bias variance, gradient descent, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Machine Learning – Complete AI Reference
enableToc: true
---

> [!info] About This Page
> Machine Learning is the engine behind modern AI — from spam filters to self-driving cars to large language models. This page covers the full ML landscape: mathematical foundations, classical algorithms, deep learning, NLP, computer vision, reinforcement learning, and production deployment.
> For data wrangling and EDA see [[Data Science]]. For game-specific AI see [[Game AI]]. For Python libraries see [[PyTorch]], [[Scikit-learn]], [[NumPy]], [[Pandas]].

- # History & The AI Landscape
  collapsed:: true
	- ## How Machine Learning Was Born
		- The seeds of machine learning were planted in **1943** when Warren McCulloch and Walter Pitts modeled the first mathematical neuron. In **1950**, Alan Turing asked "Can machines think?" and proposed the Turing Test. The field was formally founded at the **Dartmouth Conference (1956)** where John McCarthy coined the term "Artificial Intelligence."
		- Early AI was **rule-based** (expert systems) — humans encoded knowledge as if-then rules. This worked in narrow domains but collapsed under real-world complexity. You can't write rules for every way a face can look.
		- The shift came with **machine learning** — instead of programming rules, you feed algorithms data and let them discover the rules themselves. Frank Rosenblatt's **Perceptron (1957)** was the first learning algorithm. Backpropagation was developed in the **1970s–80s** and enabled training multi-layer networks.
		- Two **AI winters** (periods of lost funding and interest) followed unrealistic expectations. The modern renaissance began with **ImageNet (2012)**, when AlexNet — a deep convolutional network trained on GPUs — halved the image classification error rate overnight. Every major AI breakthrough since traces back to that moment.
		- **2017: The Transformer** (Attention Is All You Need, Vaswani et al.) changed NLP forever. **2018: BERT, GPT-1**. **2020: GPT-3**. **2022: ChatGPT**. **2023: GPT-4, Claude, Gemini**. The large language model era had arrived.
	-
	- ## The AI Hierarchy
		- ```mermaid
		  graph TD
		      AI["🤖 Artificial Intelligence\nMachines simulating human intelligence"]
		      ML["📊 Machine Learning\nLearning from data"]
		      DL["🧠 Deep Learning\nMulti-layer neural networks"]
		      GenAI["✨ Generative AI\nCreate text, images, code, audio"]
		      LLM["💬 Large Language Models\nGPT, Claude, Gemini, Llama"]
		      CV["👁️ Computer Vision\nCNN, YOLO, SAM, CLIP"]
		      RL["🎮 Reinforcement Learning\nTrial and error from rewards"]
		      AI --> ML --> DL --> GenAI
		      DL --> LLM
		      DL --> CV
		      ML --> RL
		  ```
		- | Branch | What It Does | Key Models | Used In |
		  |--------|-------------|-----------|---------|
		  | **Supervised Learning** | Learn from labeled examples | Random Forest, XGBoost, SVM | Classification, regression |
		  | **Unsupervised Learning** | Find hidden structure | K-Means, PCA, VAE | Clustering, anomaly detection |
		  | **Deep Learning** | Learn via neural networks | CNN, RNN, Transformer | Vision, NLP, speech |
		  | **Generative AI** | Create new content | GPT, Stable Diffusion, DALL-E | Text, images, code |
		  | **Reinforcement Learning** | Learn from rewards | PPO, DQN, AlphaZero | Games, robotics, trading |
		  | **Computer Vision** | Understand images/video | ResNet, YOLO, SAM | Detection, segmentation |
		  | **NLP** | Understand language | BERT, GPT, T5 | Chatbots, translation, summarization |
	-
	- ## AI Timeline
		- ```mermaid
		  timeline
		      title Milestones in AI & Machine Learning
		      1950 : Turing Test proposed
		      1956 : Dartmouth Conference — AI coined
		      1957 : Perceptron — first learning algorithm
		      1986 : Backpropagation popularized
		      1997 : Deep Blue beats Kasparov at chess
		      1998 : LeNet-5 — CNN for digit recognition
		      2006 : Hinton coins "Deep Learning"
		      2012 : AlexNet — ImageNet breakthrough
		      2014 : GANs invented by Goodfellow
		      2017 : Transformer — Attention Is All You Need
		      2018 : BERT and GPT-1
		      2020 : GPT-3 — 175B parameters
		      2021 : DALL-E — text to image
		      2022 : ChatGPT — 100M users in 2 months
		      2023 : GPT-4, Claude, Llama, Mistral, Gemini
		      2024 : Multimodal AI, AI agents, reasoning models
		  ```

- # Introduction
	- Machine Learning is the practice of building systems that **improve automatically through experience**. Instead of explicitly programming every decision, you show the system examples and let it learn the pattern — then apply that pattern to new data it has never seen.
	-
	- ## ML Knowledge Map
	  collapsed:: true
		- ```mermaid
		  mindmap
		    root((Machine Learning))
		      Mathematical Foundations
		        Linear Algebra
		        Calculus Gradients
		        Probability Statistics
		        Information Theory
		      Classical ML
		        Supervised Learning
		        Unsupervised Learning
		        Ensemble Methods
		        Feature Engineering
		      Deep Learning
		        Neural Networks
		        CNNs Vision
		        RNNs LSTMs
		        Transformers
		        Attention Mechanism
		      Generative AI
		        Large Language Models
		        Diffusion Models
		        GANs VAEs
		        Prompt Engineering
		        RAG Systems
		      Specialized
		        Computer Vision
		        NLP
		        Reinforcement Learning
		        Time Series
		        Anomaly Detection
		      Production MLOps
		        Training Pipelines
		        Model Serving
		        Monitoring Drift
		        Experiment Tracking
		  ```

- # Mathematical Foundations
  collapsed:: true
	- ## Linear Algebra — The Language of Data
		- Data in ML is always represented as vectors and matrices. An image is a matrix of pixel values. A sentence is a matrix of token embeddings. A batch of training examples is a 3D tensor.
		- ```
		  Core concepts:
		  ─────────────────────────────────────────────────────────────
		  Vector:    x = [x₁, x₂, ..., xₙ]  (1D array — one sample's features)
		  Matrix:    X ∈ ℝ^(m×n)             (m samples, n features)
		  Tensor:    3D+ array               (batch × height × width × channels)

		  Dot product:     W·x = Σ wᵢxᵢ     (core operation in every neural layer)
		  Matrix multiply: Y = XW            (linear transformation)
		  Transpose:       Xᵀ
		  Eigenvalues:     Used in PCA for finding principal components
		  SVD:             Matrix factorization for recommendations, compression
		  ```
		- ```python title="Linear algebra in NumPy — the foundation"
		  import numpy as np

		  # Data matrix: 100 samples, 5 features
		  X = np.random.randn(100, 5)

		  # Weight vector: 5 features → 1 output
		  W = np.random.randn(5)
		  b = 0.0

		  # Forward pass: linear prediction (dot product + bias)
		  y_pred = X @ W + b          # (100, 5) @ (5,) → (100,)

		  # Covariance matrix (used in PCA)
		  cov = np.cov(X.T)           # (5, 5) — how features vary together

		  # Eigendecomposition — principal components
		  eigenvalues, eigenvectors = np.linalg.eig(cov)
		  ```
		- [[NumPy]] is the Python library that makes linear algebra fast and readable. It's the foundation layer that [[PyTorch]], [[Scikit-learn]], and [[Pandas]] all build on.
	-
	- ## Calculus — How Models Learn
		- Neural networks learn by computing the **gradient of the loss function with respect to every parameter** — how much does changing this weight improve the prediction? Then they nudge all weights in the direction that reduces loss.
		- This is **gradient descent** — the core optimization algorithm in all of machine learning.
		- ```
		  Gradient Descent:
		  ─────────────────────────────────────────────────────────────
		  Loss L = function of predictions vs ground truth
		  Gradient ∂L/∂w = how much L changes when w changes
		  Update:  w ← w - α · (∂L/∂w)
		           α = learning rate (step size)

		  Variants:
		  SGD             — update per single sample (noisy but fast)
		  Mini-batch SGD  — update per batch of 32/64/128 samples (standard)
		  Adam            — adaptive learning rates per parameter (default choice)
		  AdaGrad         — accumulates gradient magnitudes
		  RMSProp         — exponential moving average of squared gradients
		  ```
		- ```python title="Manual gradient descent — the concept"
		  # Simple linear regression: y = wx + b
		  w, b   = 0.0, 0.0
		  alpha  = 0.01   # learning rate
		  epochs = 100

		  for epoch in range(epochs):
		      y_pred = w * X + b            # forward pass
		      loss   = ((y_pred - y) ** 2).mean()   # MSE loss

		      # Gradients (calculus / chain rule)
		      dL_dw = (2 * (y_pred - y) * X).mean()
		      dL_db = (2 * (y_pred - y)).mean()

		      # Update parameters
		      w -= alpha * dL_dw
		      b -= alpha * dL_db

		      if epoch % 10 == 0:
		          print(f"Epoch {epoch:3d} | Loss: {loss:.4f}")
		  ```
	-
	- ## Probability & Statistics — Uncertainty in ML
		- ML models are probabilistic — they output confidence scores, not certainties. Understanding probability is what separates an engineer who tunes parameters from one who understands why a model behaves the way it does.
		- | Concept | Role in ML |
		  |---------|-----------|
		  | **Probability distributions** | Model outputs, label noise, data generation |
		  | **Bayes' Theorem** | Foundation of Naive Bayes, Bayesian neural nets |
		  | **MLE (Max Likelihood Estimation)** | Training objective for most supervised models |
		  | **KL Divergence** | Loss function in VAEs, knowledge distillation |
		  | **Entropy** | Decision tree splitting criterion (information gain) |
		  | **Cross-entropy** | Classification loss function — most common in practice |
		  | **Central Limit Theorem** | Why training on batches works |
		  | **Hypothesis testing** | Evaluating if model A is truly better than model B |

- # The ML Pipeline — End to End
  collapsed:: true
	- ## Full Workflow
		- ```mermaid
		  graph LR
		      DC["📥 Data Collection\nAPIs · Scraping\nDatabases · Sensors"]
		      DW["🧹 Data Wrangling\nMissing values\nOutliers · Types"]
		      EDA["🔍 EDA\nDistributions\nCorrelations\nVisualization"]
		      FE["⚙️ Feature Engineering\nScaling · Encoding\nSelection · Creation"]
		      MT["🏋️ Model Training\nAlgorithm selection\nTrain / Val / Test split"]
		      ME["📊 Model Evaluation\nMetrics · Confusion matrix\nROC-AUC · Cross-val"]
		      HT["🔧 Hyperparameter Tuning\nGrid · Random · Bayesian search"]
		      DEP["🚀 Deployment\nAPI · Batch · Edge"]
		      MON["📡 Monitoring\nDrift detection\nModel refresh"]
		      DC --> DW --> EDA --> FE --> MT --> ME --> HT --> DEP --> MON --> MT
		  ```
	-
	- ## Data Preprocessing
		- ```python title="Complete preprocessing pipeline with sklearn"
		  import numpy as np
		  import pandas as pd
		  from sklearn.pipeline import Pipeline
		  from sklearn.compose import ColumnTransformer
		  from sklearn.preprocessing import (
		      StandardScaler, MinMaxScaler, RobustScaler,
		      OneHotEncoder, OrdinalEncoder, LabelEncoder
		  )
		  from sklearn.impute import SimpleImputer, KNNImputer
		  from sklearn.model_selection import train_test_split

		  df = pd.read_csv("data.csv")
		  X, y = df.drop("target", axis=1), df["target"]

		  # Split first — NEVER fit scaler/encoder on full dataset
		  X_train, X_test, y_train, y_test = train_test_split(
		      X, y, test_size=0.2, random_state=42, stratify=y
		  )

		  # Numeric features: impute missing → scale
		  numeric_features = X.select_dtypes(include=[np.number]).columns.tolist()
		  numeric_transformer = Pipeline([
		      ("imputer", KNNImputer(n_neighbors=5)),   # smarter than mean fill
		      ("scaler",  StandardScaler()),             # zero mean, unit variance
		  ])

		  # Categorical features: impute → encode
		  categorical_features = X.select_dtypes(include=["object", "category"]).columns.tolist()
		  categorical_transformer = Pipeline([
		      ("imputer", SimpleImputer(strategy="most_frequent")),
		      ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
		  ])

		  # Combine into one transformer
		  preprocessor = ColumnTransformer([
		      ("num", numeric_transformer,  numeric_features),
		      ("cat", categorical_transformer, categorical_features),
		  ])

		  # The preprocessor fits on train data only
		  X_train_processed = preprocessor.fit_transform(X_train)
		  X_test_processed  = preprocessor.transform(X_test)   # transform only — no fit
		  ```
		- [[Pandas]] and [[NumPy]] handle the data manipulation layer. [[Scikit-learn]] provides the preprocessing transformers. [[Data Science]] covers EDA and visualization in depth.

- # Supervised Learning
  collapsed:: true
	- ## Regression — Predicting Continuous Values
		- Regression maps input features to a continuous output: house price from location and size, stock return from market indicators, temperature from humidity and pressure.
		- ```python title="Regression algorithms comparison"
		  from sklearn.linear_model import LinearRegression, Ridge, Lasso, ElasticNet
		  from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
		  from sklearn.svm import SVR
		  from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
		  import xgboost as xgb

		  models = {
		      "Linear Regression":  LinearRegression(),
		      "Ridge (L2)":         Ridge(alpha=1.0),
		      "Lasso (L1)":         Lasso(alpha=0.01),
		      "ElasticNet":         ElasticNet(alpha=0.01, l1_ratio=0.5),
		      "Random Forest":      RandomForestRegressor(n_estimators=100, random_state=42),
		      "Gradient Boosting":  GradientBoostingRegressor(n_estimators=200, random_state=42),
		      "XGBoost":            xgb.XGBRegressor(n_estimators=200, learning_rate=0.05),
		  }

		  results = {}
		  for name, model in models.items():
		      model.fit(X_train_processed, y_train)
		      y_pred = model.predict(X_test_processed)
		      results[name] = {
		          "RMSE": mean_squared_error(y_test, y_pred, squared=False),
		          "MAE":  mean_absolute_error(y_test, y_pred),
		          "R²":   r2_score(y_test, y_pred),
		      }

		  import pandas as pd
		  print(pd.DataFrame(results).T.sort_values("RMSE"))
		  ```
		- | Algorithm | Strength | Weakness | When to Use |
		  |-----------|---------|---------|------------|
		  | Linear Regression | Interpretable, fast | Only linear relationships | Baseline, linear problems |
		  | Ridge (L2) | Prevents overfitting | Keeps all features | Many correlated features |
		  | Lasso (L1) | Feature selection | Can miss signal | Sparse feature sets |
		  | Random Forest | Robust, no scaling needed | Slow prediction, memory heavy | General purpose |
		  | XGBoost | Best tabular data performance | Hyperparameter sensitive | Kaggle, production tabular |
		  | SVR | Good in high dimensions | Slow on large data | Small datasets, SVM fans |
	-
	- ## Classification — Predicting Categories
		- ```python title="Classification with evaluation"
		  from sklearn.ensemble import RandomForestClassifier
		  from sklearn.linear_model import LogisticRegression
		  from sklearn.metrics import (
		      classification_report, confusion_matrix,
		      roc_auc_score, roc_curve, ConfusionMatrixDisplay
		  )
		  import xgboost as xgb
		  import matplotlib.pyplot as plt

		  clf = xgb.XGBClassifier(
		      n_estimators=200,
		      learning_rate=0.05,
		      max_depth=6,
		      use_label_encoder=False,
		      eval_metric="logloss",
		      random_state=42
		  )
		  clf.fit(
		      X_train_processed, y_train,
		      eval_set=[(X_test_processed, y_test)],
		      verbose=False
		  )

		  y_pred      = clf.predict(X_test_processed)
		  y_pred_prob = clf.predict_proba(X_test_processed)[:, 1]

		  print(classification_report(y_test, y_pred))
		  print(f"ROC-AUC: {roc_auc_score(y_test, y_pred_prob):.4f}")

		  # Feature importance
		  importance = pd.Series(
		      clf.feature_importances_,
		      index=preprocessor.get_feature_names_out()
		  ).sort_values(ascending=False).head(10)
		  importance.plot(kind="barh", title="Top 10 Features")
		  plt.tight_layout()
		  plt.savefig("feature_importance.png")
		  ```
		- ```
		  Classification metric guide:
		  ─────────────────────────────────────────────────────────────
		  Accuracy  = (TP+TN)/total         — misleading on imbalanced data
		  Precision = TP/(TP+FP)            — "when I say positive, am I right?"
		  Recall    = TP/(TP+FN)            — "did I catch all the positives?"
		  F1        = harmonic mean(P, R)   — balance between precision and recall
		  ROC-AUC   = area under ROC curve  — threshold-independent, gold standard
		  PR-AUC    = precision-recall area  — better for very imbalanced data

		  Rule of thumb:
		  Spam filter    → maximize Precision (false positives hurt user experience)
		  Cancer screen  → maximize Recall    (false negatives are deadly)
		  Fraud detect   → PR-AUC             (very imbalanced positive class)
		  ```

- # Unsupervised Learning
  collapsed:: true
	- ## Clustering
		- ```python title="K-Means and DBSCAN"
		  from sklearn.cluster import KMeans, DBSCAN
		  from sklearn.metrics import silhouette_score
		  import matplotlib.pyplot as plt

		  # ── K-Means ────────────────────────────────────────────────────────
		  # Choose K with elbow method
		  inertias = []
		  silhouettes = []
		  K_range = range(2, 11)

		  for k in K_range:
		      km = KMeans(n_clusters=k, random_state=42, n_init=10)
		      labels = km.fit_predict(X_train_processed)
		      inertias.append(km.inertia_)
		      silhouettes.append(silhouette_score(X_train_processed, labels))

		  # Plot elbow curve
		  fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
		  ax1.plot(K_range, inertias, "bo-");  ax1.set_xlabel("K"); ax1.set_title("Elbow Curve")
		  ax2.plot(K_range, silhouettes, "rs-"); ax2.set_xlabel("K"); ax2.set_title("Silhouette Score")
		  plt.savefig("clustering_evaluation.png")

		  # Best K
		  best_k = K_range[silhouettes.index(max(silhouettes))]
		  km_final = KMeans(n_clusters=best_k, random_state=42, n_init=10)
		  cluster_labels = km_final.fit_predict(X_train_processed)

		  # ── DBSCAN — density-based, finds arbitrary shapes ────────────────
		  db = DBSCAN(eps=0.5, min_samples=5)
		  db_labels = db.fit_predict(X_train_processed)
		  n_noise = (db_labels == -1).sum()
		  print(f"DBSCAN: {len(set(db_labels)) - 1} clusters, {n_noise} noise points")
		  ```
	-
	- ## Dimensionality Reduction
		- ```python title="PCA and t-SNE for visualization and compression"
		  from sklearn.decomposition import PCA
		  from sklearn.manifold import TSNE
		  import matplotlib.pyplot as plt
		  import seaborn as sns

		  # ── PCA — linear, fast, good for preprocessing ────────────────────
		  # How many components explain 95% variance?
		  pca_full = PCA()
		  pca_full.fit(X_train_processed)
		  cumvar = np.cumsum(pca_full.explained_variance_ratio_)
		  n_components_95 = np.argmax(cumvar >= 0.95) + 1
		  print(f"Components for 95% variance: {n_components_95}")

		  # Apply PCA
		  pca = PCA(n_components=n_components_95)
		  X_pca = pca.fit_transform(X_train_processed)

		  # ── t-SNE — non-linear, great for 2D visualization only ───────────
		  # NEVER use t-SNE for preprocessing — only visualization
		  tsne = TSNE(n_components=2, perplexity=30, random_state=42, n_iter=1000)
		  X_tsne = tsne.fit_transform(X_train_processed[:2000])  # max ~5000 samples

		  plt.figure(figsize=(10, 8))
		  scatter = plt.scatter(X_tsne[:, 0], X_tsne[:, 1], c=y_train[:2000],
		                        cmap="tab10", alpha=0.7, s=10)
		  plt.colorbar(scatter)
		  plt.title("t-SNE visualization of feature space")
		  plt.savefig("tsne_visualization.png")
		  ```
		- [[Matplotlib]], [[Seaborn]], and [[Plotly]] are the visualization libraries used in these analyses. See [[Data Science]] for the full EDA workflow.

- # Deep Learning & Neural Networks
  collapsed:: true
	- ## How Neural Networks Work
		- A neural network is a stack of **linear transformations interleaved with non-linear activations**. Each layer learns to detect increasingly abstract features: edges → shapes → faces → identities in a vision model; characters → words → phrases → meaning in a language model.
		- ```
		  Neural Network Math:
		  ─────────────────────────────────────────────────────────────
		  Layer:    h = activation(W·x + b)
		                           ↑
		                    learned matrix (weights)

		  Forward pass:  input → layer₁ → layer₂ → ... → output → loss
		  Backward pass: loss → ∂loss/∂W_n → ∂loss/∂W_(n-1) → ... (backprop)
		  Update:        W ← W - α · ∂loss/∂W   (gradient descent)
		  ```
		- ```python title="PyTorch — complete training loop"
		  import torch
		  import torch.nn as nn
		  import torch.optim as optim
		  from torch.utils.data import DataLoader, TensorDataset
		  from torch.optim.lr_scheduler import CosineAnnealingLR

		  # ── Model definition ───────────────────────────────────────────────
		  class MLP(nn.Module):
		      def __init__(self, input_dim: int, hidden_dim: int, output_dim: int,
		                   dropout: float = 0.3):
		          super().__init__()
		          self.net = nn.Sequential(
		              nn.Linear(input_dim, hidden_dim),
		              nn.BatchNorm1d(hidden_dim),
		              nn.ReLU(),
		              nn.Dropout(dropout),
		              nn.Linear(hidden_dim, hidden_dim // 2),
		              nn.BatchNorm1d(hidden_dim // 2),
		              nn.ReLU(),
		              nn.Dropout(dropout),
		              nn.Linear(hidden_dim // 2, output_dim),
		          )

		      def forward(self, x: torch.Tensor) -> torch.Tensor:
		          return self.net(x)

		  # ── Setup ──────────────────────────────────────────────────────────
		  device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

		  X_tensor = torch.FloatTensor(X_train_processed)
		  y_tensor = torch.LongTensor(y_train.values)
		  dataset  = TensorDataset(X_tensor, y_tensor)
		  loader   = DataLoader(dataset, batch_size=64, shuffle=True, num_workers=4)

		  model     = MLP(X_tensor.shape[1], 256, len(y.unique())).to(device)
		  criterion = nn.CrossEntropyLoss()
		  optimizer = optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)
		  scheduler = CosineAnnealingLR(optimizer, T_max=50)

		  # ── Training loop ──────────────────────────────────────────────────
		  best_val_loss = float("inf")
		  for epoch in range(100):
		      model.train()
		      total_loss = 0.0
		      for X_batch, y_batch in loader:
		          X_batch, y_batch = X_batch.to(device), y_batch.to(device)
		          optimizer.zero_grad()
		          logits = model(X_batch)
		          loss   = criterion(logits, y_batch)
		          loss.backward()
		          nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)  # prevent exploding gradients
		          optimizer.step()
		          total_loss += loss.item()
		      scheduler.step()

		      if epoch % 10 == 0:
		          avg_loss = total_loss / len(loader)
		          print(f"Epoch {epoch:3d} | Train Loss: {avg_loss:.4f}")

		  torch.save(model.state_dict(), "model.pt")
		  ```
		- [[PyTorch]] has a dedicated page covering the full API, custom datasets, distributed training, and ONNX export. For the math underneath see the Mathematical Foundations section above.
	-
	- ## Activation Functions
		- | Function | Formula | Range | Use Case | Problem |
		  |----------|---------|-------|---------|---------|
		  | **Sigmoid** | 1/(1+e^-x) | (0,1) | Binary output layer | Vanishing gradients |
		  | **Tanh** | (e^x-e^-x)/(e^x+e^-x) | (-1,1) | RNN gates | Vanishing gradients |
		  | **ReLU** | max(0, x) | [0,∞) | Hidden layers (default) | Dying ReLU (x<0) |
		  | **Leaky ReLU** | max(0.01x, x) | (-∞,∞) | When ReLU dies | Small negative slope |
		  | **GELU** | x·Φ(x) | (-∞,∞) | Transformers (BERT, GPT) | Computationally heavier |
		  | **Softmax** | e^xᵢ/Σe^xⱼ | (0,1) sum=1 | Multi-class output | Numerically unstable |
	-
	- ## Regularization Techniques
		- ```python title="Regularization patterns in PyTorch"
		  # ── Dropout — randomly zero neurons during training ────────────────
		  # Forces the network to learn redundant representations
		  nn.Dropout(p=0.5)          # 50% of neurons zeroed each forward pass

		  # ── Batch Normalization — normalize activations per batch ──────────
		  # Reduces internal covariate shift, allows higher learning rates
		  nn.BatchNorm1d(num_features)   # after Linear for tabular
		  nn.BatchNorm2d(num_channels)   # after Conv2d for images

		  # ── Weight decay (L2 in optimizer) ────────────────────────────────
		  optim.AdamW(model.parameters(), weight_decay=1e-4)

		  # ── Early stopping — stop when validation loss stops improving ─────
		  class EarlyStopping:
		      def __init__(self, patience=10):
		          self.patience = patience
		          self.counter  = 0
		          self.best     = float("inf")

		      def __call__(self, val_loss) -> bool:
		          if val_loss < self.best - 1e-4:
		              self.best = val_loss;  self.counter = 0
		          else:
		              self.counter += 1
		          return self.counter >= self.patience   # True = stop training
		  ```

- # Convolutional Neural Networks (CNNs)
  collapsed:: true
	- ## How CNNs Work
		- CNNs learn to detect spatial patterns in images through **learned filters** (kernels) that slide across the image. Early layers detect edges and gradients. Middle layers detect shapes and textures. Deep layers detect high-level concepts like "dog face" or "wheel."
		- The three key operations: **Conv2d** (detect patterns), **MaxPool** (downsample + translation invariance), **Flatten → Linear** (classify based on detected patterns).
		- ```python title="Custom CNN + transfer learning with PyTorch"
		  import torch
		  import torch.nn as nn
		  import torchvision
		  import torchvision.transforms as T
		  from torchvision.models import resnet50, ResNet50_Weights

		  # ── Custom CNN from scratch ────────────────────────────────────────
		  class SimpleCNN(nn.Module):
		      def __init__(self, num_classes: int):
		          super().__init__()
		          self.features = nn.Sequential(
		              # Block 1: 3×224×224 → 32×112×112
		              nn.Conv2d(3, 32, kernel_size=3, padding=1),
		              nn.BatchNorm2d(32),
		              nn.ReLU(inplace=True),
		              nn.MaxPool2d(2),
		              # Block 2: 32×112×112 → 64×56×56
		              nn.Conv2d(32, 64, kernel_size=3, padding=1),
		              nn.BatchNorm2d(64),
		              nn.ReLU(inplace=True),
		              nn.MaxPool2d(2),
		              # Block 3: 64×56×56 → 128×28×28
		              nn.Conv2d(64, 128, kernel_size=3, padding=1),
		              nn.BatchNorm2d(128),
		              nn.ReLU(inplace=True),
		              nn.MaxPool2d(2),
		          )
		          self.classifier = nn.Sequential(
		              nn.AdaptiveAvgPool2d((4, 4)),
		              nn.Flatten(),
		              nn.Linear(128 * 4 * 4, 256),
		              nn.ReLU(inplace=True),
		              nn.Dropout(0.5),
		              nn.Linear(256, num_classes),
		          )

		      def forward(self, x):
		          return self.classifier(self.features(x))

		  # ── Transfer Learning — use pretrained ResNet50 ────────────────────
		  # Almost always better than training from scratch unless huge dataset
		  model = resnet50(weights=ResNet50_Weights.IMAGENET1K_V2)

		  # Freeze all layers — only train the final classifier
		  for param in model.parameters():
		      param.requires_grad = False

		  # Replace final layer for our number of classes
		  model.fc = nn.Sequential(
		      nn.Dropout(0.3),
		      nn.Linear(model.fc.in_features, num_classes)
		  )

		  # Only the new layer's parameters are in the optimizer
		  optimizer = torch.optim.AdamW(model.fc.parameters(), lr=1e-3)
		  ```
		- [[OpenCV]] handles image loading, augmentation, and computer vision preprocessing. [[scikit-image]] provides additional image processing algorithms.

- # Transformers & Large Language Models
  collapsed:: true
	- ## The Attention Mechanism — The Core Innovation
		- The Transformer architecture (2017) replaced recurrence with **self-attention** — a mechanism that lets every token in a sequence directly attend to every other token, capturing long-range dependencies that RNNs struggled with.
		- ```
		  Self-Attention Math:
		  ─────────────────────────────────────────────────────────────
		  Input: sequence of token embeddings X ∈ ℝ^(n × d_model)

		  Q = X·Wq   (Queries — what this token is looking for)
		  K = X·Wk   (Keys   — what each token offers)
		  V = X·Wv   (Values — what each token contributes)

		  Attention(Q, K, V) = softmax(Q·Kᵀ / √d_k) · V
                               ──────────────────────
                               attention scores: how much
                               each token attends to each other

		  Multi-Head: run h attention heads in parallel, concatenate
		  → captures different types of relationships simultaneously
		  ```
		- ```python title="Using HuggingFace Transformers — the practical way"
		  from transformers import (
		      AutoTokenizer, AutoModel, AutoModelForSequenceClassification,
		      AutoModelForCausalLM, pipeline, BitsAndBytesConfig
		  )
		  import torch

		  # ── Embeddings — encode text to vectors ───────────────────────────
		  tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
		  model     = AutoModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")

		  def embed(texts: list[str]) -> torch.Tensor:
		      inputs  = tokenizer(texts, padding=True, truncation=True,
		                          max_length=512, return_tensors="pt")
		      with torch.no_grad():
		          out = model(**inputs)
		      # Mean pool over token dimension
		      mask = inputs["attention_mask"].unsqueeze(-1).float()
		      embeddings = (out.last_hidden_state * mask).sum(1) / mask.sum(1)
		      return torch.nn.functional.normalize(embeddings, p=2, dim=1)

		  vecs = embed(["Machine learning is fascinating", "AI is changing the world"])
		  similarity = (vecs[0] @ vecs[1]).item()
		  print(f"Cosine similarity: {similarity:.4f}")

		  # ── Sentiment classification ───────────────────────────────────────
		  classifier = pipeline("text-classification",
		                         model="distilbert-base-uncased-finetuned-sst-2-english",
		                         device=0 if torch.cuda.is_available() else -1)
		  results = classifier(["I love this product!", "This is terrible."])

		  # ── LLM inference with 4-bit quantization (run on consumer GPU) ───
		  quantization_config = BitsAndBytesConfig(
		      load_in_4bit=True,
		      bnb_4bit_compute_dtype=torch.float16,
		      bnb_4bit_use_double_quant=True,
		  )
		  llm_model = AutoModelForCausalLM.from_pretrained(
		      "mistralai/Mistral-7B-Instruct-v0.2",
		      quantization_config=quantization_config,
		      device_map="auto",
		  )
		  llm_tokenizer = AutoTokenizer.from_pretrained("mistralai/Mistral-7B-Instruct-v0.2")
		  ```
	-
	- ## Fine-Tuning LLMs
		- ```python title="LoRA fine-tuning with PEFT — efficient fine-tuning"
		  from peft import LoraConfig, get_peft_model, TaskType
		  from transformers import TrainingArguments, Trainer, DataCollatorForSeq2Seq

		  # LoRA: add small trainable rank-decomposition matrices
		  # Train <1% of parameters vs full fine-tuning
		  lora_config = LoraConfig(
		      task_type=TaskType.CAUSAL_LM,
		      r=16,              # rank — higher = more capacity, more params
		      lora_alpha=32,     # scaling factor
		      lora_dropout=0.1,
		      target_modules=["q_proj", "v_proj"],   # which layers to adapt
		      bias="none",
		  )

		  model = get_peft_model(base_model, lora_config)
		  model.print_trainable_parameters()
		  # trainable params: 6,553,600 || all params: 6,744,596,480 || trainable%: 0.097

		  training_args = TrainingArguments(
		      output_dir         = "./lora-finetuned",
		      num_train_epochs   = 3,
		      per_device_train_batch_size = 4,
		      gradient_accumulation_steps = 4,     # effective batch = 16
		      learning_rate      = 2e-4,
		      fp16               = True,
		      logging_steps      = 10,
		      save_strategy      = "epoch",
		      warmup_ratio       = 0.03,
		      lr_scheduler_type  = "cosine",
		  )
		  ```
	-
	- ## RAG — Retrieval-Augmented Generation
		- RAG is the pattern that grounds LLM responses in your own data — preventing hallucination and keeping knowledge current. Instead of fine-tuning, you retrieve relevant documents at query time and inject them into the prompt.
		- ```python title="RAG pipeline — full implementation"
		  from langchain_community.vectorstores import Chroma
		  from langchain_community.embeddings  import HuggingFaceEmbeddings
		  from langchain.text_splitter         import RecursiveCharacterTextSplitter
		  from langchain.schema                import Document
		  import anthropic

		  # ── Step 1: Ingest and embed documents ────────────────────────────
		  def build_vector_store(docs: list[str]) -> Chroma:
		      splitter = RecursiveCharacterTextSplitter(
		          chunk_size=512, chunk_overlap=64,
		          separators=["\n\n", "\n", ". ", " "]
		      )
		      chunks = splitter.create_documents(docs)
		      embeddings = HuggingFaceEmbeddings(
		          model_name="sentence-transformers/all-MiniLM-L6-v2"
		      )
		      return Chroma.from_documents(chunks, embeddings)

		  # ── Step 2: Retrieve relevant chunks + generate ───────────────────
		  def rag_query(question: str, vector_store: Chroma) -> str:
		      # Semantic search — find top 4 most relevant chunks
		      docs = vector_store.similarity_search(question, k=4)
		      context = "\n\n".join(f"[{i+1}] {d.page_content}" for i, d in enumerate(docs))

		      # Inject context into prompt
		      prompt = f"""Answer the question based on the provided context only.
		  If the context doesn't contain enough information, say so.

		  Context:
		  {context}

		  Question: {question}
		  Answer:"""

		      # Call LLM with grounded context
		      client   = anthropic.Anthropic()
		      response = client.messages.create(
		          model     = "claude-3-5-sonnet-20241022",
		          max_tokens= 1024,
		          messages  = [{"role": "user", "content": prompt}]
		      )
		      return response.content[0].text
		  ```

- # Natural Language Processing (NLP)
  collapsed:: true
	- ## The NLP Pipeline
		- ```mermaid
		  graph LR
		      Raw["📝 Raw Text"]
		      Clean["🧹 Cleaning\nLowercase · HTML · Unicode"]
		      Token["✂️ Tokenization\nWord · Subword · BPE"]
		      Embed["📐 Embedding\nWord2Vec · FastText\nBERT · Sentence-BERT"]
		      Task["🎯 Downstream Task\nClassify · NER · QA · Generate"]
		      Raw --> Clean --> Token --> Embed --> Task
		  ```
		- [[spaCy]] is the production NLP library for tokenization, POS tagging, named entity recognition, and dependency parsing. [[NLTK]] covers classical NLP with stemming, WordNet, and BLEU scoring. Both have dedicated pages.
	-
	- ## Text Classification & Named Entity Recognition
		- ```python title="NLP with spaCy + transformer pipeline"
		  import spacy
		  from spacy import displacy

		  # Load transformer-based model for maximum accuracy
		  nlp = spacy.load("en_core_web_trf")   # or "en_core_web_sm" for speed

		  text = "Apple Inc. acquired DeepMind for $500 million in London on January 15, 2024."
		  doc  = nlp(text)

		  # Named Entity Recognition
		  for ent in doc.ents:
		      print(f"{ent.text:30} → {ent.label_:10} ({spacy.explain(ent.label_)})")
		  # Apple Inc.             → ORG        (Companies, agencies)
		  # DeepMind               → ORG        (Companies, agencies)
		  # $500 million           → MONEY      (Monetary values)
		  # London                 → GPE        (Countries, cities)
		  # January 15, 2024       → DATE       (Absolute or relative dates)

		  # Dependency parsing
		  for token in doc:
		      print(f"{token.text:15} {token.dep_:10} → {token.head.text}")

		  # Visualize in browser
		  displacy.serve(doc, style="ent")
		  ```
	-
	- ## Sentiment Analysis & Text Generation
		- ```python title="Sentiment analysis and generation pipelines"
		  from transformers import pipeline

		  # Sentiment analysis — zero-shot, no training needed
		  sentiment = pipeline("sentiment-analysis",
		                        model="cardiffnlp/twitter-roberta-base-sentiment-latest")
		  results = sentiment([
		      "This product is absolutely amazing!",
		      "Worst purchase I've ever made.",
		      "It's okay, nothing special.",
		  ])
		  for r in results:
		      print(f"{r['label']:10} ({r['score']:.3f})")

		  # Zero-shot classification — classify into any categories
		  zero_shot = pipeline("zero-shot-classification",
		                        model="facebook/bart-large-mnli")
		  result = zero_shot(
		      "The new iPhone has a 48MP camera and 4K video recording.",
		      candidate_labels=["technology", "sports", "politics", "entertainment"]
		  )
		  print(dict(zip(result["labels"], [f"{s:.3f}" for s in result["scores"]])))

		  # Text summarization
		  summarizer = pipeline("summarization", model="facebook/bart-large-cnn",
		                         min_length=30, max_length=130)
		  summary = summarizer(long_article_text)[0]["summary_text"]
		  ```

- # Reinforcement Learning
  collapsed:: true
	- ## The RL Framework
		- RL agents learn by **interacting with an environment**, receiving rewards or penalties, and gradually discovering the policy (behavior) that maximizes cumulative reward. Unlike supervised learning, there is no labeled dataset — the signal comes from the environment.
		- The core challenge: **exploration vs exploitation** — the agent must balance trying new actions (exploration) against sticking with what it knows works (exploitation).
		- For game-specific RL applications with Unity ML-Agents, see [[Game AI]] — Reinforcement Learning section.
		- ```python title="Q-Learning from scratch — the classic algorithm"
		  import numpy as np
		  import gymnasium as gym

		  # CartPole: balance a pole on a cart
		  env = gym.make("CartPole-v1")

		  # Discretize continuous state space into bins
		  N_BINS    = [6, 6, 12, 12]     # bins per observation dimension
		  obs_space = list(zip(env.observation_space.low, env.observation_space.high))

		  def discretize(obs):
		      bins = [np.linspace(low, high, n) for (low, high), n in zip(obs_space, N_BINS)]
		      return tuple(int(np.digitize(o, b)) for o, b in zip(obs, bins))

		  # Q-table: state → action values
		  Q = np.zeros(tuple(n + 1 for n in N_BINS) + (env.action_space.n,))

		  # Training
		  alpha   = 0.1    # learning rate
		  gamma   = 0.99   # discount factor
		  epsilon = 1.0    # exploration rate

		  for episode in range(10000):
		      state, _ = env.reset()
		      state    = discretize(state)
		      done     = False

		      while not done:
		          # Epsilon-greedy: explore or exploit
		          if np.random.random() < epsilon:
		              action = env.action_space.sample()   # explore
		          else:
		              action = np.argmax(Q[state])          # exploit

		          next_obs, reward, terminated, truncated, _ = env.step(action)
		          done       = terminated or truncated
		          next_state = discretize(next_obs)

		          # Bellman equation update
		          Q[state][action] += alpha * (
		              reward + gamma * np.max(Q[next_state]) - Q[state][action]
		          )
		          state = next_state

		      epsilon = max(0.01, epsilon * 0.995)   # decay exploration

		      if episode % 1000 == 0:
		          print(f"Episode {episode:5d} | ε={epsilon:.3f}")
		  ```
	-
	- ## Deep RL Algorithms
		- | Algorithm | Type | Action Space | Key Idea | Used In |
		  |-----------|------|-------------|---------|---------|
		  | **DQN** | Value-based | Discrete | Deep Q-network with replay buffer | Atari games |
		  | **PPO** | Policy gradient | Both | Clip objective, stable training | Unity ML-Agents, OpenAI |
		  | **SAC** | Actor-Critic | Continuous | Entropy regularization, sample efficient | Robotics |
		  | **A3C/A2C** | Actor-Critic | Both | Async workers / advantage estimate | Multi-env training |
		  | **AlphaZero** | MCTS + RL | Discrete | Self-play + tree search | Chess, Go, StarCraft |
		  | **RLHF** | RL from human feedback | Both | Human preferences as reward signal | ChatGPT, Claude |

- # Model Evaluation & Selection
  collapsed:: true
	- ## Cross-Validation Strategies
		- ```python title="Advanced cross-validation patterns"
		  from sklearn.model_selection import (
		      KFold, StratifiedKFold, TimeSeriesSplit,
		      cross_validate, learning_curve
		  )
		  from sklearn.pipeline import Pipeline
		  import numpy as np

		  # ── Stratified K-Fold — preserves class balance in each fold ──────
		  skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

		  # Cross-validate with multiple metrics at once
		  cv_results = cross_validate(
		      Pipeline([("prep", preprocessor), ("model", xgb.XGBClassifier())]),
		      X, y, cv=skf,
		      scoring=["accuracy", "f1_weighted", "roc_auc"],
		      return_train_score=True,
		      n_jobs=-1,
		  )
		  for metric in ["accuracy", "f1_weighted", "roc_auc"]:
		      train = cv_results[f"train_{metric}"]
		      test  = cv_results[f"test_{metric}"]
		      print(f"{metric:20} train={train.mean():.4f}±{train.std():.4f}"
		            f"  test={test.mean():.4f}±{test.std():.4f}")

		  # ── Learning curve — diagnose bias vs variance ─────────────────────
		  train_sizes, train_scores, val_scores = learning_curve(
		      model, X, y, cv=5,
		      train_sizes=np.linspace(0.1, 1.0, 10),
		      scoring="accuracy", n_jobs=-1
		  )
		  # Plot: if val_score plateau early → high variance (need more data or regularize)
		  #       if val_score ≈ train_score low → high bias (need more complex model)
		  ```
	-
	- ## Hyperparameter Optimization
		- ```python title="Optuna — Bayesian hyperparameter optimization"
		  import optuna
		  from sklearn.ensemble import GradientBoostingClassifier

		  def objective(trial: optuna.Trial) -> float:
		      params = {
		          "n_estimators":  trial.suggest_int("n_estimators",  50, 500),
		          "max_depth":     trial.suggest_int("max_depth",     2,  10),
		          "learning_rate": trial.suggest_float("learning_rate", 1e-4, 0.5, log=True),
		          "subsample":     trial.suggest_float("subsample",   0.5,  1.0),
		          "min_samples_leaf": trial.suggest_int("min_samples_leaf", 1, 20),
		      }
		      model = GradientBoostingClassifier(**params, random_state=42)
		      scores = cross_val_score(model, X_train_processed, y_train,
		                               cv=3, scoring="roc_auc", n_jobs=-1)
		      return scores.mean()

		  study = optuna.create_study(direction="maximize",
		                               sampler=optuna.samplers.TPESampler(seed=42))
		  study.optimize(objective, n_trials=100, timeout=300, n_jobs=1)

		  print(f"Best ROC-AUC: {study.best_value:.4f}")
		  print(f"Best params:  {study.best_params}")

		  # Visualize optimization history
		  optuna.visualization.plot_optimization_history(study).show()
		  optuna.visualization.plot_param_importances(study).show()
		  ```

- # MLOps — Production Machine Learning
  collapsed:: true
	- ## What is MLOps
		- MLOps (Machine Learning Operations) applies [[DevOps]] principles to ML: versioning, CI/CD, monitoring, and automation for the full ML lifecycle. Without MLOps, models are deployed once and forgotten — silently degrading as the world changes around them.
		- ```mermaid
		  graph LR
		      EXP["🧪 Experiment\nMLflow · W&B\nTrack runs + metrics"]
		      TRAIN["🏋️ Train Pipeline\nAirflow · Kestra · Kubeflow\nScheduled retraining"]
		      VALID["✅ Validation\nTest metrics · Bias checks\nData validation (Great Expectations)"]
		      SERVE["🚀 Serving\nFastAPI · TorchServe\nTriton · BentoML"]
		      MONITOR["📡 Monitor\nData drift · Concept drift\nEvident AI · NannyML"]
		      RETRAIN["🔄 Auto-retrain\nOn drift detection\nor scheduled"]
		      EXP --> TRAIN --> VALID --> SERVE --> MONITOR --> RETRAIN --> TRAIN
		  ```
	-
	- ## Experiment Tracking with MLflow
		- ```python title="MLflow — track experiments, log models"
		  import mlflow
		  import mlflow.sklearn
		  import mlflow.pytorch

		  mlflow.set_tracking_uri("http://mlflow-server:5000")
		  mlflow.set_experiment("customer-churn-prediction")

		  with mlflow.start_run(run_name="xgboost-v3"):
		      # Log hyperparameters
		      mlflow.log_params({
		          "n_estimators": 200,
		          "learning_rate": 0.05,
		          "max_depth": 6,
		      })

		      # Train model
		      model = xgb.XGBClassifier(**params)
		      model.fit(X_train_processed, y_train)

		      # Log metrics
		      y_pred = model.predict(X_test_processed)
		      mlflow.log_metrics({
		          "accuracy": accuracy_score(y_test, y_pred),
		          "f1":       f1_score(y_test, y_pred),
		          "roc_auc":  roc_auc_score(y_test, model.predict_proba(X_test_processed)[:, 1]),
		      })

		      # Log artifacts
		      mlflow.log_figure(fig, "confusion_matrix.png")
		      mlflow.log_artifact("feature_importance.png")

		      # Log model with signature
		      mlflow.sklearn.log_model(
		          model,
		          artifact_path="model",
		          signature=mlflow.models.infer_signature(X_train_processed, y_pred),
		          registered_model_name="ChurnPredictor",
		      )
		  ```
	-
	- ## Model Serving
		- ```python title="FastAPI model serving — production REST endpoint"
		  from fastapi import FastAPI, HTTPException
		  from pydantic import BaseModel
		  import mlflow.pyfunc
		  import pandas as pd
		  import numpy as np

		  app = FastAPI(title="ML Model API")

		  # Load model at startup — not per-request
		  MODEL_URI = "models:/ChurnPredictor/Production"
		  model = mlflow.pyfunc.load_model(MODEL_URI)

		  class PredictionRequest(BaseModel):
		      age:        float
		      tenure:     float
		      monthly_charges: float
		      contract:   str

		  class PredictionResponse(BaseModel):
		      prediction:  int          # 0 = no churn, 1 = churn
		      probability: float        # churn probability 0-1
		      model_version: str

		  @app.post("/predict", response_model=PredictionResponse)
		  async def predict(request: PredictionRequest) -> PredictionResponse:
		      try:
		          df = pd.DataFrame([request.model_dump()])
		          proba = model.predict(df)[0]
		          return PredictionResponse(
		              prediction    = int(proba > 0.5),
		              probability   = float(proba),
		              model_version = MODEL_URI,
		          )
		      except Exception as e:
		          raise HTTPException(status_code=500, detail=str(e))

		  @app.get("/health")
		  async def health():
		      return {"status": "ok", "model": MODEL_URI}
		  ```
	-
	- ## Data Drift Detection
		- ```python title="Detecting distribution shift in production"
		  from evidently.report import Report
		  from evidently.metric_preset import DataDriftPreset, ClassificationPreset
		  import pandas as pd

		  # Compare training distribution vs live production data
		  reference_data = pd.read_parquet("training_data.parquet")
		  current_data   = pd.read_parquet("production_data_last_7d.parquet")

		  # Data drift report
		  drift_report = Report(metrics=[DataDriftPreset()])
		  drift_report.run(reference_data=reference_data, current_data=current_data)
		  drift_report.save_html("drift_report.html")

		  # Check programmatically
		  drift_result = drift_report.as_dict()
		  drifted_features = [
		      feature for feature, stats
		      in drift_result["metrics"][0]["result"]["drift_by_columns"].items()
		      if stats["drift_detected"]
		  ]
		  if drifted_features:
		      print(f"⚠️ Drift detected in: {drifted_features}")
		      # Trigger retraining pipeline via Kestra or Airflow
		  ```
		- [[kestra]] (see [[DevOps]] ecosystem) and [[Celery]] handle the automated retraining pipelines that drift detection triggers. [[Automation]] covers the broader MLOps workflow automation patterns.

- # Explore Further
	- ML is built on every layer of the engineering stack. Here is where to go deeper.
	-
	- **The data layer** — before modeling, you need clean, well-understood data. [[Data Science]] covers the full EDA workflow with [[Pandas]], [[NumPy]], statistical testing, and visualization with [[Matplotlib]], [[Seaborn]], and [[Plotly]]. The data pipeline and feature store patterns there feed directly into the preprocessing section of this page.
	-
	- **The deep learning framework** — [[PyTorch]] has its own dedicated page covering custom datasets, distributed training, ONNX export, and TorchScript. For production vision workloads, [[OpenCV]] handles real-time video processing and image augmentation. [[scikit-image]] provides classical computer vision algorithms. [[Scikit-learn]] covers the classical ML algorithms in depth with tuning examples, pipelines, and ensemble methods.
	-
	- **Scientific computing underneath** — [[SciPy]] provides the statistical tests, signal processing, and optimization algorithms that ML relies on. [[SymPy]] handles symbolic math — useful for deriving and verifying gradients.
	-
	- **NLP tooling** — [[spaCy]] is the production NLP library for entity recognition, dependency parsing, and text pipelines. [[NLTK]] covers classical NLP (stemming, WordNet, BLEU scores). Together they handle everything from quick text preprocessing to full annotation pipelines.
	-
	- **Game AI and RL in engines** — [[Game AI]] covers Unity ML-Agents, reward design, imitation learning, and how RL connects to FSMs and behavior trees in real game development. It bridges the gap between the RL algorithms on this page and shipping an actual game.
	-
	- **Deploying models to production** — [[DevOps]] covers containerizing models with [[Docker]], deploying to Kubernetes, and CI/CD pipelines for ML. [[Automation]] covers the orchestration layer: training pipeline scheduling, model validation workflows, and automated retraining with [[kestra]]. [[Continuous Monitoring & Logging]] covers how to monitor model endpoints — latency, error rates, and input distribution drift detection.
	-
	- **The architecture your model runs on** — [[System Design]] covers model serving at scale: inference caches, async queues for batch prediction, GPU cluster design, and the CAP theorem tradeoffs in distributed training. [[System Design - Scalability & CAP]] is particularly relevant when your model needs to handle millions of inference requests per day.
	-
	- **Security and responsible AI** — [[Cybersecurity]] covers adversarial ML attacks (model inversion, membership inference, prompt injection in LLMs) and defenses. Understanding the attack surface of deployed models is increasingly important as AI becomes more widely integrated into critical systems.

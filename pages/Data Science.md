---
seoTitle: Data Science Complete Guide – Beginner to Advanced Reference
description: "Comprehensive data science reference covering statistics, Python, data wrangling, visualization, machine learning, deep learning, MLOps, and real-world projects."
keywords: "data science, machine learning, deep learning, pandas, numpy, scikit-learn, tensorflow, pytorch, data visualization, statistics, MLOps, data science guide, data science notes, data science tutorial, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Data Science
---

- # What is Data Science?
	- Data Science is an interdisciplinary field that uses scientific methods, algorithms, and systems to extract knowledge and insights from structured and unstructured data.
	- It combines **statistics**, **programming**, **domain knowledge**, and **machine learning** to solve real-world problems.
	- ## The Data Science Workflow
		- ```
		  Problem Definition
		       ↓
		  Data Collection
		       ↓
		  Data Cleaning & Wrangling
		       ↓
		  Exploratory Data Analysis (EDA)
		       ↓
		  Feature Engineering
		       ↓
		  Model Building & Training
		       ↓
		  Model Evaluation
		       ↓
		  Deployment & Monitoring
		  ```
	- ## Related Pages
		- [[Python]] — Primary language for data science
		- [[R]] — Statistical computing language
		- [[Statistics & Probability]] — Mathematical foundations
		- [[Machine Learning]] — Core modeling techniques
		- [[Deep Learning]] — Neural network methods
- # History
  collapsed:: true
	- **How**: Emerged from statistics and computer science in the early 2000s. The term "Data Scientist" was popularized by DJ Patil and Jeff Hammerbacher around 2008.
	- **Who**: Key figures include John Tukey (EDA), Leo Breiman (Random Forests), Geoffrey Hinton (Deep Learning), Yann LeCun, Yoshua Bengio.
	- **Why**: Explosion of digital data (Big Data) required new tools and methods beyond traditional statistics to extract value at scale.
	- **Timeline**:
		- 1960s — Statistical computing begins
		- 1977 — John Tukey coins "Exploratory Data Analysis"
		- 1990s — Data mining and knowledge discovery emerge
		- 2001 — William Cleveland proposes "Data Science" as a discipline
		- 2008 — "Data Scientist" role defined at Facebook/LinkedIn
		- 2012 — Harvard Business Review calls it "The Sexiest Job of the 21st Century"
		- 2015+ — Deep learning revolution; TensorFlow, PyTorch released
		- 2020+ — AutoML, MLOps, LLMs become mainstream
- # Introduction
  collapsed:: true
	- ## Advantages
	  collapsed:: true
		- Turns raw data into actionable insights and business value
		- Powers AI/ML applications across every industry
		- High demand and well-compensated career path
		- Open-source ecosystem (Python, R) lowers barrier to entry
		- Applicable to virtually every domain: healthcare, finance, gaming, science
	- ## Disadvantages
	  collapsed:: true
		- Requires strong math background (linear algebra, calculus, statistics)
		- Data quality issues consume most of the work (80% cleaning, 20% modeling)
		- Models can be black boxes — hard to interpret and explain
		- Privacy and ethical concerns with personal data
		- Computationally expensive for large-scale training
	- ## Data Science vs Related Fields
	  collapsed:: true
		- ```
		  Data Analyst     → Describes what happened (reports, dashboards)
		  Data Scientist   → Predicts what will happen (models, ML)
		  Data Engineer    → Builds pipelines to move/store data
		  ML Engineer      → Deploys and scales ML models in production
		  AI Researcher    → Advances the theory and algorithms
		  ```
- # Mathematics & Statistics Foundations
  collapsed:: true
	- ## Linear Algebra
	  collapsed:: true
		- Core to understanding ML algorithms and neural networks.
		- ```python
		  import numpy as np
		  
		  # Vectors
		  v = np.array([1, 2, 3])
		  
		  # Matrix
		  A = np.array([[1, 2], [3, 4]])
		  
		  # Dot product
		  print(np.dot(v, v))        # 14
		  
		  # Matrix multiplication
		  B = np.array([[5, 6], [7, 8]])
		  print(A @ B)               # [[19 22], [43 50]]
		  
		  # Transpose
		  print(A.T)                 # [[1 3], [2 4]]
		  
		  # Inverse
		  print(np.linalg.inv(A))
		  
		  # Eigenvalues & Eigenvectors (used in PCA)
		  vals, vecs = np.linalg.eig(A)
		  ```
		- Key concepts: vectors, matrices, dot product, matrix multiplication, transpose, inverse, eigenvalues, eigenvectors, SVD
	- ## Statistics Essentials
	  collapsed:: true
		- ```python
		  import numpy as np
		  from scipy import stats
		  
		  data = [2, 4, 4, 4, 5, 5, 7, 9]
		  
		  # Central tendency
		  print(np.mean(data))       # 5.0
		  print(np.median(data))     # 4.5
		  print(stats.mode(data))    # ModeResult(mode=4, count=3)
		  
		  # Spread
		  print(np.var(data))        # variance
		  print(np.std(data))        # standard deviation: 1.87
		  
		  # Percentiles
		  print(np.percentile(data, 25))   # Q1
		  print(np.percentile(data, 75))   # Q3
		  
		  # Correlation
		  x = [1, 2, 3, 4, 5]
		  y = [2, 4, 5, 4, 5]
		  print(np.corrcoef(x, y)[0, 1])   # Pearson r
		  ```
		- Key concepts: mean, median, mode, variance, std dev, distributions, hypothesis testing, p-value, confidence intervals, correlation
	- ## Probability
	  collapsed:: true
		- ```python
		  from scipy.stats import norm, binom, poisson
		  
		  # Normal distribution
		  mu, sigma = 0, 1
		  print(norm.pdf(0, mu, sigma))     # PDF at x=0: 0.3989
		  print(norm.cdf(1.96, mu, sigma))  # CDF: ~0.975 (95% CI)
		  
		  # Binomial distribution
		  # P(X=3) for n=10 trials, p=0.5
		  print(binom.pmf(3, 10, 0.5))      # 0.117
		  
		  # Poisson distribution
		  print(poisson.pmf(2, mu=3))        # P(X=2) with lambda=3
		  ```
		- Key concepts: probability rules, Bayes' theorem, distributions (normal, binomial, Poisson), expected value, law of large numbers
- # Python for Data Science
  collapsed:: true
	- See [[Python]] for full language reference. This section covers the data science-specific stack.
	- ## NumPy — Numerical Computing
	  collapsed:: true
		- ```python
		  import numpy as np
		  
		  # Create arrays
		  a = np.array([1, 2, 3, 4, 5])
		  zeros = np.zeros((3, 4))          # 3x4 matrix of zeros
		  ones = np.ones((2, 3))
		  rng = np.arange(0, 10, 2)         # [0 2 4 6 8]
		  linspace = np.linspace(0, 1, 5)   # [0. 0.25 0.5 0.75 1.]
		  rand = np.random.rand(3, 3)       # random 3x3 matrix
		  
		  # Array operations (vectorized — no loops needed)
		  b = np.array([10, 20, 30, 40, 50])
		  print(a + b)       # [11 22 33 44 55]
		  print(a * 2)       # [2 4 6 8 10]
		  print(a ** 2)      # [1 4 9 16 25]
		  print(np.sqrt(a))  # [1. 1.41 1.73 2. 2.23]
		  
		  # Indexing & slicing
		  m = np.array([[1,2,3],[4,5,6],[7,8,9]])
		  print(m[1, 2])     # 6
		  print(m[:, 1])     # [2 5 8] — column 1
		  print(m[0, :])     # [1 2 3] — row 0
		  
		  # Boolean indexing
		  print(a[a > 3])    # [4 5]
		  
		  # Reshape
		  print(a.reshape(5, 1))
		  print(m.flatten())  # [1 2 3 4 5 6 7 8 9]
		  
		  # Aggregations
		  print(m.sum())         # 45
		  print(m.sum(axis=0))   # column sums: [12 15 18]
		  print(m.sum(axis=1))   # row sums: [6 15 24]
		  print(m.mean())        # 5.0
		  print(m.max())         # 9
		  print(m.argmax())      # 8 (flat index)
		  ```
	- ## Pandas — Data Manipulation
	  collapsed:: true
		- ```python
		  import pandas as pd
		  
		  # Create DataFrame
		  df = pd.DataFrame({
		      "name": ["Alice", "Bob", "Charlie", "Diana"],
		      "age": [25, 30, 35, 28],
		      "score": [88.5, 92.0, 78.3, 95.1],
		      "city": ["NYC", "LA", "NYC", "Chicago"]
		  })
		  
		  # Basic inspection
		  print(df.head())          # first 5 rows
		  print(df.tail(2))         # last 2 rows
		  print(df.shape)           # (4, 4)
		  print(df.dtypes)          # column data types
		  print(df.describe())      # statistical summary
		  print(df.info())          # memory + null info
		  
		  # Selecting
		  print(df["name"])                    # Series
		  print(df[["name", "score"]])         # DataFrame
		  print(df.loc[0])                     # row by label
		  print(df.iloc[1:3])                  # rows by position
		  print(df.loc[df["age"] > 28])        # filter rows
		  
		  # Adding / modifying columns
		  df["grade"] = df["score"].apply(lambda x: "A" if x >= 90 else "B")
		  df["age_group"] = pd.cut(df["age"], bins=[0,25,35,100], labels=["young","mid","senior"])
		  
		  # Aggregation
		  print(df.groupby("city")["score"].mean())
		  print(df["score"].mean())
		  print(df["city"].value_counts())
		  
		  # Sorting
		  df.sort_values("score", ascending=False, inplace=True)
		  
		  # Handling missing values
		  df2 = df.copy()
		  df2.loc[0, "score"] = None
		  print(df2.isnull().sum())            # count nulls per column
		  df2["score"].fillna(df2["score"].mean(), inplace=True)  # fill with mean
		  df2.dropna(inplace=True)             # drop rows with any null
		  
		  # Merging / joining
		  df_a = pd.DataFrame({"id": [1,2,3], "val": ["a","b","c"]})
		  df_b = pd.DataFrame({"id": [2,3,4], "info": ["x","y","z"]})
		  merged = pd.merge(df_a, df_b, on="id", how="inner")
		  
		  # Read/write files
		  df.to_csv("output.csv", index=False)
		  df_loaded = pd.read_csv("output.csv")
		  df.to_json("output.json")
		  df_excel = pd.read_excel("data.xlsx")
		  ```
- # Data Visualization
  collapsed:: true
	- ## Matplotlib — Core Plotting
	  collapsed:: true
		- ```python
		  import matplotlib.pyplot as plt
		  import numpy as np
		  
		  x = np.linspace(0, 10, 100)
		  
		  # Line plot
		  plt.figure(figsize=(8, 4))
		  plt.plot(x, np.sin(x), label="sin(x)", color="blue")
		  plt.plot(x, np.cos(x), label="cos(x)", color="red", linestyle="--")
		  plt.title("Trig Functions")
		  plt.xlabel("x")
		  plt.ylabel("y")
		  plt.legend()
		  plt.grid(True)
		  plt.tight_layout()
		  plt.show()
		  
		  # Subplots
		  fig, axes = plt.subplots(1, 2, figsize=(12, 4))
		  axes[0].hist(np.random.randn(1000), bins=30, color="steelblue")
		  axes[0].set_title("Histogram")
		  axes[1].scatter(np.random.rand(50), np.random.rand(50), alpha=0.6)
		  axes[1].set_title("Scatter Plot")
		  plt.show()
		  
		  # Bar chart
		  categories = ["A", "B", "C", "D"]
		  values = [23, 45, 12, 67]
		  plt.bar(categories, values, color="coral")
		  plt.show()
		  ```
	- ## Seaborn — Statistical Visualization
	  collapsed:: true
		- ```python
		  import seaborn as sns
		  import pandas as pd
		  
		  # Load built-in dataset
		  tips = sns.load_dataset("tips")
		  
		  # Distribution plot
		  sns.histplot(tips["total_bill"], kde=True)
		  plt.show()
		  
		  # Box plot
		  sns.boxplot(x="day", y="total_bill", data=tips)
		  plt.show()
		  
		  # Scatter with regression line
		  sns.regplot(x="total_bill", y="tip", data=tips)
		  plt.show()
		  
		  # Heatmap (correlation matrix)
		  corr = tips.select_dtypes(include="number").corr()
		  sns.heatmap(corr, annot=True, cmap="coolwarm", fmt=".2f")
		  plt.show()
		  
		  # Pair plot — all pairwise relationships
		  sns.pairplot(tips, hue="sex")
		  plt.show()
		  ```
	- ## Plotly — Interactive Visualization
	  collapsed:: true
		- ```python
		  import plotly.express as px
		  
		  df = px.data.gapminder()
		  
		  # Interactive scatter
		  fig = px.scatter(df[df.year == 2007],
		                   x="gdpPercap", y="lifeExp",
		                   size="pop", color="continent",
		                   hover_name="country",
		                   log_x=True, title="GDP vs Life Expectancy")
		  fig.show()
		  
		  # Animated chart over time
		  fig = px.scatter(df, x="gdpPercap", y="lifeExp",
		                   animation_frame="year", size="pop",
		                   color="continent", log_x=True)
		  fig.show()
		  ```
- # Exploratory Data Analysis (EDA)
  collapsed:: true
	- EDA is the process of analyzing datasets to summarize their main characteristics before modeling.
	- ## EDA Checklist
	  collapsed:: true
		- ```
		  1. Load & inspect data (shape, dtypes, head)
		  2. Check for missing values
		  3. Check for duplicates
		  4. Understand distributions (histograms, boxplots)
		  5. Check for outliers (IQR method, z-score)
		  6. Analyze correlations (heatmap)
		  7. Explore categorical variables (value_counts)
		  8. Identify target variable distribution
		  ```
	- ## Outlier Detection
	  collapsed:: true
		- ```python
		  import numpy as np
		  import pandas as pd
		  
		  data = pd.Series([10, 12, 11, 13, 200, 9, 11, 12])
		  
		  # IQR method
		  Q1 = data.quantile(0.25)
		  Q3 = data.quantile(0.75)
		  IQR = Q3 - Q1
		  lower = Q1 - 1.5 * IQR
		  upper = Q3 + 1.5 * IQR
		  outliers = data[(data < lower) | (data > upper)]
		  print(outliers)   # 4    200
		  
		  # Z-score method
		  from scipy import stats
		  z_scores = np.abs(stats.zscore(data))
		  outliers_z = data[z_scores > 3]
		  ```
- # Feature Engineering
  collapsed:: true
	- Feature engineering transforms raw data into features that better represent the underlying problem to the model.
	- ## Encoding Categorical Variables
	  collapsed:: true
		- ```python
		  import pandas as pd
		  from sklearn.preprocessing import LabelEncoder, OneHotEncoder
		  
		  df = pd.DataFrame({"color": ["red", "blue", "green", "red"]})
		  
		  # Label Encoding (ordinal — use for tree models)
		  le = LabelEncoder()
		  df["color_label"] = le.fit_transform(df["color"])
		  # red=2, blue=0, green=1
		  
		  # One-Hot Encoding (use for linear models / neural nets)
		  df_ohe = pd.get_dummies(df["color"], prefix="color")
		  print(df_ohe)
		  # color_blue  color_green  color_red
		  #          0            0          1
		  #          1            0          0
		  ```
	- ## Scaling & Normalization
	  collapsed:: true
		- ```python
		  from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler
		  import numpy as np
		  
		  X = np.array([[1, 100], [2, 200], [3, 300], [4, 400]])
		  
		  # StandardScaler — zero mean, unit variance (z-score)
		  scaler = StandardScaler()
		  X_std = scaler.fit_transform(X)
		  
		  # MinMaxScaler — scales to [0, 1]
		  mm = MinMaxScaler()
		  X_mm = mm.fit_transform(X)
		  
		  # RobustScaler — uses median/IQR, robust to outliers
		  rb = RobustScaler()
		  X_rb = rb.fit_transform(X)
		  
		  # IMPORTANT: fit on train, transform on test
		  # scaler.fit(X_train)
		  # X_train_scaled = scaler.transform(X_train)
		  # X_test_scaled = scaler.transform(X_test)  # NOT fit_transform!
		  ```
	- ## Feature Selection
	  collapsed:: true
		- ```python
		  from sklearn.feature_selection import SelectKBest, f_classif, RFE
		  from sklearn.ensemble import RandomForestClassifier
		  
		  # Select top K features by statistical test
		  selector = SelectKBest(f_classif, k=5)
		  X_new = selector.fit_transform(X, y)
		  
		  # Recursive Feature Elimination
		  rfe = RFE(RandomForestClassifier(), n_features_to_select=5)
		  rfe.fit(X, y)
		  print(rfe.support_)   # boolean mask of selected features
		  
		  # Feature importance from tree models
		  rf = RandomForestClassifier()
		  rf.fit(X, y)
		  importances = pd.Series(rf.feature_importances_, index=feature_names)
		  importances.sort_values(ascending=False).plot(kind="bar")
		  ```
- # Machine Learning
  collapsed:: true
	- ## ML Types Overview
	  collapsed:: true
		- ```
		  Supervised Learning    → labeled data → predict output
		    ├── Classification   → discrete output (spam/not spam)
		    └── Regression       → continuous output (house price)
		  
		  Unsupervised Learning  → no labels → find structure
		    ├── Clustering       → group similar data
		    └── Dimensionality Reduction → compress features
		  
		  Reinforcement Learning → agent learns via rewards/penalties
		  ```
	- ## Train/Test Split & Cross-Validation
	  collapsed:: true
		- ```python
		  from sklearn.model_selection import train_test_split, cross_val_score, KFold
		  
		  # Basic split
		  X_train, X_test, y_train, y_test = train_test_split(
		      X, y, test_size=0.2, random_state=42, stratify=y
		  )
		  
		  # K-Fold Cross Validation (more reliable evaluation)
		  kf = KFold(n_splits=5, shuffle=True, random_state=42)
		  scores = cross_val_score(model, X, y, cv=kf, scoring="accuracy")
		  print(f"CV Accuracy: {scores.mean():.3f} ± {scores.std():.3f}")
		  ```
	- ## Regression Algorithms
	  collapsed:: true
		- ```python
		  from sklearn.linear_model import LinearRegression, Ridge, Lasso, ElasticNet
		  from sklearn.metrics import mean_squared_error, r2_score
		  import numpy as np
		  
		  # Linear Regression
		  lr = LinearRegression()
		  lr.fit(X_train, y_train)
		  y_pred = lr.predict(X_test)
		  
		  print(f"MSE:  {mean_squared_error(y_test, y_pred):.4f}")
		  print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.4f}")
		  print(f"R²:   {r2_score(y_test, y_pred):.4f}")
		  
		  # Ridge (L2 regularization — penalizes large weights)
		  ridge = Ridge(alpha=1.0)
		  ridge.fit(X_train, y_train)
		  
		  # Lasso (L1 regularization — drives some weights to zero)
		  lasso = Lasso(alpha=0.1)
		  lasso.fit(X_train, y_train)
		  
		  # ElasticNet (L1 + L2 combined)
		  en = ElasticNet(alpha=0.1, l1_ratio=0.5)
		  en.fit(X_train, y_train)
		  ```
	- ## Classification Algorithms
	  collapsed:: true
		- ```python
		  from sklearn.linear_model import LogisticRegression
		  from sklearn.tree import DecisionTreeClassifier
		  from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
		  from sklearn.svm import SVC
		  from sklearn.neighbors import KNeighborsClassifier
		  from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
		  
		  # Logistic Regression
		  log_reg = LogisticRegression(max_iter=1000)
		  log_reg.fit(X_train, y_train)
		  y_pred = log_reg.predict(X_test)
		  
		  # Evaluation
		  print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
		  print(classification_report(y_test, y_pred))
		  print(confusion_matrix(y_test, y_pred))
		  
		  # Random Forest
		  rf = RandomForestClassifier(n_estimators=100, random_state=42)
		  rf.fit(X_train, y_train)
		  
		  # Gradient Boosting (XGBoost-style)
		  gb = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1)
		  gb.fit(X_train, y_train)
		  
		  # SVM
		  svm = SVC(kernel="rbf", C=1.0, gamma="scale")
		  svm.fit(X_train, y_train)
		  
		  # KNN
		  knn = KNeighborsClassifier(n_neighbors=5)
		  knn.fit(X_train, y_train)
		  ```
	- ## Clustering (Unsupervised)
	  collapsed:: true
		- ```python
		  from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
		  from sklearn.metrics import silhouette_score
		  
		  # K-Means
		  kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
		  labels = kmeans.fit_predict(X)
		  print(f"Silhouette Score: {silhouette_score(X, labels):.3f}")
		  print(f"Cluster Centers:\n{kmeans.cluster_centers_}")
		  
		  # Elbow method — find optimal k
		  inertias = []
		  for k in range(1, 11):
		      km = KMeans(n_clusters=k, random_state=42, n_init=10)
		      km.fit(X)
		      inertias.append(km.inertia_)
		  # Plot inertias vs k and look for the "elbow"
		  
		  # DBSCAN — density-based, finds arbitrary shapes, handles noise
		  db = DBSCAN(eps=0.5, min_samples=5)
		  labels_db = db.fit_predict(X)
		  # label -1 = noise points
		  ```
	- ## Dimensionality Reduction
	  collapsed:: true
		- ```python
		  from sklearn.decomposition import PCA
		  from sklearn.manifold import TSNE
		  
		  # PCA — linear dimensionality reduction
		  pca = PCA(n_components=2)
		  X_pca = pca.fit_transform(X)
		  print(f"Explained variance ratio: {pca.explained_variance_ratio_}")
		  
		  # Keep 95% of variance
		  pca_95 = PCA(n_components=0.95)
		  X_reduced = pca_95.fit_transform(X)
		  print(f"Components needed: {pca_95.n_components_}")
		  
		  # t-SNE — non-linear, great for visualization (not for production)
		  tsne = TSNE(n_components=2, random_state=42, perplexity=30)
		  X_tsne = tsne.fit_transform(X)
		  ```
	- ## Hyperparameter Tuning
	  collapsed:: true
		- ```python
		  from sklearn.model_selection import GridSearchCV, RandomizedSearchCV
		  from sklearn.ensemble import RandomForestClassifier
		  
		  # Grid Search — exhaustive search
		  param_grid = {
		      "n_estimators": [50, 100, 200],
		      "max_depth": [None, 5, 10],
		      "min_samples_split": [2, 5]
		  }
		  grid = GridSearchCV(RandomForestClassifier(), param_grid, cv=5, scoring="accuracy", n_jobs=-1)
		  grid.fit(X_train, y_train)
		  print(f"Best params: {grid.best_params_}")
		  print(f"Best score:  {grid.best_score_:.4f}")
		  
		  # Randomized Search — faster for large spaces
		  from scipy.stats import randint
		  param_dist = {"n_estimators": randint(50, 500), "max_depth": randint(3, 20)}
		  rand = RandomizedSearchCV(RandomForestClassifier(), param_dist, n_iter=20, cv=5)
		  rand.fit(X_train, y_train)
		  ```
- # Model Evaluation & Metrics
  collapsed:: true
	- ## Classification Metrics
	  collapsed:: true
		- ```
		  Accuracy    = (TP + TN) / Total          — overall correctness
		  Precision   = TP / (TP + FP)             — of predicted positives, how many are correct
		  Recall      = TP / (TP + FN)             — of actual positives, how many did we catch
		  F1 Score    = 2 * (Precision * Recall) / (Precision + Recall)
		  ROC-AUC     — area under ROC curve (1.0 = perfect, 0.5 = random)
		  
		  Use Precision when false positives are costly (spam filter)
		  Use Recall when false negatives are costly (cancer detection)
		  Use F1 when you need balance between both
		  ```
		- ```python
		  from sklearn.metrics import (accuracy_score, precision_score, recall_score,
		                               f1_score, roc_auc_score, roc_curve)
		  
		  print(f"Accuracy:  {accuracy_score(y_test, y_pred):.4f}")
		  print(f"Precision: {precision_score(y_test, y_pred):.4f}")
		  print(f"Recall:    {recall_score(y_test, y_pred):.4f}")
		  print(f"F1:        {f1_score(y_test, y_pred):.4f}")
		  
		  # ROC-AUC (needs probability scores)
		  y_proba = model.predict_proba(X_test)[:, 1]
		  print(f"ROC-AUC:   {roc_auc_score(y_test, y_proba):.4f}")
		  ```
	- ## Regression Metrics
	  collapsed:: true
		- ```python
		  from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
		  import numpy as np
		  
		  print(f"MAE:  {mean_absolute_error(y_test, y_pred):.4f}")
		  print(f"MSE:  {mean_squared_error(y_test, y_pred):.4f}")
		  print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.4f}")
		  print(f"R²:   {r2_score(y_test, y_pred):.4f}")
		  # R² = 1.0 is perfect, 0.0 = predicts mean, negative = worse than mean
		  ```
	- ## Bias-Variance Tradeoff
	  collapsed:: true
		- ```
		  High Bias (Underfitting)   → model too simple, misses patterns
		                               → train error high, test error high
		  
		  High Variance (Overfitting) → model too complex, memorizes noise
		                               → train error low, test error high
		  
		  Goal: find the sweet spot (low bias + low variance)
		  
		  Fix Underfitting:
		    - More complex model
		    - More features
		    - Less regularization
		  
		  Fix Overfitting:
		    - More training data
		    - Regularization (L1/L2, dropout)
		    - Simpler model
		    - Cross-validation
		    - Early stopping
		  ```
- # Deep Learning
  collapsed:: true
	- ## Neural Network Basics
	  collapsed:: true
		- ```
		  Input Layer → Hidden Layers → Output Layer
		  
		  Each neuron: output = activation(weights · inputs + bias)
		  
		  Common Activations:
		    ReLU     → max(0, x)           — hidden layers (most common)
		    Sigmoid  → 1/(1+e^-x)          — binary output [0,1]
		    Softmax  → e^xi / Σe^xj        — multi-class output
		    Tanh     → (e^x - e^-x)/(e^x + e^-x)  — [-1, 1]
		  
		  Training:
		    Forward pass → compute predictions
		    Loss function → measure error
		    Backpropagation → compute gradients
		    Optimizer → update weights
		  ```
	- ## TensorFlow / Keras
	  collapsed:: true
		- ```python
		  import tensorflow as tf
		  from tensorflow import keras
		  from tensorflow.keras import layers
		  
		  # Build a simple feedforward network
		  model = keras.Sequential([
		      layers.Dense(128, activation="relu", input_shape=(X_train.shape[1],)),
		      layers.Dropout(0.3),
		      layers.Dense(64, activation="relu"),
		      layers.Dropout(0.3),
		      layers.Dense(1, activation="sigmoid")   # binary classification
		  ])
		  
		  model.compile(
		      optimizer="adam",
		      loss="binary_crossentropy",
		      metrics=["accuracy"]
		  )
		  
		  model.summary()
		  
		  # Train
		  history = model.fit(
		      X_train, y_train,
		      epochs=50,
		      batch_size=32,
		      validation_split=0.2,
		      callbacks=[keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True)]
		  )
		  
		  # Evaluate
		  loss, acc = model.evaluate(X_test, y_test)
		  print(f"Test Accuracy: {acc:.4f}")
		  
		  # Save & load
		  model.save("model.keras")
		  loaded = keras.models.load_model("model.keras")
		  ```
	- ## PyTorch
	  collapsed:: true
		- ```python
		  import torch
		  import torch.nn as nn
		  import torch.optim as optim
		  from torch.utils.data import DataLoader, TensorDataset
		  
		  # Define model
		  class Net(nn.Module):
		      def __init__(self, input_dim):
		          super().__init__()
		          self.fc1 = nn.Linear(input_dim, 128)
		          self.fc2 = nn.Linear(128, 64)
		          self.fc3 = nn.Linear(64, 1)
		          self.relu = nn.ReLU()
		          self.dropout = nn.Dropout(0.3)
		          self.sigmoid = nn.Sigmoid()
		  
		      def forward(self, x):
		          x = self.dropout(self.relu(self.fc1(x)))
		          x = self.dropout(self.relu(self.fc2(x)))
		          return self.sigmoid(self.fc3(x))
		  
		  # Setup
		  device = "cuda" if torch.cuda.is_available() else "cpu"
		  model = Net(X_train.shape[1]).to(device)
		  optimizer = optim.Adam(model.parameters(), lr=1e-3)
		  criterion = nn.BCELoss()
		  
		  # DataLoader
		  X_t = torch.FloatTensor(X_train).to(device)
		  y_t = torch.FloatTensor(y_train).unsqueeze(1).to(device)
		  loader = DataLoader(TensorDataset(X_t, y_t), batch_size=32, shuffle=True)
		  
		  # Training loop
		  model.train()
		  for epoch in range(50):
		      for X_batch, y_batch in loader:
		          optimizer.zero_grad()
		          preds = model(X_batch)
		          loss = criterion(preds, y_batch)
		          loss.backward()
		          optimizer.step()
		  
		  # Save
		  torch.save(model.state_dict(), "model.pth")
		  ```
	- ## CNN — Convolutional Neural Networks (Image Data)
	  collapsed:: true
		- ```python
		  from tensorflow.keras import layers, models
		  
		  # CNN for image classification (e.g., 32x32 RGB images, 10 classes)
		  cnn = models.Sequential([
		      layers.Conv2D(32, (3,3), activation="relu", input_shape=(32,32,3)),
		      layers.MaxPooling2D((2,2)),
		      layers.Conv2D(64, (3,3), activation="relu"),
		      layers.MaxPooling2D((2,2)),
		      layers.Conv2D(64, (3,3), activation="relu"),
		      layers.Flatten(),
		      layers.Dense(64, activation="relu"),
		      layers.Dense(10, activation="softmax")
		  ])
		  
		  cnn.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])
		  ```
	- ## Transfer Learning
	  collapsed:: true
		- ```python
		  from tensorflow.keras.applications import MobileNetV2
		  from tensorflow.keras import layers, models
		  
		  # Load pretrained base (ImageNet weights)
		  base = MobileNetV2(input_shape=(224,224,3), include_top=False, weights="imagenet")
		  base.trainable = False  # freeze base layers
		  
		  # Add custom head
		  model = models.Sequential([
		      base,
		      layers.GlobalAveragePooling2D(),
		      layers.Dense(128, activation="relu"),
		      layers.Dense(num_classes, activation="softmax")
		  ])
		  
		  model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])
		  # Fine-tune: unfreeze top layers of base after initial training
		  ```
- # Natural Language Processing (NLP)
  collapsed:: true
	- ## Text Preprocessing
	  collapsed:: true
		- ```python
		  import re
		  import nltk
		  from nltk.tokenize import word_tokenize
		  from nltk.corpus import stopwords
		  from nltk.stem import PorterStemmer, WordNetLemmatizer
		  
		  nltk.download("punkt")
		  nltk.download("stopwords")
		  nltk.download("wordnet")
		  
		  text = "Data Science is Amazing! It's changing the world in 2024."
		  
		  # Lowercase
		  text = text.lower()
		  
		  # Remove punctuation & numbers
		  text = re.sub(r"[^a-z\s]", "", text)
		  
		  # Tokenize
		  tokens = word_tokenize(text)
		  # ['data', 'science', 'is', 'amazing', 'its', 'changing', 'the', 'world', 'in']
		  
		  # Remove stopwords
		  stop_words = set(stopwords.words("english"))
		  tokens = [t for t in tokens if t not in stop_words]
		  # ['data', 'science', 'amazing', 'changing', 'world']
		  
		  # Stemming (crude — cuts suffix)
		  stemmer = PorterStemmer()
		  stemmed = [stemmer.stem(t) for t in tokens]
		  
		  # Lemmatization (better — uses vocabulary)
		  lemmatizer = WordNetLemmatizer()
		  lemmatized = [lemmatizer.lemmatize(t) for t in tokens]
		  ```
	- ## TF-IDF Vectorization
	  collapsed:: true
		- ```python
		  from sklearn.feature_extraction.text import TfidfVectorizer
		  
		  corpus = [
		      "data science is great",
		      "machine learning is part of data science",
		      "deep learning is a subset of machine learning"
		  ]
		  
		  tfidf = TfidfVectorizer(max_features=20, stop_words="english")
		  X = tfidf.fit_transform(corpus)
		  
		  print(tfidf.get_feature_names_out())
		  print(X.toarray())
		  ```
	- ## Transformers & Hugging Face
	  collapsed:: true
		- ```python
		  from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
		  
		  # Sentiment analysis (zero-shot, no training needed)
		  classifier = pipeline("sentiment-analysis")
		  result = classifier("Data Science is an amazing field!")
		  print(result)  # [{'label': 'POSITIVE', 'score': 0.9998}]
		  
		  # Text generation
		  generator = pipeline("text-generation", model="gpt2")
		  output = generator("Data science helps us", max_length=50)
		  
		  # Named Entity Recognition
		  ner = pipeline("ner", grouped_entities=True)
		  entities = ner("Guido van Rossum created Python at CWI in Amsterdam.")
		  
		  # Fine-tune a BERT model
		  tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
		  model = AutoModelForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=2)
		  ```
- # Big Data Tools
  collapsed:: true
	- ## Apache Spark (PySpark)
	  collapsed:: true
		- ```python
		  from pyspark.sql import SparkSession
		  from pyspark.sql.functions import col, avg, count
		  
		  spark = SparkSession.builder.appName("DataScience").getOrCreate()
		  
		  # Read data
		  df = spark.read.csv("data.csv", header=True, inferSchema=True)
		  
		  # DataFrame operations (similar to pandas but distributed)
		  df.printSchema()
		  df.show(5)
		  df.describe().show()
		  
		  # Filter & aggregate
		  result = (df.filter(col("age") > 25)
		              .groupBy("city")
		              .agg(avg("salary").alias("avg_salary"),
		                   count("*").alias("count"))
		              .orderBy("avg_salary", ascending=False))
		  result.show()
		  
		  # ML with Spark MLlib
		  from pyspark.ml.classification import RandomForestClassifier
		  from pyspark.ml.feature import VectorAssembler
		  
		  assembler = VectorAssembler(inputCols=["age", "salary"], outputCol="features")
		  df_ml = assembler.transform(df)
		  rf = RandomForestClassifier(featuresCol="features", labelCol="label")
		  model = rf.fit(df_ml)
		  ```
- # MLOps — Production Machine Learning
  collapsed:: true
	- MLOps applies DevOps principles to machine learning: automating, monitoring, and maintaining ML models in production.
	- ## ML Pipeline
	  collapsed:: true
		- ```
		  Data Ingestion → Preprocessing → Training → Evaluation → Deployment → Monitoring
		              ↑_______________________________________________|
		                              (retraining loop)
		  ```
	- ## Scikit-learn Pipelines
	  collapsed:: true
		- ```python
		  from sklearn.pipeline import Pipeline
		  from sklearn.preprocessing import StandardScaler
		  from sklearn.ensemble import RandomForestClassifier
		  from sklearn.model_selection import cross_val_score
		  
		  # Bundle preprocessing + model into one object
		  pipe = Pipeline([
		      ("scaler", StandardScaler()),
		      ("model", RandomForestClassifier(n_estimators=100))
		  ])
		  
		  # Fit and predict — preprocessing is applied automatically
		  pipe.fit(X_train, y_train)
		  y_pred = pipe.predict(X_test)
		  
		  # Cross-validate the whole pipeline (no data leakage)
		  scores = cross_val_score(pipe, X, y, cv=5)
		  print(f"CV: {scores.mean():.3f} ± {scores.std():.3f}")
		  
		  # Save pipeline
		  import joblib
		  joblib.dump(pipe, "pipeline.pkl")
		  loaded_pipe = joblib.load("pipeline.pkl")
		  ```
	- ## Model Tracking with MLflow
	  collapsed:: true
		- ```python
		  import mlflow
		  import mlflow.sklearn
		  from sklearn.ensemble import RandomForestClassifier
		  from sklearn.metrics import accuracy_score
		  
		  mlflow.set_experiment("my-experiment")
		  
		  with mlflow.start_run():
		      # Log parameters
		      mlflow.log_param("n_estimators", 100)
		      mlflow.log_param("max_depth", 5)
		  
		      # Train
		      rf = RandomForestClassifier(n_estimators=100, max_depth=5)
		      rf.fit(X_train, y_train)
		  
		      # Log metrics
		      acc = accuracy_score(y_test, rf.predict(X_test))
		      mlflow.log_metric("accuracy", acc)
		  
		      # Log model
		      mlflow.sklearn.log_model(rf, "model")
		  
		  # View UI: mlflow ui  (then open http://localhost:5000)
		  ```
	- ## Model Serving with FastAPI
	  collapsed:: true
		- ```python
		  from fastapi import FastAPI
		  from pydantic import BaseModel
		  import joblib
		  import numpy as np
		  
		  app = FastAPI()
		  model = joblib.load("pipeline.pkl")
		  
		  class InputData(BaseModel):
		      features: list[float]
		  
		  @app.post("/predict")
		  def predict(data: InputData):
		      X = np.array(data.features).reshape(1, -1)
		      prediction = model.predict(X)[0]
		      probability = model.predict_proba(X)[0].tolist()
		      return {"prediction": int(prediction), "probability": probability}
		  
		  # Run: uvicorn main:app --reload
		  # Test: POST http://localhost:8000/predict
		  #        {"features": [1.2, 3.4, 5.6, 7.8]}
		  ```
- # Advanced Topics
  collapsed:: true
	- ## Time Series Analysis
	  collapsed:: true
		- ```python
		  import pandas as pd
		  import numpy as np
		  from statsmodels.tsa.arima.model import ARIMA
		  from statsmodels.tsa.seasonal import seasonal_decompose
		  
		  # Create time series
		  dates = pd.date_range("2020-01-01", periods=100, freq="D")
		  ts = pd.Series(np.random.randn(100).cumsum(), index=dates)
		  
		  # Decompose into trend + seasonal + residual
		  decomp = seasonal_decompose(ts, model="additive", period=7)
		  decomp.plot()
		  
		  # ARIMA model
		  model = ARIMA(ts, order=(1, 1, 1))  # (p, d, q)
		  result = model.fit()
		  forecast = result.forecast(steps=10)
		  print(forecast)
		  
		  # Rolling statistics
		  ts.rolling(window=7).mean().plot(label="7-day MA")
		  ts.rolling(window=30).std().plot(label="30-day Std")
		  ```
	- ## Anomaly Detection
	  collapsed:: true
		- ```python
		  from sklearn.ensemble import IsolationForest
		  from sklearn.neighbors import LocalOutlierFactor
		  
		  # Isolation Forest — tree-based anomaly detection
		  iso = IsolationForest(contamination=0.05, random_state=42)
		  labels = iso.fit_predict(X)
		  # -1 = anomaly, 1 = normal
		  anomalies = X[labels == -1]
		  
		  # Local Outlier Factor
		  lof = LocalOutlierFactor(n_neighbors=20, contamination=0.05)
		  labels_lof = lof.fit_predict(X)
		  ```
	- ## Recommendation Systems
	  collapsed:: true
		- ```python
		  # Collaborative Filtering with Surprise library
		  from surprise import SVD, Dataset, Reader, accuracy
		  from surprise.model_selection import train_test_split
		  
		  # Load data (userId, itemId, rating)
		  reader = Reader(rating_scale=(1, 5))
		  data = Dataset.load_from_df(df[["userId", "itemId", "rating"]], reader)
		  
		  trainset, testset = train_test_split(data, test_size=0.2)
		  
		  # SVD (Matrix Factorization)
		  svd = SVD(n_factors=50, n_epochs=20)
		  svd.fit(trainset)
		  
		  predictions = svd.test(testset)
		  print(f"RMSE: {accuracy.rmse(predictions):.4f}")
		  
		  # Predict for a specific user-item pair
		  pred = svd.predict(uid="user_1", iid="item_42")
		  print(f"Predicted rating: {pred.est:.2f}")
		  ```
	- ## AutoML
	  collapsed:: true
		- ```python
		  # Auto-sklearn — automated ML pipeline selection
		  # pip install auto-sklearn
		  import autosklearn.classification
		  
		  automl = autosklearn.classification.AutoSklearnClassifier(
		      time_left_for_this_task=120,   # 2 minutes
		      per_run_time_limit=30
		  )
		  automl.fit(X_train, y_train)
		  print(automl.leaderboard())
		  
		  # TPOT — genetic algorithm-based AutoML
		  # pip install tpot
		  from tpot import TPOTClassifier
		  tpot = TPOTClassifier(generations=5, population_size=20, verbosity=2)
		  tpot.fit(X_train, y_train)
		  tpot.export("best_pipeline.py")
		  ```
- # Tools & Libraries Reference
  collapsed:: true
	- ## Core Stack
	  collapsed:: true
		- ```
		  NumPy        — numerical arrays & math
		  Pandas       — data manipulation & analysis
		  Matplotlib   — static plotting
		  Seaborn      — statistical visualization
		  Plotly       — interactive visualization
		  Scikit-learn — classical ML algorithms
		  ```
	- ## Deep Learning
	  collapsed:: true
		- ```
		  TensorFlow / Keras  — Google's DL framework
		  PyTorch             — Meta's DL framework (research-friendly)
		  Hugging Face        — NLP transformers & pretrained models
		  ```
	- ## Big Data & Engineering
	  collapsed:: true
		- ```
		  Apache Spark (PySpark)  — distributed data processing
		  Hadoop                  — distributed storage (HDFS)
		  Kafka                   — real-time data streaming
		  Airflow                 — workflow orchestration
		  dbt                     — data transformation in SQL
		  ```
	- ## MLOps
	  collapsed:: true
		- ```
		  MLflow      — experiment tracking & model registry
		  DVC         — data version control
		  FastAPI     — model serving API
		  Docker      — containerize ML apps (see [[Docker]])
		  Kubernetes  — scale ML services (see [[Kubernetes]])
		  ```
	- ## Notebooks & IDEs
	  collapsed:: true
		- ```
		  Jupyter Notebook / JupyterLab  — interactive notebooks
		  Google Colab                   — free GPU notebooks
		  VS Code + Python extension     — full IDE experience
		  Kaggle Notebooks               — competition environment
		  ```
- # Learning Roadmap
  collapsed:: true
	- ## Beginner Path
	  collapsed:: true
		- ```
		  1. Python basics          → [[Python]]
		  2. NumPy & Pandas         → arrays, DataFrames
		  3. Matplotlib & Seaborn   → basic visualization
		  4. Statistics basics      → mean, std, distributions
		  5. First ML model         → scikit-learn LinearRegression
		  6. Kaggle Titanic         → first competition
		  ```
	- ## Intermediate Path
	  collapsed:: true
		- ```
		  1. Full EDA workflow
		  2. Feature engineering
		  3. Classification & regression algorithms
		  4. Model evaluation & cross-validation
		  5. Hyperparameter tuning
		  6. SQL for data (see [[MySQL]] / [[PostgreSQL]])
		  7. Kaggle competitions (top 25%)
		  ```
	- ## Advanced Path
	  collapsed:: true
		- ```
		  1. Deep learning (TensorFlow / PyTorch)
		  2. NLP & Transformers (Hugging Face)
		  3. Computer Vision (CNNs, YOLO)
		  4. Time series & anomaly detection
		  5. Big Data (PySpark)
		  6. MLOps (MLflow, FastAPI, Docker)
		  7. Research papers & custom architectures
		  ```
- # More Learn
	- ## Github & Webs
		- [Scikit-learn Official Docs](https://scikit-learn.org/stable/user_guide.html)
		- [Kaggle — Free Courses & Competitions](https://www.kaggle.com/learn)
		- [Hugging Face — NLP Models & Datasets](https://huggingface.co/)
		- [Papers With Code — ML Research + Implementations](https://paperswithcode.com/)
		- [Google ML Crash Course](https://developers.google.com/machine-learning/crash-course)
		- [Fast.ai — Practical Deep Learning](https://www.fast.ai/)
		- [Towards Data Science](https://towardsdatascience.com/)
		- [Data Science Roadmap](https://roadmap.sh/data-science)
	- ## Master Playlists YouTube 📺 Free
		- [AI Models Learn Res 🎆](https://youtube.com/playlist?list=PLPMIlPa0MRx7X6LjaxlkQflYOwRaYfjQe&si=zvw0xsx_VdPC_cfW)
		- [StatQuest with Josh Starmer — ML & Stats](https://www.youtube.com/@statquest)
		- [Andrej Karpathy — Neural Networks from Scratch](https://www.youtube.com/@AndrejKarpathy)
		- [3Blue1Brown — Neural Networks Visual](https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi)
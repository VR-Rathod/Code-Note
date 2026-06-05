---
seoTitle: spaCy Python Library - Industrial NLP Reference and Tutorial
description: "spaCy provides industrial-strength NLP in Python. Covers tokenization, NER, dependency parsing, word vectors, custom pipelines, and transformer models."
keywords: "spaCy, Python NLP, natural language processing, tokenization, NER, dependency parsing, word vectors, custom pipeline, transformers, Python library, text analysis"
---

- # 📘 **Overview**
	- **What is it?**: spaCy is an open-source software library for advanced Natural Language Processing (NLP), designed specifically for production use. It helps build applications that process and "understand" large volumes of text.
	- **Key Features**:
		- **Tokenization**: Non-destructive, fast, and multilingual text tokenization.
		- **Entity Recognition (NER)**: Identifying names, dates, places, organizations, etc.
		- **Dependency Parsing**: Analyzing syntactic dependency relations between words.
		- **Pretrained Pipelines**: Out-of-the-box support for word vectors and semantic similarity using convolutional neural networks (CNNs) and transformer models.
	- **Installation**:
		- ```bash
		  pip install spacy
		  # Download a standard English pipeline
		  python -m spacy download en_core_web_sm
		  ```
- # 🧾 **Core Concepts**
	- **nlp**: The pipeline instance. It loads a trained pipeline model and acts as a callable function to process text.
	- **Doc**: The container for representing a processed text document. It is a sequence of Token objects.
	- **Token**: A single unit (usually a word or punctuation mark) inside a Doc.
	- **Span**: A slice of a Doc (e.g. `doc[2:5]`), often representing a phrase or entity.
- # 💻 **Common Code Patterns & Cheat Sheet**
	- **Processing Text & Accessing Tokens**:
		- ```python
		  import spacy
		  
		  # Load the small English model
		  nlp = spacy.load("en_core_web_sm")
		  
		  # Process text
		  doc = nlp("Apple is looking at buying U.K. startup for $1 billion.")
		  
		  # Print token attributes
		  for token in doc:
		      print(f"Text: {token.text:<10} | POS: {token.pos_:<6} | Dep: {token.dep_:<8}")
		  ```
	- **Named Entity Recognition (NER)**:
		- ```python
		  # Extract named entities
		  for ent in doc.ents:
		      print(f"Entity: {ent.text:<12} | Label: {ent.label_:<8} | Explain: {spacy.explain(ent.label_)}")
		      # Outputs:
		      # Apple        | ORG      | Companies, agencies, institutions, etc.
		      # U.K.         | GPE      | Countries, cities, states
		      # $1 billion   | MONEY    | Monetary values, including unit
		  ```
	- **Semantic Similarity & Word Vectors**:
		- ```python
		  # Needs medium (_md) or large (_lg) model for vectors
		  # python -m spacy download en_core_web_md
		  nlp_md = spacy.load("en_core_web_md")
		  
		  doc1 = nlp_md("I like pizza.")
		  doc2 = nlp_md("Fast food is delicious.")
		  
		  # Calculate cosine similarity based on word vectors
		  print(doc1.similarity(doc2))  # returns similarity score between 0 and 1
		  ```
- # 💡 **Best Practices & Tips**
	- **Batch Processing**: Use `nlp.pipe()` for batch processing multiple texts (`for doc in nlp.pipe(texts): ...`) instead of iterating and calling `nlp(text)` in a loop, as it is optimized and runs much faster.
	- **Disabling Components**: If you only need tokenization or POS tagging, disable unnecessary pipeline components to save memory and processing time: `nlp = spacy.load("en_core_web_sm", disable=["parser", "ner"])`.
	- **explain() Helper**: Use `spacy.explain(label)` to get a human-readable explanation of tag labels (e.g., POS tags, dependency labels, or entity types).
- # 🔗 **Navigation & Internal Links**
	- **Parent**: [[Python]]
	- **Related Notes**: [[Machine Learning]] | [[NLTK]] | [[Transformers (by Hugging Face)]]
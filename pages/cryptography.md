---
seoTitle: Cryptography Reference - Encryption, Hashing, and Security Guide
description: "Cryptography reference covering symmetric and asymmetric encryption, AES, RSA, hashing (SHA, MD5), digital signatures, TLS, and public key infrastructure."
keywords: "cryptography, encryption, AES, RSA, hashing, SHA, digital signatures, TLS, PKI, symmetric encryption, asymmetric encryption, public key"
---

- # 📘 **Overview**
	- **What is it?**: The `cryptography` library is a package designed to provide cryptographic recipes and primitives to Python developers. It contains both high-level "recipes" (safe defaults that require no complex choices) and low-level hazardous materials ("hazmat").
	- **Key Features**:
		- **Symmetric Encryption**: Easy-to-use AES encryption via Fernet.
		- **Asymmetric Encryption**: RSA and Elliptic Curve signatures and key exchange.
		- **Key Derivation (KDFs)**: Industry-standard PBKDF2, Scrypt, and bcrypt hashing for passwords.
		- **X.509 Certificates**: Parsers and builders for cryptographic certificates.
	- **Installation**:
		- ```bash
		  pip install cryptography
		  ```
- # 🧾 **Core Concepts**
	- **Fernet**: A recipe for symmetric (secret-key) encryption. It guarantees that data encrypted cannot be read or modified without the key (using AES-128 in CBC mode with HMAC-SHA256).
	- **Hazmat (Hazardous Materials)**: Low-level APIs that require deep knowledge of cryptographic details. Prone to security flaws if misconfigured.
	- **Password Hashing (KDF)**: Transforming cleartext passwords into secure hashes using key stretch functions (e.g. Scrypt, PBKDF2), making them resistant to brute-force attacks.
- # 💻 **Common Code Patterns & Cheat Sheet**
	- **Symmetric Encryption (Fernet)**:
		- ```python
		  from cryptography.fernet import Fernet
		  
		  # Generate and save a key
		  key = Fernet.generate_key()
		  cipher_suite = Fernet(key)
		  
		  # Encrypt message
		  message = b"Top secret data!"
		  cipher_text = cipher_suite.encrypt(message)
		  
		  # Decrypt message
		  plain_text = cipher_suite.decrypt(cipher_text)
		  print(plain_text)  # b"Top secret data!"
		  ```
	- **Asymmetric Encryption (RSA)**:
		- ```python
		  from cryptography.hazmat.primitives.asymmetric import rsa, padding
		  from cryptography.hazmat.primitives import hashes
		  
		  # Generate private key
		  private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
		  public_key = private_key.public_key()
		  
		  # Encrypt with public key
		  message = b"Secret asymmetric message"
		  encrypted = public_key.encrypt(
		      message,
		      padding.OAEP(
		          mgf=padding.MGF1(algorithm=hashes.SHA256()),
		          algorithm=hashes.SHA256(),
		          label=None
		      )
		  )
		  
		  # Decrypt with private key
		  decrypted = private_key.decrypt(
		      encrypted,
		      padding.OAEP(
		          mgf=padding.MGF1(algorithm=hashes.SHA256()),
		          algorithm=hashes.SHA256(),
		          label=None
		      )
		  )
		  ```
	- **Password Hashing (PBKDF2)**:
		- ```python
		  import os
		  from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
		  from cryptography.hazmat.primitives import hashes
		  
		  salt = os.urandom(16)
		  kdf = PBKDF2HMAC(
		      algorithm=hashes.SHA256(),
		      length=32,
		      salt=salt,
		      iterations=100000
		  )
		  key = kdf.derive(b"my_secure_password")
		  ```
- # 💡 **Best Practices & Tips**
	- **Use Fernet**: Always prefer `cryptography.fernet` for symmetric data storage unless you have strict integration requirements requiring raw AES.
	- **Key Management**: Never hardcode keys in files or check them into git. Load them from environment variables or secure key vaults.
	- **Secure Randomness**: Always use `os.urandom()` or Python's `secrets` module when generating keys, salts, or nonces; do NOT use the standard `random` module.
- # 🔗 **Navigation & Internal Links**
	- **Parent**: [[Python]]
	- **Related Notes**: [[Cybersecurity]] | [[Cybersecurity Architecture]] | [[Ethical Hacking Advanced]]
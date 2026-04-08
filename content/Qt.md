---
seoTitle: Qt Framework – C++ GUI and Cross-Platform Development Reference
description: "Qt framework reference for C++ development. Covers widgets, signals/slots, Qt Quick/QML, networking, database, threading, and cross-platform deployment."
keywords: "Qt, Qt framework, C++ GUI, Qt Widgets, Qt Quick, QML, signals slots, Qt Creator, cross-platform, Qt networking, Qt database, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Qt Framework
---

- # History
  collapsed:: true
	- **Who**: Created by Haavard Nord and Eirik Chambe-Eng at Trolltech (Norway) in 1991. Now maintained by The Qt Company.
	- **Why**: To provide a cross-platform C++ framework for building GUI applications that look and behave natively on every platform.
	- **When**: Qt 1.0 released in 1995. Qt 5 in 2012. Qt 6 (current major version) in 2020.

- # Introduction
  collapsed:: true
	- ## What is Qt?
		- A comprehensive C++ framework for building cross-platform applications with GUI, networking, databases, multimedia, and more.
		- Used in automotive (infotainment), industrial HMI, desktop apps, and embedded systems.
		- Website: [qt.io](https://www.qt.io/)
	-
	- ## Advantages
	  collapsed:: true
		- True cross-platform: Windows, Linux, macOS, iOS, Android, embedded.
		- Signals & slots — elegant event-driven programming without callbacks.
		- Qt Quick/QML for modern, fluid UIs.
		- Huge ecosystem: networking, SQL, XML, multimedia, 3D (Qt3D).
		- Qt Creator IDE included.
		- Strong commercial and open-source (LGPL) licensing options.
	-
	- ## Disadvantages
	  collapsed:: true
		- Large framework — steep learning curve for the full ecosystem.
		- MOC (Meta-Object Compiler) adds a build step.
		- Commercial license required for some use cases.
		- Qt 6 has breaking changes from Qt 5.

- # Installation & Setup
  collapsed:: true
	- ## Qt Online Installer
		- Download from [qt.io/download](https://www.qt.io/download-open-source)
		- Select Qt version + Qt Creator IDE.
	-
	- ## Linux (apt — Qt5)
		- ```bash
		  sudo apt install qt5-default qtcreator
		  ```
	-
	- ## CMake
		- ```cmake
		  find_package(Qt6 REQUIRED COMPONENTS Core Widgets Network Sql)
		  target_link_libraries(MyApp Qt6::Core Qt6::Widgets Qt6::Network)
		  
		  # Required for MOC, UIC, RCC
		  set(CMAKE_AUTOMOC ON)
		  set(CMAKE_AUTOUIC ON)
		  set(CMAKE_AUTORCC ON)
		  ```

- # Core Concepts
  collapsed:: true
	- ## QObject & Signals/Slots
	  collapsed:: true
		- ```cpp
		  #include <QObject>
		  #include <QDebug>
		  
		  class Counter : public QObject {
		      Q_OBJECT  // required macro for MOC
		  
		  public:
		      Counter(QObject* parent = nullptr) : QObject(parent), m_value(0) {}
		  
		      int value() const { return m_value; }
		  
		  public slots:
		      void setValue(int val) {
		          if (val != m_value) {
		              m_value = val;
		              emit valueChanged(val);  // emit signal
		          }
		      }
		  
		  signals:
		      void valueChanged(int newValue);
		  
		  private:
		      int m_value;
		  };
		  
		  // Connect signal to slot
		  Counter a, b;
		  QObject::connect(&a, &Counter::valueChanged,
		                   &b, &Counter::setValue);
		  
		  a.setValue(42);  // b.value() is now 42
		  qDebug() << b.value(); // 42
		  ```
	-
	- ## Hello World (Qt Widgets)
	  collapsed:: true
		- ```cpp
		  #include <QApplication>
		  #include <QLabel>
		  
		  int main(int argc, char* argv[]) {
		      QApplication app(argc, argv);
		  
		      QLabel label("Hello, Qt!");
		      label.setWindowTitle("My App");
		      label.resize(300, 100);
		      label.show();
		  
		      return app.exec(); // event loop
		  }
		  ```

- # Qt Widgets
  collapsed:: true
	- ## Common Widgets
	  collapsed:: true
		- ```cpp
		  #include <QWidget>
		  #include <QPushButton>
		  #include <QLineEdit>
		  #include <QLabel>
		  #include <QVBoxLayout>
		  
		  class MyWindow : public QWidget {
		      Q_OBJECT
		  public:
		      MyWindow(QWidget* parent = nullptr) : QWidget(parent) {
		          auto* layout = new QVBoxLayout(this);
		  
		          auto* label = new QLabel("Enter name:");
		          auto* input = new QLineEdit();
		          auto* btn   = new QPushButton("Greet");
		          auto* result = new QLabel();
		  
		          layout->addWidget(label);
		          layout->addWidget(input);
		          layout->addWidget(btn);
		          layout->addWidget(result);
		  
		          connect(btn, &QPushButton::clicked, [=]() {
		              result->setText("Hello, " + input->text() + "!");
		          });
		      }
		  };
		  ```
	-
	- ## Layouts
	  collapsed:: true
		- ```cpp
		  QVBoxLayout* vbox = new QVBoxLayout();  // vertical stack
		  QHBoxLayout* hbox = new QHBoxLayout();  // horizontal stack
		  QGridLayout* grid = new QGridLayout();  // grid
		  QFormLayout* form = new QFormLayout();  // label-field pairs
		  
		  // Grid example
		  grid->addWidget(widget1, 0, 0);  // row 0, col 0
		  grid->addWidget(widget2, 0, 1);  // row 0, col 1
		  grid->addWidget(widget3, 1, 0, 1, 2); // row 1, col 0, span 1 row 2 cols
		  ```

- # Qt Quick / QML
  collapsed:: true
	- ## Basic QML Window
	  collapsed:: true
		- ```qml
		  // main.qml
		  import QtQuick 2.15
		  import QtQuick.Controls 2.15
		  
		  ApplicationWindow {
		      visible: true
		      width: 400
		      height: 300
		      title: "Qt Quick App"
		  
		      Column {
		          anchors.centerIn: parent
		          spacing: 10
		  
		          Text {
		              text: "Hello, QML!"
		              font.pixelSize: 24
		          }
		  
		          Button {
		              text: "Click Me"
		              onClicked: console.log("Clicked!")
		          }
		      }
		  }
		  ```
	-
	- ## C++ ↔ QML Integration
	  collapsed:: true
		- ```cpp
		  // Expose C++ class to QML
		  class Backend : public QObject {
		      Q_OBJECT
		      Q_PROPERTY(QString message READ message WRITE setMessage NOTIFY messageChanged)
		  public:
		      QString message() const { return m_msg; }
		      void setMessage(const QString& msg) {
		          m_msg = msg;
		          emit messageChanged();
		      }
		  signals:
		      void messageChanged();
		  private:
		      QString m_msg = "Hello from C++";
		  };
		  
		  // Register in main.cpp
		  qmlRegisterType<Backend>("com.myapp", 1, 0, "Backend");
		  
		  // Use in QML
		  // Backend { id: backend }
		  // Text { text: backend.message }
		  ```

- # Networking
  collapsed:: true
	- ```cpp
	  #include <QNetworkAccessManager>
	  #include <QNetworkRequest>
	  #include <QNetworkReply>
	  
	  QNetworkAccessManager* manager = new QNetworkAccessManager(this);
	  
	  connect(manager, &QNetworkAccessManager::finished,
	          [](QNetworkReply* reply) {
	              if (reply->error() == QNetworkReply::NoError) {
	                  QByteArray data = reply->readAll();
	                  qDebug() << data;
	              }
	              reply->deleteLater();
	          });
	  
	  manager->get(QNetworkRequest(QUrl("https://api.example.com/data")));
	  ```

- # Database (Qt SQL)
  collapsed:: true
	- ```cpp
	  #include <QSqlDatabase>
	  #include <QSqlQuery>
	  #include <QSqlError>
	  
	  QSqlDatabase db = QSqlDatabase::addDatabase("QSQLITE");
	  db.setDatabaseName("myapp.db");
	  
	  if (!db.open()) {
	      qDebug() << "DB error:" << db.lastError().text();
	      return;
	  }
	  
	  QSqlQuery query;
	  query.exec("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)");
	  
	  query.prepare("INSERT INTO users (name) VALUES (:name)");
	  query.bindValue(":name", "Alice");
	  query.exec();
	  
	  query.exec("SELECT id, name FROM users");
	  while (query.next()) {
	      int id = query.value(0).toInt();
	      QString name = query.value(1).toString();
	      qDebug() << id << name;
	  }
	  ```

- # Threading
  collapsed:: true
	- ```cpp
	  #include <QThread>
	  #include <QRunnable>
	  #include <QThreadPool>
	  
	  // Worker using QRunnable + thread pool
	  class Worker : public QRunnable {
	  public:
	      void run() override {
	          // heavy work here (runs in thread pool)
	          qDebug() << "Running in thread:" << QThread::currentThreadId();
	      }
	  };
	  
	  QThreadPool::globalInstance()->start(new Worker());
	  
	  // QtConcurrent for simple parallel tasks
	  #include <QtConcurrent>
	  QFuture<void> future = QtConcurrent::run([]() {
	      // runs in thread pool
	  });
	  future.waitForFinished();
	  ```

- # More Learn
	- [Qt Official Docs](https://doc.qt.io/)
	- [Qt Tutorials](https://doc.qt.io/qt-6/tutorials-index.html)
	- [Qt Examples](https://doc.qt.io/qt-6/qtexamplesandtutorials.html)
	- [Qt Forum](https://forum.qt.io/)
	- [Awesome Qt](https://github.com/fffaraz/awesome-cpp#gui)

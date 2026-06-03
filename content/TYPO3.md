---
seoTitle: TYPO3 CMS Reference – TypoScript, Extbase MVC, and Fluid Templating
description: "Comprehensive TYPO3 developer reference guide covering TypoScript configuration, Extbase extension development, Fluid templates, caching, and developer cookbooks."
keywords: "TYPO3, TYPO3 12, TYPO3 13, TypoScript, Extbase, Fluid templates, ViewHelpers, custom extension, backend configuration, Multi-site, PHP CMS, VR-Rathod, Code-Note, code note vr, vr book"
comments: true
displayTitle: TYPO3 Developer Guide
---

> [!info] What is TYPO3?
> **TYPO3** is an enterprise-grade, open-source Content Management System (CMS) built on PHP. It features a highly structured, scalable architecture designed for multi-site and multi-language environments. Powered by a custom configuration language called **TypoScript**, the **Fluid templating engine**, and the **Extbase framework** (an object-oriented MVC framework modeling DDD principles), TYPO3 is designed to handle massive corporate portals and complex enterprise configurations securely.

- # History
	- **How**: TYPO3 was originally created in **1997** by Danish developer **Kaspar Skårhøj**. He released it as open-source software under the GPL license in 2001. Kaspar wanted to create a system that separated design, logic, and content, which led to the creation of **TypoScript** as a declarative configuration engine. In 2004, the **TYPO3 Association** was formed to coordinate future core development. The platform underwent an architectural rewrite with the introduction of the **Extbase** MVC framework and **Fluid** template engine (which were derived from the development of FLOW3).
	- **Who**: Created by **Kaspar Skårhøj** and maintained by the non-profit **TYPO3 Association** alongside a global developer community.
	- **Why**: TYPO3 was built to solve the limitations of early web publishing engines that lacked granular user access controls, multi-site handling from a single installation, and structural separations of layouts from content databases.
-
- # Introduction
  collapsed:: true
	- ## What problem does it solve?
		- Multi-brand corporate groups need to run dozens of distinct regional web portals with translation workflows, granular backend editor access groups, and shared layout assets. Maintaining separate CMS installations is expensive and introduces security issues. TYPO3 solves this by providing a PHP-based enterprise multi-site CMS where a single installation handles multiple domains, sharing extensions and configurations via a centralized administration database.
	-
	- ## Advantages
		- **True Multi-Site Core**: Run hundreds of independent websites with unique domain names, templates, and languages from a single installation out of the box.
		- **Granular Access Permissions**: Strict role-based backend editor rights mapping down to individual page branches, content columns, and language inputs.
		- **Decoupled Architecture**: Clean separation of layout (Fluid), system configuration (TypoScript), and business logic (Extbase).
		- **Built-in Localization**: Advanced core translation workflows with side-by-side editing interfaces.
		- **Long-Term Support (LTS)**: Commercial-grade release stability cycles backed by TYPO3 GmbH support agreements.
	-
	- ## Disadvantages
		- **Steep Learning Curve**: High conceptual overhead. Developers must master TypoScript configuration files, Extbase Domain-Driven Design (DDD) mappings, and Fluid markup rules.
		- **European-Centric Ecosystem**: The community, developers, and agency support networks are highly concentrated in Germany, Switzerland, and Austria, with fewer resources available in English.
		- **Development Overhead**: Building simple modifications or creating new page components requires writing database schemas, Domain Models, Repository classes, and TypoScript mapping templates.
		- **Resource-Heavy**: High server overhead. Requires dedicated environments with OPcache and database query optimization to load pages efficiently.
	-
	- ## When to use vs alternatives
		- **Use TYPO3 When**:
			- Managing massive corporate websites, government portals, or university networks requiring dozens of localized sub-sites, strict editor permissions, and single sign-on integrations.
		- **Avoid TYPO3 When**:
			- Building simple blogs, small personal portfolios, or basic e-commerce storefronts (WordPress or Shopify are much faster to set up and have larger ecosystems of pre-made templates).
-
- # Installation & Setup (Composer-based setup)
  collapsed:: true
	- Modern TYPO3 installations must be configured using Composer to manage core files and extensions.
	-
	- ## System Prerequisites
		- **PHP**: PHP 8.1 / 8.2 (extensions: gd, intl, mbstring, openssl, pdo, session, xml, zip).
		- **Database**: MySQL 8.0+, MariaDB 10.4+, or PostgreSQL 10+.
		- **Web Server**: Apache or Nginx (configured with rewrite rules pointing to the public directory).
		- **Image Library**: GraphicsMagick or ImageMagick (Required for server-side image scaling).
	-
	- ## Composer Installation CLI
		- Run these commands inside your terminal to download and configure the base system:
		- ```bash
		  # Create a new TYPO3 project using the base distribution
		  composer create-project typo3/cms-base-distribution:^12.4 my-typo3-project
		  
		  # Change directory to the project folder
		  cd my-typo3-project
		  
		  # Create a blank file to initiate the web installer wizard
		  touch public/FIRST_INSTALL
		  ```
		- Open `https://your-domain.local/` in your browser. The web installation wizard will guide you through setting up database credentials, configuring administrator access, and choosing the base database structure.
	-
	- ## Directory Layout
		- ```
		  ├── config/                  # Site configurations and domain routing mappings
		  │   └── sites/               # Dynamic site configs (config.yaml)
		  ├── public/                  # Document root exposed to the web server
		  │   ├── index.php            # Main front controller entry script
		  │   ├── typo3/               # TYPO3 backend entry script
		  │   ├── fileadmin/           # User-uploaded editor files and media assets
		  │   └── typo3conf/           # Legacy configurations directory
		  ├── var/                     # Cache files, logs, and temporary sessions
		  ├── vendor/                  # Third-party packages (Symfony, Doctrine, TYPO3 core)
		  └── composer.json            # Composer dependencies mapping
		  ```
-
- # TypoScript (Core Configuration & Logic)
  collapsed:: true
	- **TypoScript** is a declarative configuration language unique to TYPO3. It is used to define page rendering rules, map templates, configure caches, and control variables.
	-
	- ## TypoScript Syntax Basics
		- TypoScript is not a programming language; it is a structural array configuration builder.
		-
		- ### Configuration File Structure (`Configuration/TypoScript/setup.typoscript`)
			- ```typoscript
			  # 1. Define page rendering target object
			  page = PAGE
			  page {
			      # Set HTML document type and body classes
			      typeNum = 0
			      bodyTag = <body class="default-theme">
			      
			      # Link CSS stylesheets dynamically
			      includeCSS {
				  mainStyle = EXT:my_extension/Resources/Public/Css/style.css
			      }
			      
			      # 2. Map template using Fluid template engine
			      10 = FLUIDTEMPLATE
			      10 {
				  file = EXT:my_extension/Resources/Private/Templates/PageLayout.html
				  partialRootPaths {
				      10 = EXT:my_extension/Resources/Private/Partials/
				  }
				  layoutRootPaths {
				      10 = EXT:my_extension/Resources/Private/Layouts/
				  }
				  
				  # Pass backend content data dynamically to Fluid template variables
				  variables {
				      mainContent = CONTENT
				      mainContent {
					  table = tt_content
					  select {
					      orderBy = sorting
					      # 0 corresponds to the main content column in backend layout
					      where = colPos=0
					  }
				      }
				  }
			      }
			  }
			  ```
	-
	- ## TypoScript Conditions (Symfony Expression Language)
		- Execute dynamic conditions (e.g. check login states, language codes, query parameters):
		- ```typoscript
		  # Apply condition using Symfony Expression Language
		  [frontend.user.isLoggedIn]
		      # Change body class if frontend user is logged in
		      page.bodyTag = <body class="logged-in-user">
		  [global]
		  
		  [request.getQueryParams()["type"] == "api"]
		      # Strip layout HTML output if API param is passed
		      page.10.file = EXT:my_extension/Resources/Private/Templates/ApiRaw.html
		  [global]
		  ```
-
- # Extbase MVC Extension Development
  collapsed:: true
	- **Extbase** is an object-oriented MVC framework built into TYPO3 core. It applies Domain-Driven Design (DDD) principles: Domain Models, Repositories, Service Contracts, and Controllers.
	-
	- ## Custom Extension File Structure
		- Place files inside `public/typo3conf/ext/my_portal/` or manage as local packages:
		- ```
		  ├── Classes/
		  │   ├── Controller/          # Controller actions classes
		  │   │   └── RecordController.php
		  │   ├── Domain/
		  │   │   ├── Model/           # Entity Domain Models mapping database columns
		  │   │   │   └── Record.php
		  │   │   └── Repository/      # Repository classes to execute database queries
		  │   │       └── RecordRepository.php
		  │   └── Service/             # Business logic service classes
		  ├── Configuration/
		  │   ├── Services.yaml        # Dependency Injection services container configuration
		  │   ├── TCA/                 # Table Configuration Array (backend form fields mapping)
		  │   │   └── tx_myportal_domain_model_record.php
		  │   └── TypoScript/          # Default TypoScript config files
		  │       ├── constants.typoscript
		  │       └── setup.typoscript
		  ├── Resources/
		  │   ├── Private/             # Private HTML template layouts (Fluid)
		  │   │   ├── Layouts/
		  │   │   ├── Partials/
		  │   │   └── Templates/
		  │   │       └── Record/
		  │   │           └── List.html
		  │   └── Public/              # Public assets (CSS, JS, images)
		  ├── ext_localconf.php        # Extension boot definitions and plugin registrations
		  ├── ext_tables.sql           # Database schema definition table layout
		  └── composer.json            # Extension metadata
		  ```
	-
	- ## 1. Database Schema (`ext_tables.sql`)
		- Defines custom database columns and tables mapping to Extbase models:
		- ```sql
		  # Define table schema
		  CREATE TABLE tx_myportal_domain_model_record (
		      uid int(11) NOT NULL auto_increment,
		      pid int(11) DEFAULT '0' NOT NULL,
		      title varchar(255) DEFAULT '' NOT NULL,
		      description text,
		      PRIMARY KEY (uid),
		      KEY parent (pid)
		  );
		  ```
	-
	- ## 2. Domain Model Class (`Classes/Domain/Model/Record.php`)
		- Maps database columns to PHP getters and setters:
		- ```php
		  namespace Vendor\MyPortal\Domain\Model;
		  
		  use TYPO3\CMS\Extbase\DomainObject\AbstractEntity;
		  
		  class Record extends AbstractEntity {
		    protected string $title = '';
		    protected string $description = '';
		  
		    public function getTitle(): string {
		      return $this->title;
		    }
		  
		    public function setTitle(string $title): void {
		      $this->title = $title;
		    }
		  
		    public function getDescription(): string {
		      return $this->description;
		    }
		  
		    public function setDescription(string $description): void {
		      $this->description = $description;
		    }
		  }
		  ```
	-
	- ## 3. Repository Class (`Classes/Domain/Repository/RecordRepository.php`)
		- Handlers database search operations:
		- ```php
		  namespace Vendor\MyPortal\Domain\Repository;
		  
		  use TYPO3\CMS\Extbase\Persistence\Repository;
		  use TYPO3\CMS\Extbase\Persistence\QueryInterface;
		  
		  class RecordRepository extends Repository {
		    // Default query ordering configuration
		    protected $defaultOrderings = [
		      'title' => QueryInterface::ORDER_ASCENDING
		    ];
		  }
		  ```
	-
	- ## 4. Extbase Controller Action (`Classes/Controller/RecordController.php`)
		- Executing requests and injecting model results into the Fluid view:
		- ```php
		  namespace Vendor\MyPortal\Controller;
		  
		  use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;
		  use Vendor\MyPortal\Domain\Repository\RecordRepository;
		  use Psr\Http\Message\ResponseInterface;
		  
		  class RecordController extends ActionController {
		    protected RecordRepository $recordRepository;
		  
		    // Inject repository using standard Dependency Injection
		    public function __construct(RecordRepository $recordRepository) {
		      $this->recordRepository = $recordRepository;
		    }
		  
		    public function listAction(): ResponseInterface {
		      // Fetch all records mapped from domain repository
		      $records = $this->recordRepository->findAll();
		      
		      // Pass array payload dynamically to Fluid templates view
		      $this->view->assign('records', $records);
		      
		      return $this->htmlResponse();
		    }
		  }
		  ```
	-
	- ## 5. Dependency Injection Configuration (`Configuration/Services.yaml`)
		- Tells TYPO3's Symphony-based container to automatically compile dependencies:
		- ```yaml
		  services:
		    _defaults:
		      autowire: true
		      autoconfigure: true
		      public: false
		  
		    Vendor\MyPortal\:
		      resource: '../Classes/*'
		  
		    # Register Controller publicly to allow routing execution
		    Vendor\MyPortal\Controller\RecordController:
		      public: true
		  ```
	-
	- ## 6. Plugin Registration (`ext_localconf.php`)
		- Declares custom plugins and makes them selectable in the backend Content Editor:
		- ```php
		  <?php
		  defined('TYPO3') or die();
		  
		  use TYPO3\CMS\Extbase\Utility\ExtensionUtility;
		  use Vendor\MyPortal\Controller\RecordController;
		  
		  ExtensionUtility::configurePlugin(
		    'MyPortal',             // Extension namespace key
		    'RecordList',           // Plugin identifier
		    [RecordController::class => 'list'], // Allowed Controller Actions
		    [RecordController::class => '']       // Non-cacheable actions
		  );
		  ```
-
- # Fluid Templating Engine (XML-based views)
  collapsed:: true
	- **Fluid** is TYPO3's custom XML-like templating language. It enforces strict separation of layout structures, dynamic data partials, and content templates.
	-
	- ## Fluid ViewHelpers (Tags)
		- Fluid tags are prefixed with `f:` (e.g. `<f:if>`). They parse logic loops, formatting rules, and translations dynamically:
		-
		- ### Common ViewHelpers Examples
			- **Loop**: `<f:for each="{records}" as="record">...</f:for>`
			- **Conditional**: `<f:if condition="{record.title} == 'VIP'">...</f:if>`
			- **Formatting HTML**: `<f:format.html>{record.description}</f:format.html>`
			- **Translation (Localizations)**: `<f:translate key="label.submit" />`
			- **Inline Variables declaration**: `<f:variable name="promoCode" value="TYPO3PRO" />`
	-
	- ## Layout-Based View Template (`Resources/Private/Templates/Record/List.html`)
		- Fluid templates inherit wraps from Layout files using `<f:layout>` tags:
		- ```html
		  <!-- Tells Fluid to load Private/Layouts/DefaultLayout.html wrapper -->
		  <f:layout name="DefaultLayout" />
		  
		  <!-- Renders page structure inside Main content block -->
		  <f:section name="Main">
		      <div class="records-wrapper max-w-2xl mx-auto py-4">
			  <h1 class="text-3xl font-bold mb-4">Record List Directory</h1>
			  
			  <f:if condition="{records->f:count()} > 0">
			      <f:then>
				  <div class="grid gap-4">
				      <f:for each="{records}" as="record">
					  <div class="card p-4 border rounded bg-white shadow-sm">
					      <h3 class="font-bold text-xl">{record.title}</h3>
					      <div class="prose mt-2 text-gray-600">
						  <f:format.html>{record.description}</f:format.html>
					      </div>
					  </div>
				      </f:for>
				  </div>
			      </f:then>
			      <f:or>
				  <p class="text-gray-500">No database entries found.</p>
			      </f:or>
			  </f:if>
		      </div>
		  </f:section>
		  ```
	-
	- ## Custom ViewHelper Development
		- Developers can build custom XML tags by extending the base ViewHelper class:
		- ```php
		  // Classes/ViewHelpers/CurrentYearViewHelper.php
		  namespace Vendor\MyPortal\ViewHelpers;
		  
		  use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;
		  
		  class CurrentYearViewHelper extends AbstractViewHelper {
		    /**
		     * Outputs current year dynamically.
		     * Usage in Fluid: {namespace my=Vendor\MyPortal\ViewHelpers} <my:currentYear />
		     */
		    public function render(): string {
		      return date('Y');
		    }
		  }
		  ```
-
- # Backend & Site Configurations
  collapsed:: true
	- Domain routing, language locales, and error handlers are configured using YAML files.
	-
	- ## Site Configuration (`config/sites/my_site/config.yaml`)
		- Maps URLs, base paths, localized languages, and redirection routes:
		- ```yaml
		  rootPageId: 1
		  base: 'https://www.myportal.com'
		  siteIdentifier: my_site
		  languages:
		    -
		      title: English
		      enabled: true
		      languageId: '0'
		      base: '/'
		      locale: en_US.UTF-8
		      navigationTitle: EN
		    -
		      title: Deutsch
		      enabled: true
		      languageId: '1'
		      base: '/de/'
		      locale: de_DE.UTF-8
		      navigationTitle: DE
		      fallbackType: strict
		  errorHandling:
		    -
		      errorCode: '404'
		      errorHandler: Page
		      errorContentSource: 't3://page?uid=12' # Load error layout from page UID 12
		  ```
	-
	- ## Table Configuration Array (TCA)
		- Mapped in `Configuration/TCA/`. Dictates what input elements are displayed in the backend dashboard when editors create records:
		- ```php
		  // Configuration/TCA/tx_myportal_domain_model_record.php
		  return [
		    'ctrl' => [
		      'title' => 'Portal Records',
		      'label' => 'title',
		      'tstamp' => 'tstamp',
		      'crdate' => 'crdate',
		      'iconfile' => 'EXT:my_portal/Resources/Public/Icons/record.svg'
		    ],
		    'columns' => [
		      'title' => [
			'label' => 'Record Title',
			'config' => [
			  'type' => 'input',
			  'size' => 30,
			  'max' => 255,
			  'eval' => 'trim,required'
			]
		      ],
		      'description' => [
			'label' => 'Record Description',
			'config' => [
			  'type' => 'text',
			  'enableRichtext' => true,
			  'richtextConfiguration' => 'default'
			]
		      ]
		    ],
		    'types' => [
		      '0' => ['showitem' => 'title, description']
		    ]
		  ];
		  ```
-
- # Performance Optimization (Enterprise-grade)
  collapsed:: true
	- TYPO3 includes a highly configurable Caching Framework to handle heavy traffic.
	-
	- ## Caching Framework
		- Bins are compiled into separate backend storage caches (Database, Redis, Memcached, APCu).
	-
	- ## Redis Caching Configuration (`public/typo3conf/AdditionalConfiguration.php`)
		- Offload default database cache tables to Redis inside the additional settings file:
		- ```php
		  <?php
		  // Configure Redis backend connection for TYPO3 page cache
		  $GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations']['pages']['backend'] = \TYPO3\CMS\Core\Cache\Backend\RedisBackend::class;
		  $GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations']['pages']['options'] = [
		      'hostname' => '127.0.0.1',
		      'port' => 6379,
		      'database' => 1,
		      'password' => 'secure-redis-pass'
		  ];
		  ```
	-
	- ## Asset Processing (Compression & Bundling)
		- Enable compression of CSS and JavaScript files using global TypoScript configurations:
		- ```typoscript
		  config {
		      # Compresses CSS assets dynamically into single files
		      compressCss = 1
		      concatenateCss = 1
		      
		      # Compresses JS assets
		      compressJs = 1
		      concatenateJs = 1
		  }
		  ```
-
- # Security & Governance
  collapsed:: true
	- Guarding code configurations against access vulnerabilities.
	-
	- ## Cross-Site Scripting (XSS) Prevention
		- Fluid templates escape content outputs by default. If outputting HTML fields, use `<f:format.html>` to sanitizes script tags:
		- ```html
		  <!-- Sanitizes user HTML tags, stripping malicious JavaScript executes -->
		  <div class="user-content-field">
		      <f:format.html>{record.description}</f:format.html>
		  </div>
		  ```
	-
	- ## SQL Injection Avoidance (QueryBuilder API)
		- When querying databases inside repositories, never use raw variables inside SQL statements. Always use QueryBuilder parameters:
		- ```php
		  namespace Vendor\MyPortal\Domain\Repository;
		  
		  use TYPO3\CMS\Core\Database\ConnectionPool;
		  use TYPO3\CMS\Core\Utility\GeneralUtility;
		  
		  class CustomReader {
		    public function getRecordsByTitle($title) {
		      $connection = GeneralUtility::makeInstance(ConnectionPool::class)
			->getConnectionForTable('tx_myportal_domain_model_record');
			
		      $queryBuilder = $connection->createQueryBuilder();
		      
		      // Parameterized dynamic query execution
		      return $queryBuilder
			->select('*')
			->from('tx_myportal_domain_model_record')
			->where(
			  $queryBuilder->expr()->eq('title', $queryBuilder->createNamedParameter($title))
			)
			->executeQuery()
			->fetchAllAssociative();
		    }
		  }
		  ```
-
- # Testing & QA
  collapsed:: true
	- Testing custom Extbase extensions using PHPUnit.
	-
	- ## Extension Unit Test (`Tests/Unit/Domain/Model/RecordTest.php`)
		- Mocks class objects to test logic states:
		- ```php
		  namespace Vendor\MyPortal\Tests\Unit\Domain\Model;
		  
		  use TYPO3\TestingFramework\Core\Unit\UnitTestCase;
		  use Vendor\MyPortal\Domain\Model\Record;
		  
		  class RecordTest extends UnitTestCase {
		    protected Record $record;
		  
		    protected function setUp(): void {
		      parent::setUp();
		      $this->record = new Record();
		    }
		  
		    public function testGetTitleReturnsInitialValue() {
		      $this->record->setTitle('Initial Title');
		      $this->assertSame('Initial Title', $this->record->getTitle());
		    }
		  }
		  ```
-
- # TYPO3 Developer Code Cookbooks
  collapsed:: true
	- Reusable TypoScript, Fluid, and PHP configuration setups for enterprise developers.
	-
	- ## 1. Custom CLI Command Controller
		- Registers custom console commands via Symfony:
		- ```php
		  // Classes/Command/SyncCommand.php
		  namespace Vendor\MyPortal\Command;
		  
		  use Symfony\Component\Console\Command\Command;
		  use Symfony\Component\Console\Input\InputInterface;
		  use Symfony\Component\Console\Output\OutputInterface;
		  
		  class SyncCommand extends Command {
		    protected function configure() {
		      $this->setDescription('Syncs database records.');
		    }
		  
		    protected function execute(InputInterface $input, OutputInterface $output): int {
		      $output->writeln('Syncing Extbase tables...');
		      return Command::SUCCESS;
		    }
		  }
		  ```
		-
		- **Command registration in `Configuration/Services.yaml`**:
			- ```yaml
			  Vendor\MyPortal\Command\SyncCommand:
			    tags:
			      - { name: 'console.command', command: 'portal:sync' }
			  ```
	-
	- ## 2. Dynamically Render Site Title in TypoScript
		- Injects current website title configurations into page headers:
		- ```typoscript
		  page.headerData.10 = TEXT
		  page.headerData.10 {
		      field = title
		      wrap = <title>{@site.title} | *</title>
		      insertData = 1
		  }
		  ```
	-
	- ## 3. TypoScript Menu Object Loop (HMENU)
		- Generates nested HTML lists for primary navigation menus:
		- ```typoscript
		  lib.mainNav = HMENU
		  lib.mainNav {
		      # Loop through top level pages
		      1 = TMENU
		      1 {
			  wrap = <ul class="nav-menu"> | </ul>
			  NO = 1
			  NO.wrapItemAndSub = <li class="nav-item"> | </li>
			  
			  # Active menu item styling configurations
			  ACT = 1
			  ACT.wrapItemAndSub = <li class="nav-item active"> | </li>
		      }
		  }
		  ```
	-
	- ## 4. Custom Fluid Layout Page Template
		- Structure configuration for layout templates:
		- ```html
		  <!-- Resources/Private/Layouts/DefaultLayout.html -->
		  <div class="site-layout">
		      <div class="sidebar">
			  <f:render section="Sidebar" optional="true" />
		      </div>
		      <div class="main-content">
			  <f:render section="Main" />
		      </div>
		  </div>
		  ```
	-
	- ## 5. Dynamic Content Element Columns Mapping
		- Fetch content blocks depending on columns position values:
		- ```typoscript
		  lib.leftContent = CONTENT
		  lib.leftContent {
		      table = tt_content
		      select {
			  # 1 corresponds to left sidebar column in backend layout
			  where = colPos=1
			  orderBy = sorting
		      }
		  }
		  ```
	-
	- ## 6. File Upload field in TCA config
		- Adds file selection options in backend TCA database grids:
		- ```php
		  'image_upload' => [
		    'label' => 'Main Image',
		    'config' => [
		      'type' => 'file',
		      'maxitems' => 1,
		      'allowed' => 'common-image-types'
		    ]
		  ]
		  ```
	-
	- ## 7. Fluid Translation ViewHelper
		- Locates localized labels inside XML XLF translations catalog files:
		- ```html
		  <f:translate key="EXT:my_portal/Resources/Private/Language/locallang.xlf:button.click" />
		  ```
	-
	- ## 8. Dynamic Page ID Condition check (TypoScript)
		- Executes rules only on page UID 15:
		- ```typoscript
		  [page["uid"] == 15]
		      page.bodyTag = <body class="homepage-layout">
		  [global]
		  ```
	-
	- ## 9. Custom ViewHelper Namespace Declaration
		- Registers namespace mappings inside Fluid files:
		- ```html
		  {namespace portal=Vendor\MyPortal\ViewHelpers}
		  <portal:currentYear />
		  ```
	-
	- ## 10. Composer Autoload package registry
		- Autoloader mapping configuration inside `composer.json`:
		- ```json
		  "autoload": {
		      "psr-4": {
			  "Vendor\\MyPortal\\": "Classes/"
		      }
		  }
		  ```
	-
	- ## 11. Less Fluid Grid Layout Style
		- Flexible design setup:
		- ```less
		  .flex-grid-columns {
		      display: flex;
		      flex-flow: row wrap;
		      justify-content: flex-start;
		      gap: 20px;
		  }
		  ```
	-
	- ## 12. Fluid Cycle Loop Checker
		- Toggle background styles:
		- ```html
		  <f:for each="{records}" as="record" iteration="i">
		      <div class="row {f:cycle(values:['odd', 'even'], iterator:i)}">
			  {record.title}
		      </div>
		  </f:for>
		  ```
	-
	- ## 13. TypoScript Custom PAGE Configuration
		- Clean output setup:
		- ```typoscript
		  apiPage = PAGE
		  apiPage {
		      typeNum = 99
		      config {
			  disableAllHeaderCode = 1
			  additionalHeaders.10.header = Content-Type: application/json
		      }
		      10 = TEXT
		      10.value = {"status": "running"}
		  }
		  ```
	-
	- ## 14. Extbase Query logic wrapper
		- Queries domain models using repositories:
		- ```php
		  public function findRecordsByCondition($title) {
		    $query = $this->createQuery();
		    $query->matching($query->equals('title', $title));
		    return $query->execute();
		  }
		  ```
	-
	- ## 15. Form security token generator in FlexForm
		- Configures flexforms parameters XML layouts:
		- ```xml
		  <T3DataStructure>
		      <sheets>
			  <sDEF>
			      <ROOT>
				  <type>array</type>
				  <el>
				      <settings.promoCode>
					  <label>Enter Promo Code</label>
					  <config>
					      <type>input</type>
					      <size>30</size>
					  </config>
				      </settings.promoCode>
				  </el>
			      </ROOT>
			  </sDEF>
		      </sheets>
		  </T3DataStructure>
		  ```
	-
	- ## 16. Dynamic Date Formatting in Fluid
		- Renders formatted timestamps:
		- ```html
		  <span><f:format.date format="d.m.Y">{record.crdate}</f:format.date></span>
		  ```
	-
	- ## 17. Scroll Indicator component styling
		- CSS styles:
		- ```less
		  .scroll-top-wrapper {
		      position: fixed;
		      bottom: 25px;
		      right: 25px;
		      cursor: pointer;
		  }
		  ```
	-
	- ## 18. Dynamic Site Redirection Configuration
		- Redirection config inside `config.yaml`:
		- ```yaml
		  routes:
		    -
		      route: 'promo'
		      target: 't3://page?uid=45'
		  ```
	-
	- ## 19. External API Client Curl helper
		- Fetches API payloads in PHP using TYPO3 HTTP client utilities:
		- ```php
		  namespace Vendor\MyPortal\Service;
		  
		  use TYPO3\CMS\Core\Http\RequestFactory;
		  
		  class ApiService {
		    protected $requestFactory;
		  
		    public function __construct(RequestFactory $requestFactory) {
		      $this->requestFactory = $requestFactory;
		    }
		  
		    public function fetchExternalData() {
		      $response = $this->requestFactory->request('https://api.example.com/v1/records');
		      if ($response->getStatusCode() === 200) {
			return json_decode($response->getBody()->getContents(), true);
		      }
		      return [];
		    }
		  }
		  ```
	-
	- ## 20. Webhook verification logic
		- Validates incoming API request HMAC signatures:
		- ```php
		  namespace Vendor\MyPortal\Service;
		  
		  class SignatureVerifier {
		    public function verify($body, $signature, $secret) {
		      $expected = hash_hmac('sha256', $body, $secret);
		      return hash_equals($expected, $signature);
		    }
		  }
		  ```
	-
	- ## 21. Custom element view template script
		- Interactive JavaScript element rendering:
		- ```html
		  <div class="custom-widget-target" data-widget-id="99"></div>
		  
		  <script>
		    document.addEventListener("DOMContentLoaded", () => {
		      const el = document.querySelector('.custom-widget-target');
		      if (el) {
			const id = el.getAttribute('data-widget-id');
			el.innerHTML = `<span class="badge">Active Widget ${id}</span>`;
		      }
		    });
		  </script>
		  ```
	-
	- ## 22. Dynamic Menu Dropdown TMENU settings
		- Multi-level submenus in TypoScript configuration:
		- ```typoscript
		  lib.navMenu.2 = TMENU
		  lib.navMenu.2 {
		      wrap = <ul class="submenu-level-2"> | </ul>
		      NO = 1
		      NO.wrapItemAndSub = <li class="sub-item"> | </li>
		      
		      # If sub-level is active
		      ACT = 1
		      ACT.wrapItemAndSub = <li class="sub-item active"> | </li>
		  }
		  ```
	-
	- ## 23. Direct redirect inside Extbase Action
		- Redirections in controllers:
		- ```php
		  namespace Vendor\MyPortal\Controller;
		  
		  use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;
		  
		  class RedirectController extends ActionController {
		    public function oldAction() {
		      // Redirect to list action of RecordController in same extension
		      return $this->redirect('list', 'Record');
		    }
		  }
		  ```
	-
	- ## 24. Less CSS responsive columns grid
		- Layout CSS styles:
		- ```less
		  .grid-layout-portal {
		      display: grid;
		      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		      gap: @padding-large;
		      margin: 1.5rem 0;
		  }
		  ```
	-
	- ## 25. Static layout header title config
		- Title tag override helper using TypoScript constants:
		- ```typoscript
		  config.noPageTitle = 2
		  page.headerData.10 = TEXT
		  page.headerData.10.value = <title>Corporate Portal Staging Site</title>
		  ```
	-
	- ## 26. Custom Content Element TCA Configuration
		- Registers a brand new custom Content Element type:
		- ```php
		  // Configuration/TCA/Overrides/tt_content.php
		  defined('TYPO3') or die();
		  
		  \TYPO3\CMS\Core\Utility\ExtensionUtility::registerPageTSConfigFile(
		    'my_portal',
		    'Configuration/TsConfig/Page/custom_element.tsconfig',
		    'Custom Content Element TSConfig'
		  );
		  ```
	-
	- ## 27. TypoScript dynamic language selector
		- Outputs menu links to switch between site languages:
		- ```typoscript
		  lib.languageMenu = HMENU
		  lib.languageMenu {
		      special = language
		      special.value = 0,1
		      special.normalWhenNoLanguage = 0
		      1 = TMENU
		      1 {
			  wrap = <div class="lang-selector"> | </div>
			  NO = 1
			  NO {
			      stdWrap.current = 1
			      stdWrap.setCurrent = EN || DE
			      wrapItemAndSub = <span class="lang-item"> | </span>
			  }
			  ACT < .NO
			  ACT.wrapItemAndSub = <span class="lang-item active"> | </span>
		      }
		  }
		  ```
	-
	- ## 28. Fluid Image File Reference Loader
		- Dynamic image parser rendering from fal databases:
		- ```html
		  <!-- List.html image check -->
		  <f:if condition="{record.image}">
		      <div class="thumbnail">
			  <f:image image="{record.image}" width="400c" height="300c" alt="{record.title}" />
		      </div>
		  </f:if>
		  ```
	-
	- ## 29. Extbase Repository custom query conditions
		- Querying records using Extbase expression logic:
		- ```php
		  namespace Vendor\MyPortal\Domain\Repository;
		  
		  use TYPO3\CMS\Extbase\Persistence\Repository;
		  
		  class CustomRecordRepository extends Repository {
		    public function findPendingRecords() {
		      $query = $this->createQuery();
		      $query->matching(
			$query->equals('status', 'pending')
		      );
		      return $query->execute();
		    }
		  }
		  ```
	-
	- ## 30. Backend User Session state getter
		- Check backend user groups in controller:
		- ```php
		  namespace Vendor\MyPortal\Utility;
		  
		  class UserGroupChecker {
		    public function isCurrentUserAdmin() {
		      // Access global BE user objects context
		      return (bool)($GLOBALS['BE_USER']->user['admin'] ?? false);
		    }
		  }
		  ```
	-
	- ## 31. Gulp Compilers configuration
		- Build tasks scripts:
		- ```javascript
		  const gulp = require('gulp');
		  const less = require('gulp-less');
		  
		  gulp.task('less', () => {
		    return gulp.src('./Resources/Public/Less/style.less')
		      .pipe(less())
		      .pipe(gulp.dest('./Resources/Public/Css'));
		  });
		  ```
	-
	- ## 32. Custom 404 Error handler Page config
		- YAML redirection page identifier inside site configuration:
		- ```yaml
		  errorHandling:
		    -
		      errorCode: '404'
		      errorHandler: Page
		      errorContentSource: 't3://page?uid=404'
		  ```
	-
	- ## 33. Author Details Social links wrapper
		- Dynamic bindings in Fluid:
		- ```html
		  <div class="social-tags flex gap-2">
		      <a href="https://twitter.com/{author.twitter}" class="twitter-icon">Twitter</a>
		  </div>
		  ```
	-
	- ## 34. Less Font variables setup
		- Fonts styling configurations:
		- ```less
		  @font-primary: 'Outfit', sans-serif;
		  @line-height-prose: 1.75;
		  
		  p.prose-text {
		      font-family: @font-primary;
		      line-height: @line-height-prose;
		  }
		  ```
	-
	- ## 35. Webpack Compilation configurations
		- Build entry configs:
		- ```javascript
		  module.exports = {
		    entry: './Resources/Public/Js/index.js',
		    output: {
		      filename: 'index.min.js',
		      path: path.resolve(__dirname, 'Resources/Public/JavaScript')
		    }
		  };
		  ```
	-
	- ## 36. TypoScript Custom Cache Bin config
		- Configure caching lifetimes:
		- ```typoscript
		  config.cache_period = 43200
		  ```
	-
	- ## 37. FlexForm custom plugin selector field
		- Flexform parameters declaration mapping:
		- ```xml
		  <ROOT>
		      <type>array</type>
		      <el>
			  <settings.category>
			      <label>Choose Category</label>
			      <config>
				  <type>select</type>
				  <items>
				      <numIndex index="0">
					  <numIndex index="0">Tech</numIndex>
					  <numIndex index="1">tech</numIndex>
				      </numIndex>
				  </items>
			      </config>
			  </settings.category>
		      </el>
		  </ROOT>
		  ```
	-
	- ## 38. Fluid dynamic raw output formatter
		- Sanitizes tags output:
		- ```html
		  <f:format.raw>{raw_content}</f:format.raw>
		  ```
	-
	- ## 39. Nginx rewrite configurations
		- Rewrites parameters for Nginx:
		- ```nginx
		  location / {
		      try_files $uri $uri/ /index.php$is_args$args;
		  }
		  ```
	-
	- ## 40. Fluid custom ViewHelper loop checker
		- Grid rendering checking:
		- ```html
		  <div class="col {f:if(condition: iteration.isFirst, then: 'col-main')}">
		      {content}
		  </div>
		  ```
-
- # More Learn
	- ## Developer Documentation & Reference Manuals
		- [TYPO3 Core APIs Developer Guides](https://docs.typo3.org/)
		- [TypoScript Reference & Syntax Guides](https://docs.typo3.org/m/typo3/reference-typoscript/main/en-us/)
		- [Extbase Framework Extension Development manual](https://docs.typo3.org/m/typo3/book-extbasefluid/main/en-us/)
		- [Fluid Templates ViewHelper API references](https://docs.typo3.org/other/typo3/view-helper-reference/main/en-us/)
		- [Site Configurations & Routing documentation](https://docs.typo3.org/m/typo3/reference-coreapi/main/en-us/Configuration/SiteHandling/Index.html)
		- [TYPO3 Caching Framework architecture guides](https://docs.typo3.org/m/typo3/reference-coreapi/main/en-us/ApiOverview/CachingFramework/Index.html)
		- [TYPO3 GitHub Source Code Repository](https://github.com/TYPO3/TYPO3)
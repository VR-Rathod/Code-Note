---
seoTitle: Magento E-commerce Reference – Store Setup, Architecture, and Extension Development Guide
description: "Comprehensive Magento 2 developer reference guide covering dependency injection, EAV database model, custom modules, plugin interceptors, dynamic layouts, performance, security, and developer cookbooks."
keywords: "Magento, Magento 2, Adobe Commerce, EAV database, Dependency Injection, Plugins, Observers, layout XML, PHP e-commerce, custom module, VR-Rathod, Code-Note, code note vr, vr book"
comments: true
displayTitle: Magento Developer Guide
---

> [!info] What is Magento?
> **Magento** (specifically Magento 2 / Adobe Commerce) is an enterprise-grade, open-source e-commerce platform built on PHP. It utilizes a highly modular architectural pattern featuring a custom **Dependency Injection container**, the **Entity-Attribute-Value (EAV)** database schema, XML-based **Layout Injection layouts**, and **Plugins (Interceptors)**, making it one of the most flexible and scalable e-commerce frameworks for large-scale enterprise storefronts.

- # History
	- **How**: Magento was first released in **2008** by **Roy Rubin** and **Yoav Kutner** (under their company Varien). It was originally conceived as a fork of osCommerce, but was completely rewritten. Magento 1 became highly popular due to its advanced modularity. In 2011, **eBay** acquired Magento. In 2015, **Magento 2** was launched, introducing a complete architectural overhaul including jQuery/RequireJS, Composer, and Dependency Injection. **Adobe** acquired Magento in 2018 for $1.68 billion, rebranding the commercial version to **Adobe Commerce**.
	- **Who**: Developed by **Roy Rubin**, **Yoav Kutner**, and the Magento developer community. Currently maintained and scaled by **Adobe**.
	- **Why**: Magento was built to address the lack of extensibility and multi-store support in early e-commerce builders. It provides developers with complete control over the checkout pipeline, product catalog attributes, and external ERP integrations.
-
- # Introduction
  collapsed:: true
	- ## What problem does it solve?
		- Enterprise e-commerce requires complex architectures: multi-currency transactions, regional tax variations, third-party ERP integrations, multi-store configurations managed from a single administrative console, and customized checkout pipelines. Magento solves this by providing a PHP-based modular framework where every single core block, class, database table, or controller can be customized, extended, or overridden without modifying the core codebase.
	-
	- ## Advantages
		- **Unmatched Modularity**: Every core class can be intercepted using Plugins (Interceptors) or overridden using Dependency Injection mapping rules.
		- **Advanced Multi-Store Support**: Run separate storefronts with unique languages, currencies, and inventory warehouses from a single admin panel.
		- **EAV Database System**: Dynamically add attributes to product catalog entities without creating custom table columns on the fly.
		- **Varnish & Full Page Caching**: Out-of-the-box integration with Varnish to deliver lightning-fast static page caching for anonymous visitors.
		- **Service Contracts API**: Strictly defined PHP interfaces decouple business logic, allowing easy updates and automated REST/SOAP/GraphQL API generation.
	-
	- ## Disadvantages
		- **Steep Learning Curve**: High conceptual overhead. Developers must master XML schemas, Knockout.js UI components, EAV data mappings, and the custom DI container compilation.
		- **Highly Resource-Intensive**: Requires optimized hosting infrastructures (PHP-FPM, OpenSearch/Elasticsearch, Redis, Varnish) to perform well under transaction loads.
		- **Slow Compilation Times**: Generating code interceptors and deploying static assets during deployments requires running multiple CLI tasks, slowing down CI/CD pipelines.
		- **High Development Overhead**: Creating a simple database entry or router page requires writing multiple PHP classes and XML configuration files.
	-
	- ## When to use vs alternatives
		- **Use Magento When**:
			- Building large-scale enterprise storefronts with hundreds of thousands of SKUs, complex multi-region warehouses, and B2B ordering pipelines.
			- Integrations with ERPs (e.g. SAP, Microsoft Dynamics) are required.
		- **Avoid Magento When**:
			- Setting up a basic online store with simple catalog requirements (Shopify or WooCommerce are much faster and more cost-effective for small merchants).
-
- # Installation & Setup (Magento 2 Architecture)
  collapsed:: true
	- Magento 2 requires a specific stack of server services to execute correctly.
	-
	- ## Core System Prerequisites
		- **PHP**: PHP 8.1 / 8.2 (with extensions: bcmath, gd, intl, pdo_mysql, soap, sockets, xsl, zip).
		- **Database**: MySQL 8.0 or MariaDB 10.6+.
		- **Search Engine**: OpenSearch 1.3+ or Elasticsearch 7.17+ (Required - Magento will not boot without an active search service).
		- **Caching**: Redis (for cache and session storage) and Varnish (for Full Page Caching).
		- **Composer**: Composer 2.x for package dependency management.
	-
	- ## Composer Installation CLI
		- ```bash
		  # Create a new Magento project directory via Composer
		  composer create-project --repository-url=https://repo.magento.com/ magento/project-community-edition magento2
		  
		  # Run the Magento installation command
		  bin/magento setup:install \
		    --base-url=https://magento.local/ \
		    --db-host=localhost \
		    --db-name=magento2 \
		    --db-user=dbuser \
		    --db-password=dbpass \
		    --admin-firstname=Admin \
		    --admin-lastname=User \
		    --admin-email=admin@example.com \
		    --admin-user=admin \
		    --admin-password=AdminPassword123 \
		    --language=en_US \
		    --currency=USD \
		    --timezone=America/New_York \
		    --use-rewrites=1 \
		    --search-engine=opensearch \
		    --opensearch-host=127.0.0.1 \
		    --opensearch-port=9200 \
		    --opensearch-index-prefix=magento2
		  ```
	-
	- ## File System Permissions
		- Magento requires specific file write accesses to cache and compile code:
		- ```bash
		  # Set permissions inside the root directory
		  find var generated vendor pub/static pub/media app/etc -type f -exec chmod 664 {} +
		  find var generated vendor pub/static pub/media app/etc -type d -exec chmod 775 {} +
		  chmod u+x bin/magento
		  ```
	-
	- ## Directory Layout
		- ```
		  ├── app/
		  │   ├── code/                # Custom and third-party modules (organized by Vendor/ModuleName)
		  │   ├── design/              # Custom frontend themes (organized by frontend/Vendor/theme_name)
		  │   └── etc/                 # Global configuration settings (config.php, env.php)
		  ├── bin/
		  │   └── magento              # Magento CLI executable tool script
		  ├── generated/               # Auto-generated code classes compiled by the DI container
		  ├── pub/
		  │   ├── index.php            # Web server entry point
		  │   ├── static/              # Deployed static assets (CSS, JS, templates)
		  │   └── media/               # Product catalog images and uploads
		  ├── var/                     # Cache, session, logs, and temporary files
		  └── composer.json            # Project dependencies and patches configuration
		  ```
-
- # Core Architecture & Concepts
  collapsed:: true
	- Magento relies on strict software engineering patterns to decoupled components.
	-
	- ## Model-View-Controller (MVC) Pattern
		- **Model**: Business logic layer (handled by Service Contracts, Repositories, and Resources).
		- **View**: Presentation layer (Layout XML, PHTML templates, and UI Components).
		- **Controller**: Routing handler (receives requests, executes actions, and returns results).
	-
	- ## Dependency Injection (DI)
		- Declared inside `etc/di.xml` files. The DI container injects dependencies into constructors at runtime.
		- If a class constructor changes, you must run compilation to regenerate files inside the `generated/` folder.
		-
		- **Constructor Dependency Injection Example**:
			- ```php
			  namespace Vendor\Module\Model;
			  
			  use Magento\Catalog\Api\ProductRepositoryInterface;
			  use Magento\Framework\Exception\NoSuchEntityException;
			  
			  class ProductLogger {
			    protected $productRepository;
			  
			    // Injecting the repository interface instead of a concrete class
			    public function __construct(ProductRepositoryInterface $productRepository) {
			      $this->productRepository = $productRepository;
			    }
			  
			    public function logProductSku($productId) {
			      try {
				$product = $this->productRepository->getById($productId);
				return $product->getSku();
			      } catch (NoSuchEntityException $e) {
				return 'Product not found';
			      }
			    }
			  }
			  ```
	-
	- ## Plugins (Interceptors)
		- Plugins allow intercepting any public class method without overriding the class directly.
		- Mapped in `etc/di.xml` under `<plugin>`.
		- Types of Plugins:
			- **Before**: Modifies arguments passed into a method before execution.
			- **Around**: Wraps around method execution, allowing overriding the whole process.
			- **After**: Modifies the output result returned by a method.
		-
		- ### Plugin Code Implementation
			- ```php
			  namespace Vendor\Module\Plugin;
			  
			  use Magento\Catalog\Model\Product;
			  
			  class ProductPlugin {
			    /**
			     * After Plugin: Modifies the output of product getName() method.
			     */
			    public function afterGetName(Product $subject, $result) {
			      // Subject represents the observed object instance
			      return '[Promo] ' . $result;
			    }
			  }
			  ```
	-
	- ## Event Observer Pattern
		- Observers listen to events dispatched by the framework core.
		- Registered in `etc/events.xml`.
		-
		- ### Observer Implementation
			- ```php
			  namespace Vendor\Module\Observer;
			  
			  use Magento\Framework\Event\ObserverInterface;
			  use Magento\Framework\Event\Observer;
			  use Psr\Log\LoggerInterface;
			  
			  class LogCartAddObserver implements ObserverInterface {
			    protected $logger;
			  
			    public function __construct(LoggerInterface $logger) {
			      $this->logger = $logger;
			    }
			  
			    public function execute(Observer $observer) {
			      // Extract payload parameters dispatched with the event
			      $product = $observer->getEvent()->getData('product');
			      $this->logger->info('Product added to cart: ' . $product->getSku());
			    }
			  }
			  ```
-
- # Database & ORM System (EAV vs. Flat)
  collapsed:: true
	- Magento uses two database design structures: **Flat Tables** and **Entity-Attribute-Value (EAV)**.
	-
	- ## EAV Model Architecture
		- EAV splits data representation into separate tables to support dynamic attributes without running alter queries.
		-
		- **EAV Tables Breakdown**:
			- **Entity**: The base identifier row (e.g. `catalog_product_entity` stores ID, SKU, and type).
			- **Attribute**: The definition metadata (e.g. `eav_attribute` stores attribute name, type, validation rules).
			- **Value**: The values stored in type-specific tables (e.g. `catalog_product_entity_varchar`, `catalog_product_entity_int`, `catalog_product_entity_decimal`).
		-
		- ### EAV Database Table Schema Layout
			- ```mermaid
			  graph TD
			      A[catalog_product_entity] -->|entity_id| B(catalog_product_entity_varchar)
			      A -->|entity_id| C(catalog_product_entity_int)
			      A -->|entity_id| D(catalog_product_entity_decimal)
			      E[eav_attribute] -->|attribute_id| B
			      E -->|attribute_id| C
			      E -->|attribute_id| D
			  ```
	-
	- ## Flat Tables
		- Simple relational tables. Used for configurations, sales data (orders, invoices, shipping), and index tables where EAV structure is too slow for queries.
	-
	- ## Service Contracts & Collections
		- Use Service Contracts (interfaces) to access database models securely:
		- ```php
		  // Fetching a collection of models using factories
		  $collection = $this->productCollectionFactory->create()
		    ->addAttributeToSelect(['name', 'price'])
		    ->addAttributeToFilter('status', \Magento\Catalog\Model\Product\Attribute\Source\Status::STATUS_ENABLED)
		    ->setPageSize(10);
		  ```
	-
	- ## Declarative Schema (`etc/db_schema.xml`)
		- Declares custom database tables, indexes, and relations inside a single XML file.
		- ```xml
		  <?xml version="1.0"?>
		  <schema xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Setup/Declaration/Schema/etc/db_schema.xsd">
		    <table name="vendor_module_custom_records" resource="default" engine="innodb" comment="Custom Module Records Table">
		      <column xsi:type="int" name="id" padding="10" unsigned="true" nullable="false" identity="true" comment="Primary Key"/>
		      <column xsi:type="varchar" name="title" length="255" nullable="false" comment="Record Title"/>
		      <column xsi:type="timestamp" name="created_at" on_update="false" nullable="false" default="CURRENT_TIMESTAMP" comment="Creation Date"/>
		      <constraint xsi:type="primary" referenceId="PRIMARY">
			<column name="id"/>
		      </constraint>
		    </table>
		  </schema>
		  ```
-
- # Custom Module Development (Deep Dive)
  collapsed:: true
	- Modules are contained inside the `app/code/` directory.
	- Let's construct a custom module named `Vendor_Ecomm` step-by-step.
	-
	- ## 1. Module Declaration File (`app/code/Vendor/Ecomm/etc/module.xml`)
		- Declares module dependencies:
		- ```xml
		  <?xml version="1.0"?>
		  <config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Module/etc/module.xsd">
		    <module name="Vendor_Ecomm" setup_version="1.0.0">
		      <sequence>
			<module name="Magento_Catalog"/>
		      </sequence>
		    </module>
		  </config>
		  ```
	-
	- ## 2. Autoload Registration (`app/code/Vendor/Ecomm/registration.php`)
		- Connects the namespace to the PSR-4 autoloader:
		- ```php
		  <?php
		  use Magento\Framework\Component\ComponentRegistrar;
		  
		  ComponentRegistrar::register(
		    ComponentRegistrar::MODULE,
		    'Vendor_Ecomm',
		    __DIR__
		  );
		  ```
	-
	- ## 3. Routing Map (`app/code/Vendor/Ecomm/etc/frontend/routes.xml`)
		- Defines route paths for the web storefront front controller:
		- ```xml
		  <?xml version="1.0"?>
		  <config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:App/etc/routes.xsd">
		    <router id="standard">
		      <route id="vendecomm" frontName="ecomm">
			<module name="Vendor_Ecomm"/>
		      </route>
		    </router>
		  </config>
		  ```
	-
	- ## 4. Controller Implementation (`app/code/Vendor/Ecomm/Controller/Index/Index.php`)
		- Handles incoming URL requests at: `https://store.local/ecomm/index/index`
		- ```php
		  <?php
		  namespace Vendor\Ecomm\Controller\Index;
		  
		  use Magento\Framework\App\Action\HttpGetActionInterface;
		  use Magento\Framework\Controller\Result\JsonFactory;
		  
		  class Index implements HttpGetActionInterface {
		    protected $resultJsonFactory;
		  
		    public function __construct(JsonFactory $resultJsonFactory) {
		      $this->resultJsonFactory = $resultJsonFactory;
		    }
		  
		    public function execute() {
		      $result = $this->resultJsonFactory->create();
		      $result->setData([
			'status' => 'success',
			'message' => 'Magento 2 custom module controller running.'
		      ]);
		      return $result;
		    }
		  }
		  ```
	-
	- ## 5. Plugin XML Mapping (`app/code/Vendor/Ecomm/etc/di.xml`)
		- Configures dependency injection mappings and plugin interceptors:
		- ```xml
		  <?xml version="1.0"?>
		  <config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:ObjectManager/etc/config.xsd">
		    <!-- Map Interface to concrete Repository Service -->
		    <preference for="Vendor\Ecomm\Api\RecordRepositoryInterface" type="Vendor\Ecomm\Model\RecordRepository" />
		    
		    <!-- Intercept Product Catalog loading class -->
		    <type name="Magento\Catalog\Model\Product">
		      <plugin name="vendecomm_product_interceptor" type="Vendor\Ecomm\Plugin\ProductPlugin" sortOrder="10" />
		    </type>
		  </config>
		  ```
-
- # Theme Development & Layout System
  collapsed:: true
	- Theme configurations are located inside the `app/design/frontend/` directory.
	-
	- ## Theme Descriptor File (`app/design/frontend/Vendor/custom_theme/theme.xml`)
		- Declares theme title, base theme overrides, and preview images:
		- ```xml
		  <theme xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Config/etc/theme.xsd">
		    <title>Enterprise Custom Storefront Theme</title>
		    <parent>Magento/luma</parent>
		    <media>
		      <preview_image>media/preview.jpg</preview_image>
		    </media>
		  </theme>
		  ```
	-
	- ## Layout XML Instructions
		- Layout rendering is controlled using modular XML files.
		-
		- **Common layout directives**:
			- `<block>`: Renders content using a specific PHP template block class.
			- `<referenceBlock>`: Modifies properties of an existing block.
			- `<referenceContainer>`: Appends children blocks inside a structural container (like `main.content` or `sidebar`).
			- `<move>`: Moves a block to a new container.
		-
		- ### Layout Override Code Example (`app/design/frontend/Vendor/custom_theme/Magento_Catalog/layout/catalog_product_view.xml`)
			- ```xml
			  <?xml version="1.0"?>
			  <page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
			    <body>
			      <!-- Move product reviews block directly under main title -->
			      <move element="product.info.review" destination="product.info.main" before="product.info.price" />
			      
			      <!-- Append a custom promo block to sidebar container -->
			      <referenceContainer name="sidebar.additional">
				<block class="Magento\Framework\View\Element\Template"
				       name="custom.sidebar.promo"
				       template="Magento_Catalog::html/promo.phtml" />
			      </referenceContainer>
			    </body>
			  </page>
			  ```
	-
	- ## Template rendering (`PHTML` files)
		- Renders HTML elements with inline PHP variables:
		- ```html
		  <?php
		  /** @var Magento\Framework\View\Element\Template $block */
		  // Safely grab dynamic parameters passed to the block
		  $promoText = $block->getData('promo_label') ?? 'Default Special Offer';
		  ?>
		  <div class="promo-banner bg-blue-100 p-4 border rounded">
		    <h4 class="font-bold"><?= $block->escapeHtml($promoText) ?></h4>
		    <p>Use code: <strong>DEVNOTES</strong> during checkout.</p>
		  </div>
		  ```
-
- # Performance Optimization (Enterprise-grade)
  collapsed:: true
	- Scaling Magento storefronts requires server configuration and compile optimizations.
	-
	- ## Varnish Full Page Caching
		- Direct requests to Varnish to serve compiled HTML.
		- Cache invalidations are controlled automatically via **Cache Tags** returned in HTTP response headers. Saving a product in the admin panel sends a purge request for the corresponding product cache tag.
	-
	- ## Redis Configurations (`app/etc/env.php`)
		- Offload default database cache bins and user sessions to Redis to minimize database connection limits:
		- ```php
		  'cache' => [
		    'frontend' => [
		      'default' => [
			'backend' => 'Cm_Cache_Backend_Redis',
			'backend_options' => [
			  'server' => '127.0.0.1',
			  'port' => '6379',
			  'database' => '0',
			  'password' => 'secure-redis-pass'
			]
		      ]
		    ]
		  ]
		  ```
	-
	- ## Production Deployment Checklist
		- 1. Switch indexers to update on schedule (runs indexers as cron tasks instead of real-time transactions).
		- 2. Minify CSS, JS, and HTML templates.
		- 3. Turn on JavaScript bundling (or optimize using external bundlers like Magepack).
		- 4. Set application mode to **Production**:
		   ```bash
		   bin/magento deploy:mode:set production
		   ```
-
- # Security Best Practices
  collapsed:: true
	- Maintain secure transactions and store configurations.
	-
	- ## Output Escaping
		- Always escape output strings inside PHTML templates to prevent XSS:
		- ```php
		  // 1. Escaping plain strings
		  echo $block->escapeHtml($user_input);
		  
		  // 2. Escaping HTML attributes
		  echo '<input type="text" class="' . $block->escapeHtmlAttr($class) . '" />';
		  
		  // 3. Escaping raw HTML containing allowed tags
		  echo $block->escapeHtml($dirtyHtml, ['b', 'strong', 'i']);
		  
		  // 4. Escaping inline JavaScript values
		  echo '<script>var token = "' . $block->escapeJs($token) . '";</script>';
		  ```
	-
	- ## Securing API Routes (Web APIs)
		- Configure dynamic access control rules inside `webapi.xml` endpoints:
		- ```xml
		  <!-- app/code/Vendor/Ecomm/etc/webapi.xml -->
		  <route url="/V1/ecomm/records" method="GET">
		    <service class="Vendor\Ecomm\Api\RecordRepositoryInterface" method="getList"/>
		    <resources>
		      <!-- Restrict API access to administrators -->
		      <resource ref="Magento_Backend::admin"/>
		    </resources>
		  </route>
		  ```
-
- # Testing & Quality Assurance
  collapsed:: true
	- Magento includes automated testing frameworks.
	-
	- ## PHPUnit Unit Testing (`app/code/Vendor/Ecomm/Test/Unit/Model/RecordTest.php`)
		- Testing isolated class models:
		- ```php
		  namespace Vendor\Ecomm\Test\Unit\Model;
		  
		  use PHPUnit\Framework\TestCase;
		  use Vendor\Ecomm\Model\Record;
		  
		  class RecordTest extends TestCase {
		    public function testGetTitle() {
		      $record = new Record();
		      $record->setTitle('Unit Test Title');
		      $this->assertEquals('Unit Test Title', $record->getTitle());
		    }
		  }
		  ```
-
- # Magento 2 Developer Code Cookbooks
  collapsed:: true
	- Complete code patterns for e-commerce developers.
	-
	- ## 1. Custom CLI Console Command
		- Registers a custom terminal execution task:
		- ```php
		  // app/code/Vendor/Ecomm/Console/SyncRecords.php
		  namespace Vendor\Ecomm\Console;
		  
		  use Symfony\Component\Console\Command\Command;
		  use Symfony\Component\Console\Input\InputInterface;
		  use Symfony\Component\Console\Output\OutputInterface;
		  
		  class SyncRecords extends Command {
		    protected function configure() {
		      $this->setName('ecomm:sync-records')
			->setDescription('Syncs custom local records to the remote server.');
		      parent::configure();
		    }
		  
		    protected function execute(InputInterface $input, OutputInterface $output) {
		      $output->writeln('Starting records synchronization pipeline...');
		      // Execute sync logic...
		      $output->writeln('Sync completed successfully.');
		      return 0; // Success code
		    }
		  }
		  ```
		-
		- **Command registration in `etc/di.xml`**:
			- ```xml
			  <type name="Magento\Framework\Console\CommandList">
			    <arguments>
			      <argument name="commands" xsi:type="array">
				<item name="sync_records_cmd" xsi:type="object">Vendor\Ecomm\Console\SyncRecords</item>
			      </argument>
			    </arguments>
			  </type>
			  ```
	-
	- ## 2. Programmatic Product Creation
		- Instantiates new items in the database repository:
		- ```php
		  namespace Vendor\Ecomm\Model;
		  
		  use Magento\Catalog\Api\Data\ProductInterfaceFactory;
		  use Magento\Catalog\Api\ProductRepositoryInterface;
		  
		  class ProductCreator {
		    protected $productFactory;
		    protected $productRepository;
		  
		    public function __construct(ProductInterfaceFactory $productFactory, ProductRepositoryInterface $productRepository) {
		      $this->productFactory = $productFactory;
		      $this->productRepository = $productRepository;
		    }
		  
		    public function createSimpleProduct($sku, $name, $price) {
		      $product = $this->productFactory->create();
		      $product->setSku($sku)
			->setName($name)
			->setPrice($price)
			->setAttributeSetId(4) // Default attribute set ID
			->setStatus(\Magento\Catalog\Model\Product\Attribute\Source\Status::STATUS_ENABLED)
			->setTypeId(\Magento\Catalog\Model\Product\Type::TYPE_SIMPLE)
			->setStockData([
			  'use_config_min_qty' => 1,
			  'is_in_stock' => 1,
			  'qty' => 100
			]);
		      
		      return $this->productRepository->save($product);
		    }
		  }
		  ```
	-
	- ## 3. Before Plugin: Modifying Cart Inputs
		- Intercepts and alters product quantities added to the cart:
		- ```php
		  namespace Vendor\Ecomm\Plugin;
		  
		  use Magento\Checkout\Model\Cart;
		  
		  class CartPlugin {
		    /**
		     * Restricts items added to cart to a maximum quantity of 5.
		     */
		    public function beforeAddProduct(Cart $subject, $productInfo, $requestInfo = null) {
		      if (isset($requestInfo['qty']) && $requestInfo['qty'] > 5) {
			$requestInfo['qty'] = 5;
		      }
		      return [$productInfo, $requestInfo];
		    }
		  }
		  ```
	-
	- ## 4. Event Observer: Custom Order Status Logger
		- Logs order IDs when checkout is completed successfully:
		- ```php
		  // app/code/Vendor/Ecomm/Observer/LogOrderObserver.php
		  namespace Vendor\Ecomm\Observer;
		  
		  use Magento\Framework\Event\ObserverInterface;
		  use Magento\Framework\Event\Observer;
		  use Psr\Log\LoggerInterface;
		  
		  class LogOrderObserver implements ObserverInterface {
		    protected $logger;
		  
		    public function __construct(LoggerInterface $logger) {
		      $this->logger = $logger;
		    }
		  
		    public function execute(Observer $observer) {
		      $order = $observer->getEvent()->getOrder();
		      $this->logger->info('New Order Placed: ID ' . $order->getIncrementId());
		    }
		  }
		  ```
		-
		- **Event mapping in `etc/frontend/events.xml`**:
			- ```xml
			  <config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Event/etc/events.xsd">
			    <event name="sales_order_place_after">
			      <observer name="vendecomm_order_logger" instance="Vendor\Ecomm\Observer\LogOrderObserver"/>
			    </event>
			  </config>
			  ```
	-
	- ## 5. Custom EAV Product Attribute Setup Script
		- Adds a custom attribute (`custom_internal_notes`) using setup patches:
		- ```php
		  // app/code/Vendor/Ecomm/Setup/Patch/Data/AddInternalNotesAttribute.php
		  namespace Vendor\Ecomm\Setup\Patch\Data;
		  
		  use Magento\Framework\Setup\Patch\DataPatchInterface;
		  use Magento\Framework\Setup\ModuleDataSetupInterface;
		  use Magento\Eav\Setup\EavSetupFactory;
		  
		  class AddInternalNotesAttribute implements DataPatchInterface {
		    protected $moduleDataSetup;
		    protected $eavSetupFactory;
		  
		    public function __construct(ModuleDataSetupInterface $moduleDataSetup, EavSetupFactory $eavSetupFactory) {
		      $this->moduleDataSetup = $moduleDataSetup;
		      $this->eavSetupFactory = $eavSetupFactory;
		    }
		  
		    public function apply() {
		      $eavSetup = $this->eavSetupFactory->create(['setup' => $this->moduleDataSetup]);
		      $eavSetup->addAttribute(
			\Magento\Catalog\Model\Product::ENTITY,
			'custom_internal_notes',
			[
			  'type' => 'text',
			  'label' => 'Internal Notes',
			  'input' => 'textarea',
			  'required' => false,
			  'global' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_GLOBAL,
			  'visible' => true,
			  'user_defined' => true,
			  'default' => '',
			  'searchable' => false,
			  'filterable' => false,
			  'comparable' => false,
			  'visible_on_front' => false,
			  'used_in_product_listing' => false
			]
		      );
		    }
		  
		    public static function getDependencies() { return []; }
		    public function getAliases() { return []; }
		  }
		  ```
	-
	- ## 6. GraphQL Query Resolver Implementation
		- Resolves a custom GraphQL query:
		- ```php
		  // app/code/Vendor/Ecomm/Model/Resolver/RecordResolver.php
		  namespace Vendor\Ecomm\Model\Resolver;
		  
		  use Magento\Framework\GraphQl\Config\Element\Field;
		  use Magento\Framework\GraphQl\Query\ResolverInterface;
		  use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
		  
		  class RecordResolver implements ResolverInterface {
		    public function resolve(Field $field, $context, ResolveInfo $info, array $value = null, array $args = null) {
		      return [
			'record_id' => 1,
			'title' => 'Custom resolved GraphQL record title',
			'created_at' => '2026-05-30'
		      ];
		    }
		  }
		  ```
		-
		- **GraphQL schema file (`etc/schema.graphqls`)**:
			- ```graphql
			  type Query {
			      customRecord: CustomRecordData @resolver(class: "Vendor\\Ecomm\\Model\\Resolver\\RecordResolver") @doc(description: "Get custom record details.")
			  }
			  type CustomRecordData {
			      record_id: Int
			      title: String
			      created_at: String
			  }
			  ```
	-
	- ## 7. Custom Database Repository Class
		- Service contract implementation using repositories:
		- ```php
		  namespace Vendor\Ecomm\Model;
		  
		  use Vendor\Ecomm\Api\RecordRepositoryInterface;
		  use Vendor\Ecomm\Model\RecordFactory;
		  
		  class RecordRepository implements RecordRepositoryInterface {
		    protected $recordFactory;
		  
		    public function __construct(RecordFactory $recordFactory) {
		      $this->recordFactory = $recordFactory;
		    }
		  
		    public function getById($id) {
		      $record = $this->recordFactory->create();
		      $record->load($id);
		      return $record;
		    }
		  }
		  ```
	-
	- ## 8. Dynamic Database Query with Join
		- Fetches records using Magento's dynamic query builder:
		- ```php
		  namespace Vendor\Ecomm\Model;
		  
		  use Magento\Framework\App\ResourceConnection;
		  
		  class DBReader {
		    protected $resource;
		  
		    public function __construct(ResourceConnection $resource) {
		      $this->resource = $resource;
		    }
		  
		    public function getJoinedSalesData() {
		      $connection = $this->resource->getConnection();
		      $select = $connection->select()
			->from(['o' => $this->resource->getTableName('sales_order')], ['increment_id', 'grand_total'])
			->joinInner(['grid' => $this->resource->getTableName('sales_order_grid')], 'o.entity_id = grid.entity_id', ['shipping_name'])
			->where('o.status = ?', 'complete');
		      
		      return $connection->fetchAll($select);
		    }
		  }
		  ```
	-
	- ## 9. Product Repository Save Wrapper
		- Programmatically loads, modifies, and saves products:
		- ```php
		  namespace Vendor\Ecomm\Model;
		  
		  use Magento\Catalog\Api\ProductRepositoryInterface;
		  
		  class ProductModifier {
		    protected $productRepository;
		  
		    public function __construct(ProductRepositoryInterface $productRepository) {
		      $this->productRepository = $productRepository;
		    }
		  
		    public function updatePrice($sku, $newPrice) {
		      $product = $this->productRepository->get($sku);
		      $product->setPrice($newPrice);
		      return $this->productRepository->save($product);
		    }
		  }
		  ```
	-
	- ## 10. Multi-Store Config value Reader
		- Dynamic config values fetcher:
		- ```php
		  namespace Vendor\Ecomm\Helper;
		  
		  use Magento\Framework\App\Config\ScopeConfigInterface;
		  use Magento\Store\Model\ScopeInterface;
		  
		  class DataConfig {
		    protected $scopeConfig;
		  
		    public function __construct(ScopeConfigInterface $scopeConfig) {
		      $this->scopeConfig = $scopeConfig;
		    }
		  
		    public function getStoreContactEmail() {
		      return $this->scopeConfig->getValue(
			'trans_email/ident_contact/email',
			ScopeInterface::SCOPE_STORE
		      );
		    }
		  }
		  ```
	-
	- ## 11. Rest Web API interface Class
		- Registers service contract methods mapping to REST parameters:
		- ```php
		  namespace Vendor\Ecomm\Api;
		  
		  interface RecordRepositoryInterface {
		    /**
		     * Get record by ID.
		     *
		     * @param int $id
		     * @return \Vendor\Ecomm\Api\Data\RecordInterface
		     */
		    public function getById($id);
		  }
		  ```
	-
	- ## 12. Model Data Loader Factories
		- Instantiates transient data models using factories:
		- ```php
		  namespace Vendor\Ecomm\Model;
		  
		  class ModelLoader {
		    protected $recordFactory;
		  
		    public function __construct(RecordFactory $recordFactory) {
		      $this->recordFactory = $recordFactory;
		    }
		  
		    public function loadRecord($id) {
		      $record = $this->recordFactory->create();
		      $record->load($id);
		      return $record;
		    }
		  }
		  ```
	-
	- ## 13. Block rendering Template Controller
		- Simple controller returning a layout page:
		- ```php
		  namespace Vendor\Ecomm\Controller\Page;
		  
		  use Magento\Framework\App\Action\HttpGetActionInterface;
		  use Magento\Framework\View\Result\PageFactory;
		  
		  class View implements HttpGetActionInterface {
		    protected $resultPageFactory;
		  
		    public function __construct(PageFactory $resultPageFactory) {
		      $this->resultPageFactory = $resultPageFactory;
		    }
		  
		    public function execute() {
		      // Renders layout template layout.xml file automatically
		      return $this->resultPageFactory->create();
		    }
		  }
		  ```
	-
	- ## 14. E-commerce Cart clear helper
		- Programmatically clears all items inside the active cart:
		- ```php
		  namespace Vendor\Ecomm\Model;
		  
		  use Magento\Checkout\Model\Cart;
		  
		  class CartCleaner {
		    protected $cart;
		  
		    public function __construct(Cart $cart) {
		      $this->cart = $cart;
		    }
		  
		    public function truncateCart() {
		      $this->cart->truncate()->save();
		    }
		  }
		  ```
	-
	- ## 15. Form validation token helper
		- Form key protection checker in controllers:
		- ```php
		  namespace Vendor\Ecomm\Controller\Validate;
		  
		  use Magento\Framework\App\Action\HttpPostActionInterface;
		  use Magento\Framework\App\RequestInterface;
		  use Magento\Framework\Data\Form\FormKey\Validator;
		  
		  class FormSubmit implements HttpPostActionInterface {
		    protected $request;
		    protected $formKeyValidator;
		  
		    public function __construct(RequestInterface $request, Validator $formKeyValidator) {
		      $this->request = $request;
		      $this->formKeyValidator = $formKeyValidator;
		    }
		  
		    public function execute() {
		      if (!$this->formKeyValidator->validate($this->request)) {
			throw new \Magento\Framework\Exception\LocalizedException(__('Invalid Form Key submitted.'));
		      }
		    }
		  }
		  ```
	-
	- ## 16. Localized Currency Conversion Utility
		- Formats currency amounts dynamically:
		- ```php
		  namespace Vendor\Ecomm\Helper;
		  
		  use Magento\Directory\Model\Currency;
		  
		  class CurrencyFormatter {
		    protected $currency;
		  
		    public function __construct(Currency $currency) {
		      $this->currency = $currency;
		    }
		  
		    public function formatPrice($amount) {
		      return $this->currency->format($amount, [], false);
		    }
		  }
		  ```
	-
	- ## 17. Scroll-To Page View block
		- PHTML template script:
		- ```html
		  <button id="scrollToTopBtn" class="action primary">Back to Top</button>
		  <script>
		      require(['jquery'], function($) {
			  $('#scrollToTopBtn').click(function() {
			      $('html, body').animate({scrollTop: 0}, 'smooth');
			  });
		      });
		  </script>
		  ```
	-
	- ## 18. Dynamic Repeater layout block
		- XML block layout:
		- ```xml
		  <block class="Magento\Framework\View\Element\Template" name="custom.repeater.list" template="Vendor_Ecomm::html/list.phtml"/>
		  ```
	-
	- ## 19. External API Client Proxy
		- Sends order details to an external ERP backend:
		- ```php
		  namespace Vendor\Ecomm\Model;
		  
		  use Magento\Framework\HTTP\Client\Curl;
		  
		  class ERPProxy {
		    protected $curl;
		  
		    public function __construct(Curl $curl) {
		      $this->curl = $curl;
		    }
		  
		    public function syncOrderData($payload) {
		      $this->curl->setOption(CURLOPT_TIMEOUT, 10);
		      $this->curl->post('https://erp.example.com/api/orders', json_encode($payload));
		      return $this->curl->getBody();
		    }
		  }
		  ```
	-
	- ## 20. Webhook Signature Check
		- Validates incoming API request authorization headers:
		- ```php
		  namespace Vendor\Ecomm\Model;
		  
		  class WebhookValidator {
		    public function isRequestValid($headerKey, $payload, $secret) {
		      $expected = hash_hmac('sha256', $payload, $secret);
		      return hash_equals($expected, $headerKey);
		    }
		  }
		  ```
	-
	- ## 21. Custom Element UI layout block
		- PHTML template mapping:
		- ```html
		  <div class="custom-element-wrapper">
		      <h3>Custom Javascript Widget</h3>
		      <div id="target-custom-widget"></div>
		  </div>
		  <script>
		      require(['jquery'], function($) {
			  $('#target-custom-widget').html('<p>Dynamically loaded custom component.</p>');
		      });
		  </script>
		  ```
	-
	- ## 22. Dynamic Menu Dropdown block
		- Navigation loop helper:
		- ```html
		  <ul class="custom-navigation-menu">
		      <?php foreach ($block->getMenuItems() as $item): ?>
			  <li class="menu-item">
			      <a href="<?= $block->escapeUrl($item->getUrl()) ?>"><?= $block->escapeHtml($item->getLabel()) ?></a>
			  </li>
		      <?php endforeach; ?>
		  </ul>
		  ```
	-
	- ## 23. Direct Commerce Cart Redirector Controller
		- Send users to cart in PHP:
		- ```php
		  namespace Vendor\Ecomm\Controller\Redirect;
		  
		  use Magento\Framework\App\Action\HttpGetActionInterface;
		  use Magento\Framework\Controller\Result\RedirectFactory;
		  
		  class Cart implements HttpGetActionInterface {
		    protected $redirectFactory;
		  
		    public function __construct(RedirectFactory $redirectFactory) {
		      $this->redirectFactory = $redirectFactory;
		    }
		  
		    public function execute() {
		      $redirect = $this->redirectFactory->create();
		      return $redirect->setPath('checkout/cart');
		    }
		  }
		  ```
	-
	- ## 24. Less CSS fluid layout
		- Layout styles:
		- ```less
		  .flex-grid-catalog {
		    display: flex;
		    flex-flow: row wrap;
		    justify-content: flex-start;
		    gap: 20px;
		  }
		  ```
	-
	- ## 25. Static Site Title Injector
		- layout page title config:
		- ```xml
		  <head>
		      <title>Default Custom Storefront Title</title>
		  </head>
		  ```
-
- # More Learn
	- ## Developer Documentation & Reference Manuals
		- [Adobe Commerce Developer Documentation](https://developer.adobe.com/commerce/docs/)
		- [Magento 2 GitHub Source Repository](https://github.com/magento/magento2)
		- [Magento CLI Command Reference manual](https://experienceleague.adobe.com/docs/commerce-operations/configuration-guide/cli/overview.html)
		- [Magento Dependency Injection Container documentation](https://developer.adobe.com/commerce/php/development/components/dependency-injection/)
		- [Magento EAV Database Model Reference guide](https://developer.adobe.com/commerce/php/development/components/database/)
		- [Varnish Full Page Cache configuration guides](https://experienceleague.adobe.com/docs/commerce-operations/configuration-guide/cache/varnish/config-varnish.html)
		- [Magento Stack Exchange community portal](https://magento.stackexchange.com/)
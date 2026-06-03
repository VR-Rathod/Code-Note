---
seoTitle: Drupal Developer Reference – Core Architecture, Custom Modules, and Twig Themes
description: "Comprehensive Drupal developer reference guide covering basic to super-advanced concepts. Features Symfony components, custom modules, entity API, configuration sync, database API, Twig engine, cache metadata, security, testing, and Drush CLI."
keywords: "Drupal, Drupal 10, Drupal 11, Symfony, Twig, PHP CMS, Custom Module, Theme Development, Entity Query, Drush CLI, Caching, Headless Drupal, Configuration Management, Security, PHPUnit, VR-Rathod, Code-Note, code note vr, vr book"
comments: true
displayTitle: Drupal Developer Guide
---

> [!info] What is Drupal?
> **Drupal** is an enterprise-grade, open-source Content Management System (CMS) and application framework built on PHP and modern Symfony components. Known for its robust entity system, advanced caching layers, and strict security guidelines, Drupal is designed to power complex, high-traffic web platforms that require complex content architectures, decoupled frameworks, and granular access controls.

- # History & Evolution Timeline
  collapsed:: true
	- **Evolution Paradigm**: Drupal has undergone a significant architectural shift, evolving from a simple procedural message board to a modern, decoupled-ready PHP enterprise framework.
	-
	- ## Version Timeline
		- **Drupal 1.0 to 4.x (2001–2003)**:
			- Simple PHP script created by **Dries Buytaert** for a dormitory message board.
			- Introduced modularity (hooks) and basic categorization (taxonomy).
		- **Drupal 5.0 to 6.x (2007–2008)**:
			- Introduced jQuery into core, custom menu systems, and advanced installation profiles.
			- Focus shifted toward improving usability and performance.
		- **Drupal 7.x (2011)**:
			- The peak of procedural Drupal development.
			- Introduced the database abstraction layer, theme engines, and the Field API into core.
			- Relied heavily on global procedural hooks, creating massive `.module` files that were difficult to unit test.
		- **Drupal 8.x (2015)**:
			- A complete architectural rewrite: **"Proudly Found Elsewhere"** became the philosophy.
			- Replaced legacy procedural routing and database wrappers with **Symfony components** (routing, HTTPKernel, EventDispatcher, Yaml, Dependency Injection container).
			- Introduced Twig as the templating engine, native configuration management, and the Entity API.
		- **Drupal 9.x to 10.x (2020–2023)**:
			- Normalized clean deprecation paths. Drupal 9 removed deprecated code from Drupal 8, and Drupal 10 removed deprecated code from Drupal 9.
			- Switched to PHP 8.1+ features, Symfony 6, Twig 3, and modern JavaScript architectures (removing jQuery dependencies in favor of modern ES6 standards).
			- Introduced Single Directory Components (SDC) for theme modularity.
		- **Drupal 11.x (2024+)**:
			- Focuses on "Starshot" (recipes for easy deployment), enhanced headless capabilities, and performance optimizations.
-
- # Core Philosophy & Symfony Architecture
  collapsed:: true
	- Modern Drupal is built on top of Symfony, utilizing Object-Oriented Programming (OOP) and Dependency Injection (DI).
	-
	- ## Request-Response Lifecycle
		- Every request sent to a Drupal application triggers a pipeline managed by Symfony's `HttpKernel`:
		- ```mermaid
		  sequenceDiagram
		      autonumber
		      Client->>index.php: HTTP Request
		      index.php->>Composer: Load Autoloader
		      index.php->>Drupal Kernel: boot()
		      Drupal Kernel->>Service Container: Compile Services
		      Drupal Kernel->>HttpKernel: handle(Request)
		      HttpKernel->>Routing System: Match URL path
		      Routing System->>Controller: Route matches controller class
		      Controller->>Service Container: Request required services (DI)
		      Controller->>Controller: Execute business logic
		      Controller->>Twig Engine: Render template arrays
		      Controller->>HttpKernel: Return Response object
		      HttpKernel->>Client: Send HTTP Response (HTML, JSON)
		  ```
	-
	- ## The Service Container (Dependency Injection)
		- Decouples logic by registering classes as services in `*.services.yml` files.
		- Avoid calling services statically using `\Drupal::service('name')` inside classes. Instead, use constructor injection to improve testability and loose coupling.
		-
		- **Static Access (Avoid in classes, use only in hook files)**:
			- ```php
			  $database = \Drupal::database();
			  $currentUser = \Drupal::currentUser();
			  $dateFormatter = \Drupal::service('date.formatter');
			  ```
		-
		- **Dependency Injection (Injecting services into custom classes)**:
			- ```php
			  namespace Drupal\my_module\Service;
			  
			  use Drupal\Core\Database\Connection;
			  use Drupal\Core\Session\AccountProxyInterface;
			  
			  class CustomLogManager {
			    protected $database;
			    protected $currentUser;
			  
			    // Services are passed directly via the constructor
			    public function __construct(Connection $database, AccountProxyInterface $currentUser) {
			      $this->database = $database;
			      $this->currentUser = $currentUser;
			    }
			  
			    public function logAction($action) {
			      $this->database->insert('my_custom_log_table')
			        ->fields([
			          'uid' => $this->currentUser->id(),
			          'action' => $action,
			          'timestamp' => time(),
			        ])
			        ->execute();
			    }
			  }
			  ```
-
- # Basic Content Modeling
  collapsed:: true
	- Content modeling is the process of structuring content so it can be reused across different displays and channels.
	-
	- ## Content Types (Node Bundles)
		- A Content Type represents a structural type of document (e.g., Article, Press Release, Event, Page).
		- Content types consist of **Fields** (data properties) mapped using form displays and layout templates.
	-
	- ## Fields API Architecture
		- Fields in Drupal are split into:
			- **Field Storage (Base Definition)**: Declares the data type and settings (e.g., table structure, cardinality, translatability). Shared globally.
			- **Field Instance (Bundle Context)**: Declares the settings applied to a specific content type (e.g., label, help text, default value, required status).
		-
		- **Field Cardinality**: Defines the number of values a field can store (e.g., Single value, limit of 3, or Unlimited).
		- **Field Widgets**: The form input element displayed to content editors when editing (e.g., Textfield, Select List, Autocomplete, Rich Text WYSIWYG).
		- **Field Formatters**: The visual output formatter rendered to end-users (e.g., Plain Text, Linked URL, Trimmed HTML, Responsive Image).
	-
	- ## Taxonomy (Classification)
		- Used to categorize and tag content.
		- **Vocabularies**: The container containing classification terms (e.g., Tags, Categories, Departments, Regions).
		- **Terms**: Individual classification tags within a vocabulary. Terms can be nested hierarchically.
	-
	- ## Blocks (Layout Components)
		- Reusable units of content placed in theme regions (e.g., Sidebar, Header, Footer).
		- **Block Types**: Custom block definitions with unique fields (similar to content types).
		- **Block Instances**: Placed on pages using visibility conditions (e.g., show only on `/news/*` pages for certain user roles).
	-
	- ## Media Library & Responsive Images
		- Drupal manages assets using a dedicated **Media Entity** system, treating files (images, audio, video, remote YouTube URLs) as fieldable objects.
		- **Responsive Image Styles**: Maps CSS media queries to designated Drupal image styles, allowing the browser to load optimized images based on screen sizes (`srcset`).
-
- # Site Building Engines
  collapsed:: true
	- Drupal provides powerful visual site builders in core, reducing the need to write custom database queries or page layout code.
	-
	- ## Views Engine
		- A visual SQL query builder. Allows fetching, formatting, and displaying content entities based on complex filter criteria.
		-
		- ### Key Views Configurations
			- **Displays**: Renders the same query in different formats:
				- **Page**: Generates an accessible webpage at a specific URL route (e.g., `/articles`).
				- **Block**: Renders the view as a block placeable in regions.
				- **REST Export**: Outputs the query as raw JSON/XML data.
				- **Feed**: Outputs RSS xml feeds.
			- **Filters & Sort Criteria**: Filters content based on attributes (e.g., Published = True, Type = Article) and controls ordering (e.g., Created Date DESC).
			- **Contextual Filters (Dynamic arguments)**: Allows views to receive parameters from the URL path (e.g., filter content based on the Category ID passed as page argument `/category/%`).
			- **Relationships (SQL Joins)**: Joins related entities (e.g., pull author user information into a node view via the user reference field).
	-
	- ## Webform Engine
		- Used to design forms, surveys, and applications directly from the UI.
		- Features submission tracking, email notifications, data export (CSV/Excel), and customizable validation rules.
	-
	- ## Layout Builder
		- A visual drag-and-drop page builder in core.
		- Allows site builders to design page layouts using multi-column sections and blocks.
		- Can define a global layout template for a content type or allow editors to override the layout per individual node.
-
- # Programmatic Entity API
  collapsed:: true
	- Entities are the unified model representing all system data.
	-
	- ## Content Entities vs. Configuration Entities
		- **Content Entities**: Holds operational data, mapped to database tables, revisionable, and translatable.
		- **Configuration Entities**: Stores architectural configurations, exported to YAML files, synced via Git.
		-
		- | Feature | Content Entities (e.g., Node, User) | Configuration Entities (e.g., View, ContentType) |
		  |---|---|---|
		  | **Base Class** | `\Drupal\Core\Entity\ContentEntityBase` | `\Drupal\Core\Config\Entity\ConfigEntityBase` |
		  | **Storage** | Dynamic Database Tables (Field API) | Active Config Table / Disk YAML Files |
		  | **Revisions** | Supported out of the box | Not supported |
		  | **Translation**| Supported at the field level | Handled via Config Translation API |
	-
	- ## Defining a Custom Content Entity Class
		- Custom entities are declared using PHP **Annotations** inside the class docblock:
		- ```php
		  namespace Drupal\custom_entity\Entity;
		  
		  use Drupal\Core\Entity\ContentEntityBase;
		  use Drupal\Core\Entity\EntityTypeInterface;
		  use Drupal\Core\Field\BaseFieldDefinition;
		  
		  /**
		   * Defines the custom Ticket entity.
		   *
		   * @ContentEntityType(
		   *   id = "custom_ticket",
		   *   label = @Translation("Ticket"),
		   *   base_table = "custom_ticket",
		   *   entity_keys = {
		   *     "id" = "id",
		   *     "uuid" = "uuid",
		   *     "label" = "title",
		   *     "langcode" = "langcode",
		   *   },
		   *   handlers = {
		   *     "view_builder" = "Drupal\Core\Entity\EntityViewBuilder",
		   *     "storage" = "Drupal\Core\Entity\Sql\SqlContentEntityStorage",
		   *   }
		   * )
		   */
		  class Ticket extends ContentEntityBase {
		  
		    /**
		     * Defines the structure of the entity properties (fields).
		     */
		    public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
		      $fields = parent::baseFieldDefinitions($entity_type);
		  
		      // Add custom fields mapping directly to the DB table schema
		      $fields['title'] = BaseFieldDefinition::create('string')
		        ->setLabel(t('Ticket Title'))
		        ->setRequired(TRUE)
		        ->setSetting('max_length', 255)
		        ->setDisplayOptions('view', [
		          'label' => 'hidden',
		          'type' => 'string',
		          'weight' => -5,
		        ])
		        ->setDisplayOptions('form', [
		          'type' => 'string_textfield',
		          'weight' => -5,
		        ]);
		  
		      $fields['status'] = BaseFieldDefinition::create('boolean')
		        ->setLabel(t('Resolved Status'))
		        ->setDefaultValue(FALSE);
		  
		      return $fields;
		    }
		  }
		  ```
	-
	- ## Entity Query API (Fetching Data)
		- Allows querying database content without writing raw SQL. The query automatically respects translation and access control rules.
		- ```php
		  // Get the entity query factory
		  $query = \Drupal::entityQuery('node')
		    ->condition('status', 1)                          // Published nodes
		    ->condition('type', 'article')                    // Mapped to article bundle
		    ->condition('field_tags.entity.name', 'Security') // Related term condition
		    ->sort('created', 'DESC')                         // Order by created date
		    ->range(0, 10)                                    // Limit results to 10
		    ->accessCheck(TRUE);                              // Apply node access checks (Required)
		  
		  $nids = $query->execute();
		  ```
	-
	- ## Entity CRUD Operations
		- Programmatically creating, reading, updating, and deleting entities:
		- ```php
		  use Drupal\node\Entity\Node;
		  
		  // 1. CREATE
		  $node = Node::create([
		    'type' => 'article',
		    'title' => 'Programmatic Drupal Article',
		    'body' => [
		      'value' => '<p>Written programmatically via the Entity API.</p>',
		      'format' => 'basic_html',
		    ],
		    'uid' => 1,
		  ]);
		  $node->save(); // Persists to database
		  
		  // 2. READ
		  $nid = $node->id();
		  $loaded_node = Node::load($nid);
		  $title = $loaded_node->label(); // "Programmatic Drupal Article"
		  
		  // 3. UPDATE
		  $loaded_node->setTitle('Updated Article Title');
		  $loaded_node->set('field_subtitle', 'Custom subtitle value');
		  $loaded_node->save(); // Saves changes as new revision or updates existing row
		  
		  // 4. DELETE
		  $loaded_node->delete(); // Removes all database row entries cleanly
		  ```
-
- # Custom Module Development (Deep Dive)
  collapsed:: true
	- Custom modules allow extending core logic, hooks, routing pathways, forms, and services.
	- Let's construct a complete custom module named `custom_portal` step-by-step.
	-
	- ## 1. Module Info File (`custom_portal.info.yml`)
		- Declares the module to the Drupal core system.
		- ```yaml
		  name: 'Custom Portal Services'
		  type: module
		  description: 'Extends routing, configuration forms, blocks, and services for custom portals.'
		  package: Custom
		  core_version_requirement: ^9.5 || ^10 || ^11
		  dependencies:
		    - drupal:node
		    - drupal:datetime
		  ```
	-
	- ## 2. Routing File (`custom_portal.routing.yml`)
		- Defines endpoints, controller mappings, and security access parameters.
		- ```yaml
		  # Admin Configuration Route
		  custom_portal.admin_settings:
		    path: '/admin/config/services/portal-settings'
		    defaults:
		      _form: '\Drupal\custom_portal\Form\PortalSettingsForm'
		      _title: 'Portal Application Settings'
		    requirements:
		      _permission: 'administer site configuration'
		  
		  # Dynamic REST-style Page Route
		  custom_portal.user_status:
		    path: '/portal/user/{uid}/status'
		    defaults:
		      _controller: '\Drupal\custom_portal\Controller\UserPortalController::renderStatus'
		      _title: 'User Portal Dashboard'
		    requirements:
		      _permission: 'access content'
		      uid: '\d+' # Regex to restrict parameter to integer values
		  ```
	-
	- ## 3. Service Declaration File (`custom_portal.services.yml`)
		- Declares custom business logic helper classes to the dependency injection container.
		- ```yaml
		  services:
		    custom_portal.calculator:
		      class: Drupal\custom_portal\Service\PortalCalculator
		      arguments: ['@database', '@current_user']
		  ```
	-
	- ## 4. Custom Service Implementation (`src/Service/PortalCalculator.php`)
		- ```php
		  <?php
		  
		  namespace Drupal\custom_portal\Service;
		  
		  use Drupal\Core\Database\Connection;
		  use Drupal\Core\Session\AccountInterface;
		  
		  class PortalCalculator {
		    protected $database;
		    protected $currentUser;
		  
		    public function __construct(Connection $database, AccountInterface $currentUser) {
		      $this->database = $database;
		      $this->currentUser = $currentUser;
		    }
		  
		    public function getUserSubmissionsCount() {
		      $query = $this->database->select('node_field_data', 'n')
		        ->fields('n', ['nid'])
		        ->condition('uid', $this->currentUser->id());
		      return count($query->execute()->fetchAll());
		    }
		  }
		  ```
	-
	- ## 5. Dependency-Injected Controller (`src/Controller/UserPortalController.php`)
		- ```php
		  <?php
		  
		  namespace Drupal\custom_portal\Controller;
		  
		  use Drupal\Core\Controller\ControllerBase;
		  use Drupal\custom_portal\Service\PortalCalculator;
		  use Symfony\Component\DependencyInjection\ContainerInterface;
		  use Symfony\Component\HttpFoundation\JsonResponse;
		  
		  class UserPortalController extends ControllerBase {
		    protected $calculator;
		  
		    // 1. Inject custom services using class constructor
		    public function __construct(PortalCalculator $calculator) {
		      $this->calculator = $calculator;
		    }
		  
		    // 2. Factory method to load services from the Container
		    public static function create(ContainerInterface $container) {
		      return new static(
		        $container->get('custom_portal.calculator')
		      );
		    }
		  
		    // 3. Page render callback method
		    public function renderStatus($uid) {
		      $count = $this->calculator->getUserSubmissionsCount();
		      return new JsonResponse([
		        'user_id' => (int) $uid,
		        'total_submissions' => $count,
		        'message' => $this->t('User has submitted @count articles.', ['@count' => $count]),
		      ]);
		    }
		  }
		  ```
	-
	- ## 6. Configuration Settings Form API (`src/Form/PortalSettingsForm.php`)
		- Creates a settings form that stores variables inside the active configuration system.
		- ```php
		  <?php
		  
		  namespace Drupal\custom_portal\Form;
		  
		  use Drupal\Core\Form\ConfigFormBase;
		  use Drupal\Core\Form\FormStateInterface;
		  
		  class PortalSettingsForm extends ConfigFormBase {
		  
		    protected function getEditableConfigNames() {
		      return ['custom_portal.settings'];
		    }
		  
		    public function getFormId() {
		      return 'custom_portal_settings_form';
		    }
		  
		    public function buildForm(array $form, FormStateInterface $form_state) {
		      $config = $this->config('custom_portal.settings');
		  
		      $form['api_endpoint'] = [
		        '#type' => 'url',
		        '#title' => $this->t('External API Endpoint'),
		        '#default_value' => $config->get('api_endpoint') ?? 'https://api.example.com',
		        '#required' => TRUE,
		      ];
		  
		      $form['max_items'] = [
		        '#type' => 'number',
		        '#title' => $this->t('Max Portal Items'),
		        '#default_value' => $config->get('max_items') ?? 10,
		        '#min' => 1,
		      ];
		  
		      return parent::buildForm($form, $form_state);
		    }
		  
		    public function validateForm(array &$form, FormStateInterface $form_state) {
		      if ($form_state->getValue('max_items') > 100) {
		        $form_state->setErrorByName('max_items', $this->t('Max portal items cannot exceed 100 due to performance bounds.'));
		      }
		    }
		  
		    public function submitForm(array &$form, FormStateInterface $form_state) {
		      $this->config('custom_portal.settings')
		        ->set('api_endpoint', $form_state->getValue('api_endpoint'))
		        ->set('max_items', $form_state->getValue('max_items'))
		        ->save();
		  
		      parent::submitForm($form, $form_state);
		    }
		  }
		  ```
	-
	- ## 7. Custom Block Plugin with Caching (`src/Plugin/Block/CustomStatBlock.php`)
		- Block plugins are instantiated via annotations:
		- ```php
		  <?php
		  
		  namespace Drupal\custom_portal\Plugin\Block;
		  
		  use Drupal\Core\Block\BlockBase;
		  use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
		  use Symfony\Component\DependencyInjection\ContainerInterface;
		  use Drupal\custom_portal\Service\PortalCalculator;
		  
		  /**
		   * Provides a portal stats dashboard block.
		   *
		   * @Block(
		   *   id = "custom_portal_stat_block",
		   *   admin_label = @Translation("Portal Submission Stats Block"),
		   *   category = @Translation("Custom Portal")
		   * )
		   */
		  class CustomStatBlock extends BlockBase implements ContainerFactoryPluginInterface {
		    protected $calculator;
		  
		    public function __construct(array $configuration, $plugin_id, $plugin_definition, PortalCalculator $calculator) {
		      parent::__construct($configuration, $plugin_id, $plugin_definition);
		      $this->calculator = $calculator;
		    }
		  
		    public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
		      return new static(
		        $configuration,
		        $plugin_id,
		        $plugin_definition,
		        $container->get('custom_portal.calculator')
		      );
		    }
		  
		    public function build() {
		      $submissions = $this->calculator->getUserSubmissionsCount();
		      return [
		        '#type' => 'container',
		        '#attributes' => ['class' => ['portal-stat-wrapper']],
		        'markup' => [
		          '#markup' => '<div class="stat-count">Total submissions: ' . $submissions . '</div>',
		        ],
		      ];
		    }
		  
		    // Declare block caching parameters
		    public function getCacheContexts() {
		      // Block output varies per logged-in user session
		      return ['user'];
		    }
		  }
		  ```
-
- # Theme Development & Twig Templating
  collapsed:: true
	- Theme architectures isolate the HTML structure, stylesheet styling, and javascript files.
	-
	- ## Theme Descriptor File (`custom_theme.info.yml`)
		- Declares the active base theme, libraries, and page regions:
		- ```yaml
		  name: 'Developer Reference Theme'
		  type: theme
		  description: 'Custom frontend sub-theme built over core stable9 system.'
		  base theme: stable9
		  core_version_requirement: ^9.5 || ^10 || ^11
		  
		  libraries:
		    - custom_theme/global-styling
		    - custom_theme/tailwind-build
		  
		  regions:
		    header: 'Site Header'
		    navigation: 'Primary Navigation Menu'
		    highlighted: 'Highlighted Messages'
		    content: 'Main Page Content'
		    sidebar_first: 'Sidebar Navigation Area'
		    footer: 'Site Footer'
		  ```
	-
	- ## Theme Asset Libraries (`custom_theme.libraries.yml`)
		- Defines paths, mapping dependencies, and loading priorities:
		- ```yaml
		  global-styling:
		    css:
		      theme:
		        css/base-variables.css: {}
		        css/typography.css: {}
		    js:
		      js/interactive-menu.js: {}
		    dependencies:
		      - core/drupal
		      - core/jquery
		  
		  tailwind-build:
		    css:
		      theme:
		        dist/output.css: { minified: true }
		  ```
	-
	- ## The Preprocessing Hook System (`custom_theme.theme`)
		- Procedural PHP hooks used to alter variables before they are injected into Twig:
		- ```php
		  <?php
		  
		  /**
		   * Implements hook_preprocess_page().
		   */
		  function custom_theme_preprocess_page(&$variables) {
		    // 1. Inject variables globally into page.html.twig
		    $variables['current_year'] = date('Y');
		    $variables['is_front_page'] = \Drupal::service('path.matcher')->isFrontPage();
		  
		    // 2. Load custom libraries on demand
		    if ($variables['is_front_page']) {
		      $variables['#attached']['library'][] = 'custom_theme/homepage-animations';
		    }
		  }
		  
		  /**
		   * Implements hook_preprocess_node().
		   */
		  function custom_theme_preprocess_node(&$variables) {
		    $node = $variables['node'];
		    // Add responsive wrapper classes to all nodes
		    $variables['attributes']['class'][] = 'node-rendering-wrapper';
		    
		    // Inject reading time estimate
		    $body = $node->get('body')->value;
		    $word_count = str_word_count(strip_tags($body));
		    $variables['read_time'] = ceil($word_count / 200) . ' min read';
		  }
		  ```
	-
	- ## Twig Templating Language
		- Drupal maps layouts using nested `.html.twig` templates based on strict naming fallback rules:
		-
		- ### Twig Naming Conventions (Suggestions Engine)
			- **Page layouts**: `page--[content-type].html.twig` (e.g. `page--article.html.twig`) ➔ `page.html.twig`
			- **Nodes**: `node--[nid]--[view-mode].html.twig` ➔ `node--[content-type].html.twig` ➔ `node.html.twig`
			- **Fields**: `field--[field-name]--[content-type].html.twig` ➔ `field--[field-name].html.twig` ➔ `field.html.twig`
		-
		- ### Twig Template Code Example (`templates/node--article--full.html.twig`)
			- ```twig
			  {# Base article card styling wrapper #}
			  <article{{ attributes.addClass('article-full', 'shadow-lg', 'rounded-lg') }}>
			    <header class="mb-6">
			      {# Renders node title string #}
			      <h1 class="text-3xl font-extrabold text-blue-900">{{ label }}</h1>
			      
			      <div class="meta-wrapper flex space-x-2 text-sm text-gray-500">
			        <span>By: {{ author_name }}</span>
			        <span>•</span>
			        <span>{{ date }}</span>
			        <span>•</span>
			        <span class="badge">{{ read_time }}</span>
			      </div>
			    </header>
			  
			    {# Render core fields, excluding custom side bars to place manually #}
			    <div class="content-body prose max-w-none mb-4">
			      {{ content|without('field_sidebar_notes', 'field_related_terms') }}
			    </div>
			  
			    {# Check field existence before rendering wrappers #}
			    {% if content.field_sidebar_notes|render %}
			      <aside class="sidebar-notes bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
			        <h3 class="font-bold mb-2">Author Highlights</h3>
			        {{ content.field_sidebar_notes }}
			      </aside>
			    {% endif %}
			  
			    <footer class="border-t pt-4">
			      {# Renders field tags #}
			      {% if content.field_related_terms|render %}
			        <div class="tags-list">
			          <span class="font-semibold">Tagged:</span>
			          {{ content.field_related_terms }}
			        </div>
			      {% endif %}
			    </footer>
			  </article>
			  ```
-
- # Event System & Hooks Details
  collapsed:: true
	- Modern Drupal bridges legacy procedural hook-based execution with Symfony's EventDispatcher system.
	-
	- ## Symfony Event Subscribers
		- System components dispatch events during critical states (e.g., config changes, user logins, routing).
		- To listen to an event, register a class in `{module_name}.services.yml` tagged with `event_subscriber`.
		-
		- ### Event Subscriber Class (`src/EventSubscriber/UserLoginSubscriber.php`)
			- ```php
			  <?php
			  
			  namespace Drupal\custom_portal\EventSubscriber;
			  
			  use Symfony\Component\EventDispatcher\EventSubscriberInterface;
			  use Symfony\Component\HttpKernel\KernelEvents;
			  use Symfony\Component\HttpKernel\Event\RequestEvent;
			  use Drupal\Core\Messenger\MessengerInterface;
			  
			  class UserLoginSubscriber implements EventSubscriberInterface {
			    protected $messenger;
			  
			    public function __construct(MessengerInterface $messenger) {
			      $this->messenger = $messenger;
			    }
			  
			    public static function getSubscribedEvents() {
			      // Listen to Symfony HTTP Request boot event
			      return [
			        KernelEvents::REQUEST => ['showUserAlert', 10],
			      ];
			    }
			  
			    public function showUserAlert(RequestEvent $event) {
			      $request = $event->getRequest();
			      // Output a temporary notification to users
			      if ($request->query->has('portal_alert')) {
			        $this->messenger->addWarning('You are currently viewing a custom user portal dashboard.');
			      }
			    }
			  }
			  ```
	-
	- ## Procedural Module Hooks
		- Hooks are procedural callback functions written in `.module` files. When Drupal executes an operation (like rendering a form or saving a node), it looks for matching function names:
		-
		- ### Module Entry File (`custom_portal.module`)
			- ```php
			  <?php
			  
			  use Drupal\Core\Form\FormStateInterface;
			  use Drupal\node\NodeInterface;
			  
			  /**
			   * Implements hook_form_alter().
			   * Modifies forms system-wide.
			   */
			  function custom_portal_form_alter(&$form, FormStateInterface $form_state, $form_id) {
			    if ($form_id === 'node_article_edit_form') {
			      // Alter form properties
			      $form['title']['widget'][0]['value']['#description'] = t('Ensure title contains keyword details.');
			    }
			  }
			  
			  /**
			   * Implements hook_node_presave().
			   * Triggers automatically before a node database entry is created or updated.
			   */
			  function custom_portal_node_presave(NodeInterface $node) {
			    if ($node->bundle() === 'article') {
			      // Automatically strip script tags from node title to prevent basic injection
			      $clean_title = strip_tags($node->getTitle());
			      $node->setTitle($clean_title);
			    }
			  }
			  ```
-
- # Database API & Query builder
  collapsed:: true
	- Drupal provides a database abstraction layer to guarantee cross-compatibility across database platforms (MySQL, PostgreSQL, SQLite).
	-
	- ## Schema API (`custom_portal.install`)
		- Used to create custom database tables during module installation:
		- ```php
		  <?php
		  
		  /**
		   * Implements hook_schema().
		   * Defines customized database structures.
		   */
		  function custom_portal_schema() {
		    $schema['custom_portal_metrics'] = [
		      'description' => 'Stores portal access log telemetry metrics.',
		      'fields' => [
		        'id' => [
		          'type' => 'serial',
		          'unsigned' => TRUE,
		          'not null' => TRUE,
		          'description' => 'Primary Key identifier',
		        ],
		        'uid' => [
		          'type' => 'int',
		          'unsigned' => TRUE,
		          'not null' => TRUE,
		          'default' => 0,
		        ],
		        'page_views' => [
		          'type' => 'int',
		          'not null' => TRUE,
		          'default' => 0,
		        ],
		      ],
		      'primary key' => ['id'],
		    ];
		    return $schema;
		  }
		  ```
	-
	- ## Dynamic SQL Select Queries
		- Programmatically joining tables, adding conditions, and ranges:
		- ```php
		  $database = \Drupal::database();
		  
		  // Build: SELECT nfd.nid, nfd.title, u.mail FROM node_field_data nfd INNER JOIN users_field_data u ON nfd.uid = u.uid WHERE type = :type LIMIT 10
		  $query = $database->select('node_field_data', 'nfd');
		  $query->innerJoin('users_field_data', 'u', 'nfd.uid = u.uid');
		  
		  $query->fields('nfd', ['nid', 'title'])
		    ->fields('u', ['mail'])
		    ->condition('nfd.type', 'article')
		    ->condition('nfd.status', 1)
		    ->range(0, 10);
		  
		  $result = $query->execute()->fetchAll();
		  
		  foreach ($result as $row) {
		    $title = $row->title;
		    $email = $row->mail;
		  }
		  ```
	-
	- ## Dynamic Mutation Queries (Insert, Update, Delete)
		- ```php
		  $database = \Drupal::database();
		  
		  // 1. INSERT
		  $database->insert('custom_portal_metrics')
		    ->fields([
		      'uid' => 12,
		      'page_views' => 1,
		    ])
		    ->execute();
		  
		  // 2. UPDATE
		  $database->update('custom_portal_metrics')
		    ->fields([
		      'page_views' => 5,
		    ])
		    ->condition('uid', 12)
		    ->execute();
		  
		  // 3. DELETE
		  $database->delete('custom_portal_metrics')
		    ->condition('uid', 12)
		    ->execute();
		  ```
	-
	- ## Database Transactions
		- Ensures atomic, consistent operations across multiple tables:
		- ```php
		  $connection = \Drupal::database();
		  
		  // Start the transaction transaction boundary
		  $transaction = $connection->startTransaction();
		  
		  try {
		    $connection->insert('custom_portal_metrics')->fields(['uid' => 1, 'page_views' => 1])->execute();
		    $connection->insert('another_table')->fields(['uid' => 1, 'logs' => 'Success'])->execute();
		  }
		  catch (\Exception $e) {
		    // Rollback changes if query failure occurs
		    $transaction->rollBack();
		    \Drupal::logger('database')->error('Transaction failed: @msg', ['@msg' => $e->getMessage()]);
		  }
		  ```
-
- # Configuration Management System
  collapsed:: true
	- Sync configurations (content types, field settings, displays) across staging environments without exporting databases.
	-
	- ## Directory Mapping (`settings.php`)
		- Declare configuration synchronizing folders in the settings file:
		- ```php
		  // Mapped config sync folder outside the public web root
		  $settings['config_sync_directory'] = '../config/sync';
		  ```
	-
	- ## Configuration Schema Validation (`config/schema/custom_portal.schema.yml`)
		- Configuration objects must have schemas to allow automated translation support:
		- ```yaml
		  custom_portal.settings:
		    type: config_object
		    label: 'Custom Portal Settings Settings'
		    mapping:
		      api_endpoint:
		        type: string
		        label: 'Api endpoint URL'
		      max_items:
		        type: integer
		        label: 'Max portal limit items'
		  ```
	-
	- ## Runtime Environment Settings Overrides
		- Override configuration settings dynamically without modifying database values:
		- ```php
		  // Overriding site system details for Staging environment
		  $config['system.site']['name'] = 'Staging Environment Portal';
		  $config['custom_portal.settings']['api_endpoint'] = 'https://staging-api.example.com';
		  ```
-
- # Headless & Decoupled Drupal
  collapsed:: true
	- Drupal can operate as a decoupled backend, serving JSON or GraphQL data payloads to frontend systems (Next.js, Gatsby, Vue, Mobile Apps).
	-
	- ## JSON:API Integration
		- Enable the core `jsonapi` module. It exposes all content types over standardized JSON endpoints.
		-
		- **Querying nodes via JSON:API**:
			- `GET /jsonapi/node/article`
		-
		- **Filtering JSON:API results dynamically**:
			- Exclude drafts and filter articles by specific taxonomy relationships:
			- `/jsonapi/node/article?filter[status][value]=1&filter[field_category.id][value]=uuid-value-here&include=field_image`
	-
	- ## Next.js Decoupled Fetch Example
		- A basic Javascript component fetching content from a Drupal backend:
		- ```javascript
		  export async function getStaticProps() {
		    const res = await fetch('https://drupal-backend.example.com/jsonapi/node/article?sort=-created&page[limit]=5');
		    const articles = await res.json();
		  
		    return {
		      props: {
		        posts: articles.data.map(node => ({
		          id: node.id,
		          title: node.attributes.title,
		          body: node.attributes.body.processed,
		        })),
		      },
		      revalidate: 60, // Revalidate cache hourly
		    };
		  }
		  
		  export default function Home({ posts }) {
		    return (
		      <div className="container mx-auto p-4">
		        <h1 className="text-3xl font-bold mb-4">Latest Articles</h1>
		        {posts.map(post => (
		          <div key={post.id} className="border-b p-4">
		            <h2>{post.title}</h2>
		            <div dangerouslySetInnerHTML={{ __html: post.body }} />
		          </div>
		        ))}
		      </div>
		    );
		  }
		  ```
-
- # Enterprise Caching & Performance
  collapsed:: true
	- Drupal implements a cache invalidation engine based on cache metadata: **Tags**, **Contexts**, and **Max-Age**.
	-
	- ## Caching Metadata Properties
		- **Cache Tags**: Defines *what* data is cached. (Invalidates cache upon entity update).
			- For example: `node:4`, `taxonomy_term:12`, `config:system.site`. Saving node #4 instantly purges its cache across the system and CDN.
		- **Cache Contexts**: Defines *who* sees the content or *when* (e.g. Dynamic variations).
			- For example: `user.roles`, `languages:language_interface`, `url.query_args`.
		- **Cache Max-Age**: Defines *how long* the cache lasts.
			- For example: `3600` (1 hour), `0` (never cache, completely dynamic).
	-
	- ## Render Cache Arrays (PHP)
		- Attach cache metadata directly to render outputs:
		- ```php
		  $build = [
		    '#theme' => 'my_custom_template',
		    '#content' => $data,
		    '#cache' => [
		      'contexts' => ['user.roles'],
		      'tags' => ['node_list', 'taxonomy_term:5'],
		      'max-age' => 86400, // 24 hours in seconds
		    ],
		  ];
		  ```
	-
	- ## Dynamic Cache Clears Programmatically
		- Forcefully invalidate specific cache keys in backend storage:
		- ```php
		  use Drupal\Core\Cache\Cache;
		  
		  // Clears all custom cached views and pages carrying the list tag
		  Cache::invalidateTags(['node:article:5', 'custom_dashboard_stats']);
		  ```
	-
	- ## Redis Backend Integration (`settings.php`)
		- Offload default database-backed caching to high-performance Redis cache:
		- ```php
		  if (extension_loaded('redis')) {
		    $settings['redis.connection']['interface'] = 'PhpRedis';
		    $settings['redis.connection']['host']      = '127.0.0.1';
		    $settings['redis.connection']['port']      = 6379;
		    
		    // Enable Redis for cache services
		    $settings['cache']['default'] = 'cache.backend.redis';
		    $container_yamls[] = 'modules/contrib/redis/example.services.yml';
		  }
		  ```
-
- # Security Best Practices
  collapsed:: true
	- Secure coding guidelines are built into core API modules to minimize injection and script vulnerabilities.
	-
	- ## Preventing XSS (Cross-Site Scripting)
		- **In PHP**: Escape output elements before displaying to screen.
			- ```php
			  use Drupal\Component\Utility\Html;
			  use Drupal\Component\Utility\Xss;
			  
			  // 1. Plain Text Escaping
			  $safe_text = Html::escape($user_input);
			  
			  // 2. Filter allowed HTML tags
			  $allowed_tags = ['a', 'em', 'strong'];
			  $clean_html = Xss::filter($user_input, $allowed_tags);
			  ```
		- **In Twig**: Twig automatically escapes variable rendering. If raw output is validated and clean, use the `raw` filter:
			- ```twig
			  {# Renders plain text as escaped HTML output #}
			  <div class="user-text">{{ user_comment }}</div>
			  
			  {# Renders sanitized html markup manually #}
			  <div class="sanitized-markup">{{ safe_markup|raw }}</div>
			  ```
	-
	- ## SQL Injection Prevention
		- Never concatenate raw strings inside Database select, update, or execute statements. Always use parameter tokens.
		-
		- **Vulnerable Code (DO NOT DO)**:
			- ```php
			  $connection->query("SELECT * FROM {node_field_data} WHERE title = '" . $user_input . "'");
			  ```
		- **Secure Parameterized Code**:
			- ```php
			  $connection->query("SELECT * FROM {node_field_data} WHERE title = :title", [
			    ':title' => $user_input,
			  ]);
			  ```
	-
	- ## Access Control Enforcement
		- Protect routes using custom Access Handlers:
		-
		- **Routing Definition (`custom_portal.routing.yml`)**:
			- ```yaml
			  custom_portal.secure_action:
			    path: '/portal/secure-action'
			    defaults:
			      _controller: '\Drupal\custom_portal\Controller\SecureController::run'
			    requirements:
			      _custom_access: '\Drupal\custom_portal\Controller\SecureController::access'
			  ```
		-
		- **Access Handler Code (`SecureController.php`)**:
			- ```php
			  use Drupal\Core\Access\AccessResult;
			  use Drupal\Core\Session\AccountInterface;
			  
			  public function access(AccountInterface $account) {
			    // Evaluate permissions dynamically
			    if ($account->hasPermission('access content') && $account->id() == 12) {
			      return AccessResult::allowed();
			    }
			    return AccessResult::forbidden('Access restricted to specific account holder.');
			  }
			  ```
-
- # Testing Framework
  collapsed:: true
	- Drupal provides a testing framework based on PHPUnit.
	-
	- ## 1. Unit Tests
		- Used to test simple functions and helper classes without loading the database or active configurations.
		- Extends `\Drupal\Tests\UnitTestCase`.
		- ```php
		  namespace Drupal\Tests\custom_portal\Unit;
		  
		  use Drupal\Tests\UnitTestCase;
		  use Drupal\custom_portal\Helper\MathHelper;
		  
		  class MathHelperTest extends UnitTestCase {
		    public function testAddition() {
		      $helper = new MathHelper();
		      $this->assertEquals(4, $helper->add(2, 2));
		    }
		  }
		  ```
	-
	- ## 2. Kernel Tests
		- Medium-weight testing. Boots a minimal Drupal kernel, installs a temporary database schema, and tests active entity queries.
		- Extends `\Drupal\KernelTests\KernelTestBase`.
		- ```php
		  namespace Drupal\Tests\custom_portal\Kernel;
		  
		  use Drupal\KernelTests\KernelTestBase;
		  use Drupal\node\Entity\Node;
		  
		  class NodeCrudKernelTest extends KernelTestBase {
		    protected static $modules = ['system', 'user', 'node', 'field'];
		  
		    protected function setUp(): void {
		      parent::setUp();
		      $this->installSchema('system', ['sequences']);
		      $this->installEntitySchema('user');
		      $this->installEntitySchema('node');
		    }
		  
		    public function testNodeCreation() {
		      $node = Node::create(['type' => 'article', 'title' => 'Test Article']);
		      $node->save();
		      $this->assertNotEmpty($node->id());
		    }
		  }
		  ```
	-
	- ## 3. Functional Browser Tests
		- Heavy-weight testing. Simulates a headless browser, accesses routing endpoints, submits forms, and validates HTML strings.
		- Extends `\Drupal\Tests\BrowserTestBase`.
		- ```php
		  namespace Drupal\Tests\custom_portal\Functional;
		  
		  use Drupal\Tests\BrowserTestBase;
		  
		  class PortalRoutingTest extends BrowserTestBase {
		    protected static $modules = ['custom_portal', 'node', 'user'];
		    protected $defaultTheme = 'stable9';
		  
		    public function testDashboardRoute() {
		      $admin_user = $this->drupalCreateUser(['administer site configuration']);
		      $this->drupalLogin($admin_user);
		      
		      $this->drupalGet('/admin/config/services/portal-settings');
		      $this->assertSession()->statusCodeEquals(200);
		      $this->assertSession()->pageTextContains('Portal Application Settings');
		    }
		  }
		  ```
-
- # Drush CLI Command Encyclopedia
  collapsed:: true
	- **Drush** (Drupal Shell) is a command-line interface used to manage, update, sync, and debug Drupal sites.
	-
	- ## Complete Drush Reference Table
		- | Category | Command | Alias | Description / Example Usage |
		  |---|---|---|---|
		  | **Cache** | `drush cache:rebuild` | `drush cr` | Rebuilds theme templates, routes, container files, and database cache indexes. |
		  | **Cache** | `drush cache:clear` | `drush cc` | Clears a specific cache bin (e.g., `drush cc render` or `drush cc css-js`). |
		  | **Config**| `drush config:export` | `drush cex` | Exports active database settings to disk YAML configuration files. |
		  | **Config**| `drush config:import` | `drush cim` | Imports YAML configuration files from disk to the active database. |
		  | **Config**| `drush config:get` | `drush cget`| Displays a specific configuration variable (e.g., `drush cget system.site name`). |
		  | **Config**| `drush config:set` | `drush cset`| Updates a configuration setting (e.g., `drush cset system.site name "New Site"`). |
		  | **Module**| `drush pm:enable` | `drush en` | Installs and enables a module (e.g., `drush en pathauto`). |
		  | **Module**| `drush pm:uninstall` | `drush pmu` | Uninstalls and removes configuration settings for a module (e.g., `drush pmu devel`). |
		  | **Module**| `drush pm:list` | `drush pml` | Lists all installed, enabled, and disabled modules. |
		  | **User** | `drush user:login` | `drush uli` | Generates a secure, one-time admin login link (e.g., `drush uli admin`). |
		  | **User** | `drush user:create` | `drush ucrt`| Creates a new user account (e.g., `drush ucrt devuser --mail="dev@example.com"`). |
		  | **User** | `drush user:role-add` | `drush urol`| Assigns a role to a user (e.g., `drush urol administrator devuser`). |
		  | **DB** | `drush updatedb` | `drush updb` | Runs pending database updates (triggers `hook_update_N`). |
		  | **DB** | `drush sql:cli` | `drush sqlc` | Opens a SQL command line interface connection to the database. |
		  | **DB** | `drush sql:dump` | `drush sqld` | Exports the database to a `.sql` file (e.g., `drush sqld --result-file=backup.sql`). |
		  | **System**| `drush status` | `drush st` | Displays database connections, Drupal version, PHP path, and theme statuses. |
		  | **System**| `drush watch-dog:show` | `drush ws` | Displays recent dblog system logs. |
		  | **System**| `drush queue:run` | `drush qr` | Processes items in a queued queue worker (e.g., `drush qr cron_mailer`). |
		  | **System**| `drush cron` | `drush cron`| Executes all scheduled cron hooks and tasks. |
-
- # Composer for Drupal Management
  collapsed:: true
	- Modern Drupal sites manage core and third-party dependencies using Composer.
	-
	- ## Useful Composer Commands
		- **Install a module and dependencies**:
			- `composer require drupal/pathauto`
		- **Update a specific module**:
			- `composer update drupal/webform --with-dependencies`
		- **Apply community patches automatically (`composer.json` configuration)**:
			- Add a patches mapping to apply bugfixes before compiling the autoload:
			- ```json
			  "extra": {
			      "patches": {
			          "drupal/core": {
			              "Fix routing performance bug": "https://www.drupal.org/files/issues/2023-05-12/33421-core-route-fix.patch"
			          }
			      }
			  }
			  ```
-
- # Multi-site Architecture
  collapsed:: true
	- Drupal allows running multiple separate websites using a single shared codebase (core files, contrib modules, themes), with each site having its own unique database, assets, and configuration.
	-
	- ## Configuration Settings
		- Multi-site mapping configurations are declared inside the `sites/sites.php` file:
		- ```php
		  <?php
		  // Maps domains to directories inside sites/
		  $sites['portal.example.com'] = 'portal';
		  $sites['admin.example.com'] = 'admin_portal';
		  ```
	-
	- ## File Layout
		- ```
		  ├── sites/
		  │   ├── sites.php             # Multi-site configuration mappings
		  │   ├── default/              # Default site folder
		  │   ├── portal/               # Custom files for portal.example.com
		  │   │   ├── settings.php      # Unique database connection settings
		  │   │   ├── services.yml      # Custom service configurations
		  │   │   └── files/            # Uploaded files for this site
		  │   └── admin_portal/         # Custom files for admin.example.com
		  │       ├── settings.php
		  │       └── files/
		  ```
-
- # Learning References
  collapsed:: true
	- ## Documentation Directories & Handbooks
		- [Drupal Core API Reference Index](https://api.drupal.org/api/drupal)
		- [Symfony components integration in Drupal](https://www.drupal.org/docs/develop/standards/symfony-in-drupal)
		- [Drupal Twig Templates Theming Guide](https://www.drupal.org/docs/develop/theming-drupal)
		- [JSON:API Core API specifications](https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module)
		- [Drush CLI Command Reference Guide](https://www.drush.org)
		- [Security Advisory Notices & Policies](https://www.drupal.org/security)
		- [PHPUnit Testing in Drupal](https://www.drupal.org/docs/develop/automated-testing/phpunit-in-drupal)
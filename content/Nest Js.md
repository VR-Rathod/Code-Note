---
date: 2026-05-22T09:58:29+05:30
lastmod: 2026-05-22T09:58:29+05:30

seoTitle: NestJS Complete Reference – Node.js Framework Guide
description: "Comprehensive NestJS reference covering modules, controllers, services, providers, guards, interceptors, pipes, decorators, TypeORM, and best practices."
keywords: "nestjs, nest.js, nodejs framework, typescript, modules, controllers, services, dependency injection, guards, interceptors, pipes, decorators, typeorm, rest api, nestjs notes, nestjs cheatsheet, nestjs guide, backend typescript, VR-Rathod, Code-Note, code note vr, vr book"
title: Nest Js
---

- # History & Philosophy
	- **Creator**: Kamil Myśliwiec in 2017.
	- **Problem Statement**:
		- [[Node.js]] backend frameworks like [[Express]] and [[Fastify]] are highly flexible and unopinionated but do not enforce any architecture.
		- This lack of structure leads to disorganized, hard-to-maintain codebases in large-scale applications or when multiple developers work together.
		- NestJS solves this by providing a highly structured, opinionated architecture out of the box, ensuring consistency, scalability, and clean separation of concerns.
	- **Core Architecture Roots**:
		- Heavy inspiration from **[[Angular]]** architecture (Modules, Decorators, Dependency Injection).
		- Built with and fully supports **[[TypeScript]]** out of the box (also allows raw ES6/ES7 JS).
		- Uses **[[Express]]** under the hood as the default HTTP server, but abstracting it via an adapter interface.
		- Easily interchangeable with **[[Fastify]]** for high-performance applications.
-
- # Introduction & Architecture
	- NestJS is a progressive [[Node.js]] framework for building efficient, reliable, and scalable server-side applications.
	- Relies on **[[TypeScript]] Decorators** (metadata reflection) and a robust **Dependency Injection (DI)** container to handle objects and class instantiation.
	- Follows a strictly **Modular design**, isolating components into self-contained units (Modules).
	- Great for building:
		- RESTful APIs
		- [[GraphQL]] APIs (Code-First or Schema-First)
		- Microservices (TCP, [[Redis]], gRPC, [[RabbitMQ]], MQTT, [[Kafka]])
		- Real-time applications via [[WebSockets]]
		- CLI (Command Line Interface) utilities
	-
	- ## Core Advantages:
	  collapsed:: true
		- **Strong Architecture** — Enforces clean code principles, SOLID design, and predictable layouts.
		- **First-Class [[TypeScript]] Support** — Robust typing, auto-completion, and modern JS features.
		- **Built-in IoC (Inversion of Control) Container** — Simplifies testing, mocks, and module dependency graphs.
		- **Modularity & Reusability** — Easily reuse modules or package them as dynamic libraries.
		- **Rich Official Ecosystem** — Modular libraries for [[TypeORM]], [[Prisma]], [[Mongoose]], [[GraphQL]], [[WebSockets]], [[BullMQ]], [[Passport]], and [[Swagger]].
		- **Easy Migration to [[Fastify]]** — Swap HTTP engines with one line of code for massive speed boosts.
	-
	- ## Disadvantages & Trade-offs:
	  collapsed:: true
		- **Steep Learning Curve** — Requires solid understanding of OOP, Dependency Injection, Decorators, [[RxJS]], and [[TypeScript]].
		- **Boilerplate Overhead** — Even small/simple endpoints require a controller, a service, a module, and possibly DTOs.
		- **Performance Overhead** — The dependency resolution, decorators, and request lifecycle pipelines add a tiny overhead compared to bare [[Express]]/[[Fastify]].
		- **Large Bundle Size** — Heavy dependency graph increases initial build output and memory footprints.
-
- # Setup & CLI Reference
	- ## Installation & Project Initiation:
		- ```bash
		  # Install NestJS CLI globally
		  npm install -g @nestjs/cli
		  
		  # Scaffold a new project
		  nest new project-name
		  
		  # Run commands inside project root:
		  npm run start          # Start standard development server
		  npm run start:dev      # Start dev server with watch-mode (hot reload)
		  npm run start:debug    # Start dev server with debugger port open
		  npm run start:prod     # Run compiled JS code from dist/ folder
		  npm run build          # Compile TS code to JS (generates dist/)
		  npm run test           # Run unit tests via Jest
		  npm run test:cov       # Run test coverage analysis
		  npm run test:e2e       # Run End-to-End tests
		  ```
	- ## CLI Code Generators:
	  collapsed:: true
		- Generators automatically scaffold files and register them inside their nearest parent module.
		- ```bash
		  # Syntax: nest generate <schematic> <name> [options]
		  # Shorthand: nest g <schematic> <name>
		  
		  # Generate basic blocks
		  nest g module users        # Generates users.module.ts
		  nest g controller users    # Generates users.controller.ts + registers in UsersModule
		  nest g service users       # Generates users.service.ts + registers in UsersModule
		  
		  # Generate full-featured CRUD resource (Highly Recommended)
		  # (Creates Module, Controller, Service, Entities, DTOs, and hooks up basic routes)
		  nest g resource items
		  
		  # Generate architectural pipes and filters
		  nest g guard auth                   # src/auth/auth.guard.ts
		  nest g interceptor logging          # src/logging/logging.interceptor.ts
		  nest g pipe validation              # src/validation/validation.pipe.ts
		  nest g filter http-exception        # src/http-exception.filter.ts
		  nest g middleware logger            # src/logger.middleware.ts
		  ```
	- ## Complete Directory Layout:
	  collapsed:: true
		- ```
		  src/
		  ├── main.ts                       # Entry point: Bootstraps the application instance
		  ├── app.module.ts                 # Root Module: Imports all other feature modules
		  ├── app.controller.ts             # Root Controller: Basic route examples
		  ├── app.service.ts                # Root Service: Basic logic implementation
		  ├── users/                        # Feature Directory (e.g. Users resource)
		  │   ├── users.module.ts           # Users Module declaration
		  │   ├── users.controller.ts       # Users Controller: Route definitions
		  │   ├── users.service.ts          # Users Service: Business logic
		  │   ├── dto/                      # Data Transfer Objects for validation
		  │   │   ├── create-user.dto.ts    # Creation input schema validation
		  │   │   └── update-user.dto.ts    # Update input schema validation
		  │   └── entities/                 # Database Schema / Models definitions
		  │       └── user.entity.ts        # Database Entity (TypeORM / Prisma representation)
		  └── common/                       # Shared modules, guards, decorators, interceptors
		      ├── decorators/               # Custom decorators (e.g. CurrentUser)
		      ├── guards/                   # Custom guards (e.g. Auth, Roles)
		      ├── interceptors/             # Custom interceptors (e.g. Transform, Timeout)
		      ├── middleware/               # Custom middlewares (e.g. Logger)
		      └── pipes/                    # Custom input validation pipes
		  ```
-
- # Core Building Blocks
	- ## Application Entry Point (main.ts):
	  collapsed:: true
		- Contains the bootstrapper logic that mounts middlewares, global filters, global pipes, configurations, and starts listening.
		- ```typescript
		  import { NestFactory } from '@nestjs/core';
		  import { AppModule } from './app.module';
		  import { ValidationPipe, VersioningType } from '@nestjs/common';
		  import { HttpExceptionFilter } from './common/filters/http-exception.filter';
		  
		  async function bootstrap() {
		      // Create NestJS app instance utilizing Express under the hood
		      const app = await NestFactory.create(AppModule);
		  
		      // 1. Set global routing prefix
		      app.setGlobalPrefix('api');
		  
		      // 2. Enable API Versioning (e.g., api/v1/resource)
		      app.enableVersioning({
		          type: VersioningType.URI,
		          defaultVersion: '1',
		      });
		  
		      // 3. Enable CORS
		      app.enableCors({
		          origin: 'http://localhost:4200', // Allow specific frontend URL
		          methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		          credentials: true,
		      });
		  
		      // 4. Configure global validation rules
		      app.useGlobalPipes(new ValidationPipe({
		          whitelist: true,               // Strip any parameters NOT declared in the DTO
		          forbidNonWhitelisted: true,    // Throw a BadRequest error if extra fields are sent
		          transform: true,               // Auto-convert query parameters/route params to typed objects/numbers
		          transformOptions: {
		              enableImplicitConversion: true, // Allow automatic parsing of boolean/number types from string query parameters
		          }
		      }));
		  
		      // 5. Apply Global Exception Filter
		      app.useGlobalFilters(new HttpExceptionFilter());
		  
		      // 6. Start server
		      await app.listen(3000);
		      console.log(`Application successfully listening on: http://localhost:3000/api/v1`);
		  }
		  bootstrap();
		  ```
	- ## Nest Modules (@Module):
	  collapsed:: true
		- Modules are class declarations decorated with `@Module()`. They compile metadata used by the Nest compiler to orchestrate dependency injection.
		- Each application has a **Root Module** (`AppModule`), which imports all sub-modules forming the module tree.
		- ```typescript
		  import { Module, Global } from '@nestjs/common';
		  import { DatabaseService } from './database.service';
		  
		  // Use @Global() with caution! Makes this service immediately importable by all modules
		  // without explicitly listing this module in imports.
		  @Global()
		  @Module({
		      imports:     [],                // Declare other imported modules containing needed exported providers
		      controllers: [],                // Instantiated controllers by this module
		      providers:   [DatabaseService], // Instantiated and injected providers inside this module boundary
		      exports:     [DatabaseService], // Exported providers made accessible to other importing modules
		  })
		  export class CoreDatabaseModule {}
		  ```
		- ### Dynamic Modules:
			- Dynamic modules allow you to pass configuration options dynamically when registering a module (e.g., configuring database connections, API keys, endpoints).
			- ```typescript
			  import { Module, DynamicModule, Provider } from '@nestjs/common';
			  import { MailerService } from './mailer.service';
			  
			  export interface MailerOptions {
			      apiKey: string;
			      fromEmail: string;
			  }
			  
			  @Module({})
			  export class MailerModule {
			      // Define configuration method that returns a DynamicModule object
			      static register(options: MailerOptions): DynamicModule {
			          const mailerOptionsProvider: Provider = {
			              provide: 'MAILER_OPTIONS',
			              useValue: options,
			          };
			  
			          return {
			              module: MailerModule,
			              providers: [mailerOptionsProvider, MailerService],
			              exports: [MailerService], // Export so importing modules can inject MailerService
			          };
			      }
			  }
			  
			  // Import into AppModule dynamically:
			  // @Module({
			  //   imports: [MailerModule.register({ apiKey: 'secret', fromEmail: 'no-reply@app.com' })]
			  // })
			  ```
	- ## Controllers (@Controller):
	  collapsed:: true
		- Handles incoming client requests, delegates business logic execution to services, and returns payload response structures.
		- ```typescript
		  import { 
		      Controller, Get, Post, Put, Delete, Patch,
		      Body, Param, Query, Headers, Ip, HttpCode, 
		      HttpStatus, UseGuards, Res, HttpStatus as Code
		  } from '@nestjs/common';
		  import { Response } from 'express';
		  import { UsersService } from './users.service';
		  import { CreateUserDto } from './dto/create-user.dto';
		  import { UpdateUserDto } from './dto/update-user.dto';
		  
		  @Controller('users') // Base route: /users
		  export class UsersController {
		      // Dependency Injection via TypeScript parameter property syntax
		      constructor(private readonly usersService: UsersService) {}
		  
		      // 1. Basic GET with Route Parameter + Pagination Query
		      @Get()
		      async findAll(
		          @Query('limit') limit: number = 10,
		          @Query('offset') offset: number = 0
		      ) {
		          return this.usersService.findAll(limit, offset);
		      }
		  
		      // 2. GET Route Parameter with typed path validation
		      @Get(':id')
		      async findOne(@Param('id') id: number) {
		          return this.usersService.findOne(id);
		      }
		  
		      // 3. POST request with custom response code and body validation (via DTO)
		      @Post()
		      @HttpCode(HttpStatus.CREATED)
		      async create(@Body() createUserDto: CreateUserDto) {
		          return this.usersService.create(createUserDto);
		      }
		  
		      // 4. PATCH request with path params and custom body dto
		      @Patch(':id')
		      async update(
		          @Param('id') id: number,
		          @Body() updateUserDto: UpdateUserDto
		      ) {
		          return this.usersService.update(id, updateUserDto);
		      }
		  
		      // 5. DELETE resource execution returning NO_CONTENT
		      @Delete(':id')
		      @HttpCode(HttpStatus.NO_CONTENT)
		      async delete(@Param('id') id: number) {
		          await this.usersService.remove(id);
		      }
		  
		      // 6. Advanced: Bypassing Nest response engine using direct platform response object
		      // Warning: Disables automatic serialization, global interceptors execution on response payload
		      @Get('direct-res')
		      getDirectResponse(@Res() res: Response) {
		          return res.status(200).send({ message: 'Express custom response' });
		      }
		  }
		  ```
	- ## Providers & Services (@Injectable):
	  collapsed:: true
		- Providers are JavaScript classes decorated with `@Injectable()`. They are managed by Nest's IoC container and can be injected into other classes via constructors.
		- ```typescript
		  import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
		  import { CreateUserDto } from './dto/create-user.dto';
		  import { UpdateUserDto } from './dto/update-user.dto';
		  
		  @Injectable()
		  export class UsersService {
		      // In-memory data store for demonstration
		      private users: any[] = [];
		  
		      async findAll(limit: number, offset: number) {
		          return this.users.slice(offset, offset + limit);
		      }
		  
		      async findOne(id: number) {
		          const user = this.users.find(u => u.id === id);
		          if (!user) {
		              // Standard HTTP exceptions built into NestJS
		              throw new NotFoundException(`User with ID ${id} not found`);
		          }
		          return user;
		      }
		  
		      async create(dto: CreateUserDto) {
		          const exists = this.users.some(u => u.email === dto.email);
		          if (exists) {
		              throw new ConflictException(`Email ${dto.email} already exists`);
		          }
		          const newUser = { id: Date.now(), ...dto };
		          this.users.push(newUser);
		          return newUser;
		      }
		  
		      async update(id: number, dto: UpdateUserDto) {
		          const user = await this.findOne(id);
		          const updatedUser = { ...user, ...dto };
		          this.users = this.users.map(u => (u.id === id ? updatedUser : u));
		          return updatedUser;
		      }
		  
		      async remove(id: number) {
		          await this.findOne(id);
		          this.users = this.users.filter(u => u.id !== id);
		      }
		  }
		  ```
-
- # Custom Providers & Dependency Injection (DI)
	- NestJS uses Inversion of Control (IoC) to automatically instantiate classes and resolve dependencies.
	- ## Advanced Provider Declarations:
	  collapsed:: true
		- Instead of simple array references, you can customize provider instantiations:
		- ```typescript
		  // 1. Value Providers (useValue)
		  // Great for external configuration values, constant values, or database mocking interfaces
		  const ConfigValueProvider = {
		      provide: 'APP_CONFIG',
		      useValue: Object.freeze({
		          apiEndpoint: 'https://api.v1.com',
		          timeout: 5000,
		      }),
		  };
		  
		  // 2. Class Providers (useClass)
		  // Dynamically resolve implementing interfaces based on runtime environment variables
		  const StorageServiceProvider = {
		      provide: 'STORAGE_SERVICE',
		      useClass: process.env.NODE_ENV === 'production' 
		          ? S3StorageService 
		          : LocalStorageService,
		  };
		  
		  // 3. Factory Providers (useFactory)
		  // Instantiate complex objects asynchronously, requesting arguments injected dynamically
		  const DatabaseConnectionProvider = {
		      provide: 'ASYNC_CONNECTION',
		      useFactory: async (config: ConfigService) => {
		          const connection = await createDbClient(config.get('DB_URI'));
		          return connection;
		      },
		      inject: [ConfigService], // Inject dependent services into useFactory argument positions
		  };
		  
		  // In Module declaration:
		  @Module({
		      providers: [
		          ConfigValueProvider,
		          StorageServiceProvider,
		          DatabaseConnectionProvider,
		      ],
		  })
		  export class AppModule {}
		  ```
	- ## Injection Scopes:
	  collapsed:: true
		- Providers can run inside different lifecycles by setting their `@Injectable({ scope: Scope })`:
		- ```typescript
		  import { Injectable, Scope } from '@nestjs/common';
		  
		  // 1. DEFAULT (Singleton) - Instantiated once. Shared across the entire system. (Highly recommended/default)
		  @Injectable({ scope: Scope.DEFAULT })
		  export class SingletonService {}
		  
		  // 2. REQUEST - Instantiated dynamically for EACH incoming request. Garbage collected after completion.
		  // WARNING: Request scoping propagates up. Any service injecting a REQUEST-scoped service becomes REQUEST-scoped.
		  // Can cause severe memory overhead under heavy load.
		  @Injectable({ scope: Scope.REQUEST })
		  export class RequestScopedService {}
		  
		  // 3. TRANSIENT - A dedicated instance is created for each class that injects this provider.
		  @Injectable({ scope: Scope.TRANSIENT })
		  export class TransientService {}
		  ```
	- ## Circular Dependencies (forwardRef):
	  collapsed:: true
		- Occurs when Class A imports Class B, and Class B imports Class A. To resolve this, use `forwardRef()` to defer instantiation resolution.
		- ```typescript
		  // auth.service.ts
		  @Injectable()
		  export class AuthService {
		      constructor(
		          @Inject(forwardRef(() => UsersService))
		          private usersService: UsersService,
		      ) {}
		  }
		  
		  // users.service.ts
		  @Injectable()
		  export class UsersService {
		      constructor(
		          @Inject(forwardRef(() => AuthService))
		          private authService: AuthService,
		      ) {}
		  }
		  
		  // Corresponding Module definitions must also wrap imports with forwardRef:
		  // @Module({ imports: [forwardRef(() => UsersModule)] })
		  ```
-
- # Interceptors, Guards, Pipes, Middleware & Request Lifecycle
	- ## Detailed Execution Lifecycle:
	  collapsed:: true
		- The NestJS request processing pipeline executes incoming requests and returns response structures in a strict, predictable execution order:
		- ```
		  [Incoming Request]
		          │
		          ▼
		  1. Global Middleware
		          │
		          ▼
		  2. Module Middleware (Registered via configure())
		          │
		          ▼
		  3. Global Guards ──► Controller Guards ──► Route Guards (Denies 403/401)
		          │
		          ▼
		  4. Global Interceptors (Pre-handler)
		  5. Controller Interceptors (Pre-handler)
		  6. Route Interceptors (Pre-handler)
		          │
		          ▼
		  7. Global Pipes ──► Controller Pipes ──► Route Pipes ──► Parameter Pipes
		          │
		          ▼
		  8. Route Controller Handler (Executes Service Database Queries)
		          │
		          ▼
		  9. Route Interceptors (Post-handler / RxJS manipulation)
		  10. Controller Interceptors (Post-handler)
		  11. Global Interceptors (Post-handler)
		          │
		          ▼
		  12. Route exception filters ──► Controller filters ──► Global exception filters
		          │
		          ▼
		  [Outgoing Client Response]
		  ```
	- ## Middleware:
	  collapsed:: true
		- Executes exactly like [[Express]] middleware. Used for logging, request parsing, headers manipulation, and setting properties on the request context.
		- ```typescript
		  import { Injectable, NestMiddleware } from '@nestjs/common';
		  import { Request, Response, NextFunction } from 'express';
		  
		  @Injectable()
		  export class LoggerMiddleware implements NestMiddleware {
		      use(req: Request, res: Response, next: NextFunction) {
		          const { ip, method, originalUrl } = req;
		          const userAgent = req.get('user-agent') || '';
		          const start = Date.now();
		  
		          res.on('finish', () => {
		              const duration = Date.now() - start;
		              const { statusCode } = res;
		              console.log(`[HTTP] ${method} ${originalUrl} ${statusCode} - ${duration}ms - IP: ${ip} - UA: ${userAgent}`);
		          });
		  
		          next();
		      }
		  }
		  
		  // Apply middleware within specific module:
		  export class AppModule implements NestModule {
		      configure(consumer: MiddlewareConsumer) {
		          consumer
		              .apply(LoggerMiddleware)
		              .exclude('auth/login') // Exclude specific path
		              .forRoutes('*');       // Apply to all routes
		      }
		  }
		  ```
	- ## Guards (@UseGuards):
	  collapsed:: true
		- Performs authentication and authorization tasks. Implements `CanActivate` and must return `boolean | Promise<boolean>` to allow or block route access.
		- ```typescript
		  import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
		  import { Reflector } from '@nestjs/core';
		  
		  @Injectable()
		  export class RolesGuard implements CanActivate {
		      constructor(private reflector: Reflector) {}
		  
		      async canActivate(context: ExecutionContext): Promise<boolean> {
		          // Retrieve route roles metadata attached via custom decorators
		          const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
		              context.getHandler(),
		              context.getClass(),
		          ]);
		  
		          if (!requiredRoles) {
		              return true; // No roles defined, proceed
		          }
		  
		          const request = context.switchToHttp().getRequest();
		          const user = request.user; // Appended by AuthGuard Strategy
		  
		          if (!user || !user.roles) {
		              throw new UnauthorizedException('Access denied: Missing role profile');
		          }
		  
		          // Verify if user roles intersect with required route roles
		          const hasRole = requiredRoles.some(role => user.roles.includes(role));
		          if (!hasRole) {
		              throw new UnauthorizedException('Insufficient permissions');
		          }
		          return true;
		      }
		  }
		  ```
	- ## Interceptors (@UseInterceptors):
	  collapsed:: true
		- Wraps handlers using **[[RxJS]] Observables** to log events, handle response timeouts, cache payloads, or transform incoming/outgoing data.
		- ```typescript
		  import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
		  import { Observable } from 'rxjs';
		  import { map, timeout } from 'rxjs/operators';
		  
		  export interface ApiResponse<T> {
		      data: T;
		      timestamp: string;
		      success: boolean;
		  }
		  
		  // Interceptor transforming raw return object into structured envelope
		  @Injectable()
		  export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
		      intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
		          return next.handle().pipe(
		              // 1. Transform payload
		              map(data => ({
		                  data,
		                  timestamp: new Date().toISOString(),
		                  success: true
		              })),
		              // 2. Set timeout limit (e.g., throw error if handler takes > 5 seconds)
		              timeout(5000)
		          );
		      }
		  }
		  ```
	- ## Pipes (@UsePipes):
	  collapsed:: true
		- Translates and validates input structures. Emits `400 Bad Request` if payload structure violates validation constraints.
		- Uses `class-validator` and `class-transformer` properties.
		- ```typescript
		  // custom-parse-int.pipe.ts
		  import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
		  
		  @Injectable()
		  export class CustomParseIntPipe implements PipeTransform<string, number> {
		      transform(value: string): number {
		          const val = parseInt(value, 10);
		          if (isNaN(val)) {
		              throw new BadRequestException(`Validation failed: "${value}" is not a valid integer`);
		          }
		          return val;
		      }
		  }
		  
		  // In Controller:
		  // @Get(':id')
		  // findOne(@Param('id', CustomParseIntPipe) id: number) { ... }
		  ```
-
- # Exception Filters
	- Customizes the JSON structure of error payloads returned to the client. Can target global server runtime crashes, Database schema error handling, and structured HTTP errors.
	- ```typescript
	  import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
	  import { Request, Response } from 'express';
	  
	  @Catch() // Empty argument catches ALL exceptions (both HTTP and internal node runtime errors)
	  export class HttpExceptionFilter implements ExceptionFilter {
	      catch(exception: unknown, host: ArgumentsHost) {
	          const ctx = host.switchToHttp();
	          const response = ctx.getResponse<Response>();
	          const request = ctx.getRequest<Request>();
	  
	          const status = exception instanceof HttpException
	              ? exception.getStatus()
	              : HttpStatus.INTERNAL_SERVER_ERROR;
	  
	          const message = exception instanceof HttpException
	              ? exception.getResponse()
	              : 'Internal Server Error';
	  
	          const errorResponse = {
	              statusCode: status,
	              timestamp: new Date().toISOString(),
	              path: request.url,
	              method: request.method,
	              details: typeof message === 'object' ? message : { message },
	          };
	  
	          // Log standard runtime errors for developer inspection
	          if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
	              console.error('[UNHANDLED EXCEPTION CRASH]', exception);
	          }
	  
	          response.status(status).json(errorResponse);
	      }
	  }
	  ```
-
- # DTOs & Validation
	- ## Setup:
		- ```bash
		  npm install class-validator class-transformer @nestjs/mapped-types
		  ```
	- ## Defining the Data Transfer Object (DTO):
	  collapsed:: true
		- Uses decorators to validate incoming payloads before they reach the controller.
		- ```typescript
		  import { 
		      IsString, IsEmail, IsInt, Min, Max, 
		      IsOptional, ValidateNested, IsArray, IsEnum 
		  } from 'class-validator';
		  import { Type } from 'class-transformer';
		  
		  export enum UserRole {
		      ADMIN = 'admin',
		      USER = 'user',
		      MODERATOR = 'moderator',
		  }
		  
		  export class ProfileDto {
		      @IsString()
		      bio: string;
		  
		      @IsString()
		      avatarUrl: string;
		  }
		  
		  export class CreateUserDto {
		      @IsString()
		      name: string;
		  
		      @IsEmail()
		      email: string;
		  
		      @IsInt()
		      @Min(18)
		      @Max(100)
		      age: number;
		  
		      @IsEnum(UserRole)
		      role: UserRole;
		  
		      // Validating Nested Objects:
		      @ValidateNested()
		      @Type(() => ProfileDto) // Transform plain object to ProfileDto class instance
		      profile: ProfileDto;
		  }
		  ```
	- ## Creating Update DTOs (Don't Repeat Yourself):
	  collapsed:: true
		- Instead of recreating validation rules, use `PartialType` to copy fields from your creation DTO and mark them as optional:
		- ```typescript
		  import { PartialType } from '@nestjs/mapped-types';
		  import { CreateUserDto } from './create-user.dto';
		  
		  // Inherits all fields of CreateUserDto and makes them optional for patch/update requests
		  export class UpdateUserDto extends PartialType(CreateUserDto) {}
		  ```
-
- # Configuration & Environment Variables
	- Standardizes how configurations are handled, preventing environment leakage and enabling type-safe configurations.
	- ## Installation:
		- ```bash
		  npm install @nestjs/config joi
		  ```
	- ## Setting up the ConfigModule:
	  collapsed:: true
		- Configure the global module config in your root imports:
		- ```typescript
		  import { Module } from '@nestjs/common';
		  import { ConfigModule } from '@nestjs/config';
		  import * as Joi from 'joi';
		  
		  @Module({
		      imports: [
		          ConfigModule.forRoot({
		              isGlobal: true,             // Makes ConfigService available globally
		              envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
		              // 1. Enforce strict configuration parsing via Joi validation
		              validationSchema: Joi.object({
		                  PORT: Joi.number().default(3000),
		                  DB_HOST: Joi.string().required(),
		                  DB_URI: Joi.string().required(),
		                  JWT_SECRET: Joi.string().required(),
		              }),
		              validationOptions: {
		                  allowUnknown: true,     // Allow other unvalidated environment parameters
		                  abortEarly: true,       // Stop execution immediately on invalid configuration schema
		              }
		          }),
		      ],
		  })
		  export class AppModule {}
		  ```
	- ## Injecting and Consuming Environment Variables:
	  collapsed:: true
		- Inject `ConfigService` into components:
		- ```typescript
		  import { Injectable } from '@nestjs/common';
		  import { ConfigService } from '@nestjs/config';
		  
		  @Injectable()
		  export class AuthService {
		      constructor(private configService: ConfigService) {}
		  
		      getJwtSecret(): string {
		          // Typecasting returned string values
		          return this.configService.get<string>('JWT_SECRET');
		      }
		  }
		  ```
	- ## Type-safe Config Namespaces (registerAs):
	  collapsed:: true
		- Organizes config settings into logical, type-safe namespaces instead of reading generic keys:
		- ```typescript
		  // config/database.config.ts
		  import { registerAs } from '@nestjs/config';
		  
		  export default registerAs('database', () => ({
		      host: process.env.DB_HOST,
		      port: parseInt(process.env.DB_PORT, 10) || 5432,
		  }));
		  
		  // In constructor injection:
		  // constructor(
		  //   @Inject(dbConfig.KEY) 
		  //   private dbOptions: ConfigType<typeof dbConfig>
		  // ) {
		  //   console.log(dbOptions.host); // Fully auto-typed
		  // }
		  ```
-
- # Database Integration ([[TypeORM]] & [[Prisma]])
	- ## 1. [[TypeORM]] Integration:
	  collapsed:: true
		- ### Installation:
			- ```bash
			  npm install @nestjs/typeorm typeorm pg
			  ```
		- ### Configuration and Entity:
			- Configure database connection properties:
			- ```typescript
			  // app.module.ts
			  import { Module } from '@nestjs/common';
			  import { TypeOrmModule } from '@nestjs/typeorm';
			  import { User } from './user.entity';
			  
			  @Module({
			      imports: [
			          TypeOrmModule.forRootAsync({
			              useFactory: () => ({
			                  type: 'postgres',
			                  host: process.env.DB_HOST,
			                  port: 5432,
			                  username: process.env.DB_USERNAME,
			                  password: process.env.DB_PASSWORD,
			                  database: process.env.DB_NAME,
			                  autoLoadEntities: true,  // Automatically load entities registered in modules
			                  synchronize: false,       // DANGEROUS: Set to false in production, use migrations instead
			              })
			          }),
			      ],
			  })
			  export class AppModule {}
			  ```
			- Entity with relations mapping:
			- ```typescript
			  // user.entity.ts
			  import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
			  import { Post } from './post.entity';
			  
			  @Entity('users')
			  export class User {
			      @PrimaryGeneratedColumn()
			      id: number;
			  
			      @Column({ unique: true })
			      email: string;
			  
			      @Column({ nullable: true })
			      name: string;
			  
			      // One-to-many relationship
			      @OneToMany(() => Post, post => post.user, { cascade: true })
			      posts: Post[];
			  }
			  ```
		- ### Consuming Repository & Running Database Transactions:
			- Using the repository pattern and handling safe transactional query runners:
			- ```typescript
			  import { Injectable } from '@nestjs/common';
			  import { InjectRepository } from '@nestjs/typeorm';
			  import { Repository, DataSource } from 'typeorm';
			  import { User } from './user.entity';
			  
			  @Injectable()
			  export class UsersService {
			      constructor(
			          @InjectRepository(User)
			          private usersRepository: Repository<User>,
			          private dataSource: DataSource // Injected to manage transaction execution blocks
			      ) {}
			  
			      async createWithProfileTransaction(email: string, name: string) {
			          // 1. Create a query runner instance
			          const queryRunner = this.dataSource.createQueryRunner();
			          await queryRunner.connect();
			          await queryRunner.startTransaction();
			  
			          try {
			              // 2. Perform operations using queryRunner manager
			              const user = new User();
			              user.email = email;
			              user.name = name;
			              const savedUser = await queryRunner.manager.save(user);
			  
			              // 3. Commit operations
			              await queryRunner.commitTransaction();
			              return savedUser;
			          } catch (err) {
			              // 4. Rollback changes on exceptions
			              await queryRunner.rollbackTransaction();
			              throw err;
			          } finally {
			              // 5. Release database connection pool
			              await queryRunner.release();
			          }
			      }
			  }
			  ```
	- ## 2. [[Prisma]] ORM Integration (Recommended Alternative):
	  collapsed:: true
		- ### Installation:
			- ```bash
			  npm install @prisma/client
			  npm install -D prisma
			  
			  # Initialize Prisma folder structure
			  npx prisma init
			  ```
		- ### Database Service Wrapper:
			- Initialize and hook Prisma client connection to NestJS application lifecycle events:
			- ```typescript
			  // prisma.service.ts
			  import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
			  import { PrismaClient } from '@prisma/client';
			  
			  @Injectable()
			  export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
			      async onModuleInit() {
			          await this.$connect(); // Open DB connections
			      }
			  
			      async onModuleDestroy() {
			          await this.$disconnect(); // Close connection pool on app shutdown
			      }
			  }
			  ```
		- ### Registering Service:
			- Declare a global database module to share `PrismaService`:
			- ```typescript
			  // database.module.ts
			  import { Module, Global } from '@nestjs/common';
			  import { PrismaService } from './prisma.service';
			  
			  @Global()
			  @Module({
			      providers: [PrismaService],
			      exports: [PrismaService],
			  })
			  export class DatabaseModule {}
			  ```
		- ### Running Transactions with Prisma:
			- ```typescript
			  import { Injectable } from '@nestjs/common';
			  import { PrismaService } from '../database/prisma.service';
			  
			  @Injectable()
			  export class ItemsService {
			      constructor(private prisma: PrismaService) {}
			  
			      async checkoutItem(userId: number, itemId: number, price: number) {
			          // Prisma transactional block ensures both operations complete or roll back
			          return this.prisma.$transaction(async (tx) => {
			              // 1. Deduct user balance
			              const user = await tx.user.update({
			                  where: { id: userId },
			                  data: { balance: { decrement: price } }
			              });
			  
			              if (user.balance < 0) {
			                  throw new Error('Insufficient balance');
			              }
			  
			              // 2. Register purchase log
			              const log = await tx.purchaseLog.create({
			                  data: { userId, itemId, price }
			              });
			  
			              return log;
			          });
			      }
			  }
			  ```
-
- # Security & Authentication
	- Standardizes authentication structures using [[Passport]] strategies.
	- ## 1. Installation:
		- ```bash
		  npm install @nestjs/passport passport passport-jwt @nestjs/jwt bcrypt
		  npm install -D @types/passport-jwt @types/bcrypt
		  ```
	- ## 2. JWT Strategy Implementation:
	  collapsed:: true
		- Strategies extract and validate credentials (JWTs) from headers.
		- ```typescript
		  // jwt.strategy.ts
		  import { Injectable, UnauthorizedException } from '@nestjs/common';
		  import { PassportStrategy } from '@nestjs/passport';
		  import { ExtractJwt, Strategy } from 'passport-jwt';
		  import { ConfigService } from '@nestjs/config';
		  import { UsersService } from '../users/users.service';
		  
		  @Injectable()
		  export class JwtStrategy extends PassportStrategy(Strategy) {
		      constructor(
		          private configService: ConfigService,
		          private usersService: UsersService
		      ) {
		          super({
		              // Extract Bearer token from authorization headers
		              jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		              ignoreExpiration: false,
		              secretOrKey: configService.get<string>('JWT_SECRET'),
		          });
		      }
		  
		      // Called after verification. The returned payload is attached to req.user.
		      async validate(payload: { sub: number; email: string }) {
		          const user = await this.usersService.findOne(payload.sub);
		          if (!user) {
		              throw new UnauthorizedException('Invalid auth token');
		          }
		          return user; // Attached as req.user
		      }
		  }
		  ```
	- ## 3. Protecting Routes (AuthGuard):
	  collapsed:: true
		- Route handlers require `@UseGuards(AuthGuard('jwt'))` to protect access:
		- ```typescript
		  import { Controller, Get, UseGuards, Request } from '@nestjs/common';
		  import { AuthGuard } from '@nestjs/passport';
		  
		  @Controller('profile')
		  export class ProfileController {
		      @Get()
		      @UseGuards(AuthGuard('jwt')) // Automatically checks headers for Bearer tokens
		      getProfile(@Request() req) {
		          return req.user; // Contains validated User entity returned by JwtStrategy.validate()
		      }
		  }
		  ```
	- ## 4. Custom Parameter Decorators (@CurrentUser):
	  collapsed:: true
		- Avoid calling `@Request() req` in controllers. Create a custom decorator to clean up route handler signatures:
		- ```typescript
		  // user.decorator.ts
		  import { createParamDecorator, ExecutionContext } from '@nestjs/common';
		  
		  export const CurrentUser = createParamDecorator(
		      (data: unknown, ctx: ExecutionContext) => {
		          const request = ctx.switchToHttp().getRequest();
		          return request.user;
		      },
		  );
		  
		  // Inside controller:
		  // @Get('profile')
		  // @UseGuards(AuthGuard('jwt'))
		  // getProfile(@CurrentUser() user: UserEntity) {
		  //   return user;
		  // }
		  ```
	- ## 5. Role-Based Access Control (RBAC):
	  collapsed:: true
		- Dynamically assign metadata attributes using the `@SetMetadata` wrapper:
		- ```typescript
		  // roles.decorator.ts
		  import { SetMetadata } from '@nestjs/common';
		  export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
		  
		  // Apply inside Controller routing handlers:
		  // @Roles('admin')
		  // @UseGuards(AuthGuard('jwt'), RolesGuard)
		  // @Delete(':id')
		  // remove(@Param('id') id: string) { ... }
		  ```
-
- # Advanced Framework Features
	- ## 1. Microservices Architecture:
	  collapsed:: true
		- NestJS can dynamically switch transport paradigms. Instead of HTTP, you can communicate via message brokers.
		- ### Microservice Server Setup:
			- ```typescript
			  // main.ts for microservice client
			  import { NestFactory } from '@nestjs/core';
			  import { Transport, MicroserviceOptions } from '@nestjs/microservices';
			  import { UsersModule } from './users.module';
			  
			  async function bootstrap() {
			      // Instantiate microservice server listening via TCP connection
			      const app = await NestFactory.createMicroservice<MicroserviceOptions>(UsersModule, {
			          transport: Transport.TCP,
			          options: {
			              host: '127.0.0.1',
			              port: 8888,
			          },
			      });
			      await app.listen();
			      console.log('TCP Microservice listening...');
			  }
			  bootstrap();
			  ```
		- ### Consuming Microservice Events and Messages:
			- ```typescript
			  // users.controller.ts (Microservice server handler)
			  import { Controller } from '@nestjs/common';
			  import { MessagePattern, EventPattern } from '@nestjs/microservices';
			  
			  @Controller()
			  export class UsersMicroserviceController {
			      // 1. Request-Response pattern: Sends a reply back to the sender
			      @MessagePattern({ cmd: 'get_user_by_id' })
			      getUser(id: number) {
			          return { id, name: 'Alice', role: 'User' };
			      }
			  
			      // 2. Event pattern: Fire-and-forget (asymmetric, no reply is returned)
			      @EventPattern('user_registered')
			      async handleUserRegistered(data: any) {
			          console.log('Processed register event background tasks:', data);
			      }
			  }
			  ```
		- ### Client Broker Dispatching:
			- ```typescript
			  // billing.service.ts (HTTP server dispatching to TCP microservice)
			  import { Injectable, Inject } from '@nestjs/common';
			  import { ClientProxy } from '@nestjs/microservices';
			  
			  @Injectable()
			  export class BillingService {
			      constructor(
			          @Inject('USER_SERVICE') private client: ClientProxy // Injected proxy client
			      ) {}
			  
			      triggerBillingUser(userId: number) {
			          // Dispatches event fire-and-forget style
			          this.client.emit('user_registered', { userId, timestamp: Date.now() });
			  
			          // Sends request-response style message
			          return this.client.send({ cmd: 'get_user_by_id' }, userId);
			      }
			  }
			  ```
	- ## 2. [[WebSockets]] & Real-time Gateways:
	  collapsed:: true
		- ### Installation:
			- ```bash
			  npm install @nestjs/websockets @nestjs/platform-socket.io
			  ```
		- ### WebSocket Gateway:
			- ```typescript
			  import { 
			      WebSocketGateway, WebSocketServer, 
			      SubscribeMessage, MessageBody, ConnectedSocket 
			  } from '@nestjs/websockets';
			  import { Server, Socket } from 'socket.io';
			  
			  // Configure CORS policies for incoming WebSocket connections
			  @WebSocketGateway({ cors: { origin: '*' } })
			  export class ChatGateway {
			      @WebSocketServer()
			      server: Server; // Reference to direct Socket.io Server instance
			  
			      // Listen for 'send_message' events from client connections
			      @SubscribeMessage('send_message')
			      handleMessage(
			          @MessageBody() payload: { text: string },
			          @ConnectedSocket() client: Socket
			      ): void {
			          // Broadcast payload back to all connected client nodes
			          this.server.emit('message_received', {
			              senderId: client.id,
			              text: payload.text,
			              time: new Date().toISOString()
			          });
			      }
			  }
			  ```
	- ## 3. Distributed Background Queues ([[BullMQ]]):
	  collapsed:: true
		- Implements distributed job scheduling using [[Redis]] as database state.
		- ### Installation:
			- ```bash
			  npm install @nestjs/bull bull
			  npm install -D @types/bull
			  ```
		- ### Module Configuration and Processing:
			- Register Redis connection details:
			- ```typescript
			  // app.module.ts
			  import { Module } from '@nestjs/common';
			  import { BullModule } from '@nestjs/bull';
			  
			  @Module({
			      imports: [
			          BullModule.forRoot({
			              redis: {
			                  host: 'localhost',
			                  port: 6379,
			              },
			          }),
			          // Register queue name boundary
			          BullModule.registerQueue({
			              name: 'email-queue',
			          }),
			      ],
			  })
			  export class AppModule {}
			  ```
			- Creating Queue Producer (Service):
			- ```typescript
			  // email-queue.service.ts
			  import { Injectable } from '@nestjs/common';
			  import { Queue } from 'bull';
			  import { InjectQueue } from '@nestjs/bull';
			  
			  @Injectable()
			  export class EmailQueueService {
			      constructor(
			          @InjectQueue('email-queue') private emailQueue: Queue
			      ) {}
			  
			      async sendEmailJob(to: string, content: string) {
			          // Add job payload to queue with custom execution rules
			          await this.emailQueue.add('send_welcome', {
			              to,
			              content
			          }, {
			              attempts: 3,             // Retry up to 3 times on failures
			              backoff: 5000,           // Wait 5 seconds between retries
			              removeOnComplete: true,  // Auto clean up successful job records
			          });
			      }
			  }
			  ```
			- Creating Queue Consumer (Processor):
			- ```typescript
			  // email.processor.ts
			  import { Processor, Process } from '@nestjs/bull';
			  import { Job } from 'bull';
			  
			  @Processor('email-queue')
			  export class EmailProcessor {
			      @Process('send_welcome')
			      async handleWelcomeEmail(job: Job<{ to: string, content: string }>) {
			          console.log(`Processing background job id ${job.id}...`);
			          const { to, content } = job.data;
			          
			          // Send email logic...
			          await new Promise(resolve => setTimeout(resolve, 2000));
			          console.log(`Email successfully dispatched to: ${to}`);
			      }
			  }
			  ```
-
- # Testing (Unit & E2E Testing)
	- Standardizes testing setups using [[Jest]] out of the box, allowing you to mock dependencies via the custom `TestingModule`.
	- ## 1. Unit Testing Service dependencies:
	  collapsed:: true
		- Test single service methods by mocking database repositories or external modules.
		- ```typescript
		  // users.service.spec.ts
		  import { Test, TestingModule } from '@nestjs/testing';
		  import { UsersService } from './users.service';
		  import { getRepositoryToken } from '@nestjs/typeorm';
		  import { User } from './user.entity';
		  import { Repository } from 'typeorm';
		  
		  describe('UsersService Unit Tests', () => {
		      let service: UsersService;
		      let repo: Repository<User>;
		  
		      const mockRepository = {
		          findOneBy: jest.fn().mockImplementation((options) => {
		              return Promise.resolve({ id: options.id, name: 'John Doe', email: 'john@gmail.com' });
		          }),
		          create: jest.fn().mockImplementation(dto => dto),
		          save: jest.fn().mockImplementation(user => Promise.resolve({ id: 1, ...user })),
		      };
		  
		      beforeEach(async () => {
		          const module: TestingModule = await Test.createTestingModule({
		              providers: [
		                  UsersService,
		                  {
		                      provide: getRepositoryToken(User), // Get DI injection token for repository
		                      useValue: mockRepository,
		                  }
		              ],
		          }).compile();
		  
		          service = module.get<UsersService>(UsersService);
		          repo = module.get<Repository<User>>(getRepositoryToken(User));
		      });
		  
		      it('should be defined', () => {
		          expect(service).toBeDefined();
		      });
		  
		      it('should find one user by id', async () => {
		          const user = await service.findOne(1);
		          expect(user).toEqual({ id: 1, name: 'John Doe', email: 'john@gmail.com' });
		          expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
		      });
		  });
		  ```
	- ## 2. End-to-End (E2E) HTTP Integration Testing:
	  collapsed:: true
		- Bootstraps the entire server pipeline, validates request formatting, executes actual routing pipelines, and returns values verified via supertest.
		- ```typescript
		  // users.e2e-spec.ts
		  import { Test, TestingModule } from '@nestjs/testing';
		  import { INestApplication, ValidationPipe } from '@nestjs/common';
		  import * as request from 'supertest';
		  import { AppModule } from './../src/app.module';
		  
		  describe('Users API Endpoints (e2e)', () => {
		      let app: INestApplication;
		  
		      beforeAll(async () => {
		          const moduleFixture: TestingModule = await Test.createTestingModule({
		              imports: [AppModule],
		          }).compile();
		  
		          app = moduleFixture.createNestApplication();
		          
		          // Replicate actual main.ts pipeline checks (crucial for validating validation DTOs)
		          app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
		          await app.init();
		      });
		  
		      it('/users (GET) - Success check', () => {
		          return request(app.getHttpServer())
		              .get('/users')
		              .expect(200)
		              .expect(res => {
		                  expect(Array.isArray(res.body)).toBe(true);
		              });
		      });
		  
		      it('/users (POST) - Rejects empty inputs', () => {
		          return request(app.getHttpServer())
		              .post('/users')
		              .send({ email: 'invalid-email' }) // Missing required payload fields
		              .expect(400); // ValidationPipe blocks request execution
		      });
		  
		      afterAll(async () => {
		          await app.close(); // Clean up app instance and database connections
		      });
		  });
		  ```
-
- # Performance Tuning
	- ## 1. Migrating to [[Fastify]] HTTP Adapter:
	  collapsed:: true
		- By default, NestJS uses [[Express]]. However, you can swap it for [[Fastify]] to double or triple your throughput.
		- ### Installation:
			- ```bash
			  npm install @nestjs/platform-fastify
			  ```
		- ### Setup in main.ts:
			- Import the adapter and pass it to `NestFactory.create()`:
			- ```typescript
			  import { NestFactory } from '@nestjs/core';
			  import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
			  import { AppModule } from './app.module';
			  
			  async function bootstrap() {
			      // Instantiates application running on top of Fastify platform
			      const app = await NestFactory.create<NestFastifyApplication>(
			          AppModule,
			          new FastifyAdapter({
			              logger: false, // Turn off internal logger configs for benchmarking performance
			          })
			      );
			  
			      await app.listen(3000, '0.0.0.0'); // Bind to all interfaces (required inside dockerized containers)
			      console.log(`Application running on Fastify port 3000`);
			  }
			  bootstrap();
			  ```
	- ## 2. In-Memory caching setup:
	  collapsed:: true
		- Prevent unnecessary database queries by caching responses in memory (e.g. using `cache-manager` with [[Redis]]).
		- ```typescript
		  import { CacheModule, Module } from '@nestjs/common';
		  import * as redisStore from 'cache-manager-redis-store';
		  
		  @Module({
		      imports: [
		          CacheModule.register({
		              store: redisStore,
		              host: 'localhost',
		              port: 6379,
		              ttl: 600, // Cache results for 10 minutes
		          }),
		      ],
		  })
		  export class AppModule {}
		  ```
-
- # Key Takeaways
	- NestJS enforces an **Angular-inspired modular architecture** (Modules, Controllers, Services/Providers) on the Node.js backend.
	- Every feature should reside inside its own self-contained **Module** that explicitly defines imports, exports, and providers.
	- Use **Dependency Injection** (IoC) to inject services into constructors. Mark classes with `@Injectable()` to manage their lifecycle.
	- Always configure `ValidationPipe` globally with options like `whitelist: true` and `transform: true` for clean validation and input parsing.
	- Hook up your middlewares, guards, pipes, interceptors, and exception filters in alignment with the **NestJS Request Lifecycle**.
	- Resolve circular dependencies safely using `forwardRef(() => classReference)` in both strategies and modules.
	- Choose between **TypeORM** (using repository classes and transaction QueryRunners) or **Prisma** (injecting raw Client wrappers) depending on your persistence preferences.
	- Secure your REST interfaces using passport strategy models, and design custom parameters decorators like `@CurrentUser()` to clean up controller methods.
	- Scale your business application patterns using **TCP microservices**, **WebSockets Gateways**, or **BullMQ background queues**.
-
- # Reference Links
	- **Official Website**: https://docs.nestjs.com
	- **CLI Tools Manual**: https://docs.nestjs.com/cli/overview
	- **Awesome NestJS curated repository**: https://github.com/nestjs/awesome-nestjs
	- **TypeORM Library Docs**: https://typeorm.io
	- **Prisma Client Database guide**: https://www.prisma.io/docs/concepts/components/prisma-client
	- **BullMQ Background Scheduler documentation**: https://docs.bullmq.io
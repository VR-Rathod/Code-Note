---
seoTitle: NestJS Complete Reference – Node.js Framework Guide
description: "Comprehensive NestJS reference covering modules, controllers, services, providers, guards, interceptors, pipes, decorators, TypeORM, and best practices."
keywords: "nestjs, nest.js, nodejs framework, typescript, modules, controllers, services, dependency injection, guards, interceptors, pipes, decorators, typeorm, rest api, nestjs notes, nestjs cheatsheet, nestjs guide, backend typescript, VR-Rathod, Code-Note, code note vr, vr book"
---

- # History
	- **Created by**: Kamil Myśliwiec in 2017.
	- **Why**: Express and Fastify are minimal — no enforced structure. NestJS brings Angular-style architecture (modules, DI, decorators) to the backend.
	- **Built on**: Express (default) or Fastify (optional) under the hood.
	- **Language**: TypeScript-first (also supports plain JS).
	- **Inspired by**: Angular — same concepts: modules, decorators, dependency injection.
-
- # Introduction
	- **NestJS** is a progressive Node.js framework for building scalable, maintainable server-side applications.
	- Uses **TypeScript decorators** and **dependency injection** to enforce clean architecture.
	- Follows **MVC + modular** pattern — every feature lives in its own module.
	- Great for: REST APIs, GraphQL APIs, microservices, WebSockets, CLI apps.
	-
	- ## Advantages
		- Enforced structure — scales well in large teams.
		- Built-in dependency injection — clean, testable code.
		- TypeScript-first — full type safety out of the box.
		- Rich ecosystem: built-in support for TypeORM, Prisma, GraphQL, WebSockets, queues.
		- Excellent documentation.
		- Angular developers feel right at home.
	-
	- ## Disadvantages
		- Steep learning curve — lots of concepts (decorators, DI, modules).
		- Overkill for small/simple APIs.
		- Heavy boilerplate compared to Express.
		- Decorator-heavy code can feel verbose.
- # Setup & CLI
  collapsed:: true
	- ## Installation
	  collapsed:: true
		- ```bash
		  npm install -g @nestjs/cli
		  
		  nest new my-app          # create new project
		  cd my-app
		  npm run start            # start server
		  npm run start:dev        # start with hot reload (nodemon)
		  npm run start:prod       # run compiled build
		  npm run build            # compile TypeScript → dist/
		  npm run test             # run unit tests
		  npm run test:e2e         # run end-to-end tests
		  ```
	-
	- ## CLI Generators
	  collapsed:: true
		- ```bash
		  nest generate module    users        # src/users/users.module.ts
		  nest generate controller users       # src/users/users.controller.ts
		  nest generate service   users        # src/users/users.service.ts
		  nest generate resource  users        # generates all 3 + DTO + CRUD boilerplate
		  
		  nest g mo users    # shorthand
		  nest g co users
		  nest g s  users
		  nest g res users
		  
		  nest g guard   auth          # auth.guard.ts
		  nest g interceptor logging   # logging.interceptor.ts
		  nest g pipe    validation    # validation.pipe.ts
		  nest g middleware logger     # logger.middleware.ts
		  ```
	-
	- ## Project Structure
	  collapsed:: true
		- ```
		  src/
		  ├── main.ts                  ← bootstrap, starts app
		  ├── app.module.ts            ← root module
		  ├── app.controller.ts        ← root controller
		  ├── app.service.ts           ← root service
		  └── users/
		      ├── users.module.ts
		      ├── users.controller.ts
		      ├── users.service.ts
		      ├── dto/
		      │   ├── create-user.dto.ts
		      │   └── update-user.dto.ts
		      └── entities/
		          └── user.entity.ts
		  ```
- # Core Building Blocks
  collapsed:: true
	- ## main.ts — Bootstrap
	  collapsed:: true
		- ```ts
		  import { NestFactory } from '@nestjs/core';
		  import { AppModule } from './app.module';
		  import { ValidationPipe } from '@nestjs/common';
		  
		  async function bootstrap() {
		      const app = await NestFactory.create(AppModule);
		  
		      // Global prefix for all routes
		      app.setGlobalPrefix('api');
		  
		      // Global validation pipe
		      app.useGlobalPipes(new ValidationPipe({
		          whitelist: true,       // strip unknown properties
		          forbidNonWhitelisted: true,
		          transform: true,       // auto-transform types
		      }));
		  
		      // Enable CORS
		      app.enableCors();
		  
		      await app.listen(3000);
		      console.log('App running on http://localhost:3000');
		  }
		  bootstrap();
		  ```
	-
	- ## Module
	  collapsed:: true
		- The fundamental unit — organizes related controllers, services, and providers.
		- ```ts
		  import { Module } from '@nestjs/common';
		  import { UsersController } from './users.controller';
		  import { UsersService } from './users.service';
		  
		  @Module({
		      imports:     [],              // other modules this module needs
		      controllers: [UsersController],
		      providers:   [UsersService],  // services, guards, pipes, etc.
		      exports:     [UsersService],  // make available to other modules
		  })
		  export class UsersModule {}
		  ```
	-
	- ## Controller
	  collapsed:: true
		- Handles incoming HTTP requests and returns responses.
		- ```ts
		  import { Controller, Get, Post, Put, Delete,
		           Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
		  import { UsersService } from './users.service';
		  import { CreateUserDto } from './dto/create-user.dto';
		  
		  @Controller('users')  // route prefix: /users
		  export class UsersController {
		      constructor(private readonly usersService: UsersService) {}
		  
		      @Get()
		      findAll(@Query('page') page = 1) {
		          return this.usersService.findAll(+page);
		      }
		  
		      @Get(':id')
		      findOne(@Param('id') id: string) {
		          return this.usersService.findOne(+id);
		      }
		  
		      @Post()
		      @HttpCode(HttpStatus.CREATED)
		      create(@Body() createUserDto: CreateUserDto) {
		          return this.usersService.create(createUserDto);
		      }
		  
		      @Put(':id')
		      update(@Param('id') id: string, @Body() dto: CreateUserDto) {
		          return this.usersService.update(+id, dto);
		      }
		  
		      @Delete(':id')
		      @HttpCode(HttpStatus.NO_CONTENT)
		      remove(@Param('id') id: string) {
		          return this.usersService.remove(+id);
		      }
		  }
		  ```
	-
	- ## Service (Provider)
	  collapsed:: true
		- Contains business logic — injected into controllers via DI.
		- ```ts
		  import { Injectable, NotFoundException } from '@nestjs/common';
		  import { CreateUserDto } from './dto/create-user.dto';
		  
		  @Injectable()
		  export class UsersService {
		      private users = [];
		  
		      findAll(page: number) {
		          return this.users;
		      }
		  
		      findOne(id: number) {
		          const user = this.users.find(u => u.id === id);
		          if (!user) throw new NotFoundException(`User #${id} not found`);
		          return user;
		      }
		  
		      create(dto: CreateUserDto) {
		          const user = { id: Date.now(), ...dto };
		          this.users.push(user);
		          return user;
		      }
		  
		      update(id: number, dto: CreateUserDto) {
		          const user = this.findOne(id);
		          Object.assign(user, dto);
		          return user;
		      }
		  
		      remove(id: number) {
		          const idx = this.users.findIndex(u => u.id === id);
		          if (idx === -1) throw new NotFoundException(`User #${id} not found`);
		          this.users.splice(idx, 1);
		      }
		  }
		  ```
- # DTOs & Validation
  collapsed:: true
	- ## Setup
	  collapsed:: true
		- ```bash
		  npm install class-validator class-transformer
		  ```
	-
	- ## DTO with Validation
	  collapsed:: true
		- ```ts
		  import { IsString, IsEmail, IsInt, Min, Max,
		           IsOptional, MinLength } from 'class-validator';
		  
		  export class CreateUserDto {
		      @IsString()
		      @MinLength(2)
		      name: string;
		  
		      @IsEmail()
		      email: string;
		  
		      @IsInt()
		      @Min(0)
		      @Max(120)
		      age: number;
		  
		      @IsOptional()
		      @IsString()
		      bio?: string;
		  }
		  ```
		- ```ts
		  // update-user.dto.ts — make all fields optional
		  import { PartialType } from '@nestjs/mapped-types';
		  import { CreateUserDto } from './create-user.dto';
		  
		  export class UpdateUserDto extends PartialType(CreateUserDto) {}
		  ```
	-
	- ## Common Validators
	  collapsed:: true
		- ```
		  Decorator              Validates
		  @IsString()            string
		  @IsNumber()            number
		  @IsInt()               integer
		  @IsBoolean()           boolean
		  @IsEmail()             email format
		  @IsUrl()               URL format
		  @IsUUID()              UUID format
		  @IsDate()              Date object
		  @IsArray()             array
		  @IsEnum(MyEnum)        enum value
		  @MinLength(n)          string min length
		  @MaxLength(n)          string max length
		  @Min(n)                number min value
		  @Max(n)                number max value
		  @IsOptional()          field can be undefined
		  @IsNotEmpty()          not empty string/array
		  @ValidateNested()      validate nested object
		  @Type(() => NestedDto) transform nested type
		  ```
- # Dependency Injection
  collapsed:: true
	- ## How DI Works
	  collapsed:: true
		- NestJS has a built-in IoC (Inversion of Control) container.
		- Mark a class with `@Injectable()` → NestJS manages its lifecycle.
		- Inject via constructor — NestJS resolves dependencies automatically.
		- ```ts
		  @Injectable()
		  export class EmailService {
		      send(to: string, subject: string) { /* ... */ }
		  }
		  
		  @Injectable()
		  export class UsersService {
		      // NestJS injects EmailService automatically
		      constructor(private emailService: EmailService) {}
		  
		      async create(dto: CreateUserDto) {
		          const user = await this.save(dto);
		          await this.emailService.send(user.email, 'Welcome!');
		          return user;
		      }
		  }
		  ```
	-
	- ## Custom Providers
	  collapsed:: true
		- ```ts
		  // Value provider
		  { provide: 'CONFIG', useValue: { apiKey: 'abc123' } }
		  
		  // Factory provider
		  {
		      provide: 'DB_CONNECTION',
		      useFactory: async (config: ConfigService) => {
		          return createConnection(config.get('DB_URL'));
		      },
		      inject: [ConfigService],
		  }
		  
		  // Inject custom provider
		  @Injectable()
		  export class AppService {
		      constructor(@Inject('CONFIG') private config: any) {}
		  }
		  ```
- # Guards, Interceptors, Pipes, Middleware
  collapsed:: true
	- ## Guards — Authentication / Authorization
	  collapsed:: true
		- Runs before the route handler. Returns `true` (allow) or `false` (deny).
		- ```ts
		  import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
		  
		  @Injectable()
		  export class AuthGuard implements CanActivate {
		      canActivate(context: ExecutionContext): boolean {
		          const request = context.switchToHttp().getRequest();
		          const token = request.headers.authorization;
		          return !!token; // simple check — use JWT in production
		      }
		  }
		  
		  // Apply to single route
		  @Get('profile')
		  @UseGuards(AuthGuard)
		  getProfile() { ... }
		  
		  // Apply to entire controller
		  @Controller('users')
		  @UseGuards(AuthGuard)
		  export class UsersController { ... }
		  
		  // Apply globally in main.ts
		  app.useGlobalGuards(new AuthGuard());
		  ```
	-
	- ## Interceptors — Transform response / logging
	  collapsed:: true
		- Wraps the route handler — runs before AND after.
		- ```ts
		  import { Injectable, NestInterceptor, ExecutionContext,
		           CallHandler } from '@nestjs/common';
		  import { Observable } from 'rxjs';
		  import { map, tap } from 'rxjs/operators';
		  
		  // Wrap all responses in { data: ... }
		  @Injectable()
		  export class TransformInterceptor implements NestInterceptor {
		      intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		          return next.handle().pipe(
		              map(data => ({ data, success: true }))
		          );
		      }
		  }
		  
		  // Logging interceptor
		  @Injectable()
		  export class LoggingInterceptor implements NestInterceptor {
		      intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		          const start = Date.now();
		          return next.handle().pipe(
		              tap(() => console.log(`Request took ${Date.now() - start}ms`))
		          );
		      }
		  }
		  
		  @UseInterceptors(TransformInterceptor)
		  @Controller('users')
		  export class UsersController { ... }
		  ```
	-
	- ## Pipes — Transform & validate input
	  collapsed:: true
		- ```ts
		  // Built-in pipes
		  @Get(':id')
		  findOne(@Param('id', ParseIntPipe) id: number) {
		      // id is guaranteed to be a number — 400 if not
		      return this.usersService.findOne(id);
		  }
		  
		  // Built-in pipes list:
		  // ParseIntPipe, ParseFloatPipe, ParseBoolPipe,
		  // ParseArrayPipe, ParseUUIDPipe, ParseEnumPipe,
		  // DefaultValuePipe, ValidationPipe
		  
		  // Custom pipe
		  @Injectable()
		  export class TrimPipe implements PipeTransform {
		      transform(value: any) {
		          if (typeof value === 'string') return value.trim();
		          return value;
		      }
		  }
		  ```
	-
	- ## Middleware
	  collapsed:: true
		- ```ts
		  import { Injectable, NestMiddleware } from '@nestjs/common';
		  
		  @Injectable()
		  export class LoggerMiddleware implements NestMiddleware {
		      use(req: Request, res: Response, next: () => void) {
		          console.log(`[${req.method}] ${req.url}`);
		          next();
		      }
		  }
		  
		  // Apply in module
		  export class AppModule implements NestModule {
		      configure(consumer: MiddlewareConsumer) {
		          consumer
		              .apply(LoggerMiddleware)
		              .forRoutes('*');  // or specific routes/controllers
		      }
		  }
		  ```
- # Exception Filters
  collapsed:: true
	- ## Built-in HTTP Exceptions
	  collapsed:: true
		- ```ts
		  import {
		      BadRequestException,      // 400
		      UnauthorizedException,    // 401
		      ForbiddenException,       // 403
		      NotFoundException,        // 404
		      ConflictException,        // 409
		      UnprocessableEntityException, // 422
		      InternalServerErrorException, // 500
		  } from '@nestjs/common';
		  
		  throw new NotFoundException('User not found');
		  throw new BadRequestException('Invalid email format');
		  throw new ConflictException('Email already exists');
		  ```
	-
	- ## Custom Exception Filter
	  collapsed:: true
		- ```ts
		  import { ExceptionFilter, Catch, ArgumentsHost,
		           HttpException } from '@nestjs/common';
		  
		  @Catch(HttpException)
		  export class HttpExceptionFilter implements ExceptionFilter {
		      catch(exception: HttpException, host: ArgumentsHost) {
		          const ctx = host.switchToHttp();
		          const res = ctx.getResponse();
		          const status = exception.getStatus();
		  
		          res.status(status).json({
		              statusCode: status,
		              message: exception.message,
		              timestamp: new Date().toISOString(),
		          });
		      }
		  }
		  
		  // Apply globally
		  app.useGlobalFilters(new HttpExceptionFilter());
		  ```
- # Configuration
  collapsed:: true
	- ## @nestjs/config
	  collapsed:: true
		- ```bash
		  npm install @nestjs/config
		  ```
		- ```ts
		  // app.module.ts
		  import { ConfigModule } from '@nestjs/config';
		  
		  @Module({
		      imports: [
		          ConfigModule.forRoot({
		              isGlobal: true,    // available in all modules
		              envFilePath: '.env',
		          }),
		      ],
		  })
		  export class AppModule {}
		  ```
		- ```ts
		  // Inject and use
		  import { ConfigService } from '@nestjs/config';
		  
		  @Injectable()
		  export class AppService {
		      constructor(private config: ConfigService) {}
		  
		      getDatabaseUrl() {
		          return this.config.get<string>('DB_URL');
		      }
		  }
		  ```
	-
	- ## Typed Config with Validation
	  collapsed:: true
		- ```ts
		  // config/app.config.ts
		  import { registerAs } from '@nestjs/config';
		  
		  export default registerAs('app', () => ({
		      port: parseInt(process.env.PORT, 10) || 3000,
		      dbUrl: process.env.DB_URL,
		      jwtSecret: process.env.JWT_SECRET,
		  }));
		  
		  // Inject namespace config
		  constructor(
		      @Inject(appConfig.KEY)
		      private config: ConfigType<typeof appConfig>
		  ) {}
		  
		  this.config.port    // typed as number
		  this.config.dbUrl   // typed as string
		  ```
- # Database with TypeORM
  collapsed:: true
	- ## Setup
	  collapsed:: true
		- ```bash
		  npm install @nestjs/typeorm typeorm pg   # PostgreSQL
		  # or
		  npm install @nestjs/typeorm typeorm mysql2  # MySQL
		  ```
		- ```ts
		  // app.module.ts
		  import { TypeOrmModule } from '@nestjs/typeorm';
		  
		  @Module({
		      imports: [
		          TypeOrmModule.forRoot({
		              type: 'postgres',
		              host: process.env.DB_HOST,
		              port: 5432,
		              username: process.env.DB_USER,
		              password: process.env.DB_PASS,
		              database: process.env.DB_NAME,
		              entities: [__dirname + '/**/*.entity{.ts,.js}'],
		              synchronize: true,  // auto-create tables (dev only!)
		          }),
		      ],
		  })
		  export class AppModule {}
		  ```
	-
	- ## Entity
	  collapsed:: true
		- ```ts
		  import { Entity, PrimaryGeneratedColumn, Column,
		           CreateDateColumn, UpdateDateColumn } from 'typeorm';
		  
		  @Entity('users')
		  export class User {
		      @PrimaryGeneratedColumn()
		      id: number;
		  
		      @Column()
		      name: string;
		  
		      @Column({ unique: true })
		      email: string;
		  
		      @Column({ select: false })  // exclude from queries by default
		      password: string;
		  
		      @Column({ default: true })
		      isActive: boolean;
		  
		      @CreateDateColumn()
		      createdAt: Date;
		  
		      @UpdateDateColumn()
		      updatedAt: Date;
		  }
		  ```
	-
	- ## Repository Pattern
	  collapsed:: true
		- ```ts
		  // users.module.ts
		  @Module({
		      imports: [TypeOrmModule.forFeature([User])],
		      controllers: [UsersController],
		      providers: [UsersService],
		  })
		  export class UsersModule {}
		  
		  // users.service.ts
		  import { InjectRepository } from '@nestjs/typeorm';
		  import { Repository } from 'typeorm';
		  
		  @Injectable()
		  export class UsersService {
		      constructor(
		          @InjectRepository(User)
		          private usersRepo: Repository<User>
		      ) {}
		  
		      findAll() { return this.usersRepo.find(); }
		  
		      findOne(id: number) {
		          return this.usersRepo.findOneBy({ id });
		      }
		  
		      create(dto: CreateUserDto) {
		          const user = this.usersRepo.create(dto);
		          return this.usersRepo.save(user);
		      }
		  
		      async update(id: number, dto: UpdateUserDto) {
		          await this.usersRepo.update(id, dto);
		          return this.findOne(id);
		      }
		  
		      remove(id: number) {
		          return this.usersRepo.delete(id);
		      }
		  }
		  ```
- # JWT Authentication
  collapsed:: true
	- ## Setup
	  collapsed:: true
		- ```bash
		  npm install @nestjs/jwt @nestjs/passport passport passport-jwt
		  npm install -D @types/passport-jwt
		  ```
	-
	- ## Auth Module
	  collapsed:: true
		- ```ts
		  // auth.module.ts
		  @Module({
		      imports: [
		          UsersModule,
		          JwtModule.registerAsync({
		              imports: [ConfigModule],
		              useFactory: (config: ConfigService) => ({
		                  secret: config.get('JWT_SECRET'),
		                  signOptions: { expiresIn: '7d' },
		              }),
		              inject: [ConfigService],
		          }),
		      ],
		      providers: [AuthService, JwtStrategy],
		      controllers: [AuthController],
		  })
		  export class AuthModule {}
		  ```
		- ```ts
		  // auth.service.ts
		  @Injectable()
		  export class AuthService {
		      constructor(
		          private usersService: UsersService,
		          private jwtService: JwtService,
		      ) {}
		  
		      async login(email: string, password: string) {
		          const user = await this.usersService.findByEmail(email);
		          if (!user || !await bcrypt.compare(password, user.password))
		              throw new UnauthorizedException('Invalid credentials');
		  
		          const payload = { sub: user.id, email: user.email };
		          return { access_token: this.jwtService.sign(payload) };
		      }
		  }
		  ```
		- ```ts
		  // jwt.strategy.ts
		  @Injectable()
		  export class JwtStrategy extends PassportStrategy(Strategy) {
		      constructor(config: ConfigService) {
		          super({
		              jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		              secretOrKey: config.get('JWT_SECRET'),
		          });
		      }
		  
		      async validate(payload: { sub: number; email: string }) {
		          return { id: payload.sub, email: payload.email };
		          // returned value is attached to req.user
		      }
		  }
		  
		  // Protect routes
		  @Get('profile')
		  @UseGuards(AuthGuard('jwt'))
		  getProfile(@Request() req) {
		      return req.user;
		  }
		  ```
- # Request Lifecycle
  collapsed:: true
	- ```
	  Incoming Request
	       ↓
	  Middleware          (logger, cors, body-parser)
	       ↓
	  Guards              (auth check — can this user proceed?)
	       ↓
	  Interceptors (pre)  (logging start time, transform input)
	       ↓
	  Pipes               (validate & transform request data)
	       ↓
	  Route Handler       (controller method)
	       ↓
	  Interceptors (post) (transform response, log duration)
	       ↓
	  Exception Filters   (catch any thrown exceptions)
	       ↓
	  Response
	  ```
-
- # Key Takeaways
	- NestJS = Angular architecture on the backend — modules, DI, decorators.
	- Every feature = its own **Module** containing controllers + services.
	- **Guards** → auth, **Pipes** → validation/transform, **Interceptors** → wrap responses.
	- Use `ValidationPipe` globally with `whitelist: true` — always.
	- Use `@nestjs/config` for typed env variables.
	- Use `PartialType` for update DTOs — don't repeat yourself.
	- Request lifecycle order: Middleware → Guards → Interceptors → Pipes → Handler → Interceptors → Filters.
-
- # Useful Links
	- Official Docs: https://docs.nestjs.com
	- CLI Reference: https://docs.nestjs.com/cli/overview
	- TypeORM Docs: https://typeorm.io
	- Prisma + NestJS: https://docs.nestjs.com/recipes/prisma
	- Awesome NestJS: https://github.com/nestjs/awesome-nestjs
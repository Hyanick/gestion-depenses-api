import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.enableCors(); // Autorise les requêtes cross-origin (Angular)
  // Configure les infos générales de l'API dans Swagger


    const allowedOrigins = [
    'http://localhost:4200',                 // Angular en local
    'https://gestion-depenses-webvercel.vercel.app',            // <-- ton vrai domaine front en prod
    // 'https://www.ton-front-prod.com',     // si besoin
  ];

    app.enableCors({
    origin: (origin, callback) => {
      // origin peut être undefined (ex: Postman, curl, same-origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Gestion Dépenses API') // Titre affiché dans Swagger UI
    .setDescription('API CRUD pour la gestion de transactions (revenus / dépenses).') // Description
    .setVersion('1.0.0') // Version de l'API
    .addTag('transactions')
    // .addBearerAuth() // Décommente le jour où tu ajoutes JWT
    .build();

  // Génère le document OpenAPI à partir de tes controllers/dtos
  const document = SwaggerModule.createDocument(app, config);


  // Expose Swagger UI sur /api/docs
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
  console.log(process.env.DATABASE_URL);
}
bootstrap();

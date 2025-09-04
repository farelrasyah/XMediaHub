import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableCors({ origin: '*', methods: 'GET,HEAD,OPTIONS' });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('XMediaHub API')
    .setDescription('API for downloading media from Twitter')
    .setVersion('1.0')
    .addTag('twitter', 'Twitter media endpoints')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  await app.listen(port);
  console.log(`🚀 Nest server listening on http://localhost:${port}`);
  console.log(`📖 Swagger UI available at http://localhost:${port}/api`);
}
bootstrap();

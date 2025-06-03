import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsCatcher } from './common/exception-catcher.filter';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
app.enableCors({
  origin: ['http://localhost:3001','http://127.0.0.1:3001'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});

  app.useGlobalFilters(
  new AllExceptionsCatcher(),
);

  const config = new DocumentBuilder()
    .setTitle('Your API Title')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('tag-name') 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // Swagger will be served at /api-docs


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

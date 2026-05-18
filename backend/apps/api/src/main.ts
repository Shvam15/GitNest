import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet'

async function main() {
  const app = await NestFactory.create(AppModule);

  // helmets
  app.use(helmet())

  // validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }))

  // CORS
  app.enableCors()

  // prefix
  app.setGlobalPrefix('api')

  // start
  await app.listen(process.env.PORT ?? 8080);
  
  console.log(
    `🚀 Application is running on: http://localhost:${process.env.PORT ?? 8080}`
  );
}
main();

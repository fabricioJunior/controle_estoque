import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {

  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:63263',
      'https://estoque-online-e8o1ptnfp-fabriciojuniors-projects.vercel.app'
    ],
    methods: ["GET", "POST"],
    credentials: true,
  });
  await app.listen(process.env.PORT || 5000);
}
bootstrap();

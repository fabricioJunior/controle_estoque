import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {

  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:63263',
      'http://localhost:56914',
      'https://estoque-online-e8o1ptnfp-fabriciojuniors-projects.vercel.app',
      'https://estoque-online-git-main-fabriciojuniors-projects.vercel.app',
      'https://use-por-onde-flor.vercel.app',
      'https://www.useporondeflor.com.br'
    ],
    methods: ["GET", "POST"],
    credentials: false,
  });
  await app.listen(process.env.PORT || 5080);
}
bootstrap();

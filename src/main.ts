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
      'https://use-por-onde-flor-bcycwolyu-fabriciojuniors-projects.vercel.app',
      'https://use-por-onde-flor-git-master-fabriciojuniors-projects.vercel.app',
      'https://www.useporondeflor.com.br',
      'useporondeflor.com.br',
      'http://useporondeflor.com.br',
      'https://useporondeflor.com.br'
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false,
  });
  await app.listen(process.env.PORT || 5080);
}
bootstrap();

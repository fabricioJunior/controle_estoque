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
      'https://useporondeflor.com.br',
      'http://localhost:4200',
      'https://use-por-onde-flor-kpbg-45l5fb1pc-fabriciojuniors-projects.vercel.app',
      'https://use-por-onde-flor-kpbg-git-develop-fabriciojuniors-projects.vercel.app',
      'https://use-por-onde-flor-kpbg.vercel.app'
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  });
  await app.listen(process.env.PORT || 5080);
}
bootstrap();

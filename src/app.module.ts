import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstoqueService } from './estoque/estoque.service';
import { EstoqueController } from './estoque/estoque.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';



@Module({
  imports: [ConfigModule.forRoot(), MongooseModule.forRoot('mongodb://localhost/nest')],
  controllers: [AppController, EstoqueController],
  providers: [AppService, EstoqueService],
})
export class AppModule {}

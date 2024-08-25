import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstoqueService } from './estoque/estoque.service';
import { EstoqueController } from './estoque/estoque.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EstoqueModule } from './estoque/estoque.module';



@Module({
  imports: [ EstoqueModule, ConfigModule.forRoot(), MongooseModule.forRoot('mongodb://localhost:27017/produtos')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

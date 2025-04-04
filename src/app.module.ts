import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstoqueService } from './estoque/estoque.service';
import { EstoqueController } from './estoque/estoque.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EstoqueModule } from './estoque/estoque.module';
import { ProdutoPedidoModulo } from './produto.pedido/produto.pedido.modulo';



@Module({
  imports: [EstoqueModule, ProdutoPedidoModulo, ConfigModule.forRoot(), MongooseModule.forRoot('mongodb+srv://fabriciojamescarneiro:Z4S8WvIZgcPEYjsi@estoque-cluster.dvcvp.mongodb.net/produtos?retryWrites=true&w=majority&appName=estoque-cluster/')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

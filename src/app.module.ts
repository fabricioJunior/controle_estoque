import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstoqueService } from './estoque/estoque.service';
import { EstoqueController } from './estoque/estoque.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EstoqueModule } from './estoque/estoque.module';
import { PedidosModulo } from './pedidos/pedidos.module';
import { HttpModule } from '@nestjs/axios';
import { FiscalModule } from './fiscal/fiscal.module';
import { PagamentoModule } from './pagamentos/pagamento.module';



@Module({
  imports: [
    EstoqueModule,
    PedidosModulo,
    FiscalModule,
    PagamentoModule,
    ConfigModule.forRoot(),
    HttpModule,
    MongooseModule.forRoot('mongodb+srv://fabriciojamescarneiro:Z4S8WvIZgcPEYjsi@estoque-cluster.dvcvp.mongodb.net/produtos?retryWrites=true&w=majority&appName=estoque-cluster/'),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

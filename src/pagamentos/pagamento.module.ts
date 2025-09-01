import { Module } from "@nestjs/common";
import { PagamentoController } from "./pagamento.controller";
import { PedidosModulo } from "src/pedidos/pedidos.module";
import { PagamentoService } from "./pagamento.service";
import { MongooseModule } from "@nestjs/mongoose";
import { PagamentoOnlineModel, PagamentoOnlineSchema } from "./models/pagamento.online.model";

@Module({
    controllers: [PagamentoController],
    imports: [PedidosModulo, MongooseModule.forFeature([{ name: PagamentoOnlineModel.name, schema: PagamentoOnlineSchema }])],
    providers: [PagamentoService],
})
export class PagamentoModule {

}
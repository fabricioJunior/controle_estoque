import { Module } from "@nestjs/common";
import { PagamentoController } from "./pagamento.controller";
import { PedidosModulo } from "src/pedidos/pedidos.module";
import { PagamentoService } from "./pagamento.service";

@Module({
    controllers: [PagamentoController],
    imports: [PedidosModulo],
    providers: [PagamentoService],
})
export class PagamentoModule {

}
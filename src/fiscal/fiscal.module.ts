import { Module } from "@nestjs/common";
import { FiscalController } from "./fiscal.controller";
import { PedidosService } from "src/pedidos/pedidos.service";
import { FiscalService } from "./fiscal.service";
import { HttpModule, HttpService } from "@nestjs/axios";
import { PedidosModulo } from "src/pedidos/pedidos.modulo";

@Module({
    imports: [HttpModule, PedidosModulo],
    controllers: [FiscalController],
    providers: [FiscalService],
})
export class FiscalModule {

}
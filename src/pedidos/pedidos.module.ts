import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PedidosController } from "./pedidos.controller";
import { PedidosService } from "./pedidos.service";
import { PedidoModel, PedidoSchema } from "./models/pedido.model";

@Module({
    imports: [MongooseModule.forFeature([{ name: PedidoModel.name, schema: PedidoSchema }])],
    controllers: [PedidosController],
    providers: [PedidosService],
    exports: [PedidosService]
})
export class PedidosModulo {

}
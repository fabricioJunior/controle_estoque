import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProdutoPedido, ProdutoPedidoSchema } from "./models/produto.pedido.entity";
import { ProdutoPedidoController } from "./produto.pedido.controller";
import { ProdutoPedidoService } from "./produto.pedido.service";

@Module({
    imports: [MongooseModule.forFeature([{ name: ProdutoPedido.name, schema: ProdutoPedidoSchema }])],
    controllers: [ProdutoPedidoController],
    providers: [ProdutoPedidoService],
})
export class ProdutoPedidoModulo {

}
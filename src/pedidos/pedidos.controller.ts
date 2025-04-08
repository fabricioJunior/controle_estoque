import { Body, Controller, Get, Post } from "@nestjs/common";
import { PedidosService as PedidosService } from "./pedidos.service";
import { ProdutoPedidoModel } from "./models/produto.pedido.model";
import { ProdutoPedidoDto } from "./dto/produto.pedido.dto";
import { log } from "console";
import { PedidoModel } from "./models/pedido.model";

@Controller('Pedidos')
export class PedidosController {

    constructor(private estoqueService: PedidosService) { }

    @Get()
    async get(): Promise<PedidoModel[]> {
        return this.estoqueService.findAll();

    }

    @Post()
    async create(@Body() produtos: PedidoModel[]) {


        for (var produto of produtos) {
            await this.estoqueService.upsert(produto);
        }


        return 'sucess';
    }
}

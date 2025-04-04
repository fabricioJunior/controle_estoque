import { Body, Controller, Get, Post } from "@nestjs/common";
import { ProdutoPedidoService } from "./produto.pedido.service";
import { ProdutoPedido } from "./models/produto.pedido.entity";
import { ProdutoPedidoDto } from "./dto/produto.pedido.dto";

@Controller('produtoPedido')
export class ProdutoPedidoController {

    constructor(private estoqueService: ProdutoPedidoService) { }

    @Get()
    async get(): Promise<ProdutoPedido[]> {
        return this.estoqueService.findAll();

    }

    @Post()
    async create(@Body() produtos: ProdutoPedidoDto[]) {
        produtos.forEach(
            (produto) => this.estoqueService.upsert(produto)
        );

        return 'sucess';
    }
}

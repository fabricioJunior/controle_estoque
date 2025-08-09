import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { PedidosService } from "src/pedidos/pedidos.service";
import { PagamentoService } from "./pagamento.service";
import { PagamentoRequestDto } from "./dtos/pagamento.request.dto";
import { PagamentoResultDto } from "./dtos/pagamento.result.dto";
import { PagamentoModel } from "src/pedidos/models/pagamento.model";
import { PagamentoPendenteDto } from "./dtos/pagamento.pendente.dto";

@Controller('pagamento')
export class PagamentoController {

    constructor(private pedidosService: PedidosService, private pagamentoService: PagamentoService) { }

    @Get('pedidosComPagamentoPendente')
    async pedidosComPagamentoPendente() {
        var pedidos = await this.pedidosService.pedidosComPagamentoPendente();
        return pedidos;
    }
    @Get('pedidoComPagamentoPendente')
    async pedidoComPagamentoPendente(@Query('idPedido') idPedido: string) {
        var pedido = await this.pedidosService.findById(Number.parseInt(idPedido));

        var result = new PagamentoPendenteDto({
            idPedido: idPedido,
            notaFiscal: pedido?.urlDanfe,
            pendente: pedido?.pagamentoPendente ?? false
        });
        return result;
    }

    @Get('url')
    async get(@Query('idPedido') idPedido: string) {
        var pedido = await this.pedidosService.findById(Number.parseInt(idPedido));
        var pagamentoRequest = new PagamentoRequestDto({
            handler: 'useporondeflor',
            items: pedido.produtos.map(produto => ({
                name: produto.descricao,
                price: 100 * produto.valor,
                quantity: produto.quantidade
            })),
            orderNsu: pedido.id.toString(),
            redirectUrl: 'https://estoque-online-git-main-fabriciojuniors-projects.vercel.app/pagamento'
        });
        console.log(pagamentoRequest);
        var url = this.pagamentoService.gerarUrlDePagamento(pagamentoRequest);
        console.log(url);
        pedido.pagamentoPendente = true;

        pedido.urlDePagamento = url;
        await this.pedidosService.updateFromModel(pedido);
        return pedido;
    }
    @Post()
    async post(@Body() pagamento: PagamentoResultDto) {
        var pedido = await this.pedidosService.findById(Number.parseInt(pagamento.idPedido));
        var valorPagamento = pedido.pagamentos.reduce((total, pag) => total + pag.valor, 0);

        var pagamentoModel = new PagamentoModel({
            formaDePagamento: pagamento.formaDePagamento,
            valor: valorPagamento,
            slug: pagamento.slug,
            orderNsu: pagamento.idPedido,
            transacaoId: pagamento.transanctionId,
        });
        pedido.pagamentos = [pagamentoModel];
        pedido.pagamentoPendente = false;
        return this.pedidosService.updateFromModel(pedido);
    }

    @Post('cancelar')
    async cancelarPagamento(@Query('idPedido') idPedido: string) {
        var pedido = await this.pedidosService.findById(Number.parseInt(idPedido));
        pedido.pagamentoPendente = false;
        return this.pedidosService.updateFromModel(pedido);
    }
}
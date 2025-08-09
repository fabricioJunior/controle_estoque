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
            pendente: pedido?.pagamentoPendente ?? false,
            comprovante: pedido.urlComprovante,
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
            redirectUrl: 'https://use-por-onde-flor.vercel.app/pagamento'
        });
        console.log(pagamentoRequest);
        var url = this.pagamentoService.gerarUrlDePagamento(pagamentoRequest);
        console.log(url);
        pedido.pagamentoPendente = true;

        pedido.urlDePagamento = url;
        await this.pedidosService.updateFromModel(pedido);
        return url;
    }
    //http://localhost:4200/pagamento?capture_method=pix&transaction_id=6a2b67ec-5d41-4e9d-979b-e63675f8c96b&transaction_nsu=6a2b67ec-5d41-4e9d-979b-e63675f8c96b&slug=21TGnE5n3v&order_nsu=7629&receipt_url=https:%2F%2Frecibo.infinitepay.io%2F6a2b67ec-5d41-4e9d-979b-e63675f8c96b
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
            comprovanteDePagamento: pagamento.comprovanteDePagamento
        });
        pedido.pagamentos = [pagamentoModel];
        pedido.pagamentoPendente = false;
        pedido.urlComprovante = pagamento.comprovanteDePagamento;
        this.pedidosService.upsert(pedido);
        return new PagamentoPendenteDto({
            comprovante: pedido.urlComprovante,
            notaFiscal: pedido.urlDanfe,
            pendente: false,
            idPedido: pedido.id.toString(),
        });

    }

    @Post('cancelar')
    async cancelarPagamento(@Query('idPedido') idPedido: string) {
        var pedido = await this.pedidosService.findById(Number.parseInt(idPedido));
        pedido.pagamentoPendente = false;
        return this.pedidosService.updateFromModel(pedido);
    }
}
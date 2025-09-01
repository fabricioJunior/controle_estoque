import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { PedidosService } from "src/pedidos/pedidos.service";
import { PagamentoService } from "./pagamento.service";
import { PagamentoRequestDto } from "./dtos/pagamento.request.dto";
import { PagamentoResultDto } from "./dtos/pagamento.result.dto";
import { PagamentoModel } from "src/pedidos/models/pagamento.model";
import { PagamentoPendenteDto } from "./dtos/pagamento.pendente.dto";
import { PedidoModel } from "src/pedidos/models/pedido.model";
import { PagamentoOnlineModel } from "./models/pagamento.online.model";
import { PagamentoDto } from "src/pedidos/dto/pagamento.dto";

@Controller('pagamento')
export class PagamentoController {

    constructor(private pedidosService: PedidosService, private pagamentoService: PagamentoService) { }

    @Get('pedidosComPagamentoPendente')
    async pedidosComPagamentoPendente() {
        var pedidos = await this.pedidosService.pedidosComPagamentoPendente();
        return pedidos;
    }


    @Get('pedidoComPagamentoPendente')
    async pedidoComPagamentoPendente(@Query('idPedido') idPedido?: string, @Query('orderNsu') orderNsu?: string,): Promise<PagamentoPendenteDto> {
        if (idPedido === null) {
            var pagamento = await this.pagamentoService.obterPagamentoOnlinePorNsu(orderNsu);
            var result = new PagamentoPendenteDto({
                notaFiscal: pagamento?.urlComprovante,
                pendente: pagamento?.pendente ?? false,
                comprovante: pagamento?.urlComprovante,
                orderNsu: pagamento.orderNsu,
            });
            return result;
        }
        var pedido = await this.pedidosService.findById(Number.parseInt(idPedido));
        var result = new PagamentoPendenteDto({
            idPedido: idPedido,
            notaFiscal: pedido?.urlDanfe,
            pendente: pedido?.pagamentoPendente ?? false,
            comprovante: pedido?.urlComprovante,
        });
        return result;
    }

    @Get('url')
    async get(@Query('idPedido') idPedido?: string, @Query('orderNsu') orderNsu?: string, @Query('valor') valor?: number, @Query('identificador') identificador?: string): Promise<string> {
        if (orderNsu == null && idPedido == null) {
            throw new Error('idPedido ou orderNsu deve ser informado');

        }
        if (idPedido == null && valor == null) {
            throw new Error('valor deve ser informado quando hashDePagamento for informado');
        }
        if (idPedido == null) {
            var pagamentoRequest = new PagamentoRequestDto({
                handler: 'useporondeflor',
                items: [
                    {
                        name: 'Pagamento avulso ' + (identificador != null ? identificador : ''),
                        price: valor * 100,
                        quantity: 1
                    }
                ],
                orderNsu: orderNsu,
                valor: valor,
                redirectUrl: 'https://useporondeflor.com.br/pagamento',
                identificadorExterno: identificador,
            });
            var url = this.pagamentoService.gerarUrlDePagamento(pagamentoRequest);
            var pagamentoOnline = await this.pagamentoService.criarPagamentoOnline(pagamentoRequest);
            return pagamentoOnline?.urlPagamento;
        }

        var pedido = await this.pedidosService.findById(Number.parseInt(idPedido));

        var pagamentoRequest = new PagamentoRequestDto({
            handler: 'useporondeflor',
            items: pedido.produtos.map(produto => ({
                name: produto.descricao,
                price: 100 * produto.valor,
                quantity: produto.quantidade
            })),
            orderNsu: pedido.id.toString(),
            redirectUrl: 'https://useporondeflor.com.br/pagamento'
        });

        var url = this.pagamentoService.gerarUrlDePagamento(pagamentoRequest);

        pedido.pagamentoPendente = true;
        console.log(pedido.pagamentoPendente);
        pedido.urlDePagamento = url;
        var result = await this.pedidosService.updateFromModel(pedido);
        return url;
    }
    //http://localhost:4200/pagamento?capture_method=pix&transaction_id=6a2b67ec-5d41-4e9d-979b-e63675f8c96b&transaction_nsu=6a2b67ec-5d41-4e9d-979b-e63675f8c96b&slug=21TGnE5n3v&order_nsu=7629&receipt_url=https:%2F%2Frecibo.infinitepay.io%2F6a2b67ec-5d41-4e9d-979b-e63675f8c96b
    @Post()
    async post(@Body() pagamento: PagamentoResultDto): Promise<PagamentoPendenteDto> {
        if (pagamento.idPedido == null) {
            var pagamentoOnline = await this.pagamentoService.obterPagamentoOnlinePorNsu(pagamento.nsu);
            if (pagamentoOnline == null) {
                throw new Error('Pagamento online não encontrado para o nsu informado');
            }
            pagamentoOnline.slug = pagamento.slug;
            pagamentoOnline.transacaoId = pagamento.transanctionId;
            pagamentoOnline.urlComprovante = pagamento.comprovanteDePagamento;

        }
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
        if (pedido.pagamentos == null || pedido.pagamentos.length == 0) {
            pedido.pagamentos = [];
        }
        pedido.pagamentos.push(pagamentoModel);
        pedido.pagamentoPendente = false;
        pedido.urlComprovante = pagamento.comprovanteDePagamento;
        this.pedidosService.updateFromModel(pedido);
        return new PagamentoPendenteDto({
            comprovante: pedido.urlComprovante,
            notaFiscal: pedido.urlDanfe,
            pendente: false,
            idPedido: pedido.id.toString(),
        });

    }



    @Post('cancelar')
    async cancelarPagamento(@Query('idPedido') idPedido?: string, @Query('orderNsu') orderNsu?: string): Promise<PagamentoPendenteDto> {
        if (idPedido == null) {
            var pagamento = await this.pagamentoService.cancelarPagamento(orderNsu);

            return new PagamentoPendenteDto(
                {
                    comprovante: pagamento.urlComprovante,
                    pendente: false,
                    orderNsu: pagamento.orderNsu,
                }
            );
        }
        var pedido = await this.pedidosService.findById(Number.parseInt(idPedido));
        pedido.pagamentoPendente = false;
        pedido = await this.pedidosService.updateFromModel(pedido);
        return new PagamentoPendenteDto({
            comprovante: pedido.urlComprovante,
            notaFiscal: pedido.urlDanfe,
            pendente: false,
            idPedido: pedido.id.toString(),
        });
    }

    @Post('ativar')
    async reativarPagamento(@Query('orderNsu') orderNsu: string): Promise<PagamentoOnlineModel> {
        var result = await this.pagamentoService.reativarPagamento(orderNsu);
        console.log(result);
        return result;
    }

    @Get('recuperarPagamentosOnline')
    async recuperarPagamentosOnline(@Query('identificador') identificador?: string, @Query('dataInicio') dataInicio?: Date, @Query('dataFim') dataFim?: Date
        , @Query('pagamentosDeHoje') pagamentosDeHoje?: Boolean
    ): Promise<PagamentoOnlineModel[]> {
        let filtro: any = {
            identificador: identificador,
            dataInicio: dataInicio,
            dataFim: dataFim,
        };
        console.log(pagamentosDeHoje);
        console.log(pagamentosDeHoje);
        if (pagamentosDeHoje) {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            const amanha = new Date(hoje);
            amanha.setDate(hoje.getDate() + 1);
            filtro.dataInicio = hoje;
            filtro.dataFim = amanha;
            console.log(filtro.dataFim);
            console.log(filtro.dataInicio);
        }
        return await this.pagamentoService.recuperarPagamentos(filtro);
    }
    @Get('pagamentoOnline')
    async getPagamento(@Query('orderNsu') orderNsu: string): Promise<PagamentoOnlineModel> {
        return this.pagamentoService.obterPagamentoOnlinePorNsu(orderNsu);
    }
}
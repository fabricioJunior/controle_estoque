import { Body, Controller, Param, Post, Query, Res } from "@nestjs/common";
import { FiscalService } from "./fiscal.service";
import { PedidosService } from "src/pedidos/pedidos.service";
import { NotaFiscalConsumidorDto } from "./dto/nota.fiscal.consumidor.dto";
import { ProdutoDto } from "./dto/produto.dto";
import { PedidoDto } from "./dto/pedido.dto";
import { log } from "console";
import { ResultadoProcessarNotasDto } from "./dto/resultado.processar.notas.dto";

@Controller('fiscal')
export class FiscalController {


    constructor(private fiscalService: FiscalService, private pedidosService: PedidosService,) { }

    @Post()
    async notaFiscal(@Query('idPedido') idPedido: string): Promise<ResultadoProcessarNotasDto> {
        var danfe = await this.emitirNotaFiscal(Number.parseInt(idPedido));
        var pedido = await this.pedidosService.findById(Number.parseInt(idPedido));
        return new ResultadoProcessarNotasDto(
            {
                totalEmitido: pedido.total,
                danfes: [danfe]
            }
        );
    }
    private async emitirNotaFiscal(idPedido: number): Promise<string> {
        try {
            var pedido = await this.pedidosService.findById(idPedido);
            if (pedido == null) {
                throw new Error('Pedido não encontrado');
            }
            if (pedido.urlDanfe != null) {
                return pedido.urlDanfe;
            }

            var totalProdutos = pedido.produtos.reduce((total, produto) => total + produto.valor, 0);
            if (totalProdutos != pedido.total) {
                var totalPagamento = pedido.pagamentos.reduce((total, pagamento) => total + pagamento.valor, 0);
                pedido.total = totalProdutos;
                pedido.desconto = totalProdutos - totalPagamento;
            }

            var produtoDtos = pedido.produtos.map((produto) => new ProdutoDto(
                {
                    nome: produto.descricao,
                    codigo: produto.codigoDeBarras,
                    quantidade: produto.quantidade,
                    total: produto.valor?.toString() ?? '0',
                    subtotal: produto.valor?.toString() ?? '0',
                    classe_imposto: "REF154608942",
                    ncm: '61034900', //TODO: Adicionar 
                    unidade: 'UN',
                    origem: 1,
                }
            ));
            var formaPagamento = pedido.pagamentos.map((pagamento) => this.convertPagamentoCode(pagamento.formaDePagamento))
            var valoresPagamento = pedido.pagamentos.map((pagamento) => pagamento.valor.toString());
            var complementar = 'Romaneio: ' + pedido.id + (' -  Taxa ' + pedido.taxaDeEntrega);
            log(complementar);
            var pedidoDto = new PedidoDto(
                {
                    forma_pagamento: formaPagamento,
                    valor_pagamento: valoresPagamento,
                    total: pedido.total.toString(),
                    desconto: pedido.desconto.toString(),
                    modalidade_frete: 9,
                    presenca: 1,
                    informacoes_complementares: complementar,
                }
            );
            var nota = new NotaFiscalConsumidorDto({
                id: null,
                operacao: 1,
                natureza_operacao: 'Vendas de mercadorias',
                modelo: 2,
                ambiente: 1,
                finalidade: 1,
                produtos: produtoDtos,
                pedido: pedidoDto,
            });
            log(nota);
            var result = await this.fiscalService.sendNFC(nota);

            var pedidoAtualizado = await this.pedidosService.update(pedido.id, true, result);
            log(pedidoAtualizado);
            return result;
        } catch (error) {
            console.error(`Erro ao emitir nota fiscal para o pedido ID: ${idPedido}`, error);
            console.error('Informações do pedido:', await this.pedidosService.findById(idPedido));
            throw error; // Re-throw the error to ensure it propagates
        }
    }

    @Post('/notaFiscalDoDia')
    async notaFiscalDoDia(): Promise<ResultadoProcessarNotasDto> {
        var pedidos = await this.pedidosService.findWhere(null, false);
        pedidos = pedidos.filter(pedido =>
            pedido.pagamentos.every(pagamento =>

                pagamento.formaDePagamento === 'PIX' || pagamento.formaDePagamento.includes('CARTAO') ||
                pagamento.formaDePagamento.includes('DEBITO'))
        );
        var totalProcessado = 0.0;
        var danfers = [];
        // console.error(` ${pedidos}`);
        for (var pedido of pedidos) {
            var danfe = await this.emitirNotaFiscal(pedido.id);
            danfers.push(danfe);
            totalProcessado += pedido.total;
        }
        pedidos = await this.pedidosService.findWhere(null, false);
        for (var pedido of pedidos) {
            pedido.enviadoNF = true;
            this.pedidosService.updateFromModel(pedido);
        }



        return new ResultadoProcessarNotasDto({
            danfes: danfers,
            totalEmitido: totalProcessado,
        });
    }

    private convertPagamentoCode(pagamento: string): string {
        if (pagamento == "PIX") {
            return '17';
        }
        if (pagamento.includes('CARTAO')) {
            return '03';
        }
        if (pagamento.includes('DEBITO')) {
            return '04';
        }
        if (pagamento == 'DINHEIRO') {
            return '01';
        }
        return '01';
    }
}

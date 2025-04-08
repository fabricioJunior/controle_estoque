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
    async notaFiscal(@Query('idPedido') idPedido: string): Promise<string> {
        return this.emitirNotaFiscal(Number.parseInt(idPedido));
    }

    private async emitirNotaFiscal(idPedido: number): Promise<string> {
        var pedido = await this.pedidosService.findById(idPedido);
        if (pedido.urlDanfe != null) {
            return pedido.urlDanfe;
        }
        var produtoDtos = pedido.produtos.map((produto) => new ProdutoDto(
            {
                nome: produto.descricao,
                codigo: produto.codigoDeBarras,
                quantidade: produto.quantidade,
                total: produto.valor.toString(),
                subtotal: produto.valor.toString(),
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
        var result = await this.fiscalService.sendNFC(nota);
        var pedidoAtualizado = await this.pedidosService.update(pedido.id, true, result);
        log(pedidoAtualizado);
        return result;
    }


    @Post('/notaFiscalDoDia')
    async notaFiscalDoDia(): Promise<ResultadoProcessarNotasDto> {
        var pedidos = await this.pedidosService.findWhere(null, false);

        var totalProcessado = 0.0;
        var danfers = [];
        log(pedidos);
        for (var pedido of pedidos) {
            var danfe = await this.emitirNotaFiscal(pedido.id);
            danfers.push(danfe);
            totalProcessado += pedido.total;
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

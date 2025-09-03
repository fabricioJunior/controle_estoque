import { log } from "console";
import { PagamentoRequestDto } from "./dtos/pagamento.request.dto";
import { PagamentoOnlineModel } from "./models/pagamento.online.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PagamentoModel } from "src/pedidos/models/pagamento.model";

export class PagamentoService {

    constructor(@InjectModel(PagamentoOnlineModel.name) private pagamentoModel: Model<PagamentoOnlineModel>) {

    }
    async criarPagamentoOnline(pagamentoRequest: PagamentoRequestDto): Promise<PagamentoOnlineModel> {
        var url = this.gerarUrlDePagamento(pagamentoRequest);
        var pagamento = new PagamentoOnlineModel({
            orderNsu: pagamentoRequest.orderNsu,
            urlPagamento: url,
            pedidoId: pagamentoRequest.pedidoId,
            identificadorExterno: pagamentoRequest.identificadorExterno,
            slug: pagamentoRequest.handler,
            valor: pagamentoRequest.valor,
        });
        var query = {
            orderNsu: pagamentoRequest.orderNsu,
        };
        var result = await this.pagamentoModel.findOneAndUpdate(query, {
            valor: pagamentoRequest.valor,
            urlPagamento: url,
            pedidoId: pagamentoRequest.pedidoId,
            identificadorExterno: pagamentoRequest.identificadorExterno,
            slug: pagamentoRequest.handler,

        }, {
            new: true, upsert: true
        }).exec();
        log('Pagamento criado', pagamento);
        if (result === null) {

            const createdPedido = new this.pagamentoModel(pagamento);
            log('Pagamento criado via save', createdPedido);
            result = await createdPedido.save();
        }

        return result;
    }

    obterPagamentoOnlinePorNsu(orderNsu: string): Promise<PagamentoOnlineModel> {
        return this.pagamentoModel.findOne({ orderNsu: orderNsu }).exec();
    }

    updatePagamentoOnline(pagamentoOnline: PagamentoOnlineModel): Promise<PagamentoOnlineModel> {
        var query = {
            orderNsu: pagamentoOnline.orderNsu
        }
        return this.pagamentoModel.findOneAndUpdate(query, pagamentoOnline);
    }
    cancelarPagamento(orderNsu: string): Promise<PagamentoOnlineModel> {
        return this.pagamentoModel.findOneAndUpdate(
            {
                orderNsu: orderNsu,
            },
            {
                cancelado: true,
                pendente: false,
            }
        );
    }

    async reativarPagamento(orderNsu: string): Promise<PagamentoOnlineModel> {

        return this.pagamentoModel.findOneAndUpdate(
            {
                orderNsu: orderNsu,
            },
            {
                cancelado: false,
                pendente: true,
            }
        );
    }

    async recuperarPagamentos(find: FindPagamento): Promise<PagamentoOnlineModel[]> {
        var query = {};
        if (find.orderNsu) {
            query['orderNsu'] = find.orderNsu;
        }
        if (find.identificador) {
            query['identificadorExterno'] = find.identificador;
        }

        if (find.dataInicio && find.dataFim) {

            query['dataCriacao'] = { $gte: find.dataInicio, $lte: find.dataFim };
        }
        return this.pagamentoModel.find(query).exec();
    }

    gerarUrlDePagamento(pagamentoRequest: PagamentoRequestDto): string {
        var items = JSON.stringify(pagamentoRequest.items);

        return `https://checkout.infinitepay.io/${pagamentoRequest.handler}?items=${items.toString()}&redirect_url=${pagamentoRequest.redirectUrl}&order_nsu=${pagamentoRequest.orderNsu}`;
    }



}

class FindPagamento {
    orderNsu?: string;
    dataInicio?: Date;
    dataFim?: Date;
    identificador?: string;
}
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ProdutoPedidoModel } from "./models/produto.pedido.model";
import { Model } from "mongoose";
import { ProdutoPedidoDto } from "./dto/produto.pedido.dto";
import { log } from "console";
import { PedidoModel } from "./models/pedido.model";
import { PedidoDto } from "./dto/pedido.dto";

@Injectable()
export class PedidosService {
    constructor(@InjectModel(PedidoModel.name) private pedidoModel: Model<PedidoModel>) {

    }
    async findAll(): Promise<PedidoModel[]> {
        return this.pedidoModel.find().exec();
    }

    async findById(idPedido: number): Promise<PedidoModel> {
        var result = await this.pedidoModel.where({ id: idPedido }).exec();
        return result[0];
    }
    async pedidosComPagamentoPendente(): Promise<PedidoModel[]> {
        return this.pedidoModel.where({ pagamentoPendente: true }).exec();
    }

    async pedidoComPagamentoPendente(idPedido: number): Promise<PedidoModel> {
        var result = await this.pedidoModel.where({ id: idPedido, pagamentoPendente: true }).exec();
        return result[0];
    }

    async findWhere(diaDoPedido?: Date, enviadoNF?: boolean,): Promise<PedidoModel[]> {

        return this.pedidoModel.where({
            enviadoNF: enviadoNF,
        }).exec();
    }

    async updateFromModel(pedido: PedidoModel) {
        var filter = {
            id: pedido.id,
        }
        var result = await this.pedidoModel.findOneAndUpdate(filter, {
            enviadoNF: pedido.enviadoNF,
            urlDanfe: pedido.urlDanfe,
            produtos: pedido.produtos,
            pagamentos: pedido.pagamentos,
            pagamentoPendente: pedido.pagamentoPendente,


        }).exec();
        return result;
    }
    async update(idPedido: number, enviadoNF: boolean, urlDanfe: string): Promise<PedidoModel> {
        var filter = {
            id: idPedido,
        }
        var result = await this.pedidoModel.findOneAndUpdate(filter, {
            enviadoNF: enviadoNF,
            urlDanfe: urlDanfe

        }).exec();
        return result;
    }
    async upsert(createPedidoDto: PedidoDto): Promise<PedidoModel> {
        var filter = {
            id: createPedidoDto.id,
        }
        var result = await this.pedidoModel.findOneAndUpdate(filter, {
            pagamentos: createPedidoDto.pagamentos,
            produtos: createPedidoDto.produtos,

        }).exec();

        if (result === null) {
            log('model');
            var pedido = new PedidoModel(createPedidoDto);
            log(pedido);
            const createdPedido = new this.pedidoModel(pedido);
            log('create');
            log(createdPedido);
            return createdPedido.save();
        } else {
            log(result);
        }
        return result;
    }
}
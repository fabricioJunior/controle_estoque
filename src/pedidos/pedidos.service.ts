import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ProdutoPedidoModel } from "./models/produto.pedido.model";
import { Model } from "mongoose";
import { ProdutoPedidoDto } from "./dto/produto.pedido.dto";
import { log } from "console";
import { PedidoModel } from "./models/pedido.model";
import { PedidoDto } from "./dto/pedido.dto";

@Injectable()
export class ProdutoPedidoService {
    constructor(@InjectModel(PedidoModel.name) private pedidoModel: Model<PedidoModel>) {

    }
    async findAll(): Promise<PedidoModel[]> {
        return this.pedidoModel.find().exec();
    }

    async findWhere(date?: Date, enviadoNF?: boolean,): Promise<PedidoModel[]> {

        return this.pedidoModel.find({
        }).exec();
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
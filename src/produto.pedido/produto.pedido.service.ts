import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ProdutoPedido } from "./models/produto.pedido.entity";
import { Model } from "mongoose";
import { ProdutoPedidoDto } from "./dto/produto.pedido.dto";

@Injectable()
export class ProdutoPedidoService {
    constructor(@InjectModel(ProdutoPedido.name) private produtoModel: Model<ProdutoPedido>) {

    }
    async findAll(): Promise<ProdutoPedido[]> {
        return this.produtoModel.find().exec();
    }

    async upsert(createProdutoDto: ProdutoPedidoDto): Promise<ProdutoPedido> {
        var filter = {
            codigoDeBarras: createProdutoDto.codigoDeBarras,
            idPedido: createProdutoDto.idPedido
        }
        var result = await this.produtoModel.findOneAndUpdate(filter).exec();
        if (result === null) {
            const createdProduto = new this.produtoModel(createProdutoDto,);
            return createdProduto.save();
        }
        return result;
    }
}
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { ProdutoPedidoModel } from "./produto.pedido.model";
import { PagamentoModel } from "./pagamento.model";
import { PessoaModel } from "./pessoa.model";


export type PedidoDocumento = HydratedDocument<PedidoModel>;

@Schema()
export class PedidoModel {
    _id: mongoose.Types.ObjectId;
    @Prop(
        {
            unique: true,
            required: true,
        }
    )
    id: number
    @Prop()
    total: number
    @Prop()
    desconto: number
    @Prop()
    taxaDeEntrega: number
    @Prop(
        {
            isArray: true,
            type: ProdutoPedidoModel
        }
    )
    produtos: ProdutoPedidoModel[]
    @Prop(
        {
            isArray: true,
            type: PagamentoModel
        }
    )
    pagamentos: PagamentoModel[]

    @Prop(
        {
            type: PessoaModel
        }
    )
    pessoa?: PessoaModel
    @Prop(
        { default: false }
    )
    enviadoNF?: boolean;
    @Prop()
    urlDanfe?: string;
    @Prop({ type: Date, default: Date.now() })
    diaDoPedido: Date;

    @Prop()
    pagamentoPendente?: boolean;
    @Prop()
    urlDePagamento?: string;
    @Prop()
    urlComprovante?: string;

    constructor(partial?: Partial<PedidoModel>) {
        Object.assign(this, partial);
        this._id = new mongoose.mongo.BSON.ObjectId(this.id,);
    }

}

export const PedidoSchema = SchemaFactory.createForClass(PedidoModel);
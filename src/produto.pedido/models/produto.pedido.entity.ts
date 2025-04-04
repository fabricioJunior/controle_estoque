
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date, HydratedDocument } from 'mongoose';

export type ProdutPedidoDocumento = HydratedDocument<ProdutoPedido>;

@Schema()
export class ProdutoPedido {
    _id: mongoose.Types.ObjectId;
    @Prop()
    idPedido: number
    @Prop()
    descricao: string;
    @Prop()
    cor: string;
    @Prop()
    tamanho: string;
    @Prop()
    quantidade: number;
    @Prop()
    valor: number;
    @Prop()
    desconto: number;
    @Prop()
    enviadoNF: boolean;
    @Prop({ type: Date, default: Date.now() })
    diaDoPedido: Date;
    @Prop()
    codigoDeBarras: string;


    constructor(partial?: Partial<ProdutoPedido>) {
        Object.assign(this, partial);
    }

}

export const ProdutoPedidoSchema = SchemaFactory.createForClass(ProdutoPedido);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date, HydratedDocument } from 'mongoose';

export type ProdutPedidoDocumento = HydratedDocument<ProdutoPedidoModel>;

export class ProdutoPedidoModel {
    @Prop(

    )
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
    codigoDeBarras: string;



    constructor(partial?: Partial<ProdutoPedidoModel>) {
        Object.assign(this, partial);
    }


}


import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { log } from "console";
import mongoose from "mongoose";
@Schema()
export class PagamentoOnlineModel {

    @Prop(
        {
            type: String,
            unique: true,
        }
    )
    orderNsu: string

    @Prop()
    urlPagamento: string

    @Prop(
        {
            required: true,
            type: Number,
        }
    )
    valor: number

    @Prop(
        {
            default: Date.now,
            type: Date,
        }
    )
    dataCriacao?: Date
    @Prop()
    trasacaoId?: string
    @Prop()
    urlComprovante?: string
    @Prop()
    slug?: string
    @Prop()
    transacaoId?: string

    @Prop()
    pedidoId?: number
    @Prop()
    identificadorExterno?: string

    @Prop({
        default: false
    })
    cancelado: boolean;

    @Prop({
        default: true
    })
    pendente: boolean;

    constructor(partial?: Partial<PagamentoOnlineModel>) {
        Object.assign(this, partial);

    }
}

export const PagamentoOnlineSchema = SchemaFactory.createForClass(PagamentoOnlineModel);
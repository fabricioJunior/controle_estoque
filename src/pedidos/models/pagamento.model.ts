import { Prop } from "@nestjs/mongoose"

export class PagamentoModel {
    @Prop()
    formaDePagamento: string
    @Prop()
    valor: number
    @Prop()
    slug?: string
    @Prop()
    orderNsu?: string
    @Prop()
    transacaoId?: string
    @Prop()
    comprovanteDePagamento?: string



    constructor(partial?: Partial<PagamentoModel>) {
        Object.assign(this, partial);
    }
}
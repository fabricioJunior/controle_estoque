import { Prop } from "@nestjs/mongoose"

export class PagamentoModel {
    @Prop()
    formaDePagamento: string
    @Prop()
    valor: number

    constructor(partial?: Partial<PagamentoModel>) {
        Object.assign(this, partial);
    }
}
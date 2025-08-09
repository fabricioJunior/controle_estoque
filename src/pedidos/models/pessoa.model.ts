import { Prop } from "@nestjs/mongoose";

export class PessoaModel {
    @Prop()
    nome?: string;
    @Prop()
    cpf?: string;

    constructor(partial?: Partial<PessoaModel>) {
        Object.assign(this, partial);
    }
}
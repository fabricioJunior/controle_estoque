

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProdutoDocumento = HydratedDocument<Produto>;

@Schema()
export class Produto {
    @Prop()
    descricao: string;
    @Prop()
    referencia: string;
    @Prop()
    cor: string;
    @Prop()
    tamanho: string;
    @Prop()
    quantidade: number;
    @Prop()
    valor: number;
    @Prop()
    codigoDeBarras: string
  
    constructor(partial?: Partial<Produto>) {
        Object.assign(this, partial);
    } 

}


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ProdutoDocumento = HydratedDocument<Produto>;

@Schema()
export class Produto {
    
    _id: mongoose.Types.ObjectId;
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
    @Prop({required:true, unique:true})
    codigoDeBarras: string
  
    constructor(partial?: Partial<Produto>) {
        Object.assign(this, partial);
        this._id = new mongoose.mongo.ObjectId(this.codigoDeBarras,);

    } 

}

export const ProdutoSchema = SchemaFactory.createForClass(Produto);
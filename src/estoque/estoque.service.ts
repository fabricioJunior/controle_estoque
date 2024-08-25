import { Injectable } from '@nestjs/common';
import { Produto } from './entities/produto.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProdutoDto } from './dtos/produto.dto';

@Injectable()
export class EstoqueService {
   
   constructor(@InjectModel(Produto.name) private produtoModel: Model<Produto>) {} 
   
    get():Produto[]{
      return [
         new Produto({
            descricao: "descricao teste",
            referencia: "referencia teste",
            tamanho: "tamnho 1",
            cor: "cor 1",
            valor: 119.90,
            quantidade: 1,
            codigoDeBarras: 'codigo de barras'
         })
      ];
    }

    async create(createCatDto: ProdutoDto): Promise<Produto> {
      const createdCat = new this.produtoModel(createCatDto);
      return createdCat.save();
    }
  
    async findAll(): Promise<Produto[]> {
      return this.produtoModel.find().exec();
    }
}

import { Injectable } from '@nestjs/common';
import { Produto } from './entities/produto.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProdutoDto } from './dtos/produto.dto';
import { isEmpty } from 'rxjs';
import mongoose, { HydratedDocument } from 'mongoose';
import { log } from 'console';
@Injectable()
export class EstoqueService {

  constructor(@InjectModel(Produto.name) private produtoModel: Model<Produto>) { }

  get(): Produto[] {
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

  async upsert(createProdutoDto: ProdutoDto): Promise<Produto> {
    var result = await this.produtoModel.findOneAndUpdate({
      codigoDeBarras: createProdutoDto.codigoDeBarras
    }
      , {
        quantidade: createProdutoDto.quantidade,
        valor: createProdutoDto.valor,
      }
    ).exec();

    if (result === null) {
      log(createProdutoDto);
      const createdProduto = new this.produtoModel(createProdutoDto,);
      log(createdProduto);
      return createdProduto.save();
    }

    return result;
  }

  async findAll(): Promise<Produto[]> {
    return this.produtoModel.find().exec();
  }
  async findAllWhere(find: FindProduto): Promise<Produto[]> {
    var produtos = this.produtoModel.find({
      descricao: { $regex: find.descricao, $options: 'i' },
      cor: 'MARROM'
    })
    return produtos;
  }

  async findAllCores(): Promise<String[]> {
    return this.produtoModel.distinct('cor');
  }
  async findAllTamanhos(): Promise<String[]> {
    return this.produtoModel.distinct('tamanho');
  }
}

class FindProduto {
  descricao?: string;

}
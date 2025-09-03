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
    var query: any = {};
    if (find.descricao != null) {
      query.descricao = {
        $regex: this.removeAccents(find.descricao) ?? '', $options: 'i'
      };
    }
    if (find.referencia != null) {
      query.referencia = find.referencia;
    }

    if (find.estoqueMaiorQueZero === true) {
      query.quantidade = { $gt: 0 }
    }
    if (find.cores != null) {
      query.cor = { $in: find.cores }
    }
    if (find.tamanhos != null) {
      query.tamanho = { $in: find.tamanhos }
    }
    var produtos = this.produtoModel.find(query).sort({ quantidade: -1, tamanho: 1, descricao: 1, });
    return produtos;
  }
  removeAccents(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  async findAllCores(): Promise<String[]> {
    return this.produtoModel.distinct('cor');
  }
  async findAllTamanhos(): Promise<String[]> {
    return this.produtoModel.distinct('tamanho');
  }
  async findAllTamanhoCor(referencia: string) {
    return this.produtoModel.aggregate([
      { "$match": { "referencia": referencia } },

      {

        $group: {
          _id: "$referencia",
          descricao: { $first: "$descricao" },
          cruzamento: {


            $addToSet: {

              tamanho: '$tamanho',
              cor: '$cor',
              quantidade: '$quantidade'
            },

          }  // Agrupar tamanhos únicos
        },

      }
    ]);
  }
}

class FindProduto {
  descricao?: string;
  referencia?: string;
  estoqueMaiorQueZero?: boolean;
  cores?: string[];
  tamanhos?: string[];
}
import { Body, Controller, Get, Post } from '@nestjs/common';
import { EstoqueService } from './estoque.service';
import { Produto } from './entities/produto.entity';
import { ProdutoDto } from './dtos/produto.dto';

@Controller('estoque')
export class EstoqueController {

  constructor(private estoqueService: EstoqueService) { }

  @Get()
  async get(): Promise<Produto[]> {
    return this.estoqueService.findAll();
  }

  @Post()
  async create(@Body() produto: ProdutoDto): Promise<Produto> {
    return this.estoqueService.upsert(produto);
  }
}

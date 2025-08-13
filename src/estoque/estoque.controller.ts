import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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
  @Get('filtro')
  async getBy(@Query('descricao') descricao?: string, @Query('referencia') referencia?: string) {
    return this.estoqueService.findAllWhere(
      {
        descricao: descricao,
      }
    );
  }
  @Get('cores')
  async getCores() {
    return this.estoqueService.findAllCores()
      ;
  }
  @Get('tamanhos')
  async getTamanhos() {
    return this.estoqueService.findAllTamanhos()
      ;
  }
  @Get('tamanhoCor')
  async getTamanhoCor(@Query('referencia') referencia?: string) {
    return this.estoqueService.findAllTamanhoCor(referencia);

  }

  @Post()
  async create(@Body() produto: ProdutoDto): Promise<Produto> {
    return this.estoqueService.upsert(produto);
  }
}

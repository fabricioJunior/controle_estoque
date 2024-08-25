import { Controller, Get } from '@nestjs/common';
import { EstoqueService } from './estoque.service';
import { Produto } from './entities/produto.entity';

@Controller('estoque')
export class EstoqueController {
   
    constructor(private estoqueService:EstoqueService){}

    @Get()
     async get(): Promise<Produto[]> {
       return this.estoqueService.get();
     }
}

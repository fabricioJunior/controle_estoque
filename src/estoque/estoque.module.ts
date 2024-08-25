import { Module } from "@nestjs/common";
import { EstoqueController } from "./estoque.controller";
import { EstoqueService } from "./estoque.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Produto } from "./entities/produto.entity";


@Module({
    // mports: [MongooseModule.forFeature([{ name: Produto.name, schema: ProdutoSchema }])],
    controllers: [EstoqueController],
    providers:[ EstoqueService]
})

export class EstoqueModule {  


  

}
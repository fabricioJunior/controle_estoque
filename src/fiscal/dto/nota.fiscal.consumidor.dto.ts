import { ClienteDTO } from "./cliente.dto"
import { PedidoDto } from "./pedido.dto"
import { model } from "mongoose"
import { ProdutoDto } from "./produto.dto"



export class NotaFiscalConsumidorDto {
    id: number
    operacao: number
    natureza_operacao: string
    modelo: number
    finalidade: number
    //1 - produção, 2 - homologação
    ambiente: number
    cliente?: ClienteDTO
    produtos: ProdutoDto[]
    pedido: PedidoDto

    constructor(partial?: Partial<NotaFiscalConsumidorDto>) {
        Object.assign(this, partial);
    }

}
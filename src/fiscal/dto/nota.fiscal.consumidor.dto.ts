import { ProdutoDto } from "src/estoque/dtos/produto.dto"
import { ClienteDTO } from "./cliente.dto"
import { PedidoDto } from "./pedido.dto"

export class NotaFiscalConsumidorDto {
    ID: number
    url_notificacao: string
    operacao: number
    natureza_operacao: string
    modelo: number
    finalidade: number
    ambiente: number
    cliente: ClienteDTO
    produtos: ProdutoDto[]
    pedido: PedidoDto
}
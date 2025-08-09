import { PagamentoDto } from "./pagamento.dto"
import { PessoaDto } from "./pessoa.dto"
import { ProdutoPedidoDto } from "./produto.pedido.dto"

export class PedidoDto {
    id: number
    total: number
    desconto: number
    taxaDeEntrega: number
    produtos: ProdutoPedidoDto[]
    pagamentos: PagamentoDto[]
    pessoa?: PessoaDto;
}
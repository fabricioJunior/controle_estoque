import { log } from "console";
import { PagamentoRequestDto } from "./dtos/pagamento.request.dto";

export class PagamentoService {



    gerarUrlDePagamento(pagamentoRequest: PagamentoRequestDto): string {
        var items = JSON.stringify(pagamentoRequest.items);

        return `https://checkout.infinitepay.io/${pagamentoRequest.handler}?items=${items.toString()}&redirect_url=${pagamentoRequest.redirectUrl}&order_nsu=${pagamentoRequest.orderNsu}`;
    }


}
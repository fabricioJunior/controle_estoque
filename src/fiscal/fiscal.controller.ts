import { Controller } from "@nestjs/common";
import { FiscalService } from "./fiscal.service";
import { ProdutoPedidoService } from "src/pedidos/pedidos.service";

@Controller('fiscal')
export class FiscalController {


    constructor(private fiscalService: FiscalService, private produtoPedidoService: ProdutoPedidoService,) { }

    async notaFiscalDoDia(): Promise<string> {
        return '';
    }
}
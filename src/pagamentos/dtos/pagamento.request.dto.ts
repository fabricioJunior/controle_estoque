import { ItemDto } from "./item.dto";

export class PagamentoRequestDto {

    handler: string;
    orderNsu: string;
    redirectUrl: string;
    items: ItemDto[];
    valor: number;

    pedidoId?: number;
    identificadorExterno?: string;



    constructor(partial?: Partial<PagamentoRequestDto>) {
        Object.assign(this, partial);
    }
}
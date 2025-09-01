export class PagamentoResultDto {

    comprovanteDePagamento?: string;
    transanctionId?: string;
    formaDePagamento?: string;
    idPedido?: string;
    nsu?: string;
    slug?: string;


    constructor(partial?: Partial<PagamentoResultDto>) {
        Object.assign(this, partial);
    }
}
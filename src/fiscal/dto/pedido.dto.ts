export class PedidoDto {
    presenca: number
    modalidade_frete: number
    frete: string
    desconto: string
    total: string
    forma_pagamento: string[] // dinheiro e cartão de crédito
    valor_pagamento: string[]
    informacoes_complementares: string

    constructor(partial?: Partial<PedidoDto>) {
        Object.assign(this, partial);
    }
}

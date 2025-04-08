export class ResultadoProcessarNotasDto {

    danfes: string[];
    totalEmitido: number;

    constructor(partial?: Partial<ResultadoProcessarNotasDto>) {
        Object.assign(this, partial);

    }
}
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { NotaFiscalConsumidorDto } from "./dto/nota.fiscal.consumidor.dto";
import { AxiosRequestConfig } from "axios";
import { lastValueFrom } from "rxjs";
import { log } from "console";
import { PedidoDto } from "./dto/pedido.dto";

@Injectable()
export class FiscalService {


    constructor(private readonly httpService: HttpService) {


    }

    async sendNFC(nota: NotaFiscalConsumidorDto): Promise<string> {


        const requestConfig: AxiosRequestConfig = {
            headers: {
                'content-type': 'application/json',
                'cache-control': 'no-cache',
                'x-access-token-secret': 'FDECrobtTzpJU7Gep0D05ysl0OXITSvsv1bEpof7V4DITpaE',
                'x-access-token': '4327-mDmavMbkx5H05hNJLvvPrajaetWmtLpuYu1jeApKb8D0ytI9',
                'x-consumer-secret': 'XI4yJCOraCkJLwHFVEFlvtfPdd0rRHH7O4sINzsYnBqCH5Hs',
                'x-consumer-key': 'cSttD9qCtpW7Ky7e0NeS3t0nn96RDtze'
            }
        };

        var response = await lastValueFrom(this.httpService.post(
            'https://webmaniabr.com/api/1/nfe/emissao/',
            nota,
            requestConfig,
        ));
        if (response.data['error'] != null) {
            console.error(`informacoes do servido web mania: ${response.data}`, response.data['error']);
            console.error(`nota: ${nota}`);
            throw Error(response.data);
        }
        if (response.data['status'] == 'reprovado') {
            log(response.data);
            throw Error(response.data);
        }
        log(response.data);

        return response.data['danfe'];

    }

}
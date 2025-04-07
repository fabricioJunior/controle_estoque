import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { NotaFiscalConsumidorDto } from "./dto/nota.fiscal.consumidor.dto";
import { AxiosRequestConfig } from "axios";
import { lastValueFrom } from "rxjs";

@Injectable()
export class FiscalService {


    constructor(private readonly httpService: HttpService) {


    }

    async sendNFC(nota: NotaFiscalConsumidorDto): Promise<string> {

        var headers =
        {
            'content-type': 'application/json',
            'cache-control': 'no-cache',
            'x-access-token-secret': 'SEU_CONSUMER_KEY',
            'x-access-token': 'SEU_CONSUMER_SECRET',
            'x-consumer-secret': 'SEU_ACCESS_TOKEN',
            'x-consumer-key': 'SEU_ACCESS_TOKEN_SECRET'
        };
        const requestConfig: AxiosRequestConfig = {
            headers: {
                'content-type': 'application/json',
                'cache-control': 'no-cache',
                'x-access-token-secret': 'SEU_CONSUMER_KEY',
                'x-access-token': 'SEU_CONSUMER_SECRET',
                'x-consumer-secret': 'SEU_ACCESS_TOKEN',
                'x-consumer-key': 'SEU_ACCESS_TOKEN_SECRET'
            }
        };

        var response = await lastValueFrom(this.httpService.post(
            'https://webmaniabr.com/api/1/nfe/emissao/',
            nota,
            requestConfig,
        ));

        return response.data['danfe'];

    }

}
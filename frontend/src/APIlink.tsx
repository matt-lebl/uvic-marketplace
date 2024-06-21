import axios, { AxiosResponse } from 'axios';
import {ErrorResponse} from './interfaces';

const baseUrl = ''; //http://market.lebl.ca/openapi/

class APIError extends Error {
    status: number;
    constructor(message: string, status:number) {
        super(message);
        this.status = status;
    }
}

export async function APIPost<TResponse, TBody>(path: string, requestBody: TBody ): Promise<TResponse | undefined> {
    try {
        const response: AxiosResponse<TResponse> = await axios.post(baseUrl+path, requestBody);
        switch(response.status){
            case 200:
                return response.data;
            case 201:
                return response.data;
            default:
                throw new APIError(response.data as string, response.status);
        }
    } catch (error:any) {
        throw new Error(`API request failed: ${error.message}`);
    }
}
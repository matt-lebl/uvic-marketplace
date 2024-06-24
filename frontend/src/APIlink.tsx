import axios, { AxiosResponse } from 'axios';
import ErrorResponse from './interfaces';

export const baseUrl = ''; //http://market.lebl.ca/openapi/

export default class APIError extends Error {
    status: number;
    constructor(message: string, status:number) {
        super(message);
        this.status = status;
    }
}

export async function APIPost<TResponse, TBody>(path: string, requestBody?: TBody ): Promise<TResponse | undefined> {
    //try {
        const response: AxiosResponse<TResponse> = await axios.post(baseUrl+path, requestBody);
        switch(response.status){
            case 200:
            case 201:
                return response.data;
            default:
                throw new APIError(response.data as string, response.status);
        }
    // } catch (error:any) {
    //     throw new Error(`API request failed: ${error.message}`);
    // }
}

export async function APIGet<TResponse>(path: string, queryParams?: [string, string|number][] ): Promise<TResponse> {
    //try {
        const queryString = queryParams?.map(
            ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        ).join('&');

        const url = `${baseUrl}${path}${queryString ? '?' + queryString : ''}`;

        const response: AxiosResponse<TResponse> = await axios.get(url);
        switch(response.status){
            case 200:
            case 101:
                return response.data;
            default:
                throw new APIError(response.data as string, response.status);
        }
    // } catch (error:any) {
    //     throw new Error(`API request failed: ${error.message}`);
    // }
}

export async function APIPatch<TResponse, TBody>(path: string, requestBody?: TBody ): Promise<TResponse | undefined> {
    //try {
        const response: AxiosResponse<TResponse> = await axios.patch(baseUrl+path, requestBody);
        switch(response.status){
            case 200:
                return response.data;
            default:
                throw new APIError(response.data as string, response.status);
        }
    // } catch (error:any) {
    //     throw new Error(`API request failed: ${error.message}`);
    // }
}

export async function APIDelete(path: string, queryParams?: [string, string|number][]  ): Promise<void> {
    //try {
        const queryString = queryParams?.map(
            ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        ).join('&');

        const url = `${baseUrl}${path}${queryString ? '?' + queryString : ''}`;

        const response: AxiosResponse = await axios.delete(url);
        switch(response.status){
            case 200:
                break;
            default:
                throw new APIError(response.data as string, response.status);
        }
    //} catch (error:any) {
        //throw new Error(`API request failed: ${error.message}`);
    //}
}
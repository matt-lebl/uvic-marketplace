import axios, { AxiosResponse } from 'axios';

const baseUrl = ''; //http://market.lebl.ca/openapi/

export async function APIPost<TResponse, TBody>(path: string, requestBody: TBody ): Promise<TResponse | undefined> {
    try {
        const response: AxiosResponse<TResponse> = await axios.post(baseUrl+path, requestBody);
        console.log(response.data);
        return response.data;
    } catch (error) {
        //throw new Error(`API request failed: ${error.message}`);
    }
    return undefined;
}

import React, {  PropsWithChildren } from 'react';
import axios, { AxiosResponse, AxiosInstance } from 'axios';
import APIInterface, {ErrorResponse} from './interfaces';
import dotenv from 'dotenv'; 

class APIError extends Error {
    status: number;
    constructor(message: string, status:number) {
        super(message);
        this.status = status;
    }
}
interface IApiContext {
    APIPost<TResponse extends APIInterface, TBody extends APIInterface>(path: string, requestBody?: TBody ): Promise<TResponse | undefined>
    APIGet<TResponse extends APIInterface>(path: string, queryParams?: [string, string|number][] ): Promise<TResponse>
    APIPatch<TResponse extends APIInterface, TBody extends APIInterface>(path: string, requestBody?: TBody ): Promise<TResponse | undefined>
    APIDelete(path: string, queryParams?: [string, string|number][]  ): Promise<void>
    SetAxios(newInstance:AxiosInstance): Promise<void>
}
  

const APIContext = React.createContext<IApiContext>({} as IApiContext)

export const APIContextProvider = (props: PropsWithChildren) => {
// Initialize Axios instance
dotenv.config();
const baseUrl = process.env.BASEURL;
var instance = axios.create({baseURL:baseUrl, withCredentials:true});

const SetAxios = async function(newInstance:AxiosInstance): Promise<void>{
    instance = newInstance;
}

const APIPost = async function <TResponse extends APIInterface, TBody extends APIInterface>(path: string, requestBody?: TBody ): Promise<TResponse | undefined> {
    //try {
        const response: AxiosResponse<TResponse> = await instance.post(baseUrl+path, requestBody);
        switch(response.status){
            case 200:
            case 201:
                return response.data;
            default:
                throw new APIError("Error Occured on POST", response.status);
        }
    // } catch (error:any) {
    //     throw new Error(`API request failed: ${error.message}`);
    // }
}

const APIGet = async function<TResponse extends APIInterface>(path: string, queryParams?: [string, string|number][] ): Promise<TResponse> {
    //try {
        const queryString = queryParams?.map(
            ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        ).join('&');

        const url = `${baseUrl}${path}${queryString ? '?' + queryString : ''}`;

        const response: AxiosResponse<TResponse> = await instance.get(url);
        switch(response.status){
            case 200:
            case 101:
                return response.data;
            default:
                throw new APIError("Error Occurred on GET", response.status);
        }
    // } catch (error:any) {
    //     throw new Error(`API request failed: ${error.message}`);
    // }
}

const APIPatch = async function<TResponse extends APIInterface, TBody extends APIInterface>(path: string, requestBody?: TBody ): Promise<TResponse | undefined> {
        const response: AxiosResponse<TResponse> = await instance.patch(baseUrl+path, requestBody);
        switch(response.status){
            case 200:
                return response.data;
            default:
                throw new APIError("Error occured on PATCH", response.status);
        }
    // } catch (error:any) {`   1`
    //     throw new Error(`API request failed: ${error.message}`);
    // }
}

const  APIDelete = async function(path: string, queryParams?: [string, string|number][]  ): Promise<void> {
    //try {
        const queryString = queryParams?.map(
            ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        ).join('&');

        const url = `${baseUrl}${path}${queryString ? '?' + queryString : ''}`;

        const response: AxiosResponse = await instance.delete(url);
        switch(response.status){
            case 200:
                break;
            default:
                throw new APIError("Error Occured On Delete", response.status);
        }
    //} catch (error:any) {
        //throw new Error(`API request failed: ${error.message}`);
    //}
}

const apiContext: IApiContext = {
    APIGet,
    APIPost,
    APIPatch,
    APIDelete,
    SetAxios
}

return (
    <APIContext.Provider value={apiContext}>
        {props.children}
    </APIContext.Provider>
);
}
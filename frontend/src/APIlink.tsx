import axios, { AxiosResponse, AxiosInstance } from 'axios'

export const baseUrl = process.env.REACT_APP_BASEURL ?? 'https://market.lebl.ca'

export function validateReturn(status: number): boolean { return status <= 500 };

var instance = axios.create({ baseURL: baseUrl, withCredentials: true })
export default class APIError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}
export async function SetAxios(newInstance: AxiosInstance) {
  instance = newInstance
}

export async function APIPost<TResponse, TBody>(
  path: string,
  requestBody?: TBody
): Promise<TResponse | undefined> {
  //try {
  const response: AxiosResponse<TResponse> = await instance.post(
    baseUrl + path,
    requestBody,
    { validateStatus: validateReturn }
  )
  switch (response.status) {
    case 200:
    case 201:
      return response.data
    default:
      throw new APIError(response.data as string, response.status)
  }
  // } catch (error:any) {
  //     throw new Error(`API request failed: ${error.message}`);
  // }
}

export async function APIGet<TResponse>(
  path: string,
  queryParams?: [string, string | number][]
): Promise<TResponse> {
  //try {
  const queryString = queryParams
    ?.map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&')

  const url = `${baseUrl}${path}${queryString ? '?' + queryString : ''}`

  const response: AxiosResponse<TResponse> = await instance.get(url,
    { validateStatus: validateReturn })
  switch (response.status) {
    case 200:
    case 101:
      return response.data
    default:
      throw new APIError(response.data as string, response.status)
  }
  // } catch (error:any) {
  //     throw new Error(`API request failed: ${error.message}`);
  // }
}

export async function APIPatch<TResponse, TBody>(
  path: string,
  requestBody?: TBody
): Promise<TResponse | undefined> {
  //try {
  const response: AxiosResponse<TResponse> = await instance.patch(
    baseUrl + path,
    requestBody,
    { validateStatus: validateReturn }
  )
  switch (response.status) {
    case 200:
      return response.data
    default:
      throw new APIError(response.data as string, response.status)
  }
  // } catch (error:any) {
  //     throw new Error(`API request failed: ${error.message}`);
  // }
}

export async function APIDelete(
  path: string,
  queryParams?: [string, string | number][]
): Promise<void> {
  //try {
  const queryString = queryParams
    ?.map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&')

  const url = `${baseUrl}${path}${queryString ? '?' + queryString : ''}`

  const response: AxiosResponse = await instance.delete(url,
    { validateStatus: validateReturn })
  switch (response.status) {
    case 200:
      break
    default:
      throw new APIError(response.data as string, response.status)
  }
  //} catch (error:any) {
  //throw new Error(`API request failed: ${error.message}`);
  //}
}

export async function APIUploadImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  //TODO: Make filename uuid
  const filename = file.name

  try {
    await APIPost('/api/images/' + filename, formData)
    return baseUrl + "/api/images/" + filename
  } catch (error) {
    console.error('Error uploading photo:', error)
    return null
  }
}

import axios, {isCancel, AxiosError, AxiosInstance} from 'axios';
import RestApi from './RestApi'
// console.log(axios.isCancel('something'));

export const POST_REQUEST = async({endPoint, payload}) =>
    RestApi.getInstance().post(
        endPoint,
      JSON.stringify(payload),
    );

export const POST_REQUEST_2 = async({endPoint, payload}) =>
    RestApi.getInstance().post(
        endPoint,
      new URLSearchParams(payload),
    );

export const GET_REQUEST = async(endPoint, params) =>
    RestApi.getInstance().get(
        endPoint,
      {params},
    );
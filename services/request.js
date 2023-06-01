
import {store} from '../redux/store';
// import {BASE_URL} from './constants/app.constants';
//-------not needed yet---------
export const HTTP_CLIENT = axios.create({
  baseURL,
});

// export const initialConfig = () => {
//   setupAxios();
// };

export const setupAxios = () => {
  // HTTP_CLIENT.interceptors.response.use(null, error => {
  // if (!isGenericError(error)) {
  //   return Promise.reject(error);
  // }
  // console.log('error');
  // console.log(error);
  // console.log('error');
  // return new Promise(() => {});
  // });

  HTTP_CLIENT.interceptors.request.use(
    config => {
      const {accessToken} = store.getState().auth;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    err => {
      return Promise.reject(err);
    },
  );
};

export default HTTP_CLIENT;
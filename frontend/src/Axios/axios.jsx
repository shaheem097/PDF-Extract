import axios from 'axios';
import { logoutUser } from '../Redux/Reducers/userReducer';
import { store } from '../Redux/store';

const axiosInterceptorInstance = axios.create({
  baseURL: 'http://localhost:3000',
});

axiosInterceptorInstance.interceptors.request.use(
  (config) => {

    const userAccessToken = localStorage.getItem("userAccessToken");

    
  if (userAccessToken) {
   
      config.headers.Authorization = userAccessToken;
    }
    
    return config;
  },
  (error) => {
    console.log("Error in request");
    return Promise.reject(error);
  }
);

axiosInterceptorInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error.response?.data?.message,"messagesssssssssssssssss");
    if (error.response && error.response.status === 401 &&error.response?.data?.message==='userTokenNotverify') {

         console.log("userssssssssssssssss");
   
      store.dispatch(logoutUser());
 
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInterceptorInstance;

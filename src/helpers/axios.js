import axios from "axios";

const instance = axios.create({
  baseURL: "https://mtc.voodoo.work/backend/admin/",
});

instance.interceptors.request.use(
  function (config) {
    config.data = {
      ...config.data,
      accessToken: JSON.parse(localStorage.getItem("user")).accessToken,
    };
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default instance;

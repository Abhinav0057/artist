// import axios from "axios"
import axios from "./http-common";

const THREE_MINUTES = 3 * 60 * 1000;
const baseConfig = { timeout: THREE_MINUTES };

/**
 * Axios HTTP Client
 * {@link https://github.com/axios/axios#request-config Axios Request Config}
 */
export const httpClient = {
  get: (url, config) =>
    axios.get(url, {
      ...baseConfig,
      ...config,
    }),

  post: (url, data, config) => {
    return axios.post(url, data, {
      ...baseConfig,
      ...config,
    });
  },

  put: (url, data, config) =>
    axios.put(url, data, {
      ...baseConfig,
      ...config,
    }),

  patch: (url, data, config) =>
    axios.patch(url, data, {
      ...baseConfig,
      ...config,
    }),
  delete: (url, config) =>
    axios.delete(url, {
      ...baseConfig,
      ...config,
    }),
};

axios.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");

    //|| use withCredentials if you want in cookie

    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
/**
 * Remove empty, null and undefined values
 * @param obj a record of key value pair
 * @returns a record that does not have empty, null or undefined values
 */
export function filterFalseyValues(obj) {
  for (const propName in obj) {
    if (["", null, undefined].includes(obj[propName])) {
      delete obj[propName];
    } else if (
      obj[propName] instanceof Object &&
      Object.keys(obj[propName]).length
    ) {
      obj[propName] = filterFalseyValues(obj[propName]);
    }
  }
  return obj;
}

export function toFormData(data) {
  const formData = new FormData();
  buildFormData(formData, data);
  return formData;
}

function buildFormData(formData, data, parentKey) {
  if (
    data &&
    typeof data === "object" &&
    !(data instanceof Date) &&
    !(data instanceof Blob)
  ) {
    Object.keys(data).forEach((key) => {
      buildFormData(
        formData,
        data[key],
        parentKey ? `${parentKey}[${key}]` : key
      );
    });
  } else if (parentKey) {
    const value = data instanceof Date ? data.toString() : data;
    formData.append(parentKey, value);
  }
}

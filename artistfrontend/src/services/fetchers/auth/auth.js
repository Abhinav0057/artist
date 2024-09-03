import { useMutation, useQueryClient } from "react-query";
import { api } from "../../api";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
// import jwt_decode from "jwt-decode";

import { httpClient } from "../../http-clients";

export const login = (body) => {
  return httpClient.post(api.auth.login, body);
};

export const signin = (body) => {
  return httpClient.post(api.auth.signin, body);
};

export const getMe=()=>{
  return httpClient.get(api.auth.getMe)
}

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation(api.auth.login, login, {
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [api.auth.getMe],
      });
    },
    // onError: (error) => {
    //   toast.error(error?.response?.data?.message);
    // },
  });
};
export const useSignIn = () => {
  const queryClient = useQueryClient();
  return useMutation(api.auth.login, signin, {
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [api.auth.getUserList],
      });
    },
    // onError: (error) => {
    //   toast.error(error?.response?.data?.message);
    // },
  });
};

// export const useGetUserRole = () =>
//   localStorage.getItem("token")
//     ? jwt_decode(localStorage.getItem("token"))
//     : null;


    export const useGetUserProfile = () => {
      return useQuery(api.auth.getMe, getMe, {
        select: (response) => response.data.data,
        onError: (error) => {
          //   toastFail(error?.response?.data?.message || "Something Went Wrong");
        },
      });
    };
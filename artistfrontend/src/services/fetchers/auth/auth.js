import { useMutation, useQueryClient } from "react-query";
import { api } from "../../api";
import { toast } from "react-toastify";

import { httpClient } from "../../http-clients";

export const login = (body) => {
  return httpClient.post(api.auth.login, body);
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation(api.auth.login, login, {
    onSuccess: (response) => {
      toast.success(response?.data?.message);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });
};

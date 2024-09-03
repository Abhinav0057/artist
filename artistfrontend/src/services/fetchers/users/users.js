import { useMutation, useQueryClient } from "react-query";
import { api } from "../../api";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

import { httpClient } from "../../http-clients";

export const getAllUserList = (page) => () => {
  return httpClient.get(api.user.getUserList, { params: { page: page } });
};
export const registerUser = (body) => {
  return httpClient.post(api.user.registerUser, body);
};
const deleteUser = (id) => {
  return httpClient.post(api.user.deleteUser.replace("{:id}", id));
};

const updateUser = (body) => {
  return httpClient.post(api.user.editUser.replace("{:id}", body.id), body);
};

export const useGetUserList = (page) => {
  return useQuery([api.user.getUserList, page], getAllUserList(page), {
    select: (response) => response.data.data,
    onError: (error) => {
      //   toastFail(error?.response?.data?.message || "Something Went Wrong");
    },
  });
};

export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  return useMutation(api.user.registerUser, registerUser, {
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [api.user.getUserList],
        exact: false, // Invalidate all pages
      });
    },
    // onError: (error) => {
    //   toast.error(error?.response?.data?.message);
    // },
  });
};
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation(api.user.deleteUser, deleteUser, {
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [api.user.getUserList],
        exact: false, // Invalidate all pages
      });
    },
    // onError: (error) => {
    //   toast.error(error?.response?.data?.message);
    // },
  });
};
export const useUpdateeUser = () => {
  const queryClient = useQueryClient();
  return useMutation(api.user.editUser, updateUser, {
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [api.user.getUserList],
        exact: false, // Invalidate all pages
      });
    },
    // onError: (error) => {
    //   toast.error(error?.response?.data?.message);
    // },
  });
};

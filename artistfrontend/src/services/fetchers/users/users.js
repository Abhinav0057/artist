import { useMutation, useQueryClient } from "react-query";
import { api } from "../../api";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

import { httpClient } from "../../http-clients";

export const getAllUserList = (page)=>() => {
  return httpClient.get(api.user.getUserList,{params:{page:page}});
};

export const useGetUserList = (page) => {
  return useQuery([api.user.getUserList,page], getAllUserList(page), {
    select: (response) => response.data.data,
    onError: (error) => {
      //   toastFail(error?.response?.data?.message || "Something Went Wrong");
    },
  });
};

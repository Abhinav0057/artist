import { useMutation, useQueryClient } from "react-query";
import { api } from "../../api";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

import { httpClient } from "../../http-clients";

export const getAllArtistList = (page) => () => {
  return httpClient.get(api.artist.getArtistList, { params: { page: page } });
};
export const registerArtist = (body) => {
  return httpClient.post(api.artist.registerArtist, body);
};
const deleteArtist = (id) => {
  return httpClient.post(api.artist.deleteArtist.replace("{:id}", id));
};

const updateArtist = (body) => {
  return httpClient.post(api.artist.editArtist.replace("{:id}", body.id), body);
};

export const useGetArtistList = (page) => {
  return useQuery([api.artist.getArtistList, page], getAllArtistList(page), {
    select: (response) => response.data.data,
    onError: (error) => {
      //   toastFail(error?.response?.data?.message || "Something Went Wrong");
    },
  });
};

export const useRegisterArtist = () => {
  const queryClient = useQueryClient();
  return useMutation(api.artist.registerArtist, registerArtist, {
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [api.artist.getArtistList],
        exact: false, // Invalidate all pages
      });
    },
    // onError: (error) => {
    //   toast.error(error?.response?.data?.message);
    // },
  });
};
export const useDeleteArtist = () => {
  const queryClient = useQueryClient();
  return useMutation(api.artist.deleteArtist, deleteArtist, {
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [api.artist.getArtistList],
        exact: false, // Invalidate all pages
      });
    },
    // onError: (error) => {
    //   toast.error(error?.response?.data?.message);
    // },
  });
};
export const useUpdateeArtist = () => {
  const queryClient = useQueryClient();
  return useMutation(api.artist.editArtist, updateArtist, {
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [api.artist.getArtistList],
        exact: false, // Invalidate all pages
      });
    },
    // onError: (error) => {
    //   toast.error(error?.response?.data?.message);
    // },
  });
};

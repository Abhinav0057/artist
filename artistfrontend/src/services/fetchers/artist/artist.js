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
const deleteSong = (id) => {
  return httpClient.post(api.artist.deleteSong.replace("{:id}", id));
};

const updateArtist = (body) => {
  return httpClient.post(api.artist.editArtist.replace("{:id}", body.id), body);
};
const getArtistSongList = (id) => () => {
  return httpClient.get(api.artist.getArtistSongList.replace("{:id}", id));
};
export const createSong = (body) => {
  return httpClient.post(api.artist.createSong, body);
};
export const updateSong = (body) => {
  return httpClient.post(api.artist.editSong.replace("{:id}", body.id), body);
};
export const getSampleArtistFile = async (isNotSample = false) => {
  let url = api.artist.sampleDownload;
  let fileName = "artistsample.csv";
  if (isNotSample) {
    url = api.artist.getAll;
    fileName = "all_artists.csv";
  }

  await httpClient
    .get(url)
    .then((response) => {
      var data = response.data;
      var blob = new Blob([data], { type: "text/csv;charset=utf-8;" });

      var link = document.createElement("a");
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // this.UserData = response.data.data
    })
    .catch((error) => {
      console.log(error);
    });
};

export const bulkUploadArtist = async (file) => {
  if (!file) {
    toast.error("No file selected");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await httpClient.post(api.artist.bulkUploadArtist, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("File uploaded successfully");
    console.log("File uploaded successfully:", response);
  } catch (error) {
    console.error("Error uploading file:", error);

    if (error.response) {
      toast.error(`Error: ${error.response.data.message || "Failed to upload file"}`);
    } else if (error.request) {
      toast.error("No response from server. Please try again later.");
    } else {
      toast.error("Error uploading file");
    }
  }
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
export const useCreateSong = () => {
  const queryClient = useQueryClient();
  return useMutation(api.artist.createSong, createSong, {
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [api.artist.getArtistSongList],
        exact: false, // Invalidate all pages
      });
    },
    // onError: (error) => {
    //   toast.error(error?.response?.data?.message);
    // },
  });
};
export const useUpdateSong = () => {
  const queryClient = useQueryClient();
  return useMutation(api.artist.editSong, updateSong, {
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [api.artist.getArtistSongList],
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
export const useDeleteSong = () => {
  const queryClient = useQueryClient();
  return useMutation(api.artist.deleteSong, deleteSong, {
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [api.artist.getArtistSongList],
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

export const useGetArtistSongList = (id) => {
  const queryClient = useQueryClient();
  return useQuery([api.artist.getArtistSongList, id], getArtistSongList(id), {
    select: (response) => response.data,
    onError: (error) => {
      //   toastFail(error?.response?.data?.message || "Something Went Wrong");
    },
  });
};

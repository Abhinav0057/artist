export const api = {
  auth: {
    login: "get-token/",
    signin: "register/",
    getMe: "get/me/",
  },
  user: {
    getUserList: "get/user-list/",
    registerUser: "register/user/",
    editUser: "edit/user/{:id}/",
    deleteUser: "delete/user/{:id}/",
  },
  artist: {
    getArtistList: "get/artist/list/",
    registerArtist: "create/artist/",
    editArtist: "edit/artist/{:id}/",
    deleteArtist: "delete/artist/{:id}/",
    getArtistSongList: "get/artist/song/list/{:id}/",
    createSong: "create/artist/song/",
    editSong: "edit/artist/song/{:id}/",
  },
};

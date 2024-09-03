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
    registerArtist: "register/user/",
    editArtist: "edit/user/{:id}/",
    deleteArtist: "delete/artist/{:id}/",
  },
};

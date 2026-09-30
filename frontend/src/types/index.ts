export interface User {
  firstname: string;
  lastname: string;
  profile_picture?: string;
  _id: string;
}

export interface Post {
  _id: string;
  title: string;
  description: string;
  createdAt: string | number;
  userID: {
    _id: string;
    profile_picture: string;
    firstname: string;
    lastname: string;
  };
}

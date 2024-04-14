export interface dtoUserRegister {
  username: string;
  email: string;
  password: string;
}

export interface dtoUserLogin {
  email: string;
  password: string;
}

export interface dtoUser {
  username: string;
  email: string;
  token: string;
}

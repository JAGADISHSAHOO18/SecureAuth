import type User from "./User";

export default interface LoginResponseData {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

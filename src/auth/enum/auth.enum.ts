export type AuthInput = { email: string; password: string };

export type SignInData = {
  userId: number;
  name: string;
  role: string;
  tokenVersion: number;
};

export type AuthResult = SignInData & {
  accessToken: string;
};

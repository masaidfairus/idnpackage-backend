/** Input untuk login: email + password */
export type AuthInput = { email: string; password: string };

/** Data user tanpa password, dipakai di JWT payload dan session */
export type SignInData = {
  userId: number;
  name: string;
  role: string;
  roomId: number | null;
  roomName: string | null;
  tokenVersion: number;
};

/** Response login: SignInData + accessToken */
export type AuthResult = SignInData & {
  accessToken: string;
};

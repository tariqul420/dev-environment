export interface IUser {
  email: string;
  name?: string;
  role: 'user' | 'admin';
  profile?: string;
  password: string;
}

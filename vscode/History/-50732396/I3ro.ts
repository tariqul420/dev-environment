export interface IUser {
  clerkUserId: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  profilePicture: string;
}

export interface IUser {
  clerkUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  profile: string;
  slug: string;
}

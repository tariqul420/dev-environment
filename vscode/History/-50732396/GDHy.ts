export interface IUser {
  clerkId: string;
  email: string;
  name: string;
  role: 'admin' | 'recruiter' | 'candidate';
  profilePicture: string;
}

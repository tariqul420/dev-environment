export interface IUser {
  clerkUserId: string;
  email: string;
  name: string;
  role: 'admin' | 'recruiter' | 'candidate';
  profilePicture: string;
}

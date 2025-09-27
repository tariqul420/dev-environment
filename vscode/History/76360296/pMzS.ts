import { CreateUserParams } from '@/types/type';
import { Account, Avatars, Client, Databases, ID } from 'react-native-appwrite';

export const appWriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT as string,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID as string,
  platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM as string,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID as string,
  userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID as string,
};

export const client = new Client();

client.setEndpoint(appWriteConfig.endpoint).setProject(appWriteConfig.projectId).setPlatform(appWriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);

export async function createUser({ email, password, name }: CreateUserParams) {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw Error;

    await signIn({ email, password });

    const avatarUrl = avatars.getInitialsURL(name);

    return await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, ID.unique(), { email, name, accountId: newAccount.$id, avatar: avatarUrl });
  } catch (error) {
    throw new Error(error as string);
  }
}

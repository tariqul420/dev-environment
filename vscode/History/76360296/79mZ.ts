import { Account, Client } from 'react-native-appwrite';

export const appWriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT as string,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID as string,
  platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM as string,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID as string,
  userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID as string,
};

export const client = new Client();

client.setEndpoint(appWriteConfig.endpoint).setProject(appWriteConfig.projectId).setPlatform(appWriteConfig.platform);

export const account = new Account();

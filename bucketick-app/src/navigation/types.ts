import type { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  Home: undefined; // achievement feed
  Explore: undefined; // masonry gallery
  Create: undefined; // center button, press is intercepted
  Search: undefined; // account search
  Lists: undefined; // my bucket lists
};

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  Tabs: NavigatorScreenParams<TabParamList>;
  Profile: { userId?: string };
  Connections: { tab?: 'followers' | 'following' };
  PostDetail: { postId: string };
  CreatePost: undefined;
  ListDetail: { listId: string };
  ListForm: { listId?: string };
  EditProfile: undefined;
};

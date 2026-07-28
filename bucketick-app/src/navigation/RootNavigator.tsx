import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { useAuthStore } from '../store/authStore';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { ConnectionsScreen } from '../screens/profile/ConnectionsScreen';
import { PostDetailScreen } from '../screens/feed/PostDetailScreen';
import { CreatePostScreen } from '../screens/feed/CreatePostScreen';
import { ListDetailScreen } from '../screens/home/ListDetailScreen';
import { ListFormScreen } from '../screens/home/ListFormScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { TabNavigator } from './TabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.cream, primary: colors.pink },
};

export function RootNavigator() {
  const hasOnboarded = useAuthStore((s) => s.hasOnboarded);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream } }}>
        {!hasOnboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : !isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Tabs" component={TabNavigator} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Connections" component={ConnectionsScreen} />
            <Stack.Screen name="PostDetail" component={PostDetailScreen} />
            <Stack.Screen name="ListDetail" component={ListDetailScreen} />
            <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="ListForm" component={ListFormScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ presentation: 'modal' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

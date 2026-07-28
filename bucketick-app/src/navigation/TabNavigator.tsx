import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FeedScreen } from '../screens/feed/FeedScreen';
import { ExploreScreen } from '../screens/explore/ExploreScreen';
import { SearchScreen } from '../screens/search/SearchScreen';
import { ListsScreen } from '../screens/lists/ListsScreen';
import { TabBar } from './TabBar';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

// Placeholder: the Create tab never renders; its press opens the create sheet.
const Noop = () => <View />;

export function TabNavigator() {
  return (
    <Tab.Navigator tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={FeedScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Create" component={Noop} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Lists" component={ListsScreen} />
    </Tab.Navigator>
  );
}

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ReportIssueScreen } from '../screens/ReportIssueScreen';
import { NearbyIssuesScreen } from '../screens/NearbyIssues';
import { ReportDetailsScreen } from '../screens/ReportDetails';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#fff' },
        }}
        initialRouteName="Welcome"
      >
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
        />
        <Stack.Screen 
          name="ReportIssue" 
          component={ReportIssueScreen} 
        />
        <Stack.Screen 
          name="NearbyIssues" 
          component={NearbyIssuesScreen} 
        />
        <Stack.Screen 
          name="ReportDetails" 
          component={ReportDetailsScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

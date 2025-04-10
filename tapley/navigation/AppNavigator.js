import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from '../screens/Auth/Login_screen';
import RideComparisonScreen from '../screens/Ride/Ride_comparison_screen';
import ProfileScreen from '../screens/Profile/ProfileScreen'; // Import the new ProfileScreen

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Create a drawer navigator for authenticated screens
function HomeStack() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: '#FF8C00',
        drawerInactiveTintColor: '#333',
        drawerStyle: {
          backgroundColor: '#FFF',
        },
      }}
    >
      <Drawer.Screen 
        name="RideComparison" 
        component={RideComparisonScreen} 
        options={{ title: 'Ride Comparison' }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'My Profile' }}
      />
    </Drawer.Navigator>
  );
}

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FF8C00',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeStack}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
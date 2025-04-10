import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from '../screens/Auth/Login_screen';
import RideComparisonScreen from '../screens/Ride/Ride_comparison_screen';
import HelpSupportScreen from '../screens/Auth/HelpSupportScreen';
import RatingScreen from '../screens/Ride/RatingScreen';
import PrivacyPolicyScreen from '../screens/Auth/PrivacyPolicyScreen';
import SavedPlacesScreen from '../screens/Profile/SavedPlacesScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';
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
        <Stack.Screen 
        name="Help and Support" 
        component={HelpSupportScreen} />
        <Stack.Screen
         name="PrivacyPolicy" 
         component={PrivacyPolicyScreen} />
         <Stack.Screen 
         name="SavedPlaces" 
         component={SavedPlacesScreen} 
         />
         <Stack.Screen 
         name="Rating" 
         component={RatingScreen} />
         <Stack.Screen 
         name="Settings" 
         component={SettingsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
    
  );
};

export default AppNavigator;
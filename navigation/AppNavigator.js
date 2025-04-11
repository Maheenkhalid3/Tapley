import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

// Import all screens
import LoginScreen from '../screens/Auth/Login_screen';
import RideComparisonScreen from '../screens/Ride/Ride_comparison_screen';
import HelpSupportScreen from '../screens/Auth/HelpSupportScreen';
import RatingScreen from '../screens/Ride/RatingScreen';
import PrivacyPolicyScreen from '../screens/Auth/PrivacyPolicyScreen';
import SavedPlacesScreen from '../screens/Profile/SavedPlacesScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import PrivacySettingsScreen from '../screens/Profile/PrivacySettingsScreen';
import AboutUsScreen from '../screens/Profile/AboutUsScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Main stack navigator
function MainStack() {
  const { colors } = React.useContext(ThemeContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background }
      }}
    >
      <Stack.Screen name="RideComparison" component={RideComparisonScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
      <Stack.Screen name="AboutUs" component={AboutUsScreen} />
    </Stack.Navigator>
  );
}

// Drawer navigation
function HomeDrawer() {
  const { colors } = React.useContext(ThemeContext);

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.text,
        drawerStyle: {
          backgroundColor: colors.card,
          paddingTop: 40,
        },
        headerShown: false,
        sceneContainerStyle: { backgroundColor: colors.background }
      }}
    >
      <Drawer.Screen 
        name="Main" 
        component={MainStack} 
        options={{ title: 'Home' }}
      />
      <Drawer.Screen 
        name="ProfileDrawer" 
        component={ProfileScreen}
        options={{ title: 'My Profile' }}
      />
      <Drawer.Screen 
        name="SettingsDrawer" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
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
            backgroundColor: '#FF8C00', // Orange header
          },
          headerTintColor: '#fff', // White text
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerBackTitleVisible: false,
          contentStyle: { backgroundColor: '#f8f9fa' } // Default light background
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeDrawer}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="HelpSupport" 
          component={HelpSupportScreen}
          options={{ 
            title: 'Help & Support',
            headerStyle: { backgroundColor: '#FF8C00' },
            headerTintColor: '#fff'
          }}
        />
        <Stack.Screen 
          name="PrivacyPolicy" 
          component={PrivacyPolicyScreen}
          options={{ 
            title: 'Privacy Policy',
            headerStyle: { backgroundColor: '#FF8C00' },
            headerTintColor: '#fff'
          }}
        />
        <Stack.Screen 
          name="SavedPlaces" 
          component={SavedPlacesScreen}
          options={{ 
            title: 'Saved Places',
            headerStyle: { backgroundColor: '#FF8C00' },
            headerTintColor: '#fff'
          }}
        />
        <Stack.Screen 
          name="Rating" 
          component={RatingScreen}
          options={{ 
            title: 'Rate Us',
            headerStyle: { backgroundColor: '#FF8C00' },
            headerTintColor: '#fff'
          }}
        />
        <Stack.Screen 
          name="Settings"
          component={SettingsScreen}
          options={{ 
            title: 'Settings',
            headerStyle: { backgroundColor: '#FF8C00' },
            headerTintColor: '#fff'
          }}
        />
        <Stack.Screen 
          name="Profile"
          component={ProfileScreen}
          options={{ 
            title: 'My Profile',
            headerStyle: { backgroundColor: '#FF8C00' },
            headerTintColor: '#fff'
          }}
        />
        <Stack.Screen 
          name="PrivacySettings"
          component={PrivacySettingsScreen}
          options={{ 
            title: 'Privacy Settings',
            headerStyle: { backgroundColor: '#FF8C00' },
            headerTintColor: '#fff'
          }}
        />
        <Stack.Screen 
          name="AboutUs"
          component={AboutUsScreen}
          options={{ 
            title: 'About Us',
            headerStyle: { backgroundColor: '#FF8C00' },
            headerTintColor: '#fff'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
});

export default AppNavigator;
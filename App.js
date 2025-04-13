// App.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import 'react-native-gesture-handler';
import { ThemeProvider } from './context/ThemeContext';


function SplashScreen() {
  return (
    <View style={styles.splashContainer}>
      <Text style={styles.splashText}>TAPLEY</Text>
    </View>
  );
}

function MainApp() {
  const [showSplash, setShowSplash] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#FF8C00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
  },
});
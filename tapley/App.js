import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  const [showSplash, setShowSplash] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // 3 seconds delay
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <Text style={styles.splashText}>TAPLEY</Text>
      </View>
    );
  }

  return <AppNavigator />;
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#FF8C00', // Orange background
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashText: {
    fontSize: 48, // Slightly larger
    fontWeight: '700', // Extra bold (maximum boldness)
    color: '#fff',
    letterSpacing: 2, // Wider spacing between letters
    textShadowColor: 'rgba(0, 0, 0, 0.6)', // Darker shadow
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    transform: [{ scaleY: 1.1 }], 
  },
});
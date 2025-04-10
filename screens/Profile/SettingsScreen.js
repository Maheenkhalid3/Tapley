import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SettingsScreen = ({ navigation }) => {
  // Settings states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [saveSearchHistory, setSaveSearchHistory] = useState(true);

  const handleLogout = () => {
    // Implement your logout logic here
    Alert.alert("Logged Out", "You have been successfully logged out");
    navigation.navigate('Login');
  };

  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* App Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>App Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingText}>
              <MaterialIcons name="notifications" size={22} color="#FF8C00" />
              <Text style={[styles.settingLabel, darkMode && styles.darkText]}>Price Comparison Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#767577", true: "#FF8C00" }}
              thumbColor={notificationsEnabled ? "#fff" : "#f4f3f4"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingText}>
              <MaterialIcons name="dark-mode" size={22} color="#FF8C00" />
              <Text style={[styles.settingLabel, darkMode && styles.darkText]}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#767577", true: "#FF8C00" }}
              thumbColor={darkMode ? "#fff" : "#f4f3f4"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingText}>
              <MaterialIcons name="price-change" size={22} color="#FF8C00" />
              <Text style={[styles.settingLabel, darkMode && styles.darkText]}>Price Drop Alerts</Text>
            </View>
            <Switch
              value={priceAlerts}
              onValueChange={setPriceAlerts}
              trackColor={{ false: "#767577", true: "#FF8C00" }}
              thumbColor={priceAlerts ? "#fff" : "#f4f3f4"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingText}>
              <MaterialIcons name="history" size={22} color="#FF8C00" />
              <Text style={[styles.settingLabel, darkMode && styles.darkText]}>Save Search History</Text>
            </View>
            <Switch
              value={saveSearchHistory}
              onValueChange={setSaveSearchHistory}
              trackColor={{ false: "#767577", true: "#FF8C00" }}
              thumbColor={saveSearchHistory ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Account</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingText}>
              <MaterialIcons name="person" size={22} color="#FF8C00" />
              <Text style={[styles.settingLabel, darkMode && styles.darkText]}>Edit Profile</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#FF8C00" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingText}>
              <MaterialIcons name="security" size={22} color="#FF8C00" />
              <Text style={[styles.settingLabel, darkMode && styles.darkText]}>Privacy Settings</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#FF8C00" />
          </TouchableOpacity>
        </View>

        {/* App Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>About Tapley</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingText}>
              <MaterialIcons name="info" size={22} color="#FF8C00" />
              <Text style={[styles.settingLabel, darkMode && styles.darkText]}>About Us</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#FF8C00" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
    },
    darkContainer: {
      backgroundColor: '#121212',
    },
    content: {
      padding: 12, // Reduced padding
      paddingBottom: 40, // Increased padding to ensure space for version text
    },
    section: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 12, // Reduced padding
      marginBottom: 12, // Reduced margin
      elevation: 2,
    },
    sectionTitle: {
      fontSize: 15, // Reduced font size
      fontWeight: 'bold',
      color: '#FF8C00',
      marginBottom: 10, // Reduced margin
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8, // Reduced padding
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    settingText: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    settingLabel: {
      fontSize: 14, // Reduced font size
      color: '#333',
      marginLeft: 10, // Reduced margin
    },
    logoutContainer: {
      marginTop: 20, // Increased margin for better spacing
      alignItems: 'center',
    },
    logoutButton: {
      backgroundColor: '#FF8C00',
      padding: 14, // Reduced padding
      borderRadius: 8,
      alignItems: 'center',
      width: '80%',
    },
    logoutText: {
      color: '#fff',
      fontSize: 15, // Reduced font size
      fontWeight: 'bold',
    },
    versionText: {
      textAlign: 'center',
      marginTop: 25, // Increased margin for better visibility
      color: '#888',
      fontSize: 12,
    },
  });
  
  export default SettingsScreen;
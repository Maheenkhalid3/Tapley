import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeContext } from '@context/ThemeContext';

const SettingsScreen = ({ navigation }) => {
  const {
    colors,
    toggleTheme,
    isDark,
  } = useContext(ThemeContext);

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [priceAlerts, setPriceAlerts] = React.useState(true);
  const [saveSearchHistory, setSaveSearchHistory] = React.useState(true);

  const handleLogout = () => {
    Alert.alert("Logged Out", "You have been successfully logged out");
    navigation.navigate('Login');
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.primary,
      elevation: 3,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
      flex: 1,
      marginRight: 24, // balances the back button space
    },
    content: {
      padding: 12,
      paddingBottom: 40,
    },
    section: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 10,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingText: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    settingLabel: {
      fontSize: 14,
      color: colors.text,
      marginLeft: 10,
    },
    logoutContainer: {
      marginTop: 20,
      alignItems: 'center',
    },
    logoutButton: {
      backgroundColor: colors.primary,
      padding: 14,
      borderRadius: 8,
      alignItems: 'center',
      width: '80%',
    },
    logoutText: {
      color: '#fff',
      fontSize: 15,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} /> {/* Empty view for spacing */}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* App Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingText}>
              <MaterialIcons name="notifications" size={22} color={colors.primary} />
              <Text style={styles.settingLabel}>Price Comparison Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#767577", true: colors.primary }}
              thumbColor={notificationsEnabled ? "#fff" : "#f4f3f4"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingText}>
              <MaterialIcons name="dark-mode" size={22} color={colors.primary} />
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: "#767577", true: colors.primary }}
              thumbColor={isDark ? "#fff" : "#f4f3f4"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingText}>
              <MaterialIcons name="price-change" size={22} color={colors.primary} />
              <Text style={styles.settingLabel}>Price Drop Alerts</Text>
            </View>
            <Switch
              value={priceAlerts}
              onValueChange={setPriceAlerts}
              trackColor={{ false: "#767577", true: colors.primary }}
              thumbColor={priceAlerts ? "#fff" : "#f4f3f4"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingText}>
              <MaterialIcons name="history" size={22} color={colors.primary} />
              <Text style={styles.settingLabel}>Save Search History</Text>
            </View>
            <Switch
              value={saveSearchHistory}
              onValueChange={setSaveSearchHistory}
              trackColor={{ false: "#767577", true: colors.primary }}
              thumbColor={saveSearchHistory ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={navigateToProfile}
          >
            <View style={styles.settingText}>
              <MaterialIcons name="person" size={22} color={colors.primary} />
              <Text style={styles.settingLabel}>Edit Profile</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigation.navigate('PrivacySettings')}
          >
            <View style={styles.settingText}>
              <MaterialIcons name="security" size={22} color={colors.primary} />
              <Text style={styles.settingLabel}>Privacy Settings</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* App Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Tapley</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigation.navigate('AboutUs')}
          >
            <View style={styles.settingText}>
              <MaterialIcons name="info" size={22} color={colors.primary} />
              <Text style={styles.settingLabel}>About Us</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
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

export default SettingsScreen;
// PrivacySettingsScreen.js
import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeContext } from '@context/ThemeContext';

const PrivacySettingsScreen = ({ navigation }) => {
  const { colors } = useContext(ThemeContext);
  const [dataSharing, setDataSharing] = React.useState(true);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      
      {/* Main Header with Back Arrow */}
      <View style={[styles.mainHeader, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.mainHeaderTitle}>Privacy Settings</Text>
        <View style={{ width: 24 }} /> {/* Empty view for spacing */}
      </View>

      <ScrollView contentContainerStyle={[styles.content, { backgroundColor: colors.background }]}>
        {/* All settings in one clean list */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          {/* Data Sharing Switch */}
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingText}>
              <MaterialIcons name="share" size={22} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Data Sharing with Partners</Text>
            </View>
            <Switch
              value={dataSharing}
              onValueChange={setDataSharing}
              trackColor={{ false: "#767577", true: colors.primary }}
              thumbColor={dataSharing ? "#fff" : "#f4f3f4"}
            />
          </View>
          
          {/* Change Password */}
          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingText}>
              <MaterialIcons name="lock" size={22} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Change Password</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
          </TouchableOpacity>
          
          {/* Download Data */}
          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingText}>
              <MaterialIcons name="download" size={22} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Download Your Data</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
          </TouchableOpacity>
          
          {/* Delete Account */}
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingText}>
              <MaterialIcons name="delete" size={22} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Delete Account</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    elevation: 3,
  },
  mainHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  section: {
    borderRadius: 8,
    padding: 12,
    margin: 12,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  settingText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 14,
    marginLeft: 10,
  },
});

export default PrivacySettingsScreen;
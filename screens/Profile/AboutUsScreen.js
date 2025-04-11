// AboutUsScreen.js
import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeContext } from '@context/ThemeContext';

const AboutUsScreen = ({ navigation }) => {
  const { colors } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      
      {/* Main Header with Back Arrow */}
      <View style={[styles.mainHeader, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.mainHeaderTitle}>About Us</Text>
        <View style={{ width: 24 }} /> {/* Empty view for spacing */}
      </View>

      <ScrollView contentContainerStyle={[styles.content, { backgroundColor: colors.background }]}>
        {/* Combined content in one clean section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          {/* Tapley Description - Now at the top */}
          <View style={styles.descriptionContainer}>
            <Text style={[styles.description, { color: colors.text }]}>
              Tapley is a price comparison app that helps you find the best deals across multiple retailers. 
              Our mission is to save you money and make shopping easier.
            </Text>
          </View>
          
          {/* Version */}
          <View style={[styles.infoItem, { borderTopWidth: 1, borderTopColor: colors.border }]}>
            <Text style={[styles.infoLabel, { color: colors.text }]}>Version</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>1.1.0</Text>
          </View>
          
          {/* Release Date */}
          <View style={[styles.infoItem, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
            <Text style={[styles.infoLabel, { color: colors.text }]}>Release Date</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>April 2025</Text>
          </View>
          
          {/* Terms of Service */}
          <TouchableOpacity style={[styles.linkItem, { marginTop: 8 }]}>
            <MaterialIcons name="gavel" size={22} color={colors.primary} />
            <Text style={[styles.linkText, { color: colors.text }]}>Terms of Service</Text>
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
    padding: 16,
    margin: 12,
    elevation: 2,
  },
  descriptionContainer: {
    paddingBottom: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
});

export default AboutUsScreen;
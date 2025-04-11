import { ThemeContext } from '@context/ThemeContext';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PrivacyPolicyScreen = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    // Apply smooth layout animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    // Update the expanded section state
    setExpandedSection((prevSection) => (prevSection === section ? null : section));
  };

  const sections = [
    {
      id: 1,
      title: "1. Information We Collect",
      content: `- Location data (only when you actively use the comparison feature)
- Ride selection preferences
- Device information for app optimization`,
    },
    {
      id: 2,
      title: "2. How We Use Your Data",
      content: `- To provide accurate price comparisons between Yango and Bykea
- To improve our service quality
- For basic analytics to enhance user experience`,
    },
    {
      id: 3,
      title: "3. Data Storage",
      content: `- Location data is not stored unless you choose to save favorite locations
- Anonymous usage statistics may be retained for service improvement`,
    },
    {
      id: 4,
      title: "4. Third-Party Services",
      content: `- We don't share personal data with Yango or Bykea
- We use secure cloud services for data processing`,
    },
    {
      id: 5,
      title: "5. Your Rights",
      content: `- Request access to your stored data
- Ask for data deletion
- Opt-out of analytics`,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.lastUpdated}>Last updated: April 2024</Text>

        <Text style={styles.introText}>
          At Tapley, we take your privacy seriously. This policy explains how we collect, use, and protect your information when you use our price comparison service.
        </Text>

        {/* Accordion Sections */}
        {sections.map((section) => (
          <View key={section.id} style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection(section.id)}
            >
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <MaterialIcons
                name={expandedSection === section.id ? 'expand-less' : 'expand-more'}
                size={24}
                color="#FF8C00"
              />
            </TouchableOpacity>
            {expandedSection === section.id && (
              <Text style={styles.sectionContent}>{section.content}</Text>
            )}
          </View>
        ))}

        {/* Contact Information */}
        <View style={styles.contactCard}>
          <MaterialIcons name="email" size={28} color="#FF8C00" />
          <Text style={styles.contactText}>
            For privacy-related questions, contact us at:
          </Text>
          <Text style={styles.contactEmail}>privacy@tapley.com</Text>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#888',
    marginBottom: 16,
    textAlign: 'right',
  },
  introText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    marginBottom: 24,
  },
  section: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  sectionContent: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 22,
    color: '#555',
  },
  contactCard: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
  },
  contactText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  contactEmail: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default PrivacyPolicyScreen;
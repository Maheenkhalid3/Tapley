import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeContext } from '@context/ThemeContext';

const TermsScreen = ({ navigation }) => {
  const { colors } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      
      
      <ScrollView contentContainerStyle={[styles.content, { backgroundColor: colors.background }]}>
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>1. Acceptance of Terms</Text>
          <Text style={[styles.text, { color: colors.text }]}>
            By using Tapley ("the Platform"), you agree to these Terms of Service. The Platform provides a unified service aggregator for comparing ride-hailing, food delivery, and e-commerce services across multiple providers.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.primary }]}>2. Service Description</Text>
          <Text style={[styles.text, { color: colors.text }]}>
            Tapley aggregates pricing and service information from third-party providers to enable comparisons. Final transactions are completed through the respective provider's platform. We do not process payments or fulfill services directly.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.primary }]}>3. Data Usage</Text>
          <Text style={[styles.text, { color: colors.text }]}>
            We collect necessary location and preference data to provide accurate comparisons. User data is encrypted and stored securely in compliance with data protection regulations.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.primary }]}>4. Third-Party Services</Text>
          <Text style={[styles.text, { color: colors.text }]}>
            Tapley redirects users to third-party applications for final transactions. We are not responsible for the terms, privacy policies, or practices of these external services.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.primary }]}>5. Intellectual Property</Text>
          <Text style={[styles.text, { color: colors.text }]}>
            The Tapley platform, including its comparison algorithms and interface designs, is proprietary. Service provider logos and trademarks displayed belong to their respective owners.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.primary }]}>6. Limitation of Liability</Text>
          <Text style={[styles.text, { color: colors.text }]}>
            While we strive for accuracy, Tapley does not guarantee the completeness or reliability of compared prices. Users should verify final costs with service providers before completing transactions.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.primary }]}>7. Modifications</Text>
          <Text style={[styles.text, { color: colors.text }]}>
            These terms may be updated as we expand to new service domains (food delivery, e-commerce, etc.). Continued use after changes constitutes acceptance of the modified terms.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.primary }]}>8. Governing Law</Text>
          <Text style={[styles.text, { color: colors.text, marginBottom: 20 }]}>
            These terms are governed by the laws of Pakistan. Any disputes shall be resolved in courts of competent jurisdiction in Taxila.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    elevation: 3,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
});

export default TermsScreen;
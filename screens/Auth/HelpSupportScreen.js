import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HelpSupportScreen = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleContact = (method) => {
    switch (method) {
      case 'email':
        Linking.openURL('mailto:support@tapley.com');
        break;
      case 'phone':
        Linking.openURL('tel:+923001234567');
        break;
      default:
        break;
    }
  };

  const faqs = [
    {
      id: '1',
      question: "Why are prices different between services?",
      answer: "Each service uses different algorithms considering factors like demand, distance, and their own pricing policies.",
    },
    {
      id: '2',
      question: "Can I book rides through Tapley?",
      answer: "No, Tapley only compares prices. You'll need to use the respective apps (Yango or Bykea) to book your ride.",
    },
    {
      id: '3',
      question: "How current are the price estimates?",
      answer: "Prices are fetched in real-time when you make the comparison, but may change when you actually book.",
    },
    {
      id: '4',
      question: "Does Tapley store my location data?",
      answer: "We only store your location if you choose to save it for future use. Otherwise, it's used temporarily just for the price comparison.",
    },
    {
      id: '5',
      question: "Which cities are supported?",
      answer: "Currently we support price comparison in all cities where both Yango and Bykea operate in Pakistan.",
    },
  ];

  const toggleAnswer = (id) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        200,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity
      ),
      () => setIsAnimating(false)
    );
    
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.faqContainer}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqs.map((item) => (
            <View key={item.id} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => toggleAnswer(item.id)}
                activeOpacity={0.7}
                delayPressIn={0}
              >
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <MaterialIcons
                  name={expandedId === item.id ? 'expand-less' : 'expand-more'}
                  size={24}
                  color="#FF8C00"
                />
              </TouchableOpacity>
              
              {expandedId === item.id && (
                <View style={styles.answerContainer}>
                  <Text style={styles.faqAnswer}>{item.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.contactContainer}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          
          <TouchableOpacity
            style={[styles.contactMethod, { marginBottom: 15 }]}
            onPress={() => handleContact('email')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="email" size={28} color="#FF8C00" />
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>Email us at</Text>
              <Text style={styles.contactValue}>support@tapley.com</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.contactMethod}
            onPress={() => handleContact('phone')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="phone" size={28} color="#FF8C00" />
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>Call us at</Text>
              <Text style={styles.contactValue}>+92 300 1234567</Text>
            </View>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  faqContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  contactContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 20,
  },
  faqItem: {
    marginBottom: 15,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  answerContainer: {
    paddingTop: 10,
    paddingLeft: 5,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  contactTextContainer: {
    marginLeft: 15,
  },
  contactLabel: {
    fontSize: 14,
    color: '#888',
  },
  contactValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginTop: 2,
  },
});

export default HelpSupportScreen;
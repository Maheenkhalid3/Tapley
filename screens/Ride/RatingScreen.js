import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeContext } from '@context/ThemeContext';

const RatingScreen = ({ navigation }) => {
  const [rating, setRating] = useState(0);
  const [accuracyRating, setAccuracyRating] = useState(0);
  const [comment, setComment] = useState('');
  
  // These would come from our navigation params
  const comparisonDetails = {
    date: new Date().toLocaleDateString(),
    from: "Gulberg",
    to: "DHA Phase 5",
    services: ["Yango", "Bykea"]
  };

  const handleSubmit = () => {
    if (rating === 0 || accuracyRating === 0) {
      Alert.alert("Please Rate", "Please provide both ratings before submitting");
      return;
    }

    // Here you would send the rating to our backend
    console.log("Rating submitted:", {
      appRating: rating,
      accuracyRating,
      comment
    });
    
    Alert.alert("Thank You!", "Your feedback helps us improve our service");
    navigation.goBack();
  };

  const renderStars = (currentRating, setRatingFunction, size = 28) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity 
            key={star} 
            onPress={() => setRatingFunction(star)}
          >
            <MaterialIcons
              name={star <= currentRating ? 'star' : 'star-border'}
              size={size}
              color={star <= currentRating ? '#FF8C00' : '#ccc'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
    

      <ScrollView contentContainerStyle={styles.content}>
        {/* Comparison Summary */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Your Comparison</Text>
          
          <View style={styles.detailRow}>
            <MaterialIcons name="date-range" size={20} color="#FF8C00" />
            <Text style={styles.detailText}>{comparisonDetails.date}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialIcons name="my-location" size={20} color="#FF8C00" />
            <Text style={styles.detailText}>{comparisonDetails.from}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialIcons name="location-on" size={20} color="#FF8C00" />
            <Text style={styles.detailText}>{comparisonDetails.to}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialIcons name="compare" size={20} color="#FF8C00" />
            <Text style={styles.detailText}>
              Compared: {comparisonDetails.services.join(" vs ")}
            </Text>
          </View>
        </View>

        {/* App Experience Rating */}
        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>Rate Tapley Experience</Text>
          <Text style={styles.ratingSubtitle}>How was your experience using our comparison service?</Text>
          {renderStars(rating, setRating)}
        </View>

        {/* Accuracy Rating */}
        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>Rate Price Accuracy</Text>
          <Text style={styles.ratingSubtitle}>How accurate were the prices compared to actual booking?</Text>
          {renderStars(accuracyRating, setAccuracyRating)}
        </View>

        {/* Comments */}
        <View style={styles.commentSection}>
          <Text style={styles.sectionTitle}>Additional Feedback</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="What can we improve about our comparison service?"
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.submitButton, (rating === 0 || accuracyRating === 0) && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={rating === 0 || accuracyRating === 0}
        >
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 10,
  },
  ratingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
  ratingSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignSelf: 'center',
    marginTop: 10,
  },
  commentSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#FF8C00',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RatingScreen;
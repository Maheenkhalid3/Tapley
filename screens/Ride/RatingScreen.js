import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeContext } from '@context/ThemeContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; // Import the library

const RatingScreen = ({ navigation }) => {
  const [rating, setRating] = useState(0);
  const [accuracyRating, setAccuracyRating] = useState(0);
  const [comment, setComment] = useState('');
  const { colors } = useContext(ThemeContext); // Get theme colors

  const handleSubmit = () => {
    if (rating === 0 || accuracyRating === 0) {
      Alert.alert('Please Rate', 'Please provide both ratings before submitting');
      return;
    }

    Alert.alert('Thank You!', 'Your feedback helps us improve our service');
    navigation.goBack();
  };

  const renderStars = (currentRating, setRatingFunction) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRatingFunction(star)}>
            <MaterialIcons
              name={star <= currentRating ? 'star' : 'star-border'}
              size={22}
              color={star <= currentRating ? colors.primary : '#ccc'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <KeyboardAwareScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true} // Ensures it works on Android
      extraScrollHeight={100} // Adds extra space above the keyboard
    >
      {/* Comparison Summary */}
      <View style={[styles.detailsCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Your Comparison</Text>
        <View style={styles.detailRow}>
          <MaterialIcons name="date-range" size={18} color={colors.primary} />
          <Text style={[styles.detailText, { color: colors.text }]}>Date: {new Date().toLocaleDateString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="my-location" size={18} color={colors.primary} />
          <Text style={[styles.detailText, { color: colors.text }]}>From: Gulberg</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="location-on" size={18} color={colors.primary} />
          <Text style={[styles.detailText, { color: colors.text }]}>To: DHA Phase 5</Text>
        </View>
      </View>

      {/* App Experience Rating */}
      <View style={[styles.ratingSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Rate Tapley Experience</Text>
        {renderStars(rating, setRating)}
      </View>

      {/* Accuracy Rating */}
      <View style={[styles.ratingSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Rate Price Accuracy</Text>
        {renderStars(accuracyRating, setAccuracyRating)}
      </View>

      {/* Comments */}
      <View style={[styles.commentSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Additional Feedback</Text>
        <TextInput
          style={[
            styles.commentInput,
            {
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="What can we improve?"
          placeholderTextColor={colors.textSecondary}
          multiline
          scrollEnabled // Enables scrolling within the TextInput
          numberOfLines={4} // Default visible lines
          value={comment}
          onChangeText={setComment}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          { backgroundColor: '#FF8C00' },
        ]}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Submit Feedback</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 15,
  },
  detailsCard: {
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailText: {
    fontSize: 12,
    marginLeft: 16,
  },
  ratingSection: {
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    alignSelf: 'center',
    marginTop: 10,
  },
  commentSection: {
    borderRadius: 8,
    padding: 22,
    marginBottom: 5,
    elevation: 2,
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 18,
    minHeight: 90,
    textAlignVertical: 'top',
    fontSize: 12,
  },
  submitButton: {
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: '#FF8C00',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RatingScreen;
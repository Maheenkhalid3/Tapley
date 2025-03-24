import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const RideOptionCard = ({ option, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={option.logo} style={styles.logo} />
      <View style={styles.details}>
        <Text style={styles.provider}>{option.provider}</Text>
        <Text style={styles.carType}>{option.carType}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{option.price}</Text>
        <Text style={styles.eta}>ETA: {option.eta}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  details: {
    flex: 1,
    marginLeft: 15,
  },
  provider: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  carType: {
    fontSize: 14,
    color: 'gray',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eta: {
    fontSize: 14,
    color: 'gray',
  },
});

export default RideOptionCard;
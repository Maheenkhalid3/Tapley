import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const PriceComparisonScreen = ({ route, navigation }) => {
  // Set default values to prevent crashes
  const {
    yangoPrice = 0,
    bykeaPrice = 0,
    currency = 'PKR',
    distance = '0 km',
    time = '0 min',
    vehicleType = 'Ride',
    pickup = 'Location',
    destination = 'Destination'
  } = route.params || {};

  const priceDifference = yangoPrice - bykeaPrice;
  const isBykeaCheaper = bykeaPrice < yangoPrice;
  const differencePercentage = Math.round((Math.abs(priceDifference) / yangoPrice) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.routeInfo}>
        <View style={styles.locationRow}>
          <MaterialIcons name="my-location" size={16} color="#FF8C00" />
          <Text style={styles.locationText} numberOfLines={1}>{pickup}</Text>
        </View>
        <View style={styles.locationRow}>
          <MaterialIcons name="location-on" size={16} color="#FF8C00" />
          <Text style={styles.locationText} numberOfLines={1}>{destination}</Text>
        </View>
      </View>

      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleType}>{vehicleType}</Text>
        <Text style={styles.distanceTime}>{distance} · {time}</Text>
      </View>

      <View style={styles.comparisonContainer}>
        <View style={styles.priceCard}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceName}>Yango</Text>
            <View style={styles.serviceLogo}>
              <Text style={styles.serviceLogoText}>Y</Text>
            </View>
          </View>
          <Text style={styles.price}>{yangoPrice} {currency}</Text>
          {!isBykeaCheaper && (
            <Text style={styles.bestValueTag}>Best Value</Text>
          )}
        </View>

        <View style={styles.priceCard}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceName}>Bykea</Text>
            <View style={styles.serviceLogo}>
              <Text style={styles.serviceLogoText}>B</Text>
            </View>
          </View>
          <Text style={[
            styles.price,
            isBykeaCheaper ? styles.cheaperPrice : styles.expensivePrice
          ]}>
            {bykeaPrice} {currency}
          </Text>
          {isBykeaCheaper && (
            <Text style={styles.bestValueTag}>Best Value</Text>
          )}
        </View>
      </View>

      <View style={styles.differenceContainer}>
        <Text style={styles.differenceText}>
          {isBykeaCheaper ? 'Bykea' : 'Yango'} saves you {Math.abs(priceDifference)} {currency} ({differencePercentage}%)
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Map</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  routeInfo: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    marginTop: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  locationText: {
    fontSize: 16,
    marginLeft: 8,
    flexShrink: 1,
  },
  vehicleInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  vehicleType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  distanceTime: {
    fontSize: 14,
    color: '#666',
  },
  comparisonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priceCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: '48%',
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  serviceLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF8C00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceLogoText: {
    color: 'white',
    fontWeight: 'bold',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginVertical: 8,
  },
  cheaperPrice: {
    color: '#4CAF50',
  },
  expensivePrice: {
    color: '#F44336',
  },
  bestValueTag: {
    backgroundColor: '#4CAF50',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    alignSelf: 'flex-start',
  },
  differenceContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  differenceText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  backButton: {
    backgroundColor: '#FF8C00',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PriceComparisonScreen;
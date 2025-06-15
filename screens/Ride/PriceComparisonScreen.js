import IntentLauncher from 'react-native-intent-launcher';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const PriceComparisonScreen = ({ route, navigation }) => {
  const {
    yangoPrice = 0,
    bykeaPrice = 0,
    currency = 'PKR',
    distance = '0 km',
    time = '0 min',
    vehicleType = 'Ride',
    pickup = 'Location',
    destination = 'Destination',
    pickupLat = 0,
    pickupLon = 0,
    destLat = 0,
    destLon = 0,
  } = route.params || {};

  const priceDifference = yangoPrice - bykeaPrice;
  const isBykeaCheaper = bykeaPrice < yangoPrice;
  const differencePercentage = Math.round(
    (Math.abs(priceDifference) / yangoPrice) * 100
  );

  const openYangoApp = () => {
    const ref = 'tapley_app';
    const yangoURL = `https://yango.go.link/route?start-lat=${pickupLat}&start-lon=${pickupLon}&end-lat=${destLat}&end-lon=${destLon}&adj_adgroup=widget&ref=${ref}&adj_t=vokme8e_nd9s9z9&lang=ru&adj_deeplink_js=1&utm_source=widget&adj_fallback=https%3A%2F%2Fyango.com%2Fen_int%2Forder%2F%3Fgfrom%3D${pickupLon}%2C${pickupLat}%26gto%3D${destLon}%2C${destLat}%26ref%3D${ref}`;

    Linking.openURL(yangoURL);
  };

  const openBykeaApp = () => {
  try {
    IntentLauncher.startAppByPackageName('com.bykea.pk');
  } catch (error) {
    console.warn('Bykea app not found, redirecting to Play Store:', error);
    Linking.openURL('https://play.google.com/store/apps/details?id=com.bykea.pk&pcampaignid=web_share');
  }
};



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
          <Text style={styles.serviceName}>Yango</Text>
          <Text style={[styles.price, !isBykeaCheaper && styles.cheaperPrice]}>
            {yangoPrice} {currency}
          </Text>
          {!isBykeaCheaper && (
            <Text style={styles.bestValueTag}>Best Value</Text>
          )}
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.serviceName}>Bykea</Text>
          <Text style={[styles.price, isBykeaCheaper && styles.cheaperPrice]}>
            {bykeaPrice} {currency}
          </Text>
          {isBykeaCheaper && (
            <Text style={styles.bestValueTag}>Best Value</Text>
          )}
        </View>
      </View>

      <View style={styles.appButtonsRow}>
        <TouchableOpacity style={styles.openAppButton} onPress={openYangoApp}>
          <Text style={styles.openAppButtonText}>Open Yango App</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.openAppButton} onPress={openBykeaApp}>
          <Text style={styles.openAppButtonText}>Open Bykea App</Text>
        </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 16 },
  routeInfo: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  locationText: { fontSize: 16, marginLeft: 8, flexShrink: 1 },
  vehicleInfo: { alignItems: 'center', marginBottom: 24 },
  vehicleType: { fontSize: 18, fontWeight: 'bold', color: '#FF8C00' },
  distanceTime: { fontSize: 14, color: '#666' },
  comparisonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  priceCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: '48%',
    elevation: 2,
    alignItems: 'center',
  },
  serviceName: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  price: { fontSize: 22, fontWeight: 'bold', color: '#FF8C00', marginBottom: 8 },
  cheaperPrice: { color: '#4CAF50' },
  bestValueTag: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    marginTop: 4,
  },
  appButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 16,
  },
  openAppButton: {
    flex: 0.48,
    backgroundColor: '#FF8C00',
    paddingVertical: 12,
    borderRadius: 8,
  },
  openAppButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  differenceContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    marginBottom: 20,
  },
  differenceText: { fontSize: 16, textAlign: 'center', color: '#333' },
  backButton: {
    backgroundColor: '#FF8C00',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PriceComparisonScreen;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../theme/ThemeContext';

type NearbyIssuesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NearbyIssues'>;

interface NearbyIssue {
  id: string;
  latitude: number;
  longitude: number;
  category: string;
  description: string;
  userName: string;
  timestamp: string;
  distance: number;
}

export const NearbyIssuesScreen = () => {
  const navigation = useNavigation<NearbyIssuesScreenNavigationProp>();
  const { isDark } = useTheme();
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [nearbyIssues, setNearbyIssues] = useState<NearbyIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<NearbyIssue | null>(null);
  const [mapRef, setMapRef] = useState<MapView | null>(null);

  useEffect(() => {
    fetchLocationAndNearbyIssues();
  }, []);

  const fetchLocationAndNearbyIssues = async () => {
    try {
      setLoading(true);
      const location = {
        latitude: 37.78825,
        longitude: -122.4324,
      };
      setCurrentLocation(location);

      const issues = generateMockNearbyIssues(
        location.latitude,
        location.longitude
      );
      
      setNearbyIssues(issues);
    } catch (error) {
      console.error('Error fetching nearby issues:', error);
      Alert.alert('Error', 'Failed to load nearby issues');
    } finally {
      setLoading(false);
    }
  };

  const generateMockNearbyIssues = (lat: number, lng: number): NearbyIssue[] => {
    const mockIssues: NearbyIssue[] = [
      {
        id: '1',
        latitude: lat + 0.01,
        longitude: lng + 0.01,
        category: 'Waste Management',
        description: 'Garbage piled up on street corner',
        userName: 'John Doe',
        timestamp: '2 hours ago',
        distance: calculateDistance(lat, lng, lat + 0.01, lng + 0.01),
      },
      {
        id: '2',
        latitude: lat - 0.015,
        longitude: lng + 0.008,
        category: 'Waste Management',
        description: 'Broken waste bin',
        userName: 'Jane Smith',
        timestamp: '4 hours ago',
        distance: calculateDistance(lat, lng, lat - 0.015, lng + 0.008),
      },
      {
        id: '3',
        latitude: lat + 0.008,
        longitude: lng - 0.012,
        category: 'Waste Management',
        description: 'Littering on road',
        userName: 'Mike Johnson',
        timestamp: '1 hour ago',
        distance: calculateDistance(lat, lng, lat + 0.008, lng - 0.012),
      },
    ];
    return mockIssues;
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 10) / 10;
  };

  const handleMarkerPress = (issue: NearbyIssue) => {
    setSelectedIssue(issue);
  };

  const handleZoomToMarker = (issue: NearbyIssue) => {
    if (mapRef) {
      mapRef.animateToRegion(
        {
          latitude: issue.latitude,
          longitude: issue.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  };

  const renderIssueItem = ({ item }: { item: NearbyIssue }) => (
    <TouchableOpacity
      style={[
        styles.issueItem,
        {
          backgroundColor: isDark ? '#2a2a2a' : '#fff',
          borderColor: selectedIssue?.id === item.id ? '#007AFF' : '#e0e0e0',
        },
      ]}
      onPress={() => {
        setSelectedIssue(item);
        handleZoomToMarker(item);
      }}
    >
      <View style={styles.issueHeader}>
        <Text
          style={[
            styles.issueCategory,
            { color: isDark ? '#fff' : '#333' },
          ]}
        >
          {item.category}
        </Text>
        <Text style={styles.distance}>{item.distance} km away</Text>
      </View>
      <Text
        style={[
          styles.issueDescription,
          { color: isDark ? '#aaa' : '#666' },
        ]}
      >
        {item.description}
      </Text>
      <View style={styles.issueFooter}>
        <Text style={[styles.userName, { color: isDark ? '#aaa' : '#999' }]}>
          {item.userName}
        </Text>
        <Text style={[styles.timestamp, { color: isDark ? '#aaa' : '#999' }]}>
          {item.timestamp}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
        ]}
      >
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={[styles.loaderText, { color: isDark ? '#aaa' : '#666' }]}>
            Loading nearby issues...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons
            name="arrow-back"
            size={28}
            color={isDark ? '#fff' : '#333'}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#333' }]}>
          Nearby Issues
        </Text>
        <TouchableOpacity onPress={fetchLocationAndNearbyIssues}>
          <MaterialIcons
            name="refresh"
            size={28}
            color={isDark ? '#fff' : '#333'}
          />
        </TouchableOpacity>
      </View>

      {currentLocation && (
        <MapView
          ref={setMapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Your Location"
            pinColor="red"
          />

          {nearbyIssues.map((issue) => (
            <Marker
              key={issue.id}
              coordinate={{
                latitude: issue.latitude,
                longitude: issue.longitude,
              }}
              title={issue.category}
              description={issue.description}
              pinColor="blue"
              onPress={() => handleMarkerPress(issue)}
            />
          ))}
        </MapView>
      )}

      {nearbyIssues.length > 0 && (
        <View style={styles.listContainer}>
          <FlatList
            data={nearbyIssues}
            renderItem={renderIssueItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {nearbyIssues.length === 0 && !loading && (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="info" size={48} color="#999" />
          <Text style={styles.emptyText}>No nearby issues found</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  map: {
    flex: 0.6,
    width: '100%',
  },
  listContainer: {
    flex: 0.4,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  issueItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  issueCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  distance: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  issueDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  issueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#999',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#999',
  },
});

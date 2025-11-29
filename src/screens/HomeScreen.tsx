import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../theme/ThemeContext';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const { width, height } = Dimensions.get('window');

interface CategoryItemProps {
  category: string;
  index: number;
  totalItems: number;
  onPress: () => void;
}

const CATEGORIES = [
  'Waste Management',
  'Road Damage',
  'Street Light',
  'Water Supply',
  'Sanitation',
  'Sewage and Drainage',
];

const CategoryItem = ({ category, index, totalItems, onPress }: CategoryItemProps) => {
  return (
    <View style={styles.categoryButtonContainer}>
      <TouchableOpacity
        style={styles.categoryButton}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={styles.categoryText}>{category}</Text>
      </TouchableOpacity>
    </View>
  );
};

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { isDark } = useTheme();
  const [location, setLocation] = useState<string | null>('Current Location');

  const handleReportButtonPress = () => {
    navigation.navigate('ReportIssue', { category: 'Other' });
  };

  const handleCheckNearbyPress = () => {
    navigation.navigate('NearbyIssues');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
      <View style={[styles.header, { backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5' }]}>
        <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#333' }]}>CivicConnect</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.locationContainer}>
          <MaterialIcons name="location-on" size={20} color="#666" />
          <Text style={[styles.locationText, { color: isDark ? '#aaa' : '#666' }]}>
            {location}
          </Text>
        </View>

        <View style={styles.reportButtonContainer}>
          <TouchableOpacity
            style={styles.reportButton}
            onPress={handleReportButtonPress}
            activeOpacity={0.7}
          >
            <MaterialIcons name="add-circle" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.reportButtonText}>Report a New Issue</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.checkNearbyButtonContainer}>
          <TouchableOpacity
            style={styles.checkNearbyButton}
            onPress={handleCheckNearbyPress}
            activeOpacity={0.7}
          >
            <MaterialIcons name="map" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.checkNearbyButtonText}>Check Nearby Issues</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.categoriesTitle, { color: isDark ? '#aaa' : '#666' }]}>
          or select a category
        </Text>

        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((category, index) => (
            <CategoryItem
              key={category}
              category={category}
              index={index}
              totalItems={CATEGORIES.length}
              onPress={() => navigation.navigate('ReportIssue', { category })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  reportButtonContainer: {
    marginBottom: 16,
  },
  reportButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  checkNearbyButtonContainer: {
    marginBottom: 16,
  },
  checkNearbyButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#34C759',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  checkNearbyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  categoriesTitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryButtonContainer: {
    width: '48%',
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
    color: '#333',
  },
});

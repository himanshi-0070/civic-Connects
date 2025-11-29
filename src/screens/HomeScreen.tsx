import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { CATEGORIES } from '../utils/helpers';
import { getCurrentLocation } from '../services/location';
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

const CategoryItem = ({ category, index, totalItems, onPress }: CategoryItemProps) => {
  const slideAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    const isLeftSide = index % 2 === 0;
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 600,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const isLeftSide = index % 2 === 0;
  const slideDistance = isLeftSide ? -100 : 100;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 50,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onPress();
    });
  };

  return (
    <Animated.View
      style={[
        styles.categoryButtonContainer,
        {
          transform: [
            {
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [slideDistance, 0],
              }),
            },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.categoryButton}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Text style={styles.categoryText}>{category}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors, isDark } = useTheme();
  const [location, setLocation] = useState<string | null>(null);
  const reportButtonScale = new Animated.Value(1);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const currentLocation = await getCurrentLocation();
        setLocation(currentLocation.address);
      } catch (error) {
        console.error('Error fetching location:', error);
        setLocation('Location not available');
      }
    };

    fetchLocation();
  }, []);

  const handleReportButtonPressIn = () => {
    Animated.timing(reportButtonScale, {
      toValue: 0.95,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handleReportButtonPressOut = () => {
    Animated.timing(reportButtonScale, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handleReportButtonPress = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(reportButtonScale, {
          toValue: 50,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      navigation.navigate('ReportIssue', {});
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
      <Header />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.locationContainer}>
          <MaterialIcons name="location-on" size={20} color="#666" />
          <Text style={[styles.locationText, { color: isDark ? '#aaa' : '#666' }]}>
            {location}
          </Text>
        </View>

        <Animated.View
          style={[
            styles.reportButtonContainer,
            { transform: [{ scale: reportButtonScale }] },
          ]}
        >
          <TouchableOpacity
            style={styles.reportButton}
            onPress={handleReportButtonPress}
            onPressIn={handleReportButtonPressIn}
            onPressOut={handleReportButtonPressOut}
            activeOpacity={0.9}
          >
            <MaterialIcons name="add-circle" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.reportButtonText}>Report a New Issue</Text>
          </TouchableOpacity>
        </Animated.View>

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

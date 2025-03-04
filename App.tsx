import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, ScrollView, Animated, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DetailScreen from './src/screens/religious-texts/DetailScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTexts } from './src/utils/contentManager';
import { loadFonts } from './src/utils/loadFonts';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

interface CardProps {
  title: string;
  description: string;
  onPress: () => void;
}

// Modified Card Component with animation
const Card = ({ title, description, onPress }: CardProps) => {
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      activeOpacity={1}
    >
      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
          <Text style={styles.readMore}>Read More →</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Enhanced Custom Header Component
const CustomHeader = ({ title, colors }: { title: string; colors: string[] }) => {
  const getIconName = () => {
    switch (title.split(' ')[0]) {
      case 'Islam':
        return 'mosque';
      case 'Christianity':
        return 'church';
      case 'Judaism':
        return 'star-david';
      default:
        return 'book';
    }
  };

  return (
    <LinearGradient 
      colors={colors} 
      style={styles.headerGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.headerContent}>
        <View style={styles.headerIconContainer}>
          <MaterialCommunityIcons 
            name={getIconName()} 
            size={32} 
            color="rgba(255,255,255,0.9)" 
          />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>Sacred Texts</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

// Enhanced SearchBar Component
const SearchBar = ({ placeholder, onSearch }: { placeholder: string; onSearch: (text: string) => void }) => {
  const [searchText, setSearchText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (text: string) => {
    setSearchText(text);
    onSearch(text);
  };

  return (
    <View style={[
      styles.searchContainer,
      isFocused && styles.searchContainerFocused
    ]}>
      <MaterialCommunityIcons 
        name="magnify" 
        size={24} 
        color={isFocused ? "#2196F3" : "#666"} 
        style={styles.searchIcon} 
      />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={searchText}
        onChangeText={handleSearch}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {searchText.length > 0 && (
        <TouchableOpacity 
          onPress={() => handleSearch('')}
          style={styles.clearButton}
        >
          <MaterialCommunityIcons name="close-circle" size={20} color="#999" />
        </TouchableOpacity>
      )}
    </View>
  );
};

// Modified Religion Screen with search and Firebase integration
const ReligionScreen = ({ religion, colors, navigation }) => {
  const [texts, setTexts] = useState([]);
  const [filteredTexts, setFilteredTexts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCachedData();
    fetchTexts();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchTexts().finally(() => setRefreshing(false));
  }, []);

  const loadCachedData = async () => {
    try {
      const cached = await AsyncStorage.getItem(`${religion.toLowerCase()}_texts`);
      if (cached) {
        const parsedData = JSON.parse(cached);
        setTexts(parsedData);
        setFilteredTexts(parsedData);
      }
    } catch (error) {
      console.error('Error loading cached data:', error);
    }
  };

  const fetchTexts = async () => {
    try {
      const texts = await getTexts(religion);
      setTexts(texts);
      setFilteredTexts(texts);
      
      // Cache the fetched data
      await AsyncStorage.setItem(`${religion.toLowerCase()}_texts`, JSON.stringify(texts));
    } catch (error) {
      console.error('Error in fetchTexts:', error);
    }
  };

  const handleSearch = (searchText: string) => {
    const filtered = texts.filter(text =>
      text.title.toLowerCase().includes(searchText.toLowerCase()) ||
      text.description.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredTexts(filtered);
  };

  return (
    <View style={styles.container}>
      <CustomHeader 
        title={`${religion} Texts`}
        colors={colors}
      />
      <SearchBar 
        placeholder={`Search ${religion} texts...`}
        onSearch={handleSearch}
      />
      <ScrollView 
        style={styles.cardContainer}
        contentContainerStyle={styles.cardContentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors[0]}
            colors={[colors[0]]}
          />
        }
      >
        {filteredTexts.length > 0 ? (
          filteredTexts.map((text, index) => (
            <Card 
              key={text.id || index}
              title={text.title}
              description={text.description}
              onPress={() => navigation.navigate('Detail', {
                title: text.title,
                religion,
                id: text.id
              })}
            />
          ))
        ) : (
          <Text style={styles.noResultsText}>No texts found</Text>
        )}
      </ScrollView>
    </View>
  );
};

// Navigation structure
const ReligionStack = ({ religion, colors }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Main">
      {props => <ReligionScreen {...props} religion={religion} colors={colors} />}
    </Stack.Screen>
    <Stack.Screen name="Detail" component={DetailScreen} />
  </Stack.Navigator>
);

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
      } catch (e) {
        console.warn('Error loading fonts:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#2196F3',
          tabBarInactiveTintColor: '#757575',
        }}
      >
        <Tab.Screen 
          name="Islam" 
          children={() => <ReligionStack religion="Islam" colors={['#43A047', '#1B5E20']} />}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="mosque" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Christianity" 
          children={() => <ReligionStack religion="Christianity" colors={['#5C6BC0', '#1A237E']} />}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="church" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Judaism" 
          children={() => <ReligionStack religion="Judaism" colors={['#7986CB', '#283593']} />}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="star-david" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerGradient: {
    paddingTop: 45,  // Fixed value instead of Platform-specific
    paddingBottom: 20,
    width: '100%',
  },
  initButton: {
    backgroundColor: '#43A047',
    padding: 10,
    margin: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginTop: 4,
    fontWeight: '500',
  },
  searchContainer: {
    margin: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: 'transparent',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  searchContainerFocused: {
    backgroundColor: '#fff',
    borderColor: '#2196F3',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  cardContainer: {
    flex: 1,
  },
  cardContentContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  cardDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  readMore: {
    color: '#2196F3',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 32,
  },
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
    elevation: 8,
    paddingTop: 12,
    paddingBottom: 20,  // Fixed value instead of Platform-specific
    height: 75,  // Fixed value instead of Platform-specific
  },
  detailHeader: {
    paddingTop: 45,  // Fixed value instead of Platform-specific
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  detailHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  initButton: {
    backgroundColor: '#43A047',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  initButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

// Move the fetch logic outside of styles
const fetchTexts = async (religion: string) => {
  let texts = [];
  if (religion === 'Islam') {
    texts = await getIslamicTexts();
  } else {
    // Existing Firebase fetching logic for other religions
    const collections = ['bible', 'torah'];
    for (const bookId of collections) {
      const bookInfoDoc = await getDoc(doc(db, bookId, 'info'));
      if (bookInfoDoc.exists() && bookInfoDoc.data().religion === religion) {
        texts.push({
          id: bookId,
          ...bookInfoDoc.data()
        });
      }
    }
  }
  return texts;
};

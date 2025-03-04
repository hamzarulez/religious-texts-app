import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native';
import { getQuranChapters, QuranChapter } from '../services/quranService';

export const QuranListScreen = ({ navigation }) => {
  const [chapters, setChapters] = useState<QuranChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChapters();
  }, []);

  const loadChapters = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const data = await getQuranChapters();
      console.log('Chapters loaded:', data.length);
      
      if (!data || data.length === 0) {
        setError('No chapters available');
        return;
      }

      setChapters(data);
    } catch (error) {
      console.error('Error loading chapters:', error);
      setError(error instanceof Error ? error.message : 'Failed to load chapters');
    } finally {
      setLoading(false);
    }
  };

  const renderChapter = ({ item }: { item: QuranChapter }) => (
    <TouchableOpacity
      style={styles.chapterItem}
      onPress={() => navigation.navigate('ChapterDetail', { 
        chapterId: item.chapterNumber.toString(),
        chapter: item
      })}
    >
      <View style={styles.chapterNumber}>
        <Text style={styles.numberText}>{item.chapterNumber}</Text>
      </View>
      <View style={styles.chapterInfo}>
        <Text style={styles.titleText}>{item.name}</Text>
        <Text style={styles.subtitleText}>{item.transliteration}</Text>
        <Text style={styles.translationText}>{item.translation}</Text>
        <Text style={styles.versesText}>{item.totalVerses} verses • {item.type}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadChapters}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chapters}
        renderItem={renderChapter}
        keyExtractor={(item) => item.chapterNumber.toString()}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>No chapters available</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chapterItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  chapterNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  numberText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chapterInfo: {
    flex: 1,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  translationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  versesText: {
    fontSize: 12,
    color: '#999',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

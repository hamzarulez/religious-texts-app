import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native';
import { getChapterVerses, QuranVerse } from '../services/quranService';

export const ChapterDetailScreen = ({ route }) => {
  const { chapter } = route.params;
  const [verses, setVerses] = useState<QuranVerse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVerses();
  }, []);

  const loadVerses = async () => {
    try {
      console.log('Loading verses for chapter:', chapter.chapterNumber); // Debug log
      const data = await getChapterVerses(chapter.chapterNumber.toString());
      console.log('Loaded verses:', data.length); // Debug log
      setVerses(data);
    } catch (error) {
      console.error('Error loading verses:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderVerse = ({ item }: { item: QuranVerse }) => (
    <View style={styles.verseContainer}>
      <View style={styles.verseNumber}>
        <Text style={styles.numberText}>{item.number}</Text>
      </View>
      <View style={styles.verseContent}>
        <Text style={styles.arabicText}>{item.text}</Text>
        <Text style={styles.translationText}>{item.translation}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={verses}
      renderItem={renderVerse}
      keyExtractor={(item) => item.number.toString()}
      contentContainerStyle={styles.container}
      ListHeaderComponent={() => (
        <View style={styles.header}>
          <Text style={styles.chapterName}>{chapter.name}</Text>
          <Text style={styles.chapterTranslation}>{chapter.translation}</Text>
          <Text style={styles.chapterInfo}>
            {chapter.type} • {chapter.totalVerses} Verses
          </Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  chapterName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  chapterTranslation: {
    fontSize: 18,
    color: '#666',
    marginTop: 4,
  },
  chapterInfo: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  verseContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  verseNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  verseContent: {
    flex: 1,
  },
  arabicText: {
    fontSize: 20,
    textAlign: 'right',
    marginBottom: 8,
    fontFamily: 'System',
  },
  translationText: {
    fontSize: 16,
    color: '#444',
  },
});

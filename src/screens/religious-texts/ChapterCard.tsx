import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

interface ChapterCardProps {
  chapter: {
    id: string;
    chapterNumber: number;
    title: string;
    description: string;
  };
  onPress: () => void;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.numberContainer}>
      <Text style={styles.number}>{chapter.chapterNumber}</Text>
    </View>
    <View style={styles.contentContainer}>
      <Text style={styles.title}>{chapter.title}</Text>
      <Text style={styles.description}>{chapter.description}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  numberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#43A047', // Changed from #f0f0f0 to green
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  number: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // Changed from green to white for better contrast
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});

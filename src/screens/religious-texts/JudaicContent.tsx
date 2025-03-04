import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';

interface JudaicContentProps {
  content: any;
  currentChapter: any;
  navigation: any;
  religion: string;
  id: string;
}

export const JudaicContent: React.FC<JudaicContentProps> = ({
  content,
  currentChapter,
  navigation,
  religion,
  id
}) => {
  if (!content) {
    return (
      <View style={styles.contentWrapper}>
        <Text style={styles.errorText}>No content available</Text>
      </View>
    );
  }

  if (!currentChapter) {
    return (
      <View style={styles.contentWrapper}>
        {content.books?.map(book => (
          <TouchableOpacity
            key={book.id}
            style={styles.bookItem}
            onPress={() => {
              if (book.chapters?.[0]) {
                navigation({
                  title: `${book.title} ${book.chapters[0].number}`,
                  chapterNumber: book.chapters[0].number,
                  bookId: book.id
                });
              }
            }}
          >
            <Text style={styles.bookTitle}>{book.title}</Text>
            {book.transliteration && (
              <Text style={styles.bookTransliteration}>({book.transliteration})</Text>
            )}
            {book.description && (
              <Text style={styles.bookDescription}>{book.description}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.contentWrapper}>
      {currentChapter.verses?.map((verse) => (
        <View key={verse.number} style={styles.verseItem}>
          <Text style={styles.verseNumber}>{verse.number}.</Text>
          <View style={styles.verseContent}>
            <Text style={styles.verseText}>{verse.text}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};
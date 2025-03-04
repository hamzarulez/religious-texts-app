import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from './styles';

interface ChristianContentProps {
  content: any;
  currentChapter: any;
  navigation: any;
  religion: string;
  id: string;
}

export const ChristianContent: React.FC<ChristianContentProps> = ({
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

  const renderConfessionsContent = () => {
    if (!currentChapter) {
      return (
        <ScrollView style={styles.contentWrapper}>
          {content.books?.map((book) => (
            <View key={book.number} style={styles.bookSection}>
              <Text style={styles.partTitle}>{book.title}</Text>
              <View style={styles.chaptersContainer}>
                {book.chapters?.map((chapter) => (
                  <TouchableOpacity
                    key={chapter.number}
                    style={styles.chapterItem}
                    onPress={() => {
                      navigation({
                        title: `${book.title} - Chapter ${chapter.number}`,
                        chapterNumber: chapter.number,
                      });
                    }}
                  >
                    <Text style={styles.chapterTitle}>
                      Chapter {chapter.number}: {chapter.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      );
    }

    return (
      <View style={styles.contentWrapper}>
        <Text style={styles.chapterText}>{currentChapter.text}</Text>
      </View>
    );
  };

  const renderSummaContent = () => {
    if (!currentChapter) {
      return (
        <ScrollView style={styles.contentWrapper}>
          {content.parts?.map((part) => (
            <View key={part.id} style={styles.partSection}>
              <Text style={styles.partTitle}>{part.title}</Text>
              <View style={styles.questionsContainer}>
                {part.questions?.map((question) => (
                  <TouchableOpacity
                    key={question.number}
                    style={styles.questionItem}
                    onPress={() => {
                      navigation({
                        title: `Question ${question.number}`,
                        chapterNumber: question.number,
                      });
                    }}
                  >
                    <Text style={styles.questionTitle}>
                      Question {question.number}: {question.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      );
    }

    return (
      <View style={styles.contentWrapper}>
        {currentChapter.articles?.map((article) => (
          <View key={article.number} style={styles.articleItem}>
            <Text style={styles.articleQuestion}>Article {article.number}: {article.question}</Text>
            <Text style={styles.articleResponse}>{article.response}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderBibleContent = () => {
    if (!currentChapter) {
      return (
        <ScrollView style={styles.contentWrapper}>
          {content.testaments?.map(testament => (
            <View key={testament.id} style={styles.testamentSection}>
              <Text style={styles.testamentTitle}>{testament.title}</Text>
              <Text style={styles.testamentDescription}>{testament.description}</Text>
              <View style={styles.booksContainer}>
                {testament.books?.map(book => (
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
                    {book.description && (
                      <Text style={styles.bookDescription}>{book.description}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      );
    }

    return (
      <ScrollView style={styles.contentWrapper}>
        {currentChapter.verses?.map((verse) => (
          <View key={verse.number} style={styles.verseItem}>
            <Text style={styles.verseNumber}>{verse.number}</Text>
            <View style={styles.verseContent}>
              <Text style={styles.verseText}>{verse.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  switch (id) {
    case 'confessions':
      return renderConfessionsContent();
    case 'summa':
      return renderSummaContent();
    case 'bible':
      return renderBibleContent();
    default:
      return (
        <View style={styles.contentWrapper}>
          <Text style={styles.errorText}>Unknown text type</Text>
        </View>
      );
  }
};

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles } from './styles';
import { ChapterCard } from './ChapterCard';
import { QuranChapter } from '../../services/quranService';

interface IslamicContentProps {
  content: any;
  currentChapter: any;
  chapters: QuranChapter[];
  navigation: (params: { title: string; chapterNumber: number }) => void;
  religion: string;
  id: string;
}

export const IslamicContent: React.FC<IslamicContentProps> = ({
  content,
  currentChapter,
  chapters,
  navigation,
  religion,
  id
}) => {
  const isHadith = id.includes('sahih_') || id.includes('sunan_');

  console.log('IslamicContent props:', {
    hasContent: !!content,
    hasCurrentChapter: !!currentChapter,
    chaptersLength: chapters?.length,
    isHadith
  });

  // For Quran content
  if (!isHadith && !currentChapter && (!chapters || chapters.length === 0)) {
    return (
      <View style={styles.contentWrapper}>
        <Text style={styles.errorText}>No chapters available</Text>
      </View>
    );
  }

  // For Hadith content
  if (isHadith && !content) {
    return (
      <View style={styles.contentWrapper}>
        <Text style={styles.errorText}>No content available</Text>
      </View>
    );
  }

  const renderHadithContent = () => {
    if (!currentChapter) {
      // Render chapter list for hadith collections
      return (
        <View style={styles.chaptersWrapper}>
          {content.chapters?.map((chapter) => (
            <ChapterCard
              key={`hadith-chapter-${chapter.id}`}
              chapter={{
                id: chapter.id,
                chapterNumber: chapter.chapterNumber,
                title: chapter.title,
                description: chapter.description
              }}
              onPress={() => {
                navigation({ // Remove .push, just call the function directly
                  title: chapter.title,
                  chapterNumber: chapter.chapterNumber,
                });
              }}
            />
          ))}
        </View>
      );
    }

    // Render selected chapter's hadiths
    return (
      <View style={styles.contentWrapper}>
        <View style={styles.hadithChapter}>
          <Text style={styles.hadithChapterTitle}>{currentChapter.title}</Text>
          <Text style={styles.hadithChapterDescription}>{currentChapter.description}</Text>
          {currentChapter.hadiths?.map((hadith) => (
            <View key={`hadith-${hadith.number}`} style={styles.hadithItem}>
              <Text style={styles.hadithNumber}>Hadith {hadith.number}</Text>
              <Text style={styles.narratorText}>Narrator: {hadith.narrator}</Text>
              <Text style={styles.hadithText}>{hadith.text}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderQuranChapterContent = () => {
    if (!currentChapter) {
      return (
        <ScrollView style={styles.chaptersWrapper}>
          {chapters.map((chapter) => (
            <ChapterCard
              key={`chapter-${chapter.chapterNumber}`}
              chapter={{
                id: chapter.chapterNumber.toString(),
                chapterNumber: chapter.chapterNumber,
                title: `${chapter.name} - ${chapter.translation}`,
                description: `${chapter.totalVerses} verses`
              }}
              onPress={() => {
                navigation({
                  title: chapter.translation,
                  chapterNumber: chapter.chapterNumber,
                  religion: religion,
                  id: id
                });
              }}
            />
          ))}
        </ScrollView>
      );
    }

    return (
      <ScrollView style={styles.contentWrapper}>
        {currentChapter.verses?.map((verse, index) => (
          <View 
            key={`verse-${verse.number || index}`} 
            style={styles.verseItem}
          >
            <View style={styles.verseNumberContainer}>
              <Text style={styles.verseNumber}>{verse.number || index + 1}</Text>
            </View>
            <View style={styles.verseContent}>
              <Text style={[styles.arabicText, { textAlign: 'right' }]}>{verse.text}</Text>
              <Text style={styles.translationText}>{verse.translation}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  if (isHadith) {
    return renderHadithContent();
  }

  return renderQuranChapterContent();
};

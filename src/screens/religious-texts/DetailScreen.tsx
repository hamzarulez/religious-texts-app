import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { IslamicContent } from './IslamicContent';
import { ChristianContent } from './ChristianContent';
import { JudaicContent } from './JudaicContent';
import { getTextContent } from '../../utils/contentManager';
import { getChapterVerses, getQuranChapters } from '../../services/quranService';

interface DetailScreenProps {
  route: {
    params: {
      title: string;
      religion: 'Islam' | 'Christianity' | 'Judaism';
      id: string;
      chapterNumber?: number;
      bookId?: string;
    };
  };
  navigation: any;
}

const DetailScreen: React.FC<DetailScreenProps> = ({ route, navigation }) => {
  const { title, religion, id, chapterNumber, bookId } = route.params;
  const [content, setContent] = useState<any>(null);
  const [currentChapter, setCurrentChapter] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        console.log('Loading content for:', { religion, id, chapterNumber });

        if (religion === 'Islam' && !id.includes('sahih_') && !id.includes('sunan_')) {
          try {
            // Load Quran chapters if not already loaded
            const quranChapters = await getQuranChapters();
            setChapters(quranChapters);
            
            if (chapterNumber) {
              console.log('Fetching verses for chapter:', chapterNumber);
              const verses = await getChapterVerses(chapterNumber);
              console.log('Verses loaded:', verses?.length || 0);
              
              if (verses && verses.length > 0) {
                setCurrentChapter({ 
                  number: chapterNumber,
                  verses: verses
                });
                setContent(null); // Clear content when showing chapter
              } else {
                console.log('No verses found for chapter:', chapterNumber);
                setCurrentChapter(null);
              }
            } else {
              setCurrentChapter(null);
              setContent({ chapters: quranChapters });
            }
          } catch (error) {
            console.error('Error loading Quran content:', error);
            setCurrentChapter(null);
            setContent(null);
          }
        } else {
          // Handle other religious texts
          const textContent = await getTextContent(id, religion);
          setContent(textContent);
          
          if (chapterNumber) {
            if (religion === 'Christianity') {
              if (id === 'bible') {
                const allBooks = textContent.testaments?.flatMap(testament => testament.books) || [];
                const book = allBooks.find(b => b.id === bookId);
                if (book) {
                  const chapter = book.chapters.find(ch => ch.number === chapterNumber);
                  setCurrentChapter(chapter || null);
                }
              } else if (id === 'summa') {
                const chapter = textContent.parts?.flatMap((part: any) => part.questions)
                  .find((q: any) => q.number === chapterNumber);
                setCurrentChapter(chapter || null);
              }
            } else if (religion === 'Judaism') {
              const allBooks = textContent.books || [];
              const book = allBooks.find(b => b.id === bookId);
              if (book) {
                const chapter = book.chapters.find(ch => ch.number === chapterNumber);
                setCurrentChapter(chapter || null);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error in loadContent:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [religion, id, chapterNumber, bookId]);

  const getGradientColors = () => {
    switch (religion) {
      case 'Islam':
        return ['#43A047', '#1B5E20'];
      case 'Christianity':
        return ['#5C6BC0', '#1A237E'];
      case 'Judaism':
        return ['#7986CB', '#283593'];
      default:
        return ['#666666', '#333333'];
    }
  };

  const handleNavigation = (params: any) => {
    navigation.push('Detail', {
      ...params,
      religion,
      id
    });
  };

  const renderContent = () => {
    if (religion === 'Islam') {
      console.log('Rendering Islamic content:', {
        hasContent: !!content,
        hasCurrentChapter: !!currentChapter,
        chaptersLength: chapters.length
      });
      
      return (
        <IslamicContent
          content={content}
          currentChapter={currentChapter}
          chapters={chapters}
          navigation={handleNavigation}
          religion={religion}
          id={id}
        />
      );
    }
    switch (religion) {
      case 'Islam':
        return (
          <IslamicContent
            content={content}
            currentChapter={currentChapter}
            chapters={content?.chapters || []}
            navigation={handleNavigation}
            religion={religion}
            id={id}
          />
        );
      case 'Christianity':
        return (
          <ChristianContent
            content={content}
            currentChapter={currentChapter}
            navigation={handleNavigation}
            religion={religion}
            id={id}
          />
        );
      case 'Judaism':
        return (
          <JudaicContent
            content={content}
            currentChapter={currentChapter}
            navigation={handleNavigation}
            religion={religion}
            id={id}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        renderContent()
      )}
    </View>
  );
};

export default DetailScreen;

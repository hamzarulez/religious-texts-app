import { createStackNavigator } from '@react-navigation/stack';
import { QuranListScreen } from '../screens/QuranListScreen';
import { ChapterDetailScreen } from '../screens/ChapterDetailScreen';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="QuranList" 
        component={QuranListScreen} 
        options={{ title: 'The Holy Quran' }}
      />
      <Stack.Screen 
        name="ChapterDetail" 
        component={ChapterDetailScreen}
        options={({ route }) => ({ 
          title: `Chapter ${route.params.chapter.chapterNumber}` 
        })}
      />
    </Stack.Navigator>
  );
};
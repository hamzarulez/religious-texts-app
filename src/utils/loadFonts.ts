import * as Font from 'expo-font';
import { 
  ScheherazadeNew_400Regular,
  ScheherazadeNew_700Bold 
} from '@expo-google-fonts/scheherazade-new';

export async function loadFonts() {
  try {
    console.log('Starting font loading process...');
    
    await Font.loadAsync({
      'ScheherazadeNew-Regular': ScheherazadeNew_400Regular,
      'ScheherazadeNew-Bold': ScheherazadeNew_700Bold,
    });
    
    console.log('Fonts loaded successfully');
    return true;
  } catch (error) {
    console.error('Font loading error:', error);
    return false;
  }
}

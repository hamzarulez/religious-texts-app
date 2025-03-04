import * as Font from 'expo-font';

export async function loadFonts() {
  await Font.loadAsync({
    'AntDesign': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/AntDesign.ttf'),
    'Entypo': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Entypo.ttf'),
    'EvilIcons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/EvilIcons.ttf'),
    'Feather': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Feather.ttf'),
    'FontAwesome': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome.ttf'),
    'FontAwesome5_Brands': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome5_Brands.ttf'),
    'FontAwesome5_Regular': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome5_Regular.ttf'),
    'FontAwesome5_Solid': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome5_Solid.ttf'),
    'Fontisto': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Fontisto.ttf'),
    'Foundation': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Foundation.ttf'),
    'Ionicons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
    'MaterialCommunityIcons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf'),
    'MaterialIcons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
    'Octicons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Octicons.ttf'),
    'SimpleLineIcons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/SimpleLineIcons.ttf'),
    'Zocial': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Zocial.ttf'),
  });
}
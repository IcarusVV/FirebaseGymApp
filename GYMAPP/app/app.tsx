// App.tsx (put this in the root of your project)
import { Text, View, StyleSheet } from 'react-native';
import { useFonts, Inter_400Regular } from '@expo-google-fonts/inter';
import AppLoading from 'expo-app-loading';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    // Add more fonts here if you find Expo versions of Geist / Geist Mono later
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Gym Tracker App</Text>
      <Text style={styles.description}>Track your gym visits with ease.</Text>
      {/* Add children, screens, or navigation here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontFamily: 'Inter_400Regular',
    fontSize: 24,
    marginBottom: 10,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
});
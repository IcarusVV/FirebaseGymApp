import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export function useFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Inter: require('../../assets/fonts/Inter-Regular.ttf'), // adjust path & font
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  return fontsLoaded;
}
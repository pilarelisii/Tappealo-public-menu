import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { translations, Language } from "@/src/i18n/translations";
import { Platform } from "react-native";

const STORAGE_KEY = "menu_language";

async function saveLanguage(lang: Language) {
  if (Platform.OS === "web") {
    localStorage.setItem(STORAGE_KEY, lang);
    return;
  }
  await AsyncStorage.setItem(STORAGE_KEY, lang);
}

async function loadLanguage(): Promise<Language> {
  if (Platform.OS === "web") {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "en" ? "en" : "es";
  }

  const value = await AsyncStorage.getItem(STORAGE_KEY);
  return value === "en" ? "en" : "es";
}

export function useLanguage() {
  const [language, setLanguage] = useState<Language>("es");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadLanguage().then((lang) => {
      setLanguage(lang);
      setReady(true);
    });
  }, []);

  const changeLanguage = async (lang: Language) => {
    setLanguage(lang);
    await saveLanguage(lang);
  };

  const t = translations[language];

  return {
    language,
    changeLanguage,
    t,
    ready,
  };
}
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { translations, Language, TranslationShape } from "./translations";

type LanguageContextType = {
	language: Language;
	changeLanguage: (lang: Language) => Promise<void>;
	t: TranslationShape;
	ready: boolean;
};



const LanguageContext = createContext<LanguageContextType | null>(null);

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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
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

	const value: LanguageContextType = {
		language,
		changeLanguage,
		t: translations[language] as TranslationShape,
		ready,
	};

	return (
		<LanguageContext.Provider value={value}>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLanguageContext() {
	const ctx = useContext(LanguageContext);
	if (!ctx) {
		throw new Error("useLanguageContext must be used inside LanguageProvider");
	}
	return ctx;
}

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Globe, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
  { code: 'ki', name: 'Kikuyu', nativeName: 'Gĩkũyũ', flag: '🇰🇪' },
  { code: 'luo', name: 'Luo', nativeName: 'Dholuo', flag: '🇰🇪' },
  { code: 'kam', name: 'Kamba', nativeName: 'Kĩkamba', flag: '🇰🇪' },
  { code: 'kal', name: 'Kalenjin', nativeName: 'Kalenjin', flag: '🇰🇪' },
];

// Simple translations cache
let translationsCache: Record<string, string> = {};

export const LanguageSelector: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved language preference
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang) {
      const lang = SUPPORTED_LANGUAGES.find(l => l.code === savedLang);
      if (lang) {
        setCurrentLanguage(lang);
        applyTranslations(lang.code);
      }
    }
  }, []);

  const translateText = async (text: string, targetLang: string): Promise<string> => {
    // Check cache first
    const cacheKey = `${text}-${targetLang}`;
    if (translationsCache[cacheKey]) {
      return translationsCache[cacheKey] as string;
    }

    try {
      // Using a free translation service (MyMemory API)
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
      );
      
      if (!response.ok) {
        throw new Error('Translation service unavailable');
      }

      const data = await response.json();
      
      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        const translatedText = data.responseData.translatedText;
        // Cache the translation
        translationsCache[cacheKey] = translatedText;
        return translatedText;
      }
      
      // Fallback to simple word replacements for common agricultural terms
      return getSimpleTranslation(text, targetLang);
      
    } catch (error) {
      console.error('Translation failed:', error);
      return getSimpleTranslation(text, targetLang);
    }
  };

  const getSimpleTranslation = (text: string, targetLang: string): string => {
    const simpleTranslations: Record<string, Record<string, string>> = {
      'sw': {
        'Home': 'Nyumbani',
        'Markets': 'Masoko',
        'Agriculture': 'Kilimo',
        'Weather': 'Hali ya Anga',
        'Login': 'Ingia',
        'Sign In': 'Ingia',
        'Register': 'Jisajili',
        'Farm': 'Shamba',
        'Farmer': 'Mkulima',
        'Price': 'Bei',
        'Market': 'Soko',
        'Crop': 'Mazao',
        'Animal': 'Mnyamapori',
        'Transport': 'Usafiri',
        'Storage': 'Uhifadhi',
        'Buy': 'Nunua',
        'Sell': 'Uza',
        'Profile': 'Wasifu',
        'Settings': 'Mipangilio',
        'Chat': 'Mazungumzo',
        'Community': 'Jamii',
        'Events': 'Matukio',
        'Organizations': 'Mashirika',
        'Weather Forecast': 'Utabiri wa Hali ya Anga',
        'Temperature': 'Joto',
        'Rainfall': 'Mvua',
        'Humidity': 'Unyevu',
        'Wind': 'Upepo'
      },
      'ki': {
        'Home': 'Mucii',
        'Markets': 'Macoka',
        'Agriculture': 'Urimi',
        'Weather': 'Kĩrĩa',
        'Login': 'Thonya',
        'Farm': 'Mũgũnda',
        'Farmer': 'Mũrimi',
        'Price': 'Thogora',
        'Market': 'Kĩoha',
        'Crop': 'Irio'
      },
      'luo': {
        'Home': 'Dala',
        'Markets': 'Chiro',
        'Agriculture': 'Pur',
        'Weather': 'Yamo',
        'Login': 'Donj',
        'Farm': 'Puodho',
        'Farmer': 'Japur',
        'Price': 'Nengo',
        'Market': 'Chiro',
        'Crop': 'Cham'
      }
    };

    const langTranslations = simpleTranslations[targetLang];
    if (langTranslations && langTranslations[text]) {
      return langTranslations[text];
    }

    return text; // Return original if no translation found
  };

  const applyTranslations = async (languageCode: string) => {
    if (languageCode === 'en') {
      // Restore original English text if needed
      return;
    }

    setIsTranslating(true);

    try {
      // Get all text elements that need translation
      const elementsToTranslate = document.querySelectorAll('[data-translate]');
      
      for (const element of elementsToTranslate) {
        const originalText = element.getAttribute('data-original-text') || element.textContent;
        if (originalText) {
          // Store original text if not already stored
          if (!element.getAttribute('data-original-text')) {
            element.setAttribute('data-original-text', originalText);
          }
          
          const translatedText = await translateText(originalText, languageCode);
          element.textContent = translatedText;
        }
      }

      // Also translate placeholder texts
      const inputsToTranslate = document.querySelectorAll('input[placeholder], textarea[placeholder]');
      for (const input of inputsToTranslate) {
        const originalPlaceholder = input.getAttribute('data-original-placeholder') || input.getAttribute('placeholder');
        if (originalPlaceholder) {
          if (!input.getAttribute('data-original-placeholder')) {
            input.setAttribute('data-original-placeholder', originalPlaceholder);
          }
          
          const translatedPlaceholder = await translateText(originalPlaceholder, languageCode);
          input.setAttribute('placeholder', translatedPlaceholder);
        }
      }

    } catch (error) {
      console.error('Translation application failed:', error);
      toast({
        title: "Translation Error",
        description: "Some text may not be translated. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleLanguageChange = async (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferred-language', language.code);
    
    toast({
      title: "Language Changed",
      description: `Interface language changed to ${language.nativeName}`,
    });

    if (language.code !== 'en') {
      await applyTranslations(language.code);
    }
  };

  // Auto-add translation attributes to common elements
  useEffect(() => {
    const addTranslationAttributes = () => {
      // Add data-translate to common text elements
      const selectors = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'span', 'button', 'a',
        '[role="button"]',
        '.text-lg', '.text-xl', '.text-2xl',
        '.font-semibold', '.font-bold'
      ];

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (el.textContent && el.textContent.trim() && !el.getAttribute('data-translate')) {
            el.setAttribute('data-translate', '');
          }
        });
      });
    };

    // Run after component mount and whenever content changes
    const observer = new MutationObserver(addTranslationAttributes);
    observer.observe(document.body, { childList: true, subtree: true });
    addTranslationAttributes();

    return () => observer.disconnect();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          {isTranslating ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Globe className="h-4 w-4" />
          )}
          <span className="hidden sm:inline-block">
            {currentLanguage.flag} {currentLanguage.nativeName}
          </span>
          <span className="sm:hidden">
            {currentLanguage.flag}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {SUPPORTED_LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className={`cursor-pointer ${
              currentLanguage.code === language.code ? 'bg-accent' : ''
            }`}
          >
            <span className="mr-2">{language.flag}</span>
            <div className="flex flex-col">
              <span className="font-medium">{language.nativeName}</span>
              <span className="text-xs text-muted-foreground">{language.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
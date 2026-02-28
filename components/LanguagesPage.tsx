"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Check,
  Globe,
  Volume2,
  Radio,
  BookOpen,
  Settings,
  Download,
  ChevronRight,
} from "lucide-react";

interface Language {
  id: string;
  name: string;
  nativeName: string;
  code: string;
  flag: string;
  available: boolean;
  translated: number; // percentage translated
}

interface LanguageSection {
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

interface LanguagesPageProps {
  user: any;
  onClose: () => void;
  isOpen: boolean;
}

export function LanguagesPage({ user, onClose, isOpen }: LanguagesPageProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [languageSections, setLanguageSections] = useState<LanguageSection[]>([
    {
      title: "App Interface",
      description: "Menus, buttons, and app navigation",
      icon: <Settings className="h-4 w-4" />,
      enabled: true,
    },
    {
      title: "Audio Content",
      description: "Voice guidance and audio notifications",
      icon: <Volume2 className="h-4 w-4" />,
      enabled: false,
    },
    {
      title: "Educational Content",
      description: "Learning resources and tutorials",
      icon: <BookOpen className="h-4 w-4" />,
      enabled: false,
    },
  ]);

  // Available languages with support details
  const languages: Language[] = [
    {
      id: "en",
      name: "English",
      nativeName: "English",
      code: "en",
      flag: "🇺🇸",
      available: true,
      translated: 100
    },
    {
      id: "hi",
      name: "Hindi",
      nativeName: "हिन्दी",
      code: "hi",
      flag: "🇮🇳",
      available: true,
      translated: 95
    },
    {
      id: "mr",
      name: "Marathi",
      nativeName: "मराठी",
      code: "mr",
      flag: "🇮🇳",
      available: true,
      translated: 90
    },
    {
      id: "gu",
      name: "Gujarati",
      nativeName: "ગુજરાતી",
      code: "gu",
      flag: "🇮🇳",
      available: true,
      translated: 85
    },
    {
      id: "bn",
      name: "Bengali",
      nativeName: "বাংলা",
      code: "bn",
      flag: "🇮🇳",
      available: false,
      translated: 60
    },
    {
      id: "ta",
      name: "Tamil",
      nativeName: "தமிழ்",
      code: "ta",
      flag: "🇮🇳",
      available: false,
      translated: 45
    },
    {
      id: "te",
      name: "Telugu",
      nativeName: "తెలుగు",
      code: "te",
      flag: "🇮🇳",
      available: false,
      translated: 40
    },
    {
      id: "kn",
      name: "Kannada",
      nativeName: "ಕನ್ನಡ",
      code: "kn",
      flag: "🇮🇳",
      available: false,
      translated: 35
    },
    {
      id: "ml",
      name: "Malayalam",
      nativeName: "മലയാളം",
      code: "ml",
      flag: "🇮🇳",
      available: false,
      translated: 30
    },
    {
      id: "es",
      name: "Spanish",
      nativeName: "Español",
      code: "es",
      flag: "🇪🇸",
      available: false,
      translated: 25
    },
    {
      id: "fr",
      name: "French",
      nativeName: "Français",
      code: "fr",
      flag: "🇫🇷",
      available: false,
      translated: 20
    },
    {
      id: "de",
      name: "German",
      nativeName: "Deutsch",
      code: "de",
      flag: "🇩🇪",
      available: false,
      translated: 15
    },
  ];

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);


  const handleSectionToggle = (index: number) => {
    const newSections = [...languageSections];
    newSections[index].enabled = !newSections[index].enabled;
    setLanguageSections(newSections);
  };

  const handleDownloadOffline = () => {
    const selectedLang = languages.find(lang => lang.code === selectedLanguage);
    if (selectedLang?.available) {
      alert(`Downloading offline language pack for ${selectedLang.name}...`);
      // In a real app, this would download language pack
    } else {
      alert("Offline pack not available for this language yet");
    }
  };

  const getSelectedLanguage = () => {
    return languages.find(lang => lang.code === selectedLanguage);
  };

  const getAvailabilityBadge = (language: Language) => {
    if (language.available) {
      return (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
          Available
        </span>
      );
    } else {
      return (
        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
          Coming Soon ({language.translated}%)
        </span>
      );
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Side Panel */}
      <div
        className={`
          fixed inset-y-0 right-0 z-50 w-full max-w-md transform overflow-y-auto bg-gray-50 shadow-2xl
          transition-all duration-300 ease-in-out dark:bg-neutral-900
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-neutral-800"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-black dark:text-white" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Language Settings
              </h2>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                Choose your preferred language
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current Language */}
          <div className="mb-6 rounded-xl border border-[#3D3066] bg-[#3D3066]/5 p-4 dark:border-[#8B7FA8] dark:bg-[#3D3066]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gray-50 p-2 dark:bg-neutral-800">
                  <Globe className="h-5 w-5 text-[#3D3066] dark:text-[#8B7FA8]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Current Language
                  </p>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    {getSelectedLanguage()?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getSelectedLanguage()?.flag}</span>
              </div>
            </div>
          </div>

          {/* Download Offline Pack */}
          {/* <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-1 font-medium text-gray-900 dark:text-white">
                  Offline Language Pack
                </h3>
                <p className="text-sm text-gray-600 dark:text-neutral-400">
                  Download for use without internet
                </p>
              </div>
              <button
                onClick={handleDownloadOffline}
                className="flex items-center gap-2 rounded-lg bg-[#3D3066] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4D3F7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E8F]"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-neutral-500">
              Size: ~15MB • Saves mobile data
            </p>
          </div> */}

          {/* Available Languages */}
          <div className="mb-6">
            <h3 className="mb-4 font-medium text-gray-900 dark:text-white">
              Available Languages
            </h3>
            <div className="space-y-2">
              {languages.map((language) => (
                <div
                  key={language.id}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${selectedLanguage === language.code
                      ? "border-[#3D3066] bg-[#3D3066]/5 dark:border-[#8B7FA8] dark:bg-[#3D3066]/10"
                      : "border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-800/50"
                    } ${language.available ? "hover:border-[#3D3066] dark:hover:border-[#8B7FA8]" : "opacity-70"}`}
                >
                  <div className="flex items-center gap-3">
                    {/* <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-2xl dark:bg-neutral-700">
                      {language.flag}
                    </div> */}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {language.name}
                        </p>
                        {/* {getAvailabilityBadge(language)} */}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-neutral-400">
                        {language.nativeName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Translation Progress Bar */}
                    {/* <div className="hidden sm:block">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-700">
                          <div 
                            className="h-full rounded-full bg-green-500"
                            style={{ width: `${language.translated}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-neutral-500">
                          {language.translated}%
                        </span>
                      </div>
                    </div> */}

                    {selectedLanguage === language.code ? (
                      <div className="rounded-full bg-[#3D3066] p-1.5 dark:bg-[#8B7FA8]">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-gray-300 dark:border-neutral-600"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Language Content Sections */}
          {/* <div className="mb-6">
            <h3 className="mb-4 font-medium text-gray-900 dark:text-white">
              Content Language Settings
            </h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-neutral-400">
              Choose which parts of the app to translate
            </p>
            <div className="space-y-3">
              {languageSections.map((section, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 ${
                      section.enabled 
                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-600 dark:bg-neutral-700 dark:text-neutral-400"
                    }`}>
                      {section.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {section.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-neutral-400">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSectionToggle(index)}
                    className={`relative h-6 w-12 rounded-full transition-colors ${
                      section.enabled
                        ? "bg-[#3D3066] dark:bg-[#4D3F7F]"
                        : "bg-gray-300 dark:bg-neutral-600"
                    }`}
                  >
                    <div
                      className={`absolute top-1 h-4 w-4 rounded-full bg-gray-50 transition-transform ${
                        section.enabled ? "left-1 translate-x-7" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div> */}

          {/* Language Support Info */}
          {/* <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <div className="mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
              <h4 className="font-medium text-gray-900 dark:text-white">
                Language Support
              </h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-neutral-400">
                  Fully Translated
                </span>
                <div className="flex gap-1">
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    English
                  </span>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    Hindi
                  </span>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    Marathi
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-neutral-400">
                  Partial Support
                </span>
                <span className="text-gray-500 dark:text-neutral-500">
                  4 languages
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-neutral-400">
                  Coming Soon
                </span>
                <span className="text-gray-500 dark:text-neutral-500">
                  5 languages
                </span>
              </div>

              <div className="pt-3">
                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-gray-50 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700">
                  <span>Request a Language</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Help us translate! Contribute to make ZOLD available in more languages.
              </p>
            </div>
          </div> */}

          {/* Reset to Default */}
          <div className="mt-6">
            <button
              onClick={() => {
                setSelectedLanguage("en");
                setLanguageSections(sections =>
                  sections.map(section => ({ ...section, enabled: true }))
                );
                alert("Reset to default English settings");
              }}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 py-3 text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              Reset to Default Settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
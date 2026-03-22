import { useLanguage, type Language } from "@/contexts/LanguageContext";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-lg p-2 border border-green-200/30">
      <button
        onClick={() => setLanguage('it')}
        className={`px-3 py-1.5 rounded-md text-sm font-heading font-semibold transition-all ${
          language === 'it'
            ? 'bg-green-600 text-white shadow-md'
            : 'text-foreground hover:bg-muted/50'
        }`}
      >
        🇮🇹 Italiano
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 rounded-md text-sm font-heading font-semibold transition-all ${
          language === 'en'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-foreground hover:bg-muted/50'
        }`}
      >
        🇬🇧 English
      </button>
    </div>
  );
}

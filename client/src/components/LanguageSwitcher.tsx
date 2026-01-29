import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useLocation } from 'wouter';

export default function LanguageSwitcher() {
  const { language } = useLanguage();
  const [location, setLocation] = useLocation();

  const switchLanguage = (newLang: 'pt' | 'en') => {
    if (newLang === language) return;
    
    // Get current path without language prefix
    let currentPath = location;
    if (currentPath.startsWith('/pt/') || currentPath.startsWith('/en/')) {
      currentPath = currentPath.substring(3);
    }
    if (currentPath === '/pt' || currentPath === '/en') {
      currentPath = '/';
    }
    
    // Navigate to new language path
    const newPath = currentPath === '/' || currentPath === '' 
      ? `/${newLang}` 
      : `/${newLang}${currentPath}`;
    
    setLocation(newPath);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <div className="flex gap-1 bg-muted rounded-md p-1">
        <Button
          variant={language === 'pt' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => switchLanguage('pt')}
          className="h-7 px-3 text-xs font-medium"
        >
          PT
        </Button>
        <Button
          variant={language === 'en' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => switchLanguage('en')}
          className="h-7 px-3 text-xs font-medium"
        >
          EN
        </Button>
      </div>
    </div>
  );
}

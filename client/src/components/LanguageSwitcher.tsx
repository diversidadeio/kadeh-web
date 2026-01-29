import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <div className="flex gap-1 bg-muted rounded-md p-1">
        <Button
          variant={language === 'pt' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLanguage('pt')}
          className="h-7 px-3 text-xs font-medium"
        >
          PT
        </Button>
        <Button
          variant={language === 'en' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLanguage('en')}
          className="h-7 px-3 text-xs font-medium"
        >
          EN
        </Button>
      </div>
    </div>
  );
}

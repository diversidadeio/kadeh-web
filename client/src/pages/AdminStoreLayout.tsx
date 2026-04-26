import { useAuth } from '@/_core/hooks/useAuth';
import { StoreLayoutEditor } from '@/components/StoreLayoutEditor';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'wouter';
import { useEffect } from 'react';

export default function AdminStoreLayout() {
  const { user, loading } = useAuth();
  const { language } = useLanguage();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      setLocation('/');
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>{language === 'pt' ? 'Carregando...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {language === 'pt' ? 'Acesso Negado' : 'Access Denied'}
          </h1>
          <p className="text-gray-600">
            {language === 'pt'
              ? 'Você precisa ser um administrador para acessar esta página.'
              : 'You need to be an administrator to access this page.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {language === 'pt' ? 'Gerenciador de Layout da Loja' : 'Store Layout Manager'}
          </h1>
          <p className="text-gray-600">
            {language === 'pt'
              ? 'Crie e gerencie categorias, desenhe rotas entre elas'
              : 'Create and manage categories, draw routes between them'}
          </p>
        </div>

        <StoreLayoutEditor />
      </div>
    </div>
  );
}

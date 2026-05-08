import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MapPin,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Map,
  Package,
  Grid3X3,
} from 'lucide-react';

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    // Check if admin is logged in
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
      setLocation('/pt/admin/login');
      return;
    }

    try {
      const session = JSON.parse(adminSession);
      setAdminEmail(session.email);
    } catch (err) {
      console.error('Error parsing admin session:', err);
      setLocation('/pt/admin/login');
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    setLocation('/pt/admin/login');
  };

  const handleNavigate = (path: string) => {
    setLocation(path);
  };

  const menuItems = [
    {
      title: '📍 Mapeador de Locais',
      description: 'Crie e gerencie mapas interativos de locais',
      icon: MapPin,
      action: () => window.location.href = '/pt/location-mapper',
      color: 'bg-blue-500',
    },
    {
      title: '📦 Gerenciar Produtos',
      description: 'Adicione e organize produtos em massa',
      icon: Package,
      action: () => handleNavigate('/pt/admin/bulk-products'),
      color: 'bg-green-500',
    },
    {
      title: '🏪 Layout da Loja',
      description: 'Configure o layout e gôndolas da loja',
      icon: Grid3X3,
      action: () => handleNavigate('/pt/admin/store-layout'),
      color: 'bg-purple-500',
    },
    {
      title: '📊 Categorias',
      description: 'Gerencie categorias de produtos',
      icon: BarChart3,
      action: () => handleNavigate('/pt/admin/categories'),
      color: 'bg-orange-500',
    },
    {
      title: '⚙️ Configurações',
      description: 'Ajuste as configurações do sistema',
      icon: Settings,
      action: () => alert('Configurações em desenvolvimento'),
      color: 'bg-gray-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Map className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Kadeh Admin</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-slate-600">Logado como</p>
              <p className="font-semibold text-slate-900">{adminEmail}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Bem-vindo ao Painel Admin</h2>
          <p className="text-slate-600">Gerencie todos os aspectos do seu sistema Kadeh</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={item.action}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`${item.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-4">{item.title}</CardTitle>
                  <CardDescription className="text-sm">{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-slate-100 transition"
                  >
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Mapas Criados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">0</div>
              <p className="text-xs text-slate-500 mt-1">Nenhum mapa criado ainda</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Rotas Cadastradas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">0</div>
              <p className="text-xs text-slate-500 mt-1">Nenhuma rota cadastrada</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Último Acesso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-semibold text-slate-900">Agora</div>
              <p className="text-xs text-slate-500 mt-1">Sessão ativa</p>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Dica</h3>
          <p className="text-sm text-blue-800">
            Comece criando um novo mapa no <strong>Mapeador de Locais</strong>. Você pode adicionar pontos, 
            criar rotas e exportar os dados em JSON para uso em outras aplicações.
          </p>
        </div>
      </div>
    </div>
  );
}

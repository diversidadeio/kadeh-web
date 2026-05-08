import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Lock } from 'lucide-react';

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!email || !password) {
        setError('Por favor, preencha todos os campos');
        setLoading(false);
        return;
      }

      // Simple authentication - in production, this would call a backend API
      // For now, we'll use localStorage to store admin session
      const adminCredentials = {
        email: 'admin@kadeh.io',
        password: 'kadeh2024admin',
      };

      if (email === adminCredentials.email && password === adminCredentials.password) {
        // Store admin session
        const adminSession = {
          email,
          token: 'admin_token_' + Date.now(),
          loginTime: new Date().toISOString(),
        };
        localStorage.setItem('adminSession', JSON.stringify(adminSession));
        
        // Redirect to admin dashboard
        setLocation('/pt/admin/dashboard');
      } else {
        setError('Email ou senha incorretos');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-slate-700 bg-slate-800">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center text-white">Painel Admin</CardTitle>
          <CardDescription className="text-center text-slate-400">
            Acesso restrito para administradores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@kadeh.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? 'Autenticando...' : 'Entrar'}
            </Button>

            <div className="pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-400 text-center">
                <strong>Demo:</strong> admin@kadeh.io / kadeh2024admin
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

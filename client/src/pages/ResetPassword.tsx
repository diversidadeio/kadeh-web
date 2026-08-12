import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { CheckCircle, Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Verifica se a sessão de recuperação está ativa (Supabase define automaticamente ao clicar no link)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // Sem sessão válida, redireciona para login
        setLocation("/login");
      }
    });
  }, [setLocation]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      // Deslogar de todas as sessões antigas após redefinir a senha
      await supabase.auth.signOut();
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100">

          {success ? (
            /* ── Tela: Sucesso ── */
            <div className="text-center py-4">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle className="w-9 h-9 text-green-500" />
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                Senha redefinida!
              </h2>
              <p className="text-sm text-gray-600 mb-8">
                Sua senha foi atualizada com sucesso. Faça login com a nova senha.
              </p>
              <Button
                onClick={() => setLocation("/login")}
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                Ir para o login
              </Button>
            </div>
          ) : (
            /* ── Tela: Formulário ── */
            <>
              <div className="space-y-2 mb-8 text-center">
                <h2 className="text-2xl font-extrabold text-gray-900">
                  Criar nova senha
                </h2>
                <p className="text-sm text-gray-600">
                  Digite e confirme sua nova senha abaixo.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleReset}>
                {error && (
                  <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="nova-senha" className="block text-sm font-medium text-gray-700">
                    Nova senha
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="nova-senha"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none rounded-md block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmar-senha" className="block text-sm font-medium text-gray-700">
                    Confirmar nova senha
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="confirmar-senha"
                      type={showConfirm ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="appearance-none rounded-md block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="Repita a senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {loading ? "Salvando..." : "Salvar nova senha"}
                </Button>
              </form>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

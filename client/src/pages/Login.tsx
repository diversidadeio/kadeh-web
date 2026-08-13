import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

type Tela = "login" | "esqueceu-senha" | "email-enviado";

export default function Login() {
  const [, setLocation] = useLocation();
  const [tela, setTela] = useState<Tela>("login");

  // Estados do login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados do esqueceu a senha
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message === "Invalid login credentials") {
        setError("E-mail ou senha incorretos.");
      } else {
        setError(error.message);
      }
    } else {
      setLocation("/exclusao-de-dados");
    }

    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError(null);

    try {
      const response = await fetch('/api/send-recovery', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: resetEmail,
          redirectTo: `${window.location.origin}/redefinir-senha`,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        setResetError(result.error || "Erro ao enviar e-mail. Tente novamente.");
        setResetLoading(false);
      } else {
        setTela("email-enviado");
        setResetLoading(false);
      }
    } catch (err) {
      setResetError("Erro de conexão. Verifique sua internet e tente novamente.");
      setResetLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100">

          {/* ── Tela: Login ── */}
          {tela === "login" && (
            <>
              <div className="space-y-2 mb-8">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                  Faça login na sua conta
                </h2>
                <p className="text-center text-sm text-gray-600">
                  Entre com suas credenciais para acessar o painel.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleLogin}>
                {error && (
                  <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="Seu email"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Senha
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="Sua senha"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Lembrar de mim
                    </label>
                  </div>
                  <div className="text-sm">
                    <button
                      type="button"
                      onClick={() => { setTela("esqueceu-senha"); setResetEmail(email); setResetError(null); }}
                      className="font-medium text-primary hover:text-primary/80"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </>
          )}

          {/* ── Tela: Esqueceu a Senha ── */}
          {tela === "esqueceu-senha" && (
            <>
              <button
                type="button"
                onClick={() => setTela("login")}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para o login
              </button>

              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
              </div>

              <div className="space-y-2 mb-8 text-center">
                <h2 className="text-2xl font-extrabold text-gray-900">
                  Recuperar senha
                </h2>
                <p className="text-sm text-gray-600">
                  Informe seu e-mail e enviaremos um link para você criar uma nova senha.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleResetPassword}>
                {resetError && (
                  <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
                    {resetError}
                  </div>
                )}

                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                    Email cadastrado
                  </label>
                  <input
                    id="reset-email"
                    name="reset-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="seu@email.com"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {resetLoading ? "Enviando..." : "Enviar link de recuperação"}
                </Button>
              </form>
            </>
          )}

          {/* ── Tela: E-mail Enviado ── */}
          {tela === "email-enviado" && (
            <div className="text-center py-4">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle className="w-9 h-9 text-green-500" />
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                E-mail enviado!
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                Enviamos um link de recuperação para:
              </p>
              <p className="font-semibold text-gray-900 mb-6">{resetEmail}</p>
              <p className="text-xs text-gray-500 mb-8">
                Verifique sua caixa de entrada e também a pasta de spam. O link expira em 1 hora.
              </p>
              <button
                type="button"
                onClick={() => setTela("login")}
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                Voltar para o login
              </button>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}

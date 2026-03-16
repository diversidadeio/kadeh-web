import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';

const PAYMENT_PACKAGES = [
  {
    id: '1-5',
    stores: '1-5 lojas',
    storesEn: '1-5 stores',
    amount: 10000, // R$ 100.00 in cents
    amountDisplay: 'R$ 100,00',
    priceId: 'price_1TBb1TFyI5BjRSkNEHUYk2vE',
    multiplier: 1.0,
    features: [
      'Até 5 lojas',
      'Anúncios contextualizados',
      'Analytics em tempo real',
      'Suporte por email',
    ],
    featuresEn: [
      'Up to 5 stores',
      'Contextualized ads',
      'Real-time analytics',
      'Email support',
    ],
  },
  {
    id: '6-20',
    stores: '6-20 lojas',
    storesEn: '6-20 stores',
    amount: 15000, // R$ 150.00 in cents
    amountDisplay: 'R$ 150,00',
    priceId: 'price_1TBb1TFyI5BjRSkN9j6x0aA9',
    multiplier: 1.5,
    features: [
      'Até 20 lojas',
      'Anúncios contextualizados',
      'Analytics em tempo real',
      'Suporte prioritário',
      'Relatórios detalhados',
    ],
    featuresEn: [
      'Up to 20 stores',
      'Contextualized ads',
      'Real-time analytics',
      'Priority support',
      'Detailed reports',
    ],
    popular: true,
  },
  {
    id: '21-50',
    stores: '21-50 lojas',
    storesEn: '21-50 stores',
    amount: 20000, // R$ 200.00 in cents
    amountDisplay: 'R$ 200,00',
    priceId: 'price_1TBb1TFyI5BjRSkN0egZhfui',
    multiplier: 2.0,
    features: [
      'Até 50 lojas',
      'Anúncios contextualizados',
      'Analytics em tempo real',
      'Suporte dedicado',
      'Relatórios detalhados',
      'Consultor de campanha',
    ],
    featuresEn: [
      'Up to 50 stores',
      'Contextualized ads',
      'Real-time analytics',
      'Dedicated support',
      'Detailed reports',
      'Campaign consultant',
    ],
  },
  {
    id: '50+',
    stores: '50+ lojas',
    storesEn: '50+ stores',
    amount: 25000, // R$ 250.00 in cents
    amountDisplay: 'R$ 250,00',
    priceId: 'price_1TBb1TFyI5BjRSkNhtQjOZ4Y',
    multiplier: 2.5,
    features: [
      '50+ lojas',
      'Anúncios contextualizados',
      'Analytics em tempo real',
      'Suporte 24/7',
      'Relatórios detalhados',
      'Consultor dedicado',
      'Integração customizada',
    ],
    featuresEn: [
      '50+ stores',
      'Contextualized ads',
      'Real-time analytics',
      '24/7 support',
      'Detailed reports',
      'Dedicated consultant',
      'Custom integration',
    ],
  },
];

export default function KadehAdsPaymentPage() {
  const { language } = useLanguage();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const createCheckoutMutation = trpc.stripe.createCheckoutSessionSimple.useMutation();

  const handlePayment = async (packageId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      const pkg = PAYMENT_PACKAGES.find((p) => p.id === packageId);
      if (!pkg) {
        throw new Error('Package not found');
      }

      const response = await createCheckoutMutation.mutateAsync({
        storeRange: packageId as "1-5" | "6-20" | "21-50" | "50+",
        numberOfProducts: 1, // 1 day campaign default
        campaignDuration: 1, // 1 day
        campaignName: `Kadeh Ads - ${pkg.stores}`,
        companyName: 'Empresa Teste', // Will be filled by user
        companyEmail: 'teste@example.com', // Will be filled by user
      });

      if (response.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.url;
        setSuccessMessage(
          language === 'pt'
            ? 'Redirecionando para pagamento...'
            : 'Redirecting to payment...'
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao criar sessão de pagamento'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12 md:py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {language === 'pt' ? 'Kadeh Ads - Campanha de 1 Dia' : 'Kadeh Ads - 1 Day Campaign'}
          </h1>
          <p className="text-xl text-gray-700">
            {language === 'pt'
              ? 'Escolha o pacote ideal para sua rede de lojas e comece a anunciar agora'
              : 'Choose the ideal package for your store network and start advertising now'}
          </p>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PAYMENT_PACKAGES.map((pkg) => (
              <Card
                key={pkg.id}
                className={`relative transition-all ${
                  pkg.popular ? 'ring-2 ring-blue-600 md:scale-105' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      {language === 'pt' ? 'Mais Popular' : 'Most Popular'}
                    </div>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-2xl">
                    {language === 'pt' ? pkg.stores : pkg.storesEn}
                  </CardTitle>
                  <CardDescription>
                    {language === 'pt' ? 'Campanha de 1 dia' : '1 day campaign'}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Price */}
                  <div className="text-center">
                    <p className="text-4xl font-bold text-gray-900">{pkg.amountDisplay}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      {language === 'pt' ? 'por dia' : 'per day'}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {(language === 'pt' ? pkg.features : pkg.featuresEn).map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handlePayment(pkg.id)}
                    disabled={isLoading}
                    className={`w-full ${
                      pkg.popular
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    }`}
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {language === 'pt' ? 'Processando...' : 'Processing...'}
                      </>
                    ) : language === 'pt' ? (
                      'Pagar com Stripe'
                    ) : (
                      'Pay with Stripe'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Error/Success Messages */}
      {error && (
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {successMessage && (
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Test Card Info */}
      <section className="py-8 bg-blue-50">
        <div className="container max-w-6xl mx-auto px-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {language === 'pt'
                ? 'Para testes, use o cartão: 4242 4242 4242 4242 | Qualquer data futura | Qualquer CVC'
                : 'For testing, use card: 4242 4242 4242 4242 | Any future date | Any CVC'}
            </AlertDescription>
          </Alert>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import { useEffect } from "react";

export function StripePaymentButton() {
  useEffect(() => {
    // Carregar o script do Stripe
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/buy-button.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Limpar o script quando o componente for desmontado
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="mb-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">
        Escolha seu método de pagamento
      </h3>
      <stripe-buy-button
        buy-button-id="buy_btn_1TBgevFyI5BjRSkNbrJOJ8dj"
        publishable-key="pk_test_51TBZVJFyI5BjRSkNDRUMSVqmcZJwWH6JCXv4KLEWQNURSxJGNWs2ykfqiphE7hMsFGmvBtP0TGBtaB2PJwOEQT6Z00FLNBKPiX"
      />
    </div>
  );
}

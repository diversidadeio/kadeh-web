import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Varejo from "./pages/Varejo";
import Picking from "./pages/Picking";
import SmartLayout from "./pages/SmartLayout";
import DataIntelligence from "./pages/DataIntelligence";
import HowItWorks from "./pages/HowItWorks";
import Contact from "./pages/Contact";
import Media from "./pages/Media";

import FAQ from "./pages/FAQ";
import KadehAds from "./pages/KadehAds";
import KadehAdsFull from "./pages/KadehAdsFull";
import KadehAdsCampaign from "./pages/KadehAdsCampaign";
import KadehAdsCheckout from "./pages/KadehAdsCheckout";
import KadehAdsSuccess from "./pages/KadehAdsSuccess";
import KadehAdsCancel from "./pages/KadehAdsCancel";
import KadehAdsContratacao from "./pages/KadehAdsContratacao";
import KadehAdsPaymentPage from "./pages/KadehAdsPaymentPage";
import KadehAdsDashboard from "./pages/KadehAdsDashboard";
import KadehAdsManual from "./pages/KadehAdsManual";
import KadehAdsCheckoutGeneric from "./pages/KadehAdsCheckoutGeneric";
import KadehAdsCheckoutProcess from "./pages/KadehAdsCheckoutProcess";
import StoreMapping from "./pages/StoreMapping";
import AdminCategories from "./pages/AdminCategories";
import CategoryPerformanceDashboard from "./pages/CategoryPerformanceDashboard";
import SimulacaoPixelBased from "./pages/SimulacaoPixelBased";
import SimulacaoCompleta from "./pages/SimulacaoCompleta";
import AdminStoreLayout from "./pages/AdminStoreLayout";
import AdminBulkProducts from "./pages/AdminBulkProducts";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import CorridorMapperPage from "./pages/CorridorMapperPage";
import LocationMapperPage from "./pages/LocationMapperPage";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      {/* Portuguese routes */}
      <Route path="/pt" component={Home} />
      <Route path="/pt/how-it-works" component={HowItWorks} />
      <Route path="/pt/contact" component={Contact} />
      <Route path="/pt/varejo" component={Varejo} />
      <Route path="/pt/picking" component={Picking} />
      <Route path="/pt/smart-layout" component={SmartLayout} />
      <Route path="/pt/data-intelligence" component={DataIntelligence} />
      <Route path="/pt/media" component={Media} />
      <Route path="/pt/faq" component={FAQ} />
      <Route path="/pt/ads" component={KadehAds} />
      <Route path="/pt/kadeh-ads" component={KadehAdsFull} />
      <Route path="/pt/kadeh-ads-campaign" component={KadehAdsCampaign} />
      <Route path="/pt/kadeh-ads/checkout" component={KadehAdsCheckout} />
      <Route path="/pt/kadeh-ads/success" component={KadehAdsSuccess} />
      <Route path="/pt/kadeh-ads/cancel" component={KadehAdsCancel} />
      <Route path="/pt/kadeh-ads/contratacao" component={KadehAdsContratacao} />
      <Route path="/pt/kadeh-ads/payment" component={KadehAdsPaymentPage} />
      <Route path="/pt/kadeh-ads/dashboard" component={KadehAdsDashboard} />
      <Route path="/pt/kadeh-ads/manual" component={KadehAdsManual} />
      <Route path="/pt/kadeh-ads/checkout-generic" component={KadehAdsCheckoutGeneric} />
      <Route path="/pt/kadeh-ads/checkout-process" component={KadehAdsCheckoutProcess} />
      <Route path="/pt/store-mapping" component={StoreMapping} />
      <Route path="/pt/admin/categories" component={AdminCategories} />
      <Route path="/pt/categories/performance" component={CategoryPerformanceDashboard} />
      <Route path="/pt/simulacao" component={SimulacaoCompleta} />
      <Route path="/pt/admin/store-layout" component={AdminStoreLayout} />
      <Route path="/pt/admin/bulk-products" component={AdminBulkProducts} />
      <Route path="/pt/admin/dashboard" component={AdminDashboard} />
      <Route path="/pt/admin/login" component={AdminLogin} />
      <Route path="/pt/corridor-mapper" component={CorridorMapperPage} />
      <Route path="/pt/location-mapper" component={LocationMapperPage} />

      {/* English routes */}
      <Route path="/en" component={Home} />
      <Route path="/en/how-it-works" component={HowItWorks} />
      <Route path="/en/contact" component={Contact} />
      <Route path="/en/varejo" component={Varejo} />
      <Route path="/en/picking" component={Picking} />
      <Route path="/en/smart-layout" component={SmartLayout} />
      <Route path="/en/data-intelligence" component={DataIntelligence} />
      <Route path="/en/media" component={Media} />
      <Route path="/en/faq" component={FAQ} />
      <Route path="/en/ads" component={KadehAds} />
      <Route path="/en/kadeh-ads" component={KadehAdsFull} />
      <Route path="/en/kadeh-ads-campaign" component={KadehAdsCampaign} />
      <Route path="/en/kadeh-ads/checkout" component={KadehAdsCheckout} />
      <Route path="/en/kadeh-ads/success" component={KadehAdsSuccess} />
      <Route path="/en/kadeh-ads/cancel" component={KadehAdsCancel} />
      <Route path="/en/kadeh-ads/contratacao" component={KadehAdsContratacao} />
      <Route path="/en/kadeh-ads/payment" component={KadehAdsPaymentPage} />
      <Route path="/en/kadeh-ads/dashboard" component={KadehAdsDashboard} />
      <Route path="/en/kadeh-ads/manual" component={KadehAdsManual} />
      <Route path="/en/kadeh-ads/checkout-generic" component={KadehAdsCheckoutGeneric} />
      <Route path="/en/kadeh-ads/checkout-process" component={KadehAdsCheckoutProcess} />
      <Route path="/en/store-mapping" component={StoreMapping} />
      <Route path="/en/admin/categories" component={AdminCategories} />
      <Route path="/en/categories/performance" component={CategoryPerformanceDashboard} />
      <Route path="/en/simulacao" component={SimulacaoCompleta} />
      <Route path="/en/admin/store-layout" component={AdminStoreLayout} />
      <Route path="/en/admin/bulk-products" component={AdminBulkProducts} />
      <Route path="/en/admin/dashboard" component={AdminDashboard} />
      <Route path="/en/admin/login" component={AdminLogin} />
      <Route path="/en/corridor-mapper" component={CorridorMapperPage} />
      <Route path="/en/location-mapper" component={LocationMapperPage} />

      {/* Default routes (redirect to Portuguese) */}
      <Route path="/" component={Home} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/contact" component={Contact} />
      <Route path="/varejo" component={Varejo} />
      <Route path="/picking" component={Picking} />
      <Route path="/smart-layout" component={SmartLayout} />
      <Route path="/data-intelligence" component={DataIntelligence} />
      <Route path="/media" component={Media} />
      <Route path="/faq" component={FAQ} />
      <Route path="/ads" component={KadehAds} />
      <Route path="/kadeh-ads" component={KadehAdsFull} />
      <Route path="/kadeh-ads-campaign" component={KadehAdsCampaign} />
      <Route path="/kadeh-ads/payment" component={KadehAdsPaymentPage} />
      <Route path="/store-mapping" component={StoreMapping} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/categories/performance" component={CategoryPerformanceDashboard} />
      <Route path="/simulacao" component={SimulacaoCompleta} />
      <Route path="/admin/store-layout" component={AdminStoreLayout} />
      <Route path="/admin/bulk-products" component={AdminBulkProducts} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/location-mapper" component={LocationMapperPage} />

      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Picking from "./pages/Picking";
import SmartLayout from "./pages/SmartLayout";
import DataIntelligence from "./pages/DataIntelligence";
import HowItWorks from "./pages/HowItWorks";
import Contact from "./pages/Contact";
import Media from "./pages/Media";
import Video from "./pages/Video";
import FAQ from "./pages/FAQ";
import KadehAds from "./pages/KadehAds";
import KadehAdsFull from "./pages/KadehAdsFull";
import AdvertiserPortal from "./pages/AdvertiserPortal";
import PaymentCallback from "./pages/PaymentCallback";
import KadehVarejo from "./pages/KadehVarejo";
import KadehShopping from "./pages/KadehShopping";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      {/* Portuguese routes */}
      <Route path="/pt" component={Home} />
      <Route path="/pt/how-it-works" component={HowItWorks} />
      <Route path="/pt/contact" component={Contact} />
      <Route path="/pt/picking" component={Picking} />
      <Route path="/pt/smart-layout" component={SmartLayout} />
      <Route path="/pt/data-intelligence" component={DataIntelligence} />
      <Route path="/pt/media" component={Media} />
      <Route path="/pt/video" component={Video} />
      <Route path="/pt/faq" component={FAQ} />
      <Route path="/pt/ads" component={KadehAds} />
      <Route path="/pt/kadeh-ads" component={KadehAdsFull} />
      <Route path="/pt/kadeh-varejo" component={KadehVarejo} />
      <Route path="/pt/kadeh-shopping" component={KadehShopping} />
      <Route path="/pt/advertiser-portal" component={AdvertiserPortal} />
      <Route path="/pt/payment-callback" component={PaymentCallback} />

      {/* English routes */}
      <Route path="/en" component={Home} />
      <Route path="/en/how-it-works" component={HowItWorks} />
      <Route path="/en/contact" component={Contact} />
      <Route path="/en/picking" component={Picking} />
      <Route path="/en/smart-layout" component={SmartLayout} />
      <Route path="/en/data-intelligence" component={DataIntelligence} />
      <Route path="/en/media" component={Media} />
      <Route path="/en/video" component={Video} />
      <Route path="/en/faq" component={FAQ} />
      <Route path="/en/ads" component={KadehAds} />
      <Route path="/en/kadeh-ads" component={KadehAdsFull} />
      <Route path="/en/kadeh-varejo" component={KadehVarejo} />
      <Route path="/en/kadeh-shopping" component={KadehShopping} />
      <Route path="/en/advertiser-portal" component={AdvertiserPortal} />
      <Route path="/en/payment-callback" component={PaymentCallback} />

      {/* Default routes (redirect to Portuguese) */}
      <Route path="/" component={Home} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/contact" component={Contact} />
      <Route path="/picking" component={Picking} />
      <Route path="/smart-layout" component={SmartLayout} />
      <Route path="/data-intelligence" component={DataIntelligence} />
      <Route path="/media" component={Media} />
      <Route path="/video" component={Video} />
      <Route path="/faq" component={FAQ} />
      <Route path="/ads" component={KadehAds} />
      <Route path="/kadeh-ads" component={KadehAdsFull} />
      <Route path="/kadeh-varejo" component={KadehVarejo} />
      <Route path="/kadeh-shopping" component={KadehShopping} />
      <Route path="/advertiser-portal" component={AdvertiserPortal} />
      <Route path="/payment-callback" component={PaymentCallback} />

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

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
import KadehAds from "./pages/KadehAds";
import AdsAdvertiserDashboard from "./pages/AdsAdvertiserDashboard";


function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/contact" component={Contact} />
      <Route path="/picking" component={Picking} />
      <Route path="/smart-layout" component={SmartLayout} />
      <Route path="/data-intelligence" component={DataIntelligence} />
      <Route path="/ads" component={KadehAds} />
      <Route path="/ads/dashboard" component={AdsAdvertiserDashboard} />
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

import { KadehAdsCampaignForm } from "@/components/KadehAdsCampaignForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function KadehAdsCampaignPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <KadehAdsCampaignForm />
      </div>
      <Footer />
    </div>
  );
}

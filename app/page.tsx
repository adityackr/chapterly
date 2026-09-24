import { Separator } from "@/components/ui/separator";
import Hero from "./_components/hero";
import ProductMock from "./_components/product-mock";
import Features from "./_components/features";
import HowItWorks from "./_components/how-it-works";
import CtaBand from "./_components/cta-band";
import Faq from "./_components/faq";
import Footer from "./_components/footer";

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Hero />
      <ProductMock />
      <Features />
      <Separator className="mx-auto max-w-6xl" />
      <HowItWorks />
      <CtaBand />
      <Faq />
      <Footer />
    </div>
  );
}

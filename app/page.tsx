import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import Hero from "./_components/hero";
import ProductMock from "./_components/product-mock";
import Features from "./_components/features";
import HowItWorks from "./_components/how-it-works";
import CtaBand from "./_components/cta-band";
import Faq from "./_components/faq";
import Footer from "./_components/footer";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  // Note: root layout's title.template does not apply to this same-segment
  // page, so include the site name explicitly — brand first so it survives
  // browser tab truncation.
  title: `${siteConfig.name} — Turn YouTube Videos into Courses`,
  description:
    "Paste a YouTube link and get bite-size lessons, trimmed playback, progress tracking and resume — free, private, stored in your browser.",
  alternates: { canonical: absoluteUrl("/") },
};

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

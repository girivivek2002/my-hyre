import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Trusted from "@/components/landing/Trusted";
import Features from "@/components/landing/Features";
import Engagement from "@/components/landing/Engagement";
import Recruiter from "@/components/landing/Recruiter";
import Testimonial from "@/components/landing/Testimonial";
import Pricing from "@/components/landing/Pricing";
import CTA from "@/components/landing/CTA";


export default function Home() {
  return (
     <main className="bg-[#FAFBFD] text-slate-900 min-h-screen">
      <Navbar />
      <Hero />
      <Trusted />
      <Features />
      <Engagement />
      <Recruiter />
      <Testimonial />
      <Pricing />
      <CTA />
    </main>
  );
}
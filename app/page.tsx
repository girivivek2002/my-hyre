import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Trusted from "@/components/landing/Trusted";
import Features from "@/components/landing/Features";
import Engagement from "@/components/landing/Engagement";
import Recruiter from "@/components/landing/Recruiter";
import Pricing from "@/components/landing/Pricing";
import Testimonial from "@/components/landing/Testimonial";
import CTA from "@/components/landing/CTA";


export default function Home() {
  return (
     <main className="bg-[#0A0A0F] text-white min-h-screen">
      <Navbar />
      <Hero />
      <Trusted />
      <Features />
      <Engagement />
      <Recruiter />
      <Pricing />
      <Testimonial />
      <CTA />
    </main>
  );
}
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Trusted from "@/components/landing/Trusted";
import Features from "@/components/landing/Features";
import Engagement from "@/components/landing/Engagement";
import Recruiter from "@/components/landing/Recruiter";
import Pricing from "@/components/landing/Pricing";
import Testimonial from "@/components/landing/Testimonial";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";


export default function Home() {
  return (
     <main className="bg-slate-50 dark:bg-black text-slate-900 dark:text-white min-h-screen transition-colors duration-300">
      <Navbar />
      <Hero />
      <Trusted />
      <Engagement />
      <Recruiter />
      <Features />
      <Pricing />
      <Testimonial />
      <CTA />
      <Footer />
    </main>
  );
}
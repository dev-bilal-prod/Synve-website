import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Stats from "@/components/Stats";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Process />
      <Stats />
      <Contact />
      <Footer />
    </main>
  );
}
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Gallery from "@/components/Gallery";
import About from "@/components/About";
import Interview from "@/components/Interview";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import MouseGlow from "@/components/MouseGlow";
import { MusicProvider } from "@/components/BackgroundMusic";
import PianoQuest from "@/components/PianoQuest";

export default function Home() {
  return (
    <MusicProvider>
    <main>
      <PianoQuest />
      <ScrollProgress />
      <MouseGlow />
      <Nav />
      <Hero />
      <Marquee />
      <Gallery />
      <About />
      <Interview />
      <Contact />
      <Footer />
    </main>
    </MusicProvider>
  );
}

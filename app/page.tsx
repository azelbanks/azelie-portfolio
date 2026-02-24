'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Journey } from '@/components/sections/Journey';
import { Projects } from '@/components/sections/Projects';
import { Skills } from '@/components/sections/Skills';
import { Contact } from '@/components/sections/Contact';
import { RecruiterDilemma } from '@/components/easter-egg/RecruiterDilemma';
import { KonamiListener } from '@/components/easter-egg/KonamiListener';
import { ChatBot, ChatBubble } from '@/components/chat';
import { useAppStore } from '@/lib/store';

export default function Home() {
  const unlockEasterEgg = useAppStore((state) => state.unlockEasterEgg);
  const openEasterEggGame = useAppStore((state) => state.openEasterEggGame);

  const handleKonamiActivate = () => {
    unlockEasterEgg();
    openEasterEggGame();
  };

  return (
    <>
      <Header />
      <main className="relative">
        <Hero />
        <About />
        <Journey />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />

      {/* Easter Egg - Le Dilemme du Recruteur */}
      <KonamiListener onActivate={handleKonamiActivate} />
      <RecruiterDilemma />

      {/* Chatbot IA */}
      <ChatBot />
      <ChatBubble />
    </>
  );
}

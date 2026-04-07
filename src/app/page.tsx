"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import {
  Camera,
  Mic,
  Search,
  Tv,
  MessageSquare,
  Smartphone,
  Zap,
  Globe,
  ArrowRight,
  Play,
  Volume2,
  Scan,
  Sparkles,
  Film,
  Users,
  Star,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IPadMockup, BrowserMockup } from "@/components/device-mockup";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const features = [
  { icon: Camera, title: "Vision AI", description: "Snap your TV screen — AI identifies the show, actors, and scene in under 2 seconds", color: "from-red-500 to-orange-500" },
  { icon: Volume2, title: "VocalBridge Voice", description: "Premium voice agent by VocalBridge AI — ask questions without touching your phone", color: "from-red-600 to-red-400" },
  { icon: Search, title: "700K+ Shows", description: "Full cast, plot summaries, episode details from TMDB for any show or movie", color: "from-pink-500 to-red-500" },
  { icon: Smartphone, title: "Install as App", description: "Add to home screen — feels native, works offline for UI, no app store needed", color: "from-red-500 to-rose-500" },
  { icon: Zap, title: "Free to Use", description: "Powered by Google Gemini free tier. No paid API keys. No subscriptions.", color: "from-orange-500 to-red-500" },
  { icon: Globe, title: "Open Source", description: "MIT licensed. Fork it, modify it, self-host it. The code is yours.", color: "from-red-400 to-pink-500" },
];

const faqs = [
  { question: "How does it know what I'm watching?", answer: "Point your phone camera at the TV and snap a screenshot. Google Gemini Vision identifies the show, or you can search by name. TMDB loads full cast and plot context." },
  { question: "Does it work with Netflix, Disney+, HBO?", answer: "Yes — it works with any screen. Netflix, Disney+, HBO, Amazon Prime, Apple TV+, Hulu, cable TV, even a projector. It analyzes the image, not the streaming service." },
  { question: "Is it really free?", answer: "Yes. The app is MIT open source. It uses Google Gemini's free tier (15 requests/minute). You get a free API key in 30 seconds at aistudio.google.com." },
  { question: "What about VocalBridge AI?", answer: "VocalBridge is the premium voice engine — it gives you a dedicated voice agent you can talk to naturally. Web Speech API works as a free fallback. Both are built in." },
  { question: "Can it spoil the show?", answer: "No — the AI is instructed to avoid spoilers by default. It only reveals future plot points if you explicitly ask." },
  { question: "Can I contribute?", answer: "Absolutely! It's MIT licensed on GitHub. We welcome feature ideas, bug fixes, and improvements." },
];

function HeroScreenContent() {
  return (
    <div className="w-full h-full bg-gradient-to-b from-zinc-950 to-zinc-900 p-4 sm:p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-red-500 flex items-center justify-center">
            <Tv className="h-3 w-3 text-white" />
          </div>
          <span className="text-white text-xs font-semibold">What Now</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center">
            <Camera className="h-3 w-3 text-zinc-400" />
          </div>
          <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center">
            <Mic className="h-3 w-3 text-zinc-400" />
          </div>
        </div>
      </div>

      {/* Show context */}
      <div className="flex gap-2 mb-3 p-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
        <div className="w-10 h-14 rounded bg-gradient-to-br from-red-900 to-red-700 flex-shrink-0" />
        <div>
          <div className="text-white text-[10px] font-semibold">Breaking Bad</div>
          <div className="text-zinc-400 text-[8px]">S3 E7 &middot; TV Show &middot; 9.5/10</div>
          <div className="text-zinc-500 text-[7px] mt-0.5 font-mono">Bryan Cranston, Aaron Paul, Dean Norris...</div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="flex justify-end">
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg px-2.5 py-1.5 max-w-[75%]">
            <p className="text-[9px] text-white">Who is that bald guy talking to Walt?</p>
          </div>
        </div>
        <div className="flex justify-start">
          <div className="bg-zinc-800 border border-zinc-700/50 rounded-lg px-2.5 py-1.5 max-w-[80%]">
            <p className="text-[9px] text-zinc-200">
              That&apos;s <strong>Dean Norris</strong> as <strong>Hank Schrader</strong> — Walt&apos;s brother-in-law and DEA agent. He&apos;s getting closer to figuring out Walt&apos;s secret.
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg px-2.5 py-1.5 max-w-[75%]">
            <p className="text-[9px] text-white">What else has he been in?</p>
          </div>
        </div>
        <div className="flex justify-start">
          <div className="bg-zinc-800 border border-zinc-700/50 rounded-lg px-2.5 py-1.5 max-w-[80%]">
            <p className="text-[9px] text-zinc-200">
              Big Jim in <em>Under the Dome</em>, and he was in <em>Total Recall</em> (1990). Also appeared in <em>Starship Troopers</em>.
            </p>
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-zinc-800">
        <div className="flex-1 bg-zinc-800 rounded-full px-3 py-1.5">
          <span className="text-[8px] text-zinc-500">Ask anything about the show...</span>
        </div>
        <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center">
          <Mic className="h-3 w-3 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Netflix & What Now",
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Web",
    url: "https://netflix-and-what-now.vercel.app",
    description: "AI TV companion — point your phone at the TV and ask anything.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white grain relative overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.04]">
        <div className="w-[92vw] max-w-[1400px] mx-auto flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-red-500 flex items-center justify-center">
              <Tv className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-sm sm:text-base tracking-tight">Netflix & What Now</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <a href="https://github.com/venkata-srinivasan/netflix-and-what-now" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors hidden sm:block">
              GitHub
            </a>
            <Link href="/watch">
              <Button size="sm" className="gap-1.5 bg-red-500 hover:bg-red-600 text-white border-0 text-xs sm:text-sm">
                <Play className="h-3 w-3 fill-current" />
                Launch App
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ━━━ HERO ━━━ */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
          {/* Background gradient orbs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-red-500/[0.07] blur-[150px]" />
            <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-red-800/[0.05] blur-[120px]" />
          </div>

          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 w-[92vw] max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center py-16 sm:py-24">
              {/* Left — copy */}
              <div className="text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[11px] text-red-400 mb-6"
                >
                  <Sparkles className="h-3 w-3" />
                  Free &middot; Open Source &middot; No account needed
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter leading-[0.95]"
                >
                  Your AI
                  <br />
                  <span className="text-netflix">TV companion.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="mt-5 text-base sm:text-lg text-zinc-400 max-w-md mx-auto lg:mx-0 leading-relaxed"
                >
                  Point your phone at the TV. Ask who that actor is. Get the plot recap. Powered by VocalBridge AI voice and Gemini vision — completely free.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex flex-col sm:flex-row items-center lg:items-start gap-3 mt-8"
                >
                  <Link href="/watch">
                    <Button size="lg" className="gap-2 bg-red-500 hover:bg-red-600 text-white border-0 px-8 h-12 text-sm font-semibold glow">
                      <Play className="h-4 w-4 fill-current" />
                      Start Watching — It&apos;s Free
                    </Button>
                  </Link>
                  <a href="https://github.com/venkata-srinivasan/netflix-and-what-now" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="gap-2 px-6 h-12 text-sm border-zinc-700 hover:border-zinc-500 text-zinc-300">
                      View Source
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                </motion.div>

                {/* Trust badges */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex items-center gap-4 mt-8 justify-center lg:justify-start"
                >
                  {[
                    { icon: Film, text: "700K+ shows" },
                    { icon: Star, text: "Gemini Vision" },
                    { icon: Volume2, text: "VocalBridge" },
                  ].map((badge) => (
                    <div key={badge.text} className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                      <badge.icon className="h-3 w-3" />
                      {badge.text}
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right — iPad mockup */}
              <motion.div
                initial={{ opacity: 0, y: 40, rotateY: -10 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.9, delay: 0.3 }}
                className="perspective-[1000px]"
              >
                <IPadMockup>
                  <HeroScreenContent />
                </IPadMockup>
              </motion.div>
            </div>
          </motion.div>
        </section>


        {/* ━━━ HOW IT WORKS — with browser mockup ━━━ */}
        <section className="py-24 sm:py-36 relative">
          <div className="w-[92vw] max-w-[1200px] mx-auto">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-red-400 text-xs font-mono uppercase tracking-widest mb-3">How it works</p>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                Three steps. <span className="text-zinc-500">Zero friction.</span>
              </h2>
            </motion.div>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-20">
              {[
                { num: "01", icon: Scan, title: "Snap your screen", desc: "Point your phone at the TV and capture a frame. Gemini Vision identifies the show, actors, and scene instantly." },
                { num: "02", icon: Mic, title: "Ask with your voice", desc: "Tap the mic and speak naturally — VocalBridge AI processes your question and streams back the answer." },
                { num: "03", icon: MessageSquare, title: "Get instant context", desc: "AI responds with actor names, filmographies, plot recaps, and trivia. No spoilers unless you ask." },
              ].map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="group relative"
                >
                  <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-red-500/20 transition-all duration-500">
                    <span className="text-[11px] font-mono text-red-500/60 tracking-widest">{step.num}</span>
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/10 flex items-center justify-center mt-4 mb-4 group-hover:bg-red-500/15 transition-colors">
                      <step.icon className="h-5 w-5 text-red-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Browser mockup showing the app */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <BrowserMockup url="netflix-and-what-now.vercel.app/watch">
                <div className="w-full aspect-[16/9] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 sm:p-10 flex items-center justify-center relative overflow-hidden scanlines">
                  {/* Simulated app screenshot */}
                  <div className="grid grid-cols-[200px_1fr] gap-6 w-full max-w-3xl">
                    {/* Sidebar */}
                    <div className="space-y-3 hidden sm:block">
                      <div className="text-[10px] text-zinc-600 uppercase tracking-wider font-mono">Now watching</div>
                      <div className="flex gap-2 p-2 rounded-lg bg-zinc-800/40 border border-zinc-700/30">
                        <div className="w-8 h-12 rounded bg-red-900/50 flex-shrink-0" />
                        <div>
                          <div className="text-[10px] text-white font-semibold">Stranger Things</div>
                          <div className="text-[8px] text-zinc-500">S4 E4 &middot; 9.0/10</div>
                        </div>
                      </div>
                      <div className="text-[8px] text-zinc-600 font-mono">
                        Cast: Millie Bobby Brown, Finn Wolfhard, David Harbour...
                      </div>
                    </div>
                    {/* Chat */}
                    <div className="space-y-2">
                      <div className="flex justify-end"><div className="bg-red-500/15 border border-red-500/20 rounded-lg px-3 py-1.5 text-[10px] text-white max-w-xs">Who is the girl with the shaved head?</div></div>
                      <div className="flex justify-start"><div className="bg-zinc-800/50 border border-zinc-700/30 rounded-lg px-3 py-1.5 text-[10px] text-zinc-300 max-w-sm">That&apos;s <strong>Millie Bobby Brown</strong> playing <strong>Eleven (El)</strong>. She has telekinetic powers from being experimented on at Hawkins Lab. She&apos;s 20 years old IRL and was also in <em>Enola Holmes</em>.</div></div>
                      <div className="flex justify-end"><div className="bg-red-500/15 border border-red-500/20 rounded-lg px-3 py-1.5 text-[10px] text-white max-w-xs">What happened in the last episode?</div></div>
                      <div className="flex justify-start"><div className="bg-zinc-800/50 border border-zinc-700/30 rounded-lg px-3 py-1.5 text-[10px] text-zinc-300 max-w-sm animate-pulse">Typing...</div></div>
                    </div>
                  </div>
                </div>
              </BrowserMockup>
            </motion.div>
          </div>
        </section>

        {/* ━━━ SETUP GUIDE ━━━ */}
        <section className="py-24 sm:py-36 relative border-t border-white/[0.04]">
          <div className="w-[92vw] max-w-[900px] mx-auto">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-red-400 text-xs font-mono uppercase tracking-widest mb-3">Get started in 2 minutes</p>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                Free setup. <span className="text-zinc-500">No credit card.</span>
              </h2>
              <p className="text-zinc-500 mt-4 max-w-lg mx-auto">
                You need one free API key to power the AI. That&apos;s it. No accounts, no payments, no tracking.
              </p>
            </motion.div>

            <motion.div
              className="space-y-4"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {/* Step 1 */}
              <motion.div variants={item} className="flex gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                <div className="flex-1">
                  <h3 className="font-bold text-base mb-1">Get a free Google Gemini API key</h3>
                  <p className="text-sm text-zinc-500 mb-3">Takes 30 seconds. No credit card. Gemini&apos;s free tier gives you 15 requests per minute — plenty for watching a movie.</p>
                  <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="gap-1.5 border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs">
                      Get Free Key
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div variants={item} className="flex gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 text-zinc-400 flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                <div className="flex-1">
                  <h3 className="font-bold text-base mb-1">Clone & add your key</h3>
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-xs text-zinc-400 space-y-1 mt-2">
                    <p><span className="text-zinc-600">#</span> Clone the repo</p>
                    <p className="text-zinc-300">git clone https://github.com/venkata-srinivasan/netflix-and-what-now.git</p>
                    <p className="text-zinc-300">cd netflix-and-what-now && npm install</p>
                    <p className="mt-2"><span className="text-zinc-600">#</span> Add your Gemini key</p>
                    <p className="text-zinc-300">cp .env.example .env.local</p>
                    <p className="text-zinc-300"><span className="text-zinc-600">#</span> Edit .env.local → paste your GOOGLE_GENERATIVE_AI_API_KEY</p>
                  </div>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div variants={item} className="flex gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 text-zinc-400 flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                <div className="flex-1">
                  <h3 className="font-bold text-base mb-1">Run it</h3>
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-xs text-zinc-400 mt-2">
                    <p className="text-zinc-300">npm run dev</p>
                    <p className="mt-1"><span className="text-zinc-600">#</span> Open localhost:3000 on your phone (same WiFi)</p>
                    <p><span className="text-zinc-600">#</span> Or deploy to Vercel with one click ↓</p>
                  </div>
                  <a href="https://vercel.com/new/clone?repository-url=https://github.com/venkata-srinivasan/netflix-and-what-now&env=GOOGLE_GENERATIVE_AI_API_KEY&envDescription=Free%20Gemini%20API%20key%20from%20aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="inline-block mt-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://vercel.com/button" alt="Deploy with Vercel" className="h-9" />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ━━━ FEATURES ━━━ */}
        <section className="py-24 sm:py-36 relative border-t border-white/[0.04]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-red-500/[0.03] blur-[200px]" />
          </div>

          <div className="w-[92vw] max-w-[1200px] mx-auto relative z-10">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-red-400 text-xs font-mono uppercase tracking-widest mb-3">Features</p>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                Built for the <span className="text-netflix">couch.</span>
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={item}
                  className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-red-500/20 transition-all duration-500 overflow-hidden"
                >
                  {/* Gradient glow on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-4.5 w-4.5 text-red-400" />
                    </div>
                    <h3 className="font-bold text-base mb-1.5">{feature.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ━━━ VOCAL BRIDGE SECTION ━━━ */}
        <section className="py-24 sm:py-36 relative border-t border-white/[0.04]">
          <div className="w-[92vw] max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <p className="text-red-400 text-xs font-mono uppercase tracking-widest mb-3">Voice Engine</p>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-5">
                  Powered by
                  <br />
                  <span className="text-netflix">VocalBridge AI.</span>
                </h2>
                <p className="text-zinc-400 leading-relaxed mb-6">
                  Don&apos;t type while you&apos;re watching TV. Just talk. VocalBridge AI provides a dedicated voice agent that understands your questions, has context about what you&apos;re watching, and streams back natural answers.
                </p>
                <ul className="space-y-3 text-sm text-zinc-400">
                  {[
                    "Bidirectional voice — ask and hear answers",
                    "MCP server integration for TMDB tools",
                    "Session transcripts and analytics",
                    "Deploy to web, phone, or both",
                    "Free Web Speech API as fallback",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-red-500/15 border border-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative"
              >
                {/* Voice waveform visualization */}
                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                        <Mic className="h-5 w-5 text-white" />
                      </div>
                      <div className="pulse-ring" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">VocalBridge Agent</div>
                      <div className="text-xs text-green-400 font-mono">Connected &middot; Listening</div>
                    </div>
                  </div>

                  {/* Fake waveform */}
                  <div className="flex items-center gap-[3px] h-16 justify-center mb-6">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-[3px] rounded-full bg-red-500/60"
                        animate={{
                          height: [8, Math.random() * 50 + 10, 8],
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: i * 0.05,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-mono flex-shrink-0">YOU:</span>
                      <span className="text-zinc-300">&quot;Who is the guy that just walked in?&quot;</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 font-mono flex-shrink-0">AI:</span>
                      <span className="text-zinc-300">&quot;That&apos;s Jonathan Banks as Mike Ehrmantraut. He&apos;s a former police officer turned fixer...&quot;</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ━━━ FAQ ━━━ */}
        <section className="py-24 sm:py-36 border-t border-white/[0.04]">
          <div className="w-[92vw] max-w-[700px] mx-auto">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-red-400 text-xs font-mono uppercase tracking-widest mb-3">FAQ</p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Common questions
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Accordion className="space-y-2">
                {faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="rounded-xl px-5 bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.08] transition-colors"
                  >
                    <AccordionTrigger className="text-left text-sm font-semibold py-4 text-zinc-200">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-zinc-500 pb-4 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* ━━━ FINAL CTA ━━━ */}
        <section className="py-24 sm:py-36 relative border-t border-white/[0.04] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-500/[0.06] blur-[150px]" />
          </div>
          <div className="w-[92vw] max-w-[700px] mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/15 flex items-center justify-center mx-auto mb-6">
                <Tv className="h-7 w-7 text-red-400" />
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-5">
                Stop pausing.
                <br />
                <span className="text-netflix">Start asking.</span>
              </h2>
              <p className="text-zinc-500 max-w-md mx-auto mb-10 text-base leading-relaxed">
                Free. Open source. No account needed. Just point, ask, and know.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/watch">
                  <Button size="lg" className="gap-2 bg-red-500 hover:bg-red-600 text-white border-0 px-10 h-13 text-sm font-semibold glow">
                    <Play className="h-4 w-4 fill-current" />
                    Launch App
                  </Button>
                </Link>
                <a href="https://github.com/venkata-srinivasan/netflix-and-what-now" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="gap-2 px-8 h-13 text-sm border-zinc-800 text-zinc-400">
                    Star on GitHub
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8">
        <div className="w-[92vw] max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500/70 flex items-center justify-center">
              <Tv className="h-2.5 w-2.5 text-white" />
            </div>
            <span className="font-medium text-zinc-500">Netflix & What Now</span>
          </div>
          <div className="flex items-center gap-4 font-mono">
            <a href="https://github.com/venkata-srinivasan/netflix-and-what-now" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">GitHub</a>
            <span>MIT License</span>
            <span>Gemini + VocalBridge + Next.js</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-abstract.jpg';
import React from 'react';

const TITLES = [
  { text: 'SAP Specialist', color: 'text-primary' },
  { text: 'AI Enterprise Strategist', color: 'text-accent' },
  { text: 'AI Prompt Engineer', color: 'text-blue-500' },
  { text: 'SAP Solution Architect', color: 'text-green-500' },
  { text: 'Business Transformation Specialist', color: 'text-orange-500' },
  { text: 'PreSales Specialist', color: 'text-purple-500' },
  { text: 'Entrepreneur', color: 'text-pink-500' },
];

function useTypewriter(titles, delay = 120) {
  const [index, setIndex] = React.useState(0);
  const [subIndex, setSubIndex] = React.useState(0);
  const [deleting, setDeleting] = React.useState(false);
  const [blink, setBlink] = React.useState(true);

  React.useEffect(() => {
    if (subIndex === titles[index].text.length + 1 && !deleting) {
      setTimeout(() => setDeleting(true), 1000);
      return;
    }
    if (deleting && subIndex === 0) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % titles.length);
      return;
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (deleting ? -1 : 1));
    }, deleting ? delay / 2 : delay);
    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index, titles, delay]);

  React.useEffect(() => {
    const blinkInterval = setInterval(() => setBlink((b) => !b), 500);
    return () => clearInterval(blinkInterval);
  }, []);

  return {
    text: titles[index].text.substring(0, subIndex),
    color: titles[index].color,
    blink,
  };
}
function Hero() {
  const handleViewWork = () => {
    window.location.href = '/myExperience';
  };
  const handleRequestResume = () => {
    window.location.href = '/getinTouch';
  };
  const typewriter = useTypewriter(TITLES, 80);
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-background">
      <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-5"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight h-20 mb-2 mt-2">
                <span className={typewriter.color}>{typewriter.text}</span>
                <span className={typewriter.blink ? 'opacity-100' : 'opacity-0'}>|</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
                Experienced SAP professional helping businesses optimize their processes 
                and sharing insights through technical blogs and consulting expertise.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group font-semibold text-base" onClick={handleViewWork}>
                View My Work
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" className="group font-semibold text-base" onClick={handleRequestResume}>
                Request Resume
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">22+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">35+</div>
                <div className="text-sm text-muted-foreground">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">6+</div>
                <div className="text-sm text-muted-foreground">Global Rollouts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">40+</div>
                <div className="text-sm text-muted-foreground">Satisfied Clients</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-strong">
              <img 
                src={heroImage} 
                alt="Abstract digital art representing modern SAP consulting" 
                className="w-full h-[500px] object-cover transition-all duration-700 hover:scale-105"
                style={{ filter: 'blur(1px) brightness(0.95)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-accent/10 to-background opacity-30 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

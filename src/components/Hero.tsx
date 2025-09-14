import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-abstract.jpg';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroAbstract from '@/assets/hero-abstract.jpg';
import heroConsultant from '@/assets/hero-consultant.jpg';
import heroAIDoodle1 from '@/assets/hero-ai-doodle-1.jpg';
import heroAIDoodle2 from '@/assets/hero-ai-doodle-2.jpg';
import heroAIDoodle3 from '@/assets/hero-ai-doodle-3.jpg';
import profileImg from '@/assets/profile.jpg';

const TITLES = [
  { text: 'SAP Specialist', color: 'text-primary' },
  { text: 'AI Prompt Engineer', color: 'text-blue-500' },
  { text: 'PreSales Specialist', color: 'text-purple-500' },
  { text: 'Entrepreneur', color: 'text-pink-500' },
  { text: 'SAP Architect', color: 'text-green-500' },
  { text: 'AI/ML Leader', color: 'text-accent' },
  { text: 'AI Pioneer', color: 'text-orange-500' },
  { text: 'AI Visionary', color: 'text-blue-400' },
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
  const navigate = useNavigate();
  const handleViewWork = () => {
    navigate('/myExperience');
  };
  const handleRequestResume = () => {
    navigate('/getinTouch');
  };
  const typewriter = useTypewriter(TITLES, 80);
    // Animated shimmer lines, multi-colored dust particles, and network/octagon connection lines
    // No images, just effects

  // (Old carousel code removed; now handled by offsetAI and offsetSAP above)

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated shimmer lines and dust particles background */}
      <div className="absolute inset-0 w-full h-full z-0" style={{ pointerEvents: 'none' }}>
        {/* Large profile image as background, under shimmer/dust/network effects */}
        <div className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-center z-0 pointer-events-none">
          <img src={profileImg} alt="Profile" className="w-[480px] h-[640px] object-cover rounded-3xl opacity-30" style={{background: 'transparent'}} />
          {/* Transparent overlay above profile image */}
          <div className="absolute inset-0 w-full h-full rounded-3xl pointer-events-none" style={{background: 'linear-gradient(120deg, #fff0 0%, #60a5fa22 60%, #fff0 100%)', opacity: 0.5}}></div>
        </div>
        {/* Symmetrical shimmer lines (vertical grid) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 h-full w-0.5 opacity-20"
              style={{
                left: `${(i + 1) * 7}%`,
                background: `linear-gradient(180deg, #60a5fa 0%, #fff3 50%, #818cf8 100%)`,
                animation: `shimmerLine 4s linear infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
        {/* Symmetrical grid dust/dots */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, row) => (
            [...Array(10)].map((_, col) => {
              const colors = ['#60a5fa', '#a78bfa', '#fbbf24', '#38bdf8', '#818cf8', '#f472b6', '#f87171'];
              const color = colors[(row * 10 + col) % colors.length];
              return (
                <div
                  key={`dot-${row}-${col}`}
                  className="absolute rounded-full opacity-30"
                  style={{
                    background: color,
                    width: '4px',
                    height: '4px',
                    top: `${10 + row * 13}%`,
                    left: `${5 + col * 9}%`,
                    animation: `dotPulse 3s ease-in-out infinite`,
                    animationDelay: `${(row * 10 + col) * 0.5}s`,
                  }}
                />
              );
            })
          ))}
        </div>
        {/* Network/octagon connection lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex:1}}>
          <g stroke="#38bdf8" strokeWidth="2" opacity="0.18">
            <polygon points="120,80 200,40 280,80 280,160 200,200 120,160" fill="none" />
            <polygon points="320,180 400,140 480,180 480,260 400,300 320,260" fill="none" />
            <polygon points="520,100 600,60 680,100 680,180 600,220 520,180" fill="none" />
            <line x1="200" y1="40" x2="400" y2="140" />
            <line x1="280" y1="80" x2="480" y2="180" />
            <line x1="200" y1="200" x2="400" y2="300" />
            <line x1="120" y1="160" x2="320" y2="260" />
            <line x1="400" y1="140" x2="600" y2="60" />
            <line x1="480" y1="180" x2="680" y2="100" />
          </g>
        </svg>
        {/* Overlay for text readability */}
        <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none" style={{width: '100vw'}}></div>
        {/* Add shimmer keyframes */}
        <style>{`
          @keyframes shimmerLine {
            0% { opacity: 0.1; }
            50% { opacity: 0.5; }
            100% { opacity: 0.1; }
          }
          @keyframes dotPulse {
            0% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.5); opacity: 0.6; }
            100% { transform: scale(1); opacity: 0.3; }
          }
        `}</style>
      </div>
      {/* Content above carousels, always readable */}
      <div className="absolute left-0 top-0 h-full w-[55vw] flex flex-col justify-center z-10 px-8">
        <div className="max-w-xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            <span
              className={typewriter.color}
              style={{
                display: 'inline-block',
                minHeight: '1.2em',
                maxWidth: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                verticalAlign: 'top',
              }}
            >
              {typewriter.text}
            </span>
            <span className={typewriter.blink ? 'opacity-100' : 'opacity-0'}>|</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-8">
            Experienced SAP professional helping businesses optimize their processes and sharing insights through technical blogs and consulting expertise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button size="lg" className="group font-semibold text-base" onClick={handleViewWork}>
              View My Work
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" className="group font-semibold text-base" onClick={handleRequestResume}>
              Request Resume
            </Button>
          </div>
          <div className="flex items-center space-x-8 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">22+</div>
              <div className="text-sm text-white/70">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">35+</div>
              <div className="text-sm text-white/70">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">6+</div>
              <div className="text-sm text-white/70">Global Rollouts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">40+</div>
              <div className="text-sm text-white/70">Satisfied Clients</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

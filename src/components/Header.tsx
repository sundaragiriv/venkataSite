import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Linkedin, Mail } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/', hash: '#aboutMe', label: 'AboutMe' },
    { to: '/myExperience', label: 'myExperience' },
    { to: '/techhBlogs', label: 'techhBlogs' },
    { to: '/getinTouch', label: 'getinTouch' },
  ];

  const navigate = useNavigate();

  // Smooth scroll for section links
  const handleNavClick = (item) => {
    if (item.to === '/' && item.hash) {
      navigate('/');
      setTimeout(() => {
        const el = document.querySelector(item.hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (item.to === '/') {
      navigate('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-4 cursor-pointer" onClick={() => handleNavClick({ to: '/' }) }>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Venkata</h1>
            <a href="https://www.linkedin.com/in/sundaragiri" target="_blank" rel="noopener noreferrer" className="ml-4 text-muted-foreground hover:text-primary">
              <Linkedin className="h-6 w-6" />
            </a>
            <a href="mailto:venkatagirivasan@gmail.com" className="text-muted-foreground hover:text-primary">
              <Mail className="h-6 w-6" />
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                item.hash ? (
                  <span
                    key={item.label}
                    className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
                    onClick={() => handleNavClick(item)}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t">
              {navItems.map((item) => (
                item.hash ? (
                  <span
                    key={item.label}
                    className="text-foreground hover:text-primary block px-3 py-2 text-base font-medium transition-colors cursor-pointer"
                    onClick={() => { handleNavClick(item); setIsMenuOpen(false); }}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="text-foreground hover:text-primary block px-3 py-2 text-base font-medium transition-colors cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
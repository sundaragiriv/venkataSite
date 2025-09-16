import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Linkedin, Mail } from 'lucide-react';
import { AtSign, Send } from 'lucide-react';
// Official LinkedIn SVG
const LinkedInSVG = () => (
  <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="6" fill="#0A66C2"/>
    <path d="M12.36 13.64H8.91V23.09H12.36V13.64ZM10.63 12.18C9.51 12.18 8.64 11.31 8.64 10.19C8.64 9.07 9.51 8.2 10.63 8.2C11.75 8.2 12.62 9.07 12.62 10.19C12.62 11.31 11.75 12.18 10.63 12.18ZM23.09 17.36C23.09 15.09 21.47 13.64 19.47 13.64C18.36 13.64 17.64 14.27 17.36 14.73V13.64H13.91V23.09H17.36V18.09C17.36 17.09 18.09 16.36 19.09 16.36C20.09 16.36 20.36 17.09 20.36 18.09V23.09H23.09V17.36Z" fill="white"/>
  </svg>
);
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoImg from '@/assets/logo1.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/', hash: '#aboutMe', label: 'About Me' },
    { to: '/myExperience', label: 'My Experience' },
    { to: '/techBlogs', label: 'Tech Blogs' },
    { to: '/getinTouch', label: 'Get in Touch' },
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
    } else if (item.to === '/myExperience') {
      navigate('/myExperience');
      setTimeout(() => {
        const el = document.getElementById('professional-summary');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      navigate(item.to);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 w-full">
          <div className="flex-shrink-0 flex items-center gap-4 cursor-pointer" onClick={() => handleNavClick({ to: '/' }) }>
            <img src={logoImg} alt="Site Logo" className="h-14 w-14 rounded-full shadow-md mr-2 bg-white" />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
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
              <a href="https://www.linkedin.com/in/sundaragiri" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <LinkedInSVG />
              </a>
              <a href="mailto:venkatagirivasan@gmail.com" className="text-muted-foreground hover:text-primary">
                <AtSign className="h-5 w-5" />
              </a>
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
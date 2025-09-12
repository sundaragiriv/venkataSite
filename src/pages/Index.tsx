import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AboutMe from '@/components/About';
import MyExperience from '@/components/Experience';
import Blog from '@/components/Blog';
import GetInTouch from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
  <AboutMe />
  <MyExperience />
  <Blog />
  <GetInTouch />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

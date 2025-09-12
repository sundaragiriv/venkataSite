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
  <div>
    <MyExperience />
    <div className="flex justify-end mt-4 mb-12">
      <a href="/myExperience">
        <button className="px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary/80 transition">View Full Experience</button>
      </a>
    </div>
  </div>
  <Blog />
  <div>
    <GetInTouch />
    <div className="flex justify-end mt-4 mb-12">
      <a href="/getinTouch">
        <button className="px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary/80 transition">Contact Me</button>
      </a>
    </div>
  </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;

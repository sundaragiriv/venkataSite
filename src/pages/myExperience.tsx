import React from 'react';
import Header from '@/components/Header';
import Experience from '@/components/Experience';

const MyExperiencePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Experience fullPage />
        </section>
      </main>
    </div>
  );
};

export default MyExperiencePage;

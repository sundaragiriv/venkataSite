import React from 'react';
import Header from '@/components/Header';
import Experience from '@/components/Experience';

const MyExperiencePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">Professional Experience</h1>
          <Experience fullPage />
        </section>
      </main>
    </div>
  );
};

export default MyExperiencePage;

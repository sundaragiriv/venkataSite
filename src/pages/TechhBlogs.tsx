import React from 'react';
import Blog from '@/components/Blog';

const TechhBlogs = () => {
  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">Tech Blogs</h1>
        <Blog fullPage />
      </section>
    </main>
  );
};

export default TechhBlogs;

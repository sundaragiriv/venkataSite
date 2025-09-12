import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface BlogProps {
  fullPage?: boolean;
}

const Blog: React.FC<BlogProps> = ({ fullPage = false }) => {
  const blogPosts = [
    {
      title: 'SAP S/4HANA Migration: Best Practices and Pitfalls to Avoid',
      excerpt: 'A comprehensive guide to successful S/4HANA migration with real-world examples and lessons learned from enterprise implementations.',
      category: 'Migration',
      readTime: '8 min read',
      date: 'Dec 15, 2024',
      tags: ['S/4HANA', 'Migration', 'Best Practices']
    },
    {
      title: 'Building Custom Fiori Apps: From Concept to Deployment',
      excerpt: 'Step-by-step tutorial on creating custom Fiori applications using UI5 and SAP BTP, including performance optimization tips.',
      category: 'Development',
      readTime: '12 min read',
      date: 'Dec 10, 2024',
      tags: ['Fiori', 'UI5', 'Development']
    },
    {
      title: 'SAP Integration Patterns: Choosing the Right Approach',
      excerpt: 'Deep dive into various SAP integration patterns, when to use each approach, and implementation considerations.',
      category: 'Integration',
      readTime: '10 min read',
      date: 'Dec 5, 2024',
      tags: ['Integration', 'API', 'Architecture']
    },
    {
      title: 'ABAP Performance Optimization: Advanced Techniques',
      excerpt: 'Advanced ABAP coding techniques and performance optimization strategies for large-scale enterprise applications.',
      category: 'Performance',
      readTime: '15 min read',
      date: 'Nov 28, 2024',
      tags: ['ABAP', 'Performance', 'Optimization']
    },
    {
      title: 'SAP BTP: Cloud-Native Development Strategies',
      excerpt: 'Exploring cloud-native development approaches on SAP Business Technology Platform with practical examples.',
      category: 'Cloud',
      readTime: '9 min read',
      date: 'Nov 20, 2024',
      tags: ['BTP', 'Cloud', 'Development']
    },
    {
      title: 'Change Management in SAP Projects: A Consultant\'s Guide',
      excerpt: 'Strategies for effective change management during SAP implementations, focusing on user adoption and training.',
      category: 'Management',
      readTime: '7 min read',
      date: 'Nov 15, 2024',
      tags: ['Change Management', 'Training', 'Implementation']
    }
  ];

  if (fullPage) {
    // 2-column layout: left = blog detail, right = other blogs
    const [selected, setSelected] = React.useState(0);
    return (
      <section id="blog" className="py-10 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Blog detail */}
            <div className="lg:col-span-2">
              <Card className="p-8 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {blogPosts[selected].category}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {blogPosts[selected].readTime}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {blogPosts[selected].title}
                </h2>
                <div className="flex flex-wrap gap-1 mb-4">
                  {blogPosts[selected].tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center text-xs text-muted-foreground mb-6">
                  <Calendar className="h-3 w-3 mr-1" />
                  {blogPosts[selected].date}
                </div>
                <p className="text-base text-muted-foreground mb-6">
                  {blogPosts[selected].excerpt}
                </p>
                <Button variant="outline" size="lg">
                  Read Full Article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            </div>
            {/* Right: Other blogs */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Other Blogs</h3>
                {blogPosts.map((post, idx) => (
                  <Card
                    key={idx}
                    className={`p-4 cursor-pointer border ${selected === idx ? 'border-primary' : ''}`}
                    onClick={() => setSelected(idx)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                    <h4 className="text-base font-semibold text-foreground">
                      {post.title}
                    </h4>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  // Default: grid view for homepage
  const displayedBlogs = blogPosts.slice(0, 3);
  return (
    <section id="blog" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Knowledge Sharing Blog
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Sharing insights, best practices, and technical deep-dives from my SAP consulting experience 
            to help the community learn and grow.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayedBlogs.map((post, index) => (
            <Card key={index} className="p-6 hover:shadow-medium transition-all duration-300 group cursor-pointer">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {post.readTime}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {post.date}
                  </div>
                  <Button variant="ghost" size="sm" className="group/btn">
                    Read More
                    <ArrowRight className="ml-1 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="flex justify-end">
          <a href="/techhBlogs">
            <Button variant="outline" size="lg">
              View All Tech Blogs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Blog;
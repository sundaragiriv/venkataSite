import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const Blog = () => {
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
          {blogPosts.map((post, index) => (
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

        <div className="text-center">
          <Button variant="outline" size="lg">
            View All Articles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Blog;
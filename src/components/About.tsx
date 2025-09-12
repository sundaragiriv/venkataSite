import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Database, Users, Zap } from 'lucide-react';

const About = () => {
  const skills = [
    'SAP ERP', 'SAP S/4HANA', 'SAP ABAP', 'SAP Fiori', 'SAP CDS',
    'SAP BTP', 'SAP Integration', 'Business Process Optimization',
    'Project Management', 'Technical Architecture'
  ];

  const services = [
    {
      icon: <Code className="h-6 w-6" />,
      title: 'Custom Development',
      description: 'ABAP development, Fiori apps, and custom solutions tailored to your business needs.'
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: 'System Integration',
      description: 'Seamless integration between SAP systems and third-party applications.'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Process Optimization',
      description: 'Analyze and optimize business processes for maximum efficiency and ROI.'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Performance Tuning',
      description: 'Optimize system performance and ensure smooth operations at scale.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            About Me
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            I'm a passionate SAP consultant with expertise in enterprise solutions and a mission 
            to share knowledge through technical blogs and community engagement.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground">My Expertise</h3>
            <p className="text-muted-foreground">
              With over 5 years of experience in SAP consulting, I specialize in end-to-end 
              implementations, system integrations, and business process optimization. My focus 
              is on delivering practical solutions that drive real business value.
            </p>
            <p className="text-muted-foreground">
              Beyond consulting, I'm passionate about knowledge sharing through technical blogs, 
              helping fellow developers and businesses understand complex SAP concepts and 
              best practices.
            </p>
            
            <div className="space-y-3">
              <h4 className="text-lg font-medium text-foreground">Core Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="p-6 hover:shadow-medium transition-shadow">
                <div className="text-primary mb-3">
                  {service.icon}
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  {service.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';

const Experience = () => {
  const experiences = [
    {
      title: 'Senior SAP Consultant',
      company: 'TechCorp Solutions',
      location: 'New York, NY',
      period: '2022 - Present',
      description: 'Leading SAP S/4HANA implementations and digital transformation projects for Fortune 500 clients.',
      achievements: [
        'Led 3 successful S/4HANA migrations',
        'Reduced system downtime by 40%',
        'Mentored team of 5 junior consultants'
      ],
      technologies: ['SAP S/4HANA', 'Fiori', 'BTP', 'ABAP']
    },
    {
      title: 'SAP Developer',
      company: 'Global Systems Inc.',
      location: 'Chicago, IL',
      period: '2020 - 2022',
      description: 'Developed custom SAP solutions and integrated third-party systems with SAP ERP.',
      achievements: [
        'Built 15+ custom Fiori applications',
        'Integrated SAP with Salesforce CRM',
        'Improved data processing speed by 60%'
      ],
      technologies: ['ABAP', 'Fiori', 'SAP PI/PO', 'JavaScript']
    },
    {
      title: 'Junior SAP Consultant',
      company: 'Business Solutions Ltd.',
      location: 'Boston, MA',
      period: '2019 - 2020',
      description: 'Started career in SAP consulting, focusing on functional modules and user training.',
      achievements: [
        'Completed SAP certification',
        'Trained 50+ end users',
        'Supported 5 go-live projects'
      ],
      technologies: ['SAP ECC', 'SAP MM', 'SAP SD', 'SAP FI']
    }
  ];

  return (
    <section id="experience" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Professional Experience
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            My journey in SAP consulting, from junior developer to senior consultant, 
            with a track record of successful implementations and innovations.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <Card key={index} className="p-8 hover:shadow-medium transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {exp.title}
                    </h3>
                    <div className="text-lg text-primary font-medium mb-2">
                      {exp.company}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{exp.period}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{exp.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">
                  {exp.description}
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Key Achievements</h4>
                    <ul className="space-y-1">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start">
                          <span className="text-primary mr-2">•</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
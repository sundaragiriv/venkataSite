import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AboutMe = () => {
  const skills = [
    'SAP S/4HANA', 'SAP SD', 'SAP MM', 'SAP PS', 'Asset Management', 'SAP Integration',
    'SAP Sales & Service V2', 'SAP C4C Sales & Service', 'SAP Commerce Cloud', 'SAP CDC', 'SAP CDP', 'Emarsys', 'Qualtrics',
    'SAP FSM', 'SAP IoT', 'SAP BRIM', 'SAP CPQ', 'SAP SOM',
    'SAP Integration Suite (CPI, BTP)', 'IS-U',
    'HTML', 'CSS', 'JavaScript', 'jQuery', 'JSON', 'XML', 'Java', 'JSP', 'Spring MVC', 'Python (basic)',
    'GitHub', 'Bitbucket', 'Jenkins', 'JIRA', 'Dynatrace', 'Postman', 'ARC', 'PuTTY',
    'AI/ML: Joule, SAP CX AI Toolkit, SAP SAC, Smart Insights, ChatBots, Generative AI'
  ];

  const services = [
    {
      icon: <span role="img" aria-label="architecture">🏗️</span>,
      title: 'SAP Architecture & Leadership',
      description: '23+ years leading global SAP implementations, transformations, and migrations.'
    },
    {
      icon: <span role="img" aria-label="solutions">🛠️</span>,
      title: 'End-to-End SAP Solutions',
      description: 'Expert in SAP CX, S/4HANA, FSM, C4C, Commerce Cloud, CDC, CDP, Emarsys, Qualtrics.'
    },
    {
      icon: <span role="img" aria-label="ai">🤖</span>,
      title: 'AI/ML in SAP',
      description: 'Applied AI/ML for personalization, analytics, and intelligent automation in SAP landscapes.'
    },
    {
      icon: <span role="img" aria-label="integration">🔗</span>,
      title: 'Integration & Optimization',
      description: 'Architected secure, scalable integrations and optimized business processes for maximum ROI.'
    }
  ];

  return (
    <section id="aboutMe" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex flex-col items-center justify-center mb-2">
            <img src="/assets/profile.jpg" alt="Profile" className="w-32 h-32 rounded-full shadow-lg" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hi, I'm Sundaragiri, a passionate SAP architect and consultant based in <span className="text-primary font-semibold">North Carolina, USA</span>, dedicated to helping businesses transform and thrive. My mission is to deliver innovative, practical SAP solutions while sharing knowledge and empowering others in the tech community.
            </p>
            <p className="text-md text-muted-foreground max-w-2xl mx-auto mt-2">
              I believe in a consultative, partnership-driven approach—listening first, then architecting solutions that drive real business value. My journey spans 23+ years, from hands-on delivery to strategic leadership, always focused on excellence, integrity, and continuous learning.
            </p>
          </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground">My Mission & Values</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Delivering SAP solutions that are innovative, scalable, and tailored to each client.</li>
              <li>Empowering teams and clients through knowledge sharing and mentorship.</li>
              <li>Building long-term partnerships based on trust, transparency, and results.</li>
              <li>Continuous learning and adapting to new technologies and business needs.</li>
            </ul>
            <div className="space-y-3 mt-6">
              <h4 className="text-lg font-medium text-foreground">Core Skills & Certifications</h4>
              <div className="mt-2 text-sm text-muted-foreground">
                <strong>Certifications:</strong> SAP C4C Sales Cloud, SAP C4C Service Cloud, SAP CDC, SAP Commerce Cloud, SAP Marketing Cloud, SAP Qualtrics XM
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                <strong>Education:</strong> MBA (MIS), PG Diploma in AI/ML
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill, idx) => (
                  <Badge variant="secondary" className="mr-1" key={idx}>{skill}</Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="p-6 hover:shadow-medium transition-shadow">
                <div className="text-primary mb-3">{service.icon}</div>
                <h4 className="text-lg font-semibold text-foreground mb-2">{service.title}</h4>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}

export default AboutMe;
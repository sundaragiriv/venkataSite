import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const About = () => {
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
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            About Me
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Accomplished SAP Senior Consultant with 23+ years of leadership, architecting, and hands-on experience across global SAP implementations and transformations. Specialized in SAP Customer Experience (CX) Cloud applications, S/4HANA, and advanced integration solutions. Proven success in delivering complex SAP landscapes under RISE with SAP and GROW with SAP programs, including Greenfield, Brownfield, and Selective Data Transition migrations. Trusted advisor for C-level stakeholders on SAP roadmap strategy, capability alignment, and TCO/ROI optimization.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground">Professional Summary</h3>
            <p className="text-muted-foreground">
              Specialized in SAP CX Cloud, S/4HANA (OTC, SD, MM, Asset Management, Preventive Maintenance, ESM, FSM, Service modules), SAP FSM, C4C, Commerce Cloud, CDC, CDP, Emarsys, Qualtrics, and SAP Integration Suite (CPI, BTP). Extensive experience in architecting and deploying SAP CPI/BTP-based integrations, predictive maintenance, mobile workforce enablement, and AI/ML-driven solutions for customer engagement and analytics.
            </p>
            <p className="text-muted-foreground">
              Certifications: SAP C4C Sales Cloud, SAP C4C Service Cloud, SAP CDC, SAP Commerce Cloud, SAP Marketing Cloud, SAP Qualtrics XM
            </p>
            <p className="text-muted-foreground">
              Education: MBA (Management Information Systems), PG Diploma in Artificial Intelligence and Machine Learning
            </p>
            
            <div className="space-y-3">
              <h4 className="text-lg font-medium text-foreground">Core Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <Badge variant="secondary" className="mr-1" key={idx}>{skill}</Badge>
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
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
  <section id="aboutMe" className="pb-16" style={{ background: 'linear-gradient(90deg, #1a1333 0%, #2a1850 100%)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-2">
          <div className="flex flex-col items-center justify-center mb-0">
            <img src="/assets/profile.jpg" alt="Consultant" className="w-32 h-32 rounded-full shadow-lg mb-2" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hi, I'm Sundaragiri, a passionate SAP architect and consultant based in <span className="text-primary font-semibold">North Carolina, USA</span>, dedicated to helping businesses transform and thrive.
            </p>
          </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <div className="space-y-3 mt-6">
              <h4 className="text-lg font-medium text-foreground mt-6">Certifications</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {['SAP C4C Sales Cloud', 'SAP C4C Service Cloud', 'SAP CDC', 'SAP Commerce Cloud', 'SAP Marketing Cloud', 'SAP Qualtrics XM'].map((cert, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-700 border-none rounded px-2 py-1 text-indigo-200 text-xs font-semibold shadow-sm m-1 min-w-[120px] text-center">
                    {cert}
                  </div>
                ))}
              </div>
              <h4 className="text-lg font-medium text-foreground mt-6">SAP Core Skills</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {[
                  'SAP S/4HANA (Cloud & On-Premise)',
                  'SAP Business Technology Platform (BTP)',
                  'SAP Integration Suite (CPI)',
                  'SAP Build Apps',
                  'SAP Build Process Automation',
                  'SAP Fiori/UI5',
                  'SAP Analytics Cloud (SAC)',
                  'SAP AI Core / AI Launchpad',
                  'SAP Sales & Service Cloud V2',
                  'SAP Customer Data Platform (CDP)',
                  'SAP Emarsys',
                  'SAP Commerce Cloud',
                  'SAP CPQ (Quote 2.0)',
                  'ABAP RAP (RESTful Application Programming)',
                  'SAP Event Mesh'
                ].map((skill, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-700 border-none rounded px-2 py-1 text-indigo-200 text-xs font-semibold shadow-sm m-1 min-w-[180px] text-center">
                    {skill}
                  </div>
                ))}
              </div>
              <h4 className="text-lg font-medium text-foreground mt-6">AI/ML Skills</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {[
                  'Prompt Engineering (ChatGPT, Claude, etc.)',
                  'Generative AI (LLMs, RAG, Fine-tuning)',
                  'Machine Learning (scikit-learn, TensorFlow, PyTorch)',
                  'LangChain & LLM Orchestration',
                  'SAP Joule & SAP CX AI Toolkit',
                  'Vector Databases (FAISS, Pinecone, etc.)',
                  'Responsible AI / AI Ethics',
                  'LLMOps / MLOps',
                  'SAP AI Foundation (on BTP)',
                  'API-based AI Integrations (OpenAI, Cohere, HuggingFace)'
                ].map((ai, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-700 border-none rounded px-2 py-1 text-indigo-200 text-xs font-semibold shadow-sm m-1 min-w-[220px] text-center">
                    {ai}
                  </div>
                ))}
              </div>
              <h4 className="text-lg font-medium text-foreground mt-6">Education</h4>
              <div className="flex gap-2 mt-1">
                <div className="bg-primary/10 border border-primary rounded px-3 py-1 text-primary text-xs font-semibold shadow-sm">MBA (MIS)</div>
                <div className="bg-primary/10 border border-primary rounded px-3 py-1 text-primary text-xs font-semibold shadow-sm">PG Diploma in AI/ML</div>
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
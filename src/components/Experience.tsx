import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Experience = ({ fullPage = false }) => {
  const experiences = [
    {
      title: 'Sr. SAP CX Architect',
      company: 'LB Foster Company',
      location: 'Pittsburgh, PA',
      period: 'June 2024 – Current',
      description: 'Architect/Leadership for e2e sales automation using SAP CPQ, Sales Cloud V2, ECC, BTP, CPI, and integration with S4HANA, INFOR ERP.',
      achievements: [
        'Designed and implemented SAP Sales Cloud V2 and SAP CPQ for dynamic pricing and automated proposal generation',
        'Developed custom CPQ extensions on SAP BTP for real-time validation and margin analysis',
        'Integrated SAP CPQ with S/4HANA for automated order conversion',
        'Orchestrated middleware integration using SAP CPI for real-time data synchronization across multiple ERP instances'
      ],
      technologies: ['SAP Sales Cloud V2', 'SAP CPQ', 'SAP S/4HANA', 'SAP BTP', 'SAP CPI', 'ECC', 'INFOR ERP']
    },
    {
      title: 'Sr. SAP CX Architect',
      company: 'Carlisle Roofing',
      location: 'Remote, NY',
      period: 'Nov 2023 – May 2024',
      description: 'Led SAP Sales Cloud V2, CPQ, FSM & Service Cloud implementations with ECC integration.',
      achievements: [
        'Streamlined lead-to-quote automation with AI-driven product recommendations',
        'Configured SAP Service Cloud V2 for ticket management and service automation',
        'Enabled SAP FSM integration for real-time field service updates and technician scheduling',
        'Utilized SAP CPI for secure API-based integration across SAP CX and ERP applications'
      ],
      technologies: ['SAP Sales Cloud V2', 'SAP CPQ', 'SAP FSM', 'SAP Service Cloud V2', 'ECC', 'SAP CPI']
    },
    {
      title: 'Sr. SAP OTC Lead / Functional Architect',
      company: 'Weyerhaeuser Inc.',
      location: 'Seattle, WA',
      period: 'Nov 2022 – Nov 2023',
      description: 'Project leader for SAP C4C Sales & Service V2 Implementation, S4 HANA, MDG, Qualtrics, CPI, BTP, Fiori UI, and Azure App Pass platform.',
      achievements: [
        'Mentored and led a team of 27 people',
        'Designed and activated complex business scenarios in lumber business',
        'Integrated C4C with S4, rebuilt ATP functions, and transformed sales/service cycles',
        'Delivered blueprints and acted as liaison between project streams and business teams'
      ],
      technologies: ['SAP C4C', 'SAP S/4HANA', 'SAP MDG', 'SAP Qualtrics', 'SAP CPI', 'SAP BTP', 'SAP Fiori', 'Azure']
    },
    {
      title: 'Director - SAP Practice / SAP Solution Specialist',
      company: 'TA Digital Inc.',
      location: 'Remote, NC',
      period: 'Nov 2019 – Nov 2022',
      description: 'SAP Practice Leader for Fortune 500 clients, architecting and delivering complex SAP transformations and cross-cloud solutions.',
      achievements: [
        'Managed P&L ($2M cost / $8M revenue) and multi-client delivery',
        'Architected unified customer experiences across SAP Commerce, CDC, Emarsys, CPQ, FSM, S/4HANA',
        'Built and led teams of 40+ consultants',
        'Delivered strategic roadmaps and GTM enablement for RISE/GROW with SAP'
      ],
      technologies: ['SAP Commerce Cloud', 'SAP CDC', 'SAP Emarsys', 'SAP CPQ', 'SAP FSM', 'SAP S/4HANA', 'SAP BTP', 'SAP C4C']
    },
    {
      title: 'SAP C4C, Commerce & CX Solutions Architect',
      company: 'Carestream Health',
      location: 'Remote, NY',
      period: 'Nov 2018 – Nov 2019',
      description: 'Led architecture and delivery for SAP C4C Sales & Service Cloud, FSM, and Hybris Commerce integration.',
      achievements: [
        'Architected integrated service operations across C4C, FSM, ECC, Contact Center, and Commerce',
        'Delivered adaptive UI/UX and multi-tenant deployments',
        'Enabled C4C Customer Self-Service Portal with MindTouch integration',
        'Configured and extended C4C objects with modern UX paradigms'
      ],
      technologies: ['SAP C4C', 'SAP FSM', 'SAP ECC', 'Hybris Commerce', 'MindTouch', 'SAP CPI', 'HCI']
    },
    {
      title: 'SAP Commerce Solutions Architect',
      company: 'Pearson Education',
      location: 'Remote, NC',
      period: 'Mar 2018 – Nov 2018',
      description: 'Architected SAP Commerce B2B Solution for distributors, wholesalers, and partners.',
      achievements: [
        'Developed requirements, stories, and UX designs for SAP Commerce B2B Accelerator',
        'Configured and integrated API-based solutions with Oracle Cloud and legacy systems',
        'Redesigned B2B Portal to Hybris Commerce on-premises',
        'Delivered custom customer report development and architectural documentation'
      ],
      technologies: ['SAP Commerce', 'Oracle Cloud', 'ECC', 'Hybris', 'MVC', 'JSP', 'Spring']
    },
    {
      title: 'SAP Solutions Architect/ Hybris Technical Architect',
      company: 'Costco Group',
      location: 'Remote, NC',
      period: 'Sept. 2017 – April 2018',
      description: 'Solution and design responsibilities in Hybris Commerce, ECC Order Management, E-Commerce Product/Type Modelling, and integration.',
      achievements: [
        'Architected full-lifecycle implementation of Hybris for B2B/B2C accelerators',
        'Designed multi-language/multi-currency eCommerce website on Hybris',
        'Expert advisory on performance/scalability engineering and deployment strategies',
        'Led continuous integration and agile design concepts'
      ],
      technologies: ['Hybris Commerce', 'ECC', 'AS400', 'VendorNet', 'Spring', 'JMS', 'REST', 'SOA', 'ESB', 'GIT']
    },
    {
      title: 'SAP CX/ Commerce Solution Architect',
      company: 'Electronic Theater Controls',
      location: '',
      period: 'Mar. 2017 – Sept. 2017',
      description: 'Design & configuration of Hybris Commerce, ECC Order Management, B2B Accelerator, Data HUB, and SAP Cockpit Management.',
      achievements: [
        'Managed cross-functional teams for ETC B2B eCommerce projects',
        'Provided technical and solution architectural recommendations',
        'Created training programs and reusable frameworks',
        'Integrated SAP Data Hub for material, price, stock, and customer objects'
      ],
      technologies: ['Hybris Commerce', 'ECC', 'Data Hub', 'Java', 'Spring', 'Solr', 'WCMS']
    },
    {
      title: 'SAP Hybris Architect/ BT Specialist',
      company: 'Lenovo Group',
      location: 'USA',
      period: 'March 2015 – March 2017',
      description: 'Led architecture and implementation of SAP Hybris Commerce, CPQ, and C4C integrated with ECC, CRM, and Salesforce for B2B e-commerce enablement.',
      achievements: [
        'Architected SAP CPQ + Hybris solutions for dynamic product configuration and quoting',
        'Delivered C4C functionality and tenant configuration',
        'Defined omni-channel product modeling and CMS strategies',
        'Led agile-based delivery and mentored developers'
      ],
      technologies: ['Hybris Commerce', 'SAP CPQ', 'SAP C4C', 'ECC', 'CRM', 'Salesforce', 'AEM', 'PI/PO']
    },
    {
      title: 'Hybris Technical/ Solution Architect',
      company: 'First Energy Corp (IS-U)',
      location: '',
      period: 'May 2014 – March 2015',
      description: 'Led end-to-end implementation of SAP C4C as part of Hybris Suite rollout for deregulated utility business.',
      achievements: [
        'Architected E2E customer service processes and workflow automation',
        'Designed real-time and batch data integrations between C4C and ECC',
        'Enabled agents with OpenText Extended ECM capabilities',
        'Established multi-channel communication hub within C4C'
      ],
      technologies: ['SAP C4C', 'Hybris Suite', 'ECC', 'OpenText ECM', 'PI/PO', 'OData', 'IDoc']
    }
  ];

  const displayedExperiences = fullPage ? experiences : experiences.slice(0, 2);
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

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayedExperiences.map((exp, index) => (
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
                        <span role="img" aria-label="calendar">📅</span>
                        <span className="text-sm">{exp.period}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span role="img" aria-label="location">📍</span>
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
                      {exp.technologies.map((tech, idx) => (
                        <Badge variant="outline" className="text-xs mr-1" key={idx}>{tech}</Badge>
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
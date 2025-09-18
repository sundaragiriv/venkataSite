import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  type?: 'website' | 'article';
  image?: string;
  url?: string;
  publishedTime?: string;
  author?: string;
}

export default function SEO({
  title = 'Venkata Sundaragiri - SAP CX Architect | SAP AI Expert | Joule Integration Specialist',
  description = 'Expert SAP CX Architect specializing in Sales Cloud V2, Service Cloud V2, SAP AI Toolkit, Joule integration, S/4HANA, BTP, and enterprise AI solutions. 22+ years Fortune 500 experience.',
  type = 'website',
  image = '/assets/og-image.jpg',
  url = 'https://sundaragiriv.github.io/venkataSite',
  publishedTime,
  author = 'Venkata Sundaragiri'
}: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      
      {/* Additional SEO */}
      <meta name="keywords" content="SAP CX, SAP AI, SAP Joule, Sales Cloud V2, Service Cloud V2, SAP CX AI Toolkit, SAP S/4HANA, BTP Integration, SAP Architect, SAP Consultant, CPQ, FSM, CPI, CDC, CDP, Enterprise AI, GenAI SAP, SAP Performance, Vedic Leadership" />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <link rel="canonical" href={url} />
      
      {/* Schema.org structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Venkata Sundaragiri",
          "jobTitle": "SAP CX Architect & AI Integration Specialist",
          "description": "Expert SAP CX Architect with 22+ years experience in Sales Cloud V2, Service Cloud V2, SAP AI Toolkit, Joule integration, and enterprise solutions",
          "url": url,
          "sameAs": [
            "https://linkedin.com/in/venkata-sundaragiri"
          ],
          "knowsAbout": [
            "SAP CX", "SAP AI", "SAP Joule", "Sales Cloud V2", "Service Cloud V2", 
            "SAP CX AI Toolkit", "SAP S/4HANA", "BTP Integration", "Enterprise AI",
            "CPQ", "FSM", "CPI", "CDC", "CDP", "Vedic Leadership"
          ],
          "hasOccupation": {
            "@type": "Occupation",
            "name": "SAP Solution Architect",
            "occupationLocation": {
              "@type": "Country",
              "name": "United States"
            },
            "skills": "SAP CX, SAP AI, Joule Integration, Enterprise Architecture"
          }
        })}
      </script>
    </Helmet>
  );
}
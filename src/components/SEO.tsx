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
  title = 'Venkata - SAP CX Architect & AI Pioneer | Enterprise Solutions Expert',
  description = 'Leading SAP CX architect with 22+ years experience. Specializing in Sales/Service Cloud V2, AI integration, BTP, and Vedic wisdom for high-performing teams. Proven track record with Fortune 500 clients.',
  type = 'website',
  image = '/assets/og-image.jpg',
  url = 'https://sundaragiriv.github.io/venkataSite',
  publishedTime,
  author = 'Venkata Girivasan'
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
      <meta name="keywords" content="SAP CX, SAP Architect, Sales Cloud V2, Service Cloud V2, SAP AI, BTP Integration, SAP Consultant, Enterprise Architecture, Vedic Wisdom, SAP Performance" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
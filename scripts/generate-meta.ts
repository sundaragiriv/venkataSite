import { writeFileSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Generate sitemap.xml
const routes = [
  '/',
  '/about',
  '/configure', 
  '/signals',
  '/veda',
  '/ai'
];

const baseUrl = 'https://sundaragiriv.github.io/venkataSite';

// Add signal posts
try {
  const signalFiles = readdirSync('content/signals').filter(f => f.endsWith('.mdx'));
  signalFiles.forEach(file => {
    const slug = file.replace('.mdx', '');
    routes.push(`/signals/${slug}`);
  });
} catch (e) {
  console.log('No signals directory found');
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

writeFileSync('public/sitemap.xml', sitemap);

// Generate RSS feed
let rssItems: any[] = [];
try {
  const signalFiles = readdirSync('content/signals').filter(f => f.endsWith('.mdx'));
  rssItems = signalFiles.map(file => {
    const content = readFileSync(join('content/signals', file), 'utf-8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) return null;
    
    const frontmatter: any = {};
    frontmatterMatch[1].split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length) {
        frontmatter[key.trim()] = valueParts.join(':').trim().replace(/"/g, '');
      }
    });
    
    const slug = file.replace('.mdx', '');
    return {
      title: frontmatter.title || slug,
      link: `${baseUrl}/signals/${slug}`,
      description: frontmatter.summary || '',
      pubDate: new Date(frontmatter.date || Date.now()).toUTCString()
    };
  }).filter(Boolean);
} catch (e) {
  console.log('No signals found for RSS');
}

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Venkata's Signals</title>
    <link>${baseUrl}/signals</link>
    <description>Tech, AI-in-SAP, and Vedic wisdom insights</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${rssItems.map(item => `    <item>
      <title>${item?.title}</title>
      <link>${item?.link}</link>
      <description>${item?.description}</description>
      <pubDate>${item?.pubDate}</pubDate>
      <guid>${item?.link}</guid>
    </item>`).join('\n')}
  </channel>
</rss>`;

writeFileSync('public/rss.xml', rss);

console.log('Generated sitemap.xml and rss.xml');
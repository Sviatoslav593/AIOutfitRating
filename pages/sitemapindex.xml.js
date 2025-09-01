function generateSitemapIndex() {
  const currentDate = new Date().toISOString();
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.outfitrater.online/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;
}

function SitemapIndex() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // Generate the XML sitemap index
  const sitemapIndex = generateSitemapIndex();

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400, must-revalidate");
  res.setHeader("X-Robots-Tag", "noindex");

  // Send the XML to the browser
  res.write(sitemapIndex);
  res.end();

  return {
    props: {},
  };
}

export default SitemapIndex;

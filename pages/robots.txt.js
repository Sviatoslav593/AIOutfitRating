function generateRobotsTxt() {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: https://www.outfitrater.online/sitemap.xml

# Disallow caching and build files
Disallow: /_next/
Disallow: /api/
Disallow: /.next/

# Allow important static files
Allow: /favicon.ico
Allow: /apple-touch-icon-180.svg
Allow: /site.webmanifest`;
}

function RobotsTxt() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // Generate the robots.txt
  const robotsTxt = generateRobotsTxt();

  res.setHeader("Content-Type", "text/plain");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate"
  );

  // Send the robots.txt to the browser
  res.write(robotsTxt);
  res.end();

  return {
    props: {},
  };
}

export default RobotsTxt;

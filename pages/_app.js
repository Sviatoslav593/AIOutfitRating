import "../styles/globals.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon-180.svg" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Meta tags */}
        <meta name="theme-color" content="#FF0050" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* SEO Meta Tags */}
        <title>
          AI Outfit Rater - Get Professional Style Analysis in Seconds
        </title>
        <meta
          name="description"
          content="Upload your outfit photo and get instant AI-powered style analysis! Professional fashion rating, style metrics, and personalized feedback. Free outfit evaluation with TikTok-style results."
        />
        <meta
          name="keywords"
          content="AI outfit rater, style analysis, fashion AI, outfit rating, style checker, fashion feedback, outfit analyzer, style metrics, fashion evaluation, AI fashion"
        />
        <meta name="author" content="AI Outfit Rater" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />

        {/* Google Search Console Verification - Replace with your actual code */}
        <meta
          name="google-site-verification"
          content="YOUR_GOOGLE_VERIFICATION_CODE_HERE"
        />

        {/* Bing Webmaster Tools Verification - Replace with your actual code */}
        <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE_HERE" />

        {/* Google AdSense */}
        <meta name="google-adsense-account" content="ca-pub-4616343080553569" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://www.outfitrater.online" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="AI Outfit Rater - Professional Style Analysis"
        />
        <meta property="og:site_name" content="AI Outfit Rater" />
        <meta
          property="og:description"
          content="Get instant AI-powered fashion analysis! Upload your outfit photo for professional style rating, detailed metrics, and personalized feedback. Free and fun TikTok-style results!"
        />
        <meta property="og:url" content="https://www.outfitrater.online" />
        <meta
          property="og:image"
          content="https://www.outfitrater.online/favicon.svg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="AI Outfit Rater - Style Analysis Tool"
        />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:site" content="@outfitrater" />
        <meta property="twitter:creator" content="@outfitrater" />
        <meta
          property="twitter:title"
          content="AI Outfit Rater - Professional Style Analysis"
        />
        <meta
          property="twitter:description"
          content="Get instant AI-powered fashion analysis! Upload your outfit photo for professional style rating and detailed metrics. Free TikTok-style results!"
        />
        <meta property="twitter:url" content="https://www.outfitrater.online" />
        <meta
          property="twitter:image"
          content="https://www.outfitrater.online/favicon.svg"
        />
        <meta
          property="twitter:image:alt"
          content="AI Outfit Rater - Style Analysis Tool"
        />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "AI Outfit Rater",
              alternateName: "Outfit Rater",
              description:
                "AI-powered fashion analysis tool that provides instant style ratings, detailed metrics, and personalized feedback for your outfit photos.",
              url: "https://www.outfitrater.online",
              applicationCategory: "Fashion & Style",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              creator: {
                "@type": "Organization",
                name: "AI Outfit Rater",
                url: "https://outfitrater.online",
              },
              keywords:
                "AI outfit rating, style analysis, fashion AI, outfit evaluation, style checker",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "1250",
                bestRating: "5",
                worstRating: "1",
              },
            }),
          }}
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

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
        <title>AI Outfit Rater</title>
        <meta
          name="description"
          content="Upload your outfit and get an AI rating! Get a professional assessment of your style in seconds."
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="AI Outfit Rater" />
        <meta
          property="og:description"
          content="Upload your outfit and get an AI rating! Get a professional assessment of your style in seconds."
        />
        <meta property="og:url" content="https://outfitrater.online" />
        <meta
          property="og:image"
          content="https://outfitrater.online/favicon.svg"
        />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="AI Outfit Rater" />
        <meta
          property="twitter:description"
          content="Upload your outfit and get an AI rating! Get a professional assessment of your style in seconds."
        />
        <meta property="twitter:url" content="https://outfitrater.online" />
        <meta
          property="twitter:image"
          content="https://outfitrater.online/favicon.svg"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

import { ScrollViewStyleReset } from 'expo-router/html';

// Root HTML template used for the web build (Netlify).
export default function Root({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>BEYNATION Portfolio</title>
        <meta
          name="description"
          content="Developer portfolio: projects, skills, services and contact."
        />
        <meta name="theme-color" content="#050B14" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: 'body { background-color: #050B14; }' }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

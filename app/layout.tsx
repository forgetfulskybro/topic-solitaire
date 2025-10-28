import { Inter, JetBrains_Mono } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  description:
    "A strategic card game where you organize cards by matching them to their topics. Think solitaire meets categorization!",
  manifest: "/manifest.json",
  openGraph: {
    title: "Topic Solitaire",
    description:
      "A strategic card game where you organize cards by matching them to their topics. Think solitaire meets categorization!",
    url: "https://topic-solitaire.vercel.app",
    siteName: "Topic Solitaire",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Topic Solitaire - Strategic Card Matching Game",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Topic Solitaire",
    description:
      "A strategic card game where you organize cards by matching them to their topics. Think solitaire meets categorization!",
    images: ["/og-image.svg"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Topic Solitaire",
  },
  icons: {
    icon: [
      { url: "/topicSolitaire.png", sizes: "192x192", type: "image/png" },
      { url: "/topicSolitaire.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/topicSolitaire.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0e8845",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0e8845" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Topic Solitaire" />
        <link rel="apple-touch-icon" href="/topicSolitaire.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable}`}>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }

              let deferredPrompt;
              window.addEventListener('beforeinstallprompt', (e) => {
                console.log('PWA install prompt available');
                e.preventDefault();
                deferredPrompt = e;
              });

              window.addEventListener('appinstalled', (evt) => {
                console.log('PWA was installed');
              });
            `,
          }}
        />
      </body>
    </html>
  );
}

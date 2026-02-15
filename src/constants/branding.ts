/**
 * Logo and brand asset paths for MediSnap AI
 * All sizes are generated from /public/MediSnapLogo.png
 */

export const LOGO_PATHS = {
  // Main logo
  original: '/MediSnapLogo.png',
  
  // Favicons
  favicon16: '/favicon-16x16.png',
  favicon32: '/favicon-32x32.png',
  favicon48: '/favicon-48x48.png',
  faviconIco: '/favicon.ico',
  
  // Apple/iOS
  appleTouchIcon: '/apple-touch-icon.png',
  
  // Android/PWA
  androidChrome192: '/android-chrome-192x192.png',
  androidChrome512: '/android-chrome-512x512.png',
  
  // Microsoft/Windows
  msIcon144: '/ms-icon-144x144.png',
  msIcon310: '/ms-icon-310x310.png',
  
  // Manifest
  webManifest: '/site.webmanifest',
  browserConfig: '/browserconfig.xml',
} as const;

export const BRAND_COLORS = {
  primary: '#2563eb',
  primaryDark: '#1e40af',
  primaryLight: '#3b82f6',
  background: '#ffffff',
} as const;

export const BRAND_NAME = 'MediSnap AI';
export const BRAND_TAGLINE = 'AI-Powered Clinical Intelligence Platform';

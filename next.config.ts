
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
//ADD THIS SECTION FOR FIREBASE STUDIO
devIndicators: {
  position: 'bottom-right', // Or whatever position you prefer
},
// IMPORTANT: Add allowedDevOrigins
// The allowedDevOrigins key was removed as it's unrecognized by the current Next.js version.
// If specific cross-origin issues arise with Firebase Studio, this may need to be revisited
// with an alternative approach.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'docs.google.com', // For document thumbnails if ever applicable
        port: '',
        pathname: '/**',
      },
      { // Added for potential direct image links from Google User Content
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      { // Added for Firebase Storage
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;

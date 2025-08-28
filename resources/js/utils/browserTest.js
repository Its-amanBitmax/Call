/**
 * Browser compatibility test utility
 * Helps diagnose WebRTC and media device issues
 */

import { getBrowserCompatibility } from './mediaDevices';

/**
 * Run comprehensive browser compatibility test
 */
export const runBrowserTest = () => {
  const compatibility = getBrowserCompatibility();
  
  console.log('=== BROWSER COMPATIBILITY TEST ===');
  console.log('User Agent:', navigator.userAgent);
  console.log('Protocol:', window.location.protocol);
  console.log('Hostname:', window.location.hostname);
  console.log('Standard Media Devices API:', compatibility.hasStandardMediaDevices);
  console.log('Legacy getUserMedia:', compatibility.hasLegacyGetUserMedia);
  console.log('HTTPS:', compatibility.isHttps);
  console.log('Localhost:', compatibility.isLocalhost);
  
  // Check for common browser features
  console.log('WebRTC Features:', {
    hasRTCPeerConnection: !!window.RTCPeerConnection,
    hasRTCSessionDescription: !!window.RTCSessionDescription,
    hasRTCIceCandidate: !!window.RTCIceCandidate
  });
  
  // Check for common browser prefixes
  console.log('Browser Prefixes:', {
    webkit: !!navigator.webkitGetUserMedia,
    moz: !!navigator.mozGetUserMedia,
    ms: !!navigator.msGetUserMedia
  });
  
  return compatibility;
};

/**
 * Test media device access with detailed logging
 */
export const testMediaAccess = async () => {
  try {
    console.log('=== MEDIA ACCESS TEST ===');
    
    // Test standard API first
    if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
      console.log('Testing standard getUserMedia API...');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      console.log('Standard API success! Stream:', stream);
      stream.getTracks().forEach(track => track.stop());
      return true;
    }
    
    // Test legacy APIs
    const legacyAPIs = [
      { name: 'navigator.getUserMedia', func: navigator.getUserMedia },
      { name: 'navigator.webkitGetUserMedia', func: navigator.webkitGetUserMedia },
      { name: 'navigator.mozGetUserMedia', func: navigator.mozGetUserMedia },
      { name: 'navigator.msGetUserMedia', func: navigator.msGetUserMedia }
    ];
    
    for (const api of legacyAPIs) {
      if (api.func) {
        console.log(`Testing ${api.name}...`);
        return new Promise((resolve, reject) => {
          api.func.call(navigator, 
            { video: true, audio: true },
            (stream) => {
              console.log(`${api.name} success! Stream:`, stream);
              stream.getTracks().forEach(track => track.stop());
              resolve(true);
            },
            (error) => {
              console.log(`${api.name} failed:`, error);
              reject(error);
            }
          );
        });
      }
    }
    
    throw new Error('No media access APIs available');
    
  } catch (error) {
    console.error('Media access test failed:', error);
    throw error;
  }
};

/**
 * Check if WebRTC is fundamentally available
 */
export const isWebRTCAvailable = () => {
  return !!(window.RTCPeerConnection || window.webkitRTCPeerConnection);
};

/**
 * Get detailed environment information
 */
export const getEnvironmentInfo = () => {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    cookiesEnabled: navigator.cookieEnabled,
    javaEnabled: navigator.javaEnabled ? navigator.javaEnabled() : false,
    screen: {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth
    },
    window: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    location: {
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      port: window.location.port,
      pathname: window.location.pathname
    }
  };
};

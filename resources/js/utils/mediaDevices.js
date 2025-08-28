/**
 * Media Devices Utility Functions
 * Handles browser compatibility and error handling for WebRTC media devices
 * Works across all major browsers with proper fallbacks
 */

/**
 * Check if the browser supports media devices
 * @returns {boolean} True if media devices are supported
 */
export const isMediaDevicesSupported = () => {
  // Check if we're in a browser environment
  if (typeof navigator === 'undefined' || typeof window === 'undefined') {
    return false;
  }
  
  // Check for various ways media devices might be available
  // Some older browsers might have getUserMedia directly on navigator
  const hasStandardMediaDevices = !!(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function');
  const hasLegacyGetUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  
  return hasStandardMediaDevices || hasLegacyGetUserMedia;
};

/**
 * Check if the page is served over HTTPS (required for getUserMedia in most browsers)
 * @returns {boolean} True if served over HTTPS
 */
export const isHttps = () => {
  return window.location.protocol === 'https:';
};

/**
 * Check if we're running on localhost (where HTTPS is not required)
 * @returns {boolean} True if running on localhost
 */
export const isLocalhost = () => {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

/**
 * Legacy getUserMedia implementation for older browsers
 */
const getLegacyUserMedia = (constraints) => {
  return new Promise((resolve, reject) => {
    const getUserMedia = navigator.getUserMedia || 
                         navigator.webkitGetUserMedia || 
                         navigator.mozGetUserMedia || 
                         navigator.msGetUserMedia;
    
    if (!getUserMedia) {
      reject(new Error('Legacy getUserMedia not available'));
      return;
    }
    
    getUserMedia.call(navigator, constraints, resolve, reject);
  });
};

/**
 * Get user media with comprehensive browser compatibility
 * @param {Object} constraints Media constraints (video, audio)
 * @returns {Promise<MediaStream>} Media stream promise
 */
export const getUserMedia = async (constraints = { video: true, audio: true }) => {
  // First try the standard modern API
  if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      return stream;
    } catch (error) {
      console.warn('Standard getUserMedia failed, trying legacy method:', error);
      // Fall through to legacy method
    }
  }
  
  // Try legacy API for older browsers
  if (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia) {
    try {
      const stream = await getLegacyUserMedia(constraints);
      return stream;
    } catch (error) {
      console.error('Legacy getUserMedia also failed:', error);
      throw this.formatError(error);
    }
  }
  
  // If neither API is available
  throw new Error('WebRTC is not supported in this browser. Please use a modern browser like Chrome, Firefox, Edge, or Safari.');
};

/**
 * Format error messages for better user experience
 */
const formatError = (error) => {
  console.error('Media access error:', error);
  
  if (error.name === 'NotAllowedError') {
    return new Error('Camera/microphone access was denied. Please check your browser permissions and allow access when prompted.');
  } else if (error.name === 'NotFoundError') {
    return new Error('No camera/microphone found. Please check your device connections.');
  } else if (error.name === 'NotReadableError') {
    return new Error('Camera/microphone is already in use by another application.');
  } else if (error.name === 'OverconstrainedError') {
    return new Error('The requested camera/microphone settings cannot be satisfied.');
  } else if (error.message.includes('Permission denied')) {
    return new Error('Permission denied. Please allow camera/microphone access in your browser settings.');
  } else {
    return new Error('Failed to access camera/microphone: ' + error.message);
  }
};

/**
 * Stop all tracks in a media stream
 * @param {MediaStream} stream Media stream to stop
 */
export const stopMediaStream = (stream) => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
};

/**
 * Check if camera access is available
 * @returns {Promise<boolean>} True if camera is available
 */
export const isCameraAvailable = async () => {
  if (!isMediaDevicesSupported()) return false;
  
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some(device => device.kind === 'videoinput');
  } catch (error) {
    console.error('Error enumerating devices:', error);
    return false;
  }
};

/**
 * Check if microphone access is available
 * @returns {Promise<boolean>} True if microphone is available
 */
export const isMicrophoneAvailable = async () => {
  if (!isMediaDevicesSupported()) return false;
  
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some(device => device.kind === 'audioinput');
  } catch (error) {
    console.error('Error enumerating devices:', error);
    return false;
  }
};

/**
 * Get browser compatibility information
 * @returns {Object} Browser compatibility info
 */
export const getBrowserCompatibility = () => {
  return {
    hasStandardMediaDevices: !!(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function'),
    hasLegacyGetUserMedia: !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia),
    isHttps: isHttps(),
    isLocalhost: isLocalhost(),
    userAgent: navigator.userAgent,
    protocol: window.location.protocol
  };
};

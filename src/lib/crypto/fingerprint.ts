/**
 * Browser fingerprinting utilities for fraud prevention
 * This module will be used client-side to generate a unique fingerprint
 * based on browser characteristics
 */

/**
 * Generate a browser fingerprint based on available browser data
 * Uses various browser-specific attributes to create a unique identifier
 */
export const generateBrowserFingerprint = async (): Promise<string> => {
  if (typeof window === 'undefined') {
    return '';
  }
  
  try {
    // Collect browser information
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const platform = navigator.platform;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const colorDepth = window.screen.colorDepth;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const touchSupport = 'ontouchstart' in window;
    const cookiesEnabled = navigator.cookieEnabled;
    
    // Canvas fingerprinting - creates a unique hash based on how the browser renders canvas
    const canvasData = await getCanvasFingerprint();
    
    // Audio fingerprinting - browser audio processing characteristics
    const audioData = await getAudioFingerprint();
    
    // WebGL fingerprinting - browser's WebGL implementation details
    const webglData = getWebGLFingerprint();
    
    // Combine all data into a single string
    const fingerprintData = [
      userAgent,
      language,
      platform,
      `${screenWidth}x${screenHeight}`,
      colorDepth,
      timezone,
      touchSupport ? 1 : 0,
      cookiesEnabled ? 1 : 0,
      canvasData,
      audioData,
      webglData,
    ].join('|');
    
    // Create a hash of the data
    return await sha256(fingerprintData);
  } catch (error) {
    console.error('Error generating fingerprint:', error);
    return '';
  }
};

/**
 * Get canvas fingerprint data
 */
const getCanvasFingerprint = async (): Promise<string> => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    // Set canvas dimensions
    canvas.width = 200;
    canvas.height = 50;
    
    // Fill with a gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgb(255,0,0)');
    gradient.addColorStop(0.5, 'rgb(0,255,0)');
    gradient.addColorStop(1, 'rgb(0,0,255)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some text
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText('Anonymous Voting System', 10, 30);
    
    // Add some shapes
    ctx.beginPath();
    ctx.arc(160, 25, 20, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    
    // Get the canvas data and hash it
    return canvas.toDataURL();
  } catch (e) {
    return '';
  }
};

/**
 * Get WebGL fingerprint data
 */
const getWebGLFingerprint = (): string => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return '';
    
    // Get WebGL renderer and vendor information
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return '';
    
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    
    return `${vendor}|${renderer}`;
  } catch (e) {
    return '';
  }
};

/**
 * Get audio fingerprint data
 */
const getAudioFingerprint = async (): Promise<string> => {
  try {
    if (typeof window === 'undefined' || !window.AudioContext) {
      return '';
    }
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const oscillator = audioContext.createOscillator();
    const dynamicsCompressor = audioContext.createDynamicsCompressor();
    
    // Set properties of audio nodes
    analyser.fftSize = 256;
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(10000, audioContext.currentTime);
    
    // Connect audio nodes
    oscillator.connect(dynamicsCompressor);
    dynamicsCompressor.connect(analyser);
    analyser.connect(audioContext.destination);
    
    // Start the oscillator
    oscillator.start(0);
    
    // Wait for some processing
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Get frequency data
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);
    
    // Clean up
    oscillator.stop();
    audioContext.close();
    
    // Return first 10 frequency values as a string
    return Array.from(frequencyData.slice(0, 10)).join(',');
  } catch (e) {
    return '';
  }
};

/**
 * Simple SHA-256 hash implementation for client-side
 */
const sha256 = async (message: string): Promise<string> => {
  if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }
  
  // Fallback to simpler hash if Web Crypto API is not available
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}; 
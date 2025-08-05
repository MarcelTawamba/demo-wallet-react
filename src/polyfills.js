// Polyfill for Buffer in browser
import { Buffer } from 'buffer';

// Make Buffer available globally
window.Buffer = Buffer; 
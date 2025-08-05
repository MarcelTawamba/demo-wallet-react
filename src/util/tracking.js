import Amplitude from 'amplitude-js';
import { getEnvVar } from '../utils/env';

let disable = true;
let isInitialized = false;
const apiKey = getEnvVar('VITE_AMPLITUDE_API');

export function enableTracking() {
  disable = false;
}

function initialize() {
  if (disable || !apiKey) return false;

  if (!isInitialized) {
    Amplitude.getInstance().init(apiKey);
    isInitialized = true;
  }

  return true;
}

export function track(event, options) {
  if (!initialize()) return;
  Amplitude.getInstance().logEventWithTimestamp(event, options, Date.now());
}

/**
 * Use to track the steps of a specific flow.
 * FLOW: SECTION > SUBSECTION > SUBSECTION > ... [ACTION]
 *
 * @param {string} flow
 * @param {string} section
 * @param {object} subsections
 * @param {string} action
 * @param {object} options
 */
export function trackFlow(flow, section, subsections = [], action, options) {
  let event = `${flow.toUpperCase()}: ${section.toUpperCase()}`;

  if (subsections)
    event += ` > ${subsections.map(x => x.toUpperCase()).join(' > ')}`;

  event += ` [${action.toUpperCase()}]`;

  track(event, options);
}

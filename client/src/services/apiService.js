/**
 * API Service for EventCraft AI Client
 * Centralizes network communication with the Express backend
 */

/**
 * Checks server health and Gemini configuration status
 * @returns {Promise<Object>} Server status object
 */
export async function fetchServerStatusApi() {
  const response = await fetch('/api/status');
  if (!response.ok) {
    throw new Error(`Server returned HTTP ${response.status}`);
  }
  return response.json();
}

/**
 * Sends event parameters to generate a full 7-section event plan
 * @param {Object} planInput - Validated form data
 * @param {string} [customApiKey] - Optional user-provided Gemini API key
 * @returns {Promise<{ plan: Object, meta: Object }>} Generated plan and metadata
 */
export async function generateEventPlanApi(planInput, customApiKey) {
  const response = await fetch('/api/plan/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...planInput,
      apiKey: customApiKey || undefined
    })
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Failed to generate event plan. Please check inputs.');
  }

  return result;
}

/**
 * Regenerates an isolated section of the event plan
 * @param {string} sectionKey - Name of the section to refresh
 * @param {Object} currentPlan - Active event plan
 * @param {Object} meta - Event metadata
 * @param {string} [customApiKey] - Optional user-provided Gemini API key
 * @returns {Promise<Object>} Refreshed section data
 */
export async function regenerateSectionApi(sectionKey, currentPlan, meta, customApiKey) {
  const response = await fetch('/api/plan/regenerate-section', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      section: sectionKey,
      currentPlan,
      apiKey: customApiKey || undefined,
      ...meta
    })
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || `Failed to regenerate section '${sectionKey}'`);
  }

  return result.data;
}

/**
 * Sends follow-up message to the AI Event Planner assistant
 * @param {string} message - User instruction or inquiry
 * @param {Object} currentPlan - Active event plan
 * @param {Array} chatHistory - Previous message history
 * @param {Object} meta - Event metadata
 * @param {string} [customApiKey] - Optional user-provided Gemini API key
 * @returns {Promise<{ replyMessage: string, updatedPlan?: Object }>}
 */
export async function chatWithPlannerApi(message, currentPlan, chatHistory, meta, customApiKey) {
  const response = await fetch('/api/plan/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      currentPlan,
      chatHistory: (chatHistory || []).slice(-8),
      apiKey: customApiKey || undefined,
      ...meta
    })
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Failed to process chat message');
  }

  return result;
}

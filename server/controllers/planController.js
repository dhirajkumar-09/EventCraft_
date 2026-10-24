import {
  generateEventPlan,
  regenerateSection,
  chatWithPlanner,
  isGeminiConfigured
} from '../services/geminiService.js';

export async function handleGeneratePlan(req, res, next) {
  try {
    const input = req.sanitizedBody;
    const plan = await generateEventPlan(input);
    res.json({
      success: true,
      plan,
      meta: {
        eventType: input.eventType,
        city: input.city,
        totalBudget: input.totalBudget,
        currency: input.currency,
        currencySymbol: input.currencySymbol,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function handleRegenerateSection(req, res, next) {
  try {
    const input = req.sanitizedBody;
    const { section, currentPlan } = input;

    const validSections = [
      'overview',
      'budget',
      'timeline',
      'vendorChecklist',
      'personalizedIdeas',
      'runSheet',
      'backupPlan'
    ];

    if (!validSections.includes(section)) {
      return res.status(400).json({
        error: `Invalid section '${section}'. Must be one of: ${validSections.join(', ')}`
      });
    }

    const updatedSectionData = await regenerateSection(section, currentPlan, input);

    res.json({
      success: true,
      section,
      data: updatedSectionData
    });
  } catch (error) {
    next(error);
  }
}

export async function handleChatPlanner(req, res, next) {
  try {
    const input = req.sanitizedBody;
    const { message, currentPlan } = input;
    const chatHistory = Array.isArray(req.body.chatHistory) ? req.body.chatHistory : [];

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const result = await chatWithPlanner(message, currentPlan, chatHistory, input);

    res.json({
      success: true,
      replyMessage: result.replyMessage,
      updatedPlan: result.updatedPlan
    });
  } catch (error) {
    next(error);
  }
}

export function handleGetStatus(req, res) {
  const apiKeyConfigured = isGeminiConfigured();
  res.json({
    status: 'online',
    appName: 'EventCraft AI',
    model: 'gemini-2.5-flash',
    apiKeyConfigured,
    mode: apiKeyConfigured ? 'live-gemini' : 'smart-planner-engine'
  });
}

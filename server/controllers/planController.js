/**
 * Plan Controller for EventCraft AI
 * Handles API endpoints for plan generation, section regeneration, AI planner chat, and status check.
 */

import { GEMINI_CONFIG, VALID_SECTIONS } from '../config/constants.js';
import {
  chatWithPlanner,
  generateEventPlan,
  isGeminiConfigured,
  regenerateSection
} from '../services/geminiService.js';

/**
 * Handles master event plan generation request
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
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

/**
 * Handles targeted section regeneration request
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function handleRegenerateSection(req, res, next) {
  try {
    const input = req.sanitizedBody;
    const { section, currentPlan } = input;

    if (!VALID_SECTIONS.includes(section)) {
      return res.status(400).json({
        error: `Invalid section '${section}'. Must be one of: ${VALID_SECTIONS.join(', ')}`
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

/**
 * Handles conversational follow-up questions and plan updates
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
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

/**
 * Returns the health, engine status, and AI model info
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 */
export function handleGetStatus(_req, res) {
  const apiKeyConfigured = isGeminiConfigured();
  res.json({
    status: 'online',
    appName: 'EventCraft AI',
    model: GEMINI_CONFIG.CANDIDATE_MODELS[0],
    apiKeyConfigured,
    mode: apiKeyConfigured ? 'live-gemini' : 'smart-planner-engine'
  });
}

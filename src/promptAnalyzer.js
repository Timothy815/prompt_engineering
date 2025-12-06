/**
 * Prompt Analyzer - Core logic for evaluating prompt quality
 * Based on frameworks from Andrew Ng, Andrej Karpathy, Anthropic, and Sander Schulhoff
 */

import { CONFIG } from './config.js';

/**
 * Check if the prompt has sufficient context length
 * Based on Karpathy's "Context Engineering" principle
 *
 * @param {string} prompt - The prompt to analyze
 * @returns {boolean} - True if prompt has sufficient context
 */
export function checkContextLength(prompt) {
  return prompt.length > CONFIG.MIN_CONTEXT_LENGTH;
}

/**
 * Check if the prompt includes a persona assignment
 * Based on Daniel Miessler's Persona Pattern
 *
 * @param {string} prompt - The prompt to analyze
 * @returns {boolean} - True if persona is detected
 */
export function checkPersona(prompt) {
  const lower = prompt.toLowerCase();
  return CONFIG.PERSONA_KEYWORDS.some(keyword => lower.includes(keyword));
}

/**
 * Check if the prompt uses delimiters to separate instructions from data
 * Based on Andrew Ng and Isa Fulford's delimiter methodology
 *
 * @param {string} prompt - The prompt to analyze
 * @returns {boolean} - True if delimiters are present
 */
export function checkDelimiters(prompt) {
  return CONFIG.DELIMITERS.some(delimiter => prompt.includes(delimiter));
}

/**
 * Check if the prompt specifies an output format
 * Important for getting structured, usable responses
 *
 * @param {string} prompt - The prompt to analyze
 * @returns {boolean} - True if output format is specified
 */
export function checkOutputFormat(prompt) {
  const lower = prompt.toLowerCase();
  return CONFIG.OUTPUT_FORMATS.some(format => lower.includes(format));
}

/**
 * Check if the prompt uses Chain of Thought reasoning
 * Based on Sander Schulhoff's CoT research
 *
 * @param {string} prompt - The prompt to analyze
 * @returns {boolean} - True if CoT phrases are detected
 */
export function checkChainOfThought(prompt) {
  const lower = prompt.toLowerCase();
  return CONFIG.COT_PHRASES.some(phrase => lower.includes(phrase));
}

/**
 * Check if the prompt uses XML structure tags
 * Based on Anthropic's structured prompting research
 *
 * @param {string} prompt - The prompt to analyze
 * @returns {Object} - Contains found tags and count
 */
export function checkXMLStructure(prompt) {
  const xmlTagsFound = CONFIG.XML_TAGS.filter(tag => prompt.includes(tag));
  return {
    found: xmlTagsFound.length > 0,
    tags: xmlTagsFound,
    count: xmlTagsFound.length,
    isAdvanced: xmlTagsFound.length >= 3
  };
}

/**
 * Detect Personally Identifiable Information (PII) in the prompt
 * Critical for safety and privacy compliance
 *
 * @param {string} prompt - The prompt to analyze
 * @returns {Array<string>} - Array of detected PII types
 */
export function detectPII(prompt) {
  const piiFound = [];
  const lower = prompt.toLowerCase();

  // Check regex patterns
  if (CONFIG.PII_PATTERNS.email.test(prompt)) {
    piiFound.push('email address');
  }
  if (CONFIG.PII_PATTERNS.phone.test(prompt)) {
    piiFound.push('phone number');
  }
  if (CONFIG.PII_PATTERNS.ssn.test(prompt)) {
    piiFound.push('SSN');
  }
  if (CONFIG.PII_PATTERNS.ip.test(prompt)) {
    piiFound.push('IP address');
  }

  // Check keyword patterns
  if (CONFIG.PII_KEYWORDS.some(keyword => lower.includes(keyword))) {
    piiFound.push('credentials');
  }

  return piiFound;
}

/**
 * Calculate the grade based on percentage score
 *
 * @param {number} percentage - Score as a percentage (0-100)
 * @returns {string} - Grade level (Expert, Proficient, Developing, Novice)
 */
export function calculateGrade(percentage) {
  if (percentage === CONFIG.SCORING.EXPERT) return 'Expert';
  if (percentage >= CONFIG.SCORING.PROFICIENT) return 'Proficient';
  if (percentage >= CONFIG.SCORING.DEVELOPING) return 'Developing';
  return 'Novice';
}

/**
 * Main analyzer function - evaluates a prompt against all criteria
 *
 * @param {string} prompt - The prompt to analyze
 * @returns {Object} - Complete analysis results
 */
export function analyzePrompt(prompt) {
  if (!prompt || !prompt.trim()) {
    return {
      error: 'Empty prompt',
      score: 0,
      maxScore: 0,
      percentage: 0,
      grade: 'Novice',
      checks: {},
      pii: []
    };
  }

  const checks = {
    contextLength: checkContextLength(prompt),
    persona: checkPersona(prompt),
    delimiters: checkDelimiters(prompt),
    outputFormat: checkOutputFormat(prompt),
    chainOfThought: checkChainOfThought(prompt),
    xmlStructure: checkXMLStructure(prompt)
  };

  const pii = detectPII(prompt);

  // Calculate score
  let score = 0;
  let maxScore = 5; // Base checks

  if (checks.contextLength) score++;
  if (checks.persona) score++;
  if (checks.delimiters) score++;
  if (checks.outputFormat) score++;
  if (checks.chainOfThought) score++;

  // Bonus points for XML structure
  if (checks.xmlStructure.isAdvanced) {
    score += 2;
    maxScore += 2;
  } else if (checks.xmlStructure.found) {
    score += 1;
    maxScore += 1;
  }

  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const grade = calculateGrade(percentage);

  return {
    score,
    maxScore,
    percentage,
    grade,
    checks,
    pii,
    hasSecurityIssues: pii.length > 0
  };
}

/**
 * Generate feedback messages for the UI
 *
 * @param {Object} analysis - Analysis results from analyzePrompt()
 * @returns {Object} - Structured feedback for display
 */
export function generateFeedback(analysis) {
  const feedback = {
    messages: [],
    warnings: [],
    summary: {}
  };

  const { checks, pii, score, maxScore, percentage, grade } = analysis;

  // Context Length feedback
  if (checks.contextLength) {
    feedback.messages.push({
      type: 'success',
      title: 'Context Loaded',
      message: 'Good length. You are providing enough "state" for the model.',
      reference: 'Karpathy'
    });
  } else {
    feedback.messages.push({
      type: 'fail',
      title: 'Context Missing',
      message: 'This prompt is too short. Remember, the prompt is the "RAM". Add background info.',
      reference: 'Karpathy',
      learnMoreSection: 'context'
    });
  }

  // Persona feedback
  if (checks.persona) {
    feedback.messages.push({
      type: 'success',
      title: 'Persona Detected',
      message: 'You successfully assigned a role to the AI.',
      reference: 'Miessler'
    });
  } else {
    feedback.messages.push({
      type: 'fail',
      title: 'No Persona',
      message: 'Who is the AI supposed to be? Try starting with "You are an expert in..."',
      reference: 'Miessler',
      learnMoreSection: 'context'
    });
  }

  // Delimiters feedback
  if (checks.delimiters) {
    feedback.messages.push({
      type: 'success',
      title: 'Delimiters Used',
      message: 'Great job separating instructions from data.',
      reference: 'Ng/Fulford'
    });
  } else {
    feedback.messages.push({
      type: 'info',
      title: 'Tip',
      message: 'If you are pasting text to be summarized/edited, wrap it in triple quotes (""") or XML tags.',
      reference: 'Ng/Fulford',
      learnMoreSection: 'foundations'
    });
  }

  // Output Format feedback
  if (checks.outputFormat) {
    feedback.messages.push({
      type: 'success',
      title: 'Output Format Defined',
      message: 'Good engineering.',
      reference: 'Business Logic'
    });
  } else {
    feedback.messages.push({
      type: 'fail',
      title: 'No Format',
      message: 'Always specify how you want the data (e.g., "Output as a Markdown Table").',
      reference: 'Business Logic'
    });
  }

  // Chain of Thought feedback
  if (checks.chainOfThought) {
    feedback.messages.push({
      type: 'success',
      title: 'CoT Reasoning',
      message: "You're encouraging the AI to think step-by-step.",
      reference: 'Schulhoff'
    });
  } else {
    feedback.messages.push({
      type: 'info',
      title: 'Advanced Tip',
      message: 'For complex tasks, add "Think step-by-step" to improve reasoning accuracy.',
      reference: 'Schulhoff',
      learnMoreSection: 'reasoning'
    });
  }

  // XML Structure feedback
  if (checks.xmlStructure.isAdvanced) {
    feedback.messages.push({
      type: 'success',
      title: 'XML Structure',
      message: `Professional-grade architecture! Found ${checks.xmlStructure.count} structured sections.`,
      reference: 'Anthropic'
    });
  } else if (checks.xmlStructure.found) {
    feedback.messages.push({
      type: 'info',
      title: 'Partial Structure',
      message: "You're using some XML tags. See Section 4 for the complete template.",
      reference: 'Anthropic',
      learnMoreSection: 'structure'
    });
  }

  // PII warnings
  if (pii.length > 0) {
    feedback.warnings.push({
      type: 'security',
      title: 'SAFETY ALERT',
      message: `Detected possible PII: ${pii.join(', ')}. Review Section 7 on data sanitization before submitting prompts with sensitive information.`,
      severity: 'high'
    });
  }

  // Summary
  feedback.summary = {
    score,
    maxScore,
    percentage,
    grade
  };

  return feedback;
}

// Export all functions for testing
export default {
  analyzePrompt,
  generateFeedback,
  checkContextLength,
  checkPersona,
  checkDelimiters,
  checkOutputFormat,
  checkChainOfThought,
  checkXMLStructure,
  detectPII,
  calculateGrade
};

/**
 * Configuration constants for the Prompt Analyzer
 */

export const CONFIG = {
  // Minimum context length for passing the context check
  MIN_CONTEXT_LENGTH: 50,

  // Persona detection keywords
  PERSONA_KEYWORDS: ['act as', 'you are', 'role'],

  // Delimiter patterns
  DELIMITERS: ['"""', '```', '<'],

  // Output format keywords
  OUTPUT_FORMATS: ['json', 'csv', 'table', 'markdown', 'list', 'code', 'python', 'html', 'tree'],

  // Chain of Thought keywords
  COT_PHRASES: [
    'step by step',
    'step-by-step',
    'think through',
    'reasoning',
    'explain your thinking',
    'show your work',
    'break it down',
    'take a deep breath'
  ],

  // XML structure tags
  XML_TAGS: ['<system_role>', '<context>', '<task>', '<constraints>', '<instructions>', '<output>', '<examples>'],

  // PII detection patterns
  PII_PATTERNS: {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|edu|net|gov)/gi,
    phone: /(\d{3}[-.\s]??\d{3}[-.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-.\s]??\d{4})/g,
    ssn: /\d{3}-\d{2}-\d{4}/g,
    ip: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g
  },

  PII_KEYWORDS: ['password', 'api key', 'token', 'ssn', 'social security'],

  // Scoring thresholds
  SCORING: {
    EXPERT: 100,
    PROFICIENT: 75,
    DEVELOPING: 50,
    NOVICE: 0
  }
};

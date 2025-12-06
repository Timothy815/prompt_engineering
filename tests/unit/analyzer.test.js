/**
 * Unit tests for Prompt Analyzer
 * Tests all analyzer functions in isolation
 */

import {
  checkContextLength,
  checkPersona,
  checkDelimiters,
  checkOutputFormat,
  checkChainOfThought,
  checkXMLStructure,
  detectPII,
  calculateGrade,
  analyzePrompt,
  generateFeedback
} from '../../src/promptAnalyzer.js';

import { testPrompts, testSets } from '../fixtures/prompts.js';

describe('Prompt Analyzer - Unit Tests', () => {

  describe('checkContextLength()', () => {
    test('passes when prompt > 50 characters', () => {
      const longPrompt = 'a'.repeat(51);
      expect(checkContextLength(longPrompt)).toBe(true);
    });

    test('fails when prompt < 50 characters', () => {
      const shortPrompt = 'a'.repeat(49);
      expect(checkContextLength(shortPrompt)).toBe(false);
    });

    test('fails at exactly 50 characters', () => {
      const exactPrompt = 'a'.repeat(50);
      expect(checkContextLength(exactPrompt)).toBe(false);
    });

    test('handles empty strings', () => {
      expect(checkContextLength('')).toBe(false);
    });

    test('handles very long prompts', () => {
      const veryLong = 'a'.repeat(10000);
      expect(checkContextLength(veryLong)).toBe(true);
    });
  });

  describe('checkPersona()', () => {
    test('detects "You are" pattern', () => {
      expect(checkPersona('You are an expert developer.')).toBe(true);
    });

    test('detects "Act as" pattern', () => {
      expect(checkPersona('Act as a cybersecurity professional.')).toBe(true);
    });

    test('detects "role" keyword', () => {
      expect(checkPersona('In your role as a teacher, explain this.')).toBe(true);
    });

    test('is case insensitive', () => {
      expect(checkPersona('YOU ARE an expert.')).toBe(true);
      expect(checkPersona('ACT AS a professional.')).toBe(true);
      expect(checkPersona('your ROLE is to assist.')).toBe(true);
    });

    test('returns false for prompts without persona', () => {
      expect(checkPersona('Summarize this text.')).toBe(false);
    });

    test('handles empty strings', () => {
      expect(checkPersona('')).toBe(false);
    });

    test('detects all persona variations from fixtures', () => {
      testSets.allPersonaVariations.forEach(fixture => {
        expect(checkPersona(fixture.input)).toBe(true);
      });
    });
  });

  describe('checkDelimiters()', () => {
    test('detects triple quotes', () => {
      expect(checkDelimiters('Analyze """this text"""')).toBe(true);
    });

    test('detects triple backticks', () => {
      expect(checkDelimiters('Review ```this code```')).toBe(true);
    });

    test('detects XML tags', () => {
      expect(checkDelimiters('<input>sample text</input>')).toBe(true);
    });

    test('detects any angle bracket for XML', () => {
      expect(checkDelimiters('Text with <tag> present')).toBe(true);
    });

    test('returns false when no delimiters present', () => {
      expect(checkDelimiters('Plain text without delimiters')).toBe(false);
    });

    test('handles empty strings', () => {
      expect(checkDelimiters('')).toBe(false);
    });

    test('detects all delimiter variations from fixtures', () => {
      testSets.allDelimiterVariations.forEach(fixture => {
        expect(checkDelimiters(fixture.input)).toBe(true);
      });
    });
  });

  describe('checkOutputFormat()', () => {
    test('detects JSON format request', () => {
      expect(checkOutputFormat('Return the data in JSON format')).toBe(true);
    });

    test('detects markdown format request', () => {
      expect(checkOutputFormat('Output as a markdown table')).toBe(true);
    });

    test('detects CSV format request', () => {
      expect(checkOutputFormat('Export as CSV')).toBe(true);
    });

    test('detects table format request', () => {
      expect(checkOutputFormat('Display in a table')).toBe(true);
    });

    test('detects list format request', () => {
      expect(checkOutputFormat('Show as a bulleted list')).toBe(true);
    });

    test('is case insensitive', () => {
      expect(checkOutputFormat('Output as JSON')).toBe(true);
      expect(checkOutputFormat('output as MARKDOWN')).toBe(true);
    });

    test('detects multiple format keywords', () => {
      expect(checkOutputFormat('Return JSON or CSV or markdown')).toBe(true);
    });

    test('returns false when no format specified', () => {
      expect(checkOutputFormat('Just give me the answer')).toBe(false);
    });

    test('detects all format variations from fixtures', () => {
      testSets.allFormatVariations.forEach(fixture => {
        expect(checkOutputFormat(fixture.input)).toBe(true);
      });
    });
  });

  describe('checkChainOfThought()', () => {
    test('detects "step by step"', () => {
      expect(checkChainOfThought('Solve this step by step')).toBe(true);
    });

    test('detects "step-by-step" with hyphens', () => {
      expect(checkChainOfThought('Think step-by-step')).toBe(true);
    });

    test('detects "think through"', () => {
      expect(checkChainOfThought('Think through the problem')).toBe(true);
    });

    test('detects "reasoning"', () => {
      expect(checkChainOfThought('Explain your reasoning')).toBe(true);
    });

    test('detects "show your work"', () => {
      expect(checkChainOfThought('Show your work')).toBe(true);
    });

    test('detects "take a deep breath"', () => {
      expect(checkChainOfThought('Take a deep breath and solve this')).toBe(true);
    });

    test('is case insensitive', () => {
      expect(checkChainOfThought('STEP BY STEP analysis')).toBe(true);
    });

    test('returns false when no CoT phrases present', () => {
      expect(checkChainOfThought('Just answer the question')).toBe(false);
    });

    test('detects all CoT variations from fixtures', () => {
      testSets.allCotVariations.forEach(fixture => {
        expect(checkChainOfThought(fixture.input)).toBe(true);
      });
    });
  });

  describe('checkXMLStructure()', () => {
    test('detects system_role tags', () => {
      const result = checkXMLStructure('<system_role>Expert</system_role>');
      expect(result.found).toBe(true);
      expect(result.tags).toContain('<system_role>');
    });

    test('detects context tags', () => {
      const result = checkXMLStructure('<context>Background info</context>');
      expect(result.found).toBe(true);
      expect(result.tags).toContain('<context>');
    });

    test('detects task tags', () => {
      const result = checkXMLStructure('<task>Do something</task>');
      expect(result.found).toBe(true);
      expect(result.tags).toContain('<task>');
    });

    test('counts total XML tags correctly', () => {
      const prompt = '<system_role>Expert</system_role><context>Info</context><task>Work</task>';
      const result = checkXMLStructure(prompt);
      expect(result.count).toBe(3);
    });

    test('marks as advanced when 3+ tags present', () => {
      const prompt = '<system_role>A</system_role><context>B</context><task>C</task><constraints>D</constraints>';
      const result = checkXMLStructure(prompt);
      expect(result.isAdvanced).toBe(true);
      expect(result.count).toBe(4);
    });

    test('marks as basic when < 3 tags present', () => {
      const prompt = '<system_role>A</system_role><context>B</context>';
      const result = checkXMLStructure(prompt);
      expect(result.isAdvanced).toBe(false);
      expect(result.count).toBe(2);
    });

    test('returns false when no XML tags present', () => {
      const result = checkXMLStructure('Plain text prompt');
      expect(result.found).toBe(false);
      expect(result.count).toBe(0);
    });

    test('handles empty strings', () => {
      const result = checkXMLStructure('');
      expect(result.found).toBe(false);
      expect(result.count).toBe(0);
    });
  });

  describe('detectPII()', () => {
    test('detects email addresses', () => {
      const pii = detectPII('Contact me at john.doe@example.com');
      expect(pii).toContain('email address');
    });

    test('detects phone numbers in various formats', () => {
      expect(detectPII('Call 555-123-4567')).toContain('phone number');
      expect(detectPII('Call 555.123.4567')).toContain('phone number');
      expect(detectPII('Call 5551234567')).toContain('phone number');
      expect(detectPII('Call (555) 123-4567')).toContain('phone number');
    });

    test('detects SSN patterns', () => {
      const pii = detectPII('SSN: 123-45-6789');
      expect(pii).toContain('SSN');
    });

    test('detects IP addresses', () => {
      const pii = detectPII('Server at 192.168.1.1');
      expect(pii).toContain('IP address');
    });

    test('detects password/credential keywords', () => {
      expect(detectPII('My password is secret123')).toContain('credentials');
      expect(detectPII('API key: abc123')).toContain('credentials');
      expect(detectPII('Auth token required')).toContain('credentials');
    });

    test('detects multiple PII types in one prompt', () => {
      const pii = detectPII('Email: test@test.com, Phone: 555-1234, IP: 10.0.0.1, Password: abc');
      expect(pii.length).toBeGreaterThan(1);
      expect(pii).toContain('email address');
      expect(pii).toContain('phone number');
      expect(pii).toContain('IP address');
      expect(pii).toContain('credentials');
    });

    test('returns empty array when no PII found', () => {
      const pii = detectPII('This is a clean prompt about cars');
      expect(pii).toEqual([]);
    });

    test('handles empty strings', () => {
      expect(detectPII('')).toEqual([]);
    });

    test('detects all PII types from fixtures', () => {
      testSets.allPIITypes.forEach(fixture => {
        const pii = detectPII(fixture.input);
        expect(pii.length).toBeGreaterThan(0);
        fixture.expectedPII.forEach(expectedType => {
          expect(pii).toContain(expectedType);
        });
      });
    });
  });

  describe('calculateGrade()', () => {
    test('assigns "Expert" for 100%', () => {
      expect(calculateGrade(100)).toBe('Expert');
    });

    test('assigns "Proficient" for 75%', () => {
      expect(calculateGrade(75)).toBe('Proficient');
    });

    test('assigns "Proficient" for 99%', () => {
      expect(calculateGrade(99)).toBe('Proficient');
    });

    test('assigns "Developing" for 50%', () => {
      expect(calculateGrade(50)).toBe('Developing');
    });

    test('assigns "Developing" for 74%', () => {
      expect(calculateGrade(74)).toBe('Developing');
    });

    test('assigns "Novice" for 49%', () => {
      expect(calculateGrade(49)).toBe('Novice');
    });

    test('assigns "Novice" for 0%', () => {
      expect(calculateGrade(0)).toBe('Novice');
    });
  });

  describe('analyzePrompt() - Integration', () => {
    test('returns error for empty prompt', () => {
      const result = analyzePrompt('');
      expect(result.error).toBe('Empty prompt');
      expect(result.score).toBe(0);
    });

    test('returns error for whitespace-only prompt', () => {
      const result = analyzePrompt('   \n\t  ');
      expect(result.error).toBe('Empty prompt');
    });

    test('analyzes novice prompt correctly', () => {
      const result = analyzePrompt(testPrompts.novice.input);
      expect(result.score).toBe(testPrompts.novice.expectedScore);
      expect(result.grade).toBe(testPrompts.novice.expectedGrade);
      expect(result.checks.contextLength).toBe(false);
      expect(result.checks.persona).toBe(false);
    });

    test('analyzes developing prompt correctly', () => {
      const result = analyzePrompt(testPrompts.developing.input);
      expect(result.score).toBeGreaterThan(testPrompts.novice.expectedScore);
      expect(result.checks.contextLength).toBe(true);
      expect(result.checks.persona).toBe(true);
      expect(result.checks.delimiters).toBe(true);
    });

    test('analyzes proficient prompt correctly', () => {
      const result = analyzePrompt(testPrompts.proficient.input);
      expect(result.score).toBe(testPrompts.proficient.expectedScore);
      expect(result.grade).toBe(testPrompts.proficient.expectedGrade);
      expect(result.checks.outputFormat).toBe(true);
    });

    test('analyzes expert prompt correctly', () => {
      const result = analyzePrompt(testPrompts.expert.input);
      expect(result.score).toBe(testPrompts.expert.expectedScore);
      expect(result.grade).toBe(testPrompts.expert.expectedGrade);
      expect(result.checks.chainOfThought).toBe(true);
      expect(result.checks.xmlStructure.isAdvanced).toBe(true);
    });

    test('detects PII and sets security flag', () => {
      const result = analyzePrompt(testPrompts.piiEmail.input);
      expect(result.hasSecurityIssues).toBe(true);
      expect(result.pii.length).toBeGreaterThan(0);
    });

    test('calculates percentage correctly', () => {
      const result = analyzePrompt(testPrompts.proficient.input);
      expect(result.percentage).toBe(100); // 5/5 base checks
    });

    test('awards bonus points for XML structure', () => {
      const result = analyzePrompt(testPrompts.expert.input);
      expect(result.maxScore).toBeGreaterThan(5); // Base 5 + XML bonus
    });

    test('all skill level fixtures produce expected results', () => {
      testSets.allSkillLevels.forEach(fixture => {
        const result = analyzePrompt(fixture.input);
        expect(result.grade).toBe(fixture.expectedGrade);
      });
    });
  });

  describe('generateFeedback()', () => {
    test('generates feedback messages for novice prompt', () => {
      const analysis = analyzePrompt(testPrompts.novice.input);
      const feedback = generateFeedback(analysis);

      expect(feedback.messages.length).toBeGreaterThan(0);
      expect(feedback.summary.grade).toBe('Novice');
    });

    test('includes success messages for passing checks', () => {
      const analysis = analyzePrompt(testPrompts.proficient.input);
      const feedback = generateFeedback(analysis);

      const successMessages = feedback.messages.filter(m => m.type === 'success');
      expect(successMessages.length).toBeGreaterThan(0);
    });

    test('includes fail messages for failed checks', () => {
      const analysis = analyzePrompt(testPrompts.novice.input);
      const feedback = generateFeedback(analysis);

      const failMessages = feedback.messages.filter(m => m.type === 'fail');
      expect(failMessages.length).toBeGreaterThan(0);
    });

    test('includes section links for failed checks', () => {
      const analysis = analyzePrompt(testPrompts.novice.input);
      const feedback = generateFeedback(analysis);

      const messagesWithLinks = feedback.messages.filter(m => m.learnMoreSection);
      expect(messagesWithLinks.length).toBeGreaterThan(0);
    });

    test('includes security warnings for PII', () => {
      const analysis = analyzePrompt(testPrompts.piiEmail.input);
      const feedback = generateFeedback(analysis);

      expect(feedback.warnings.length).toBeGreaterThan(0);
      expect(feedback.warnings[0].type).toBe('security');
    });

    test('includes summary with score and grade', () => {
      const analysis = analyzePrompt(testPrompts.proficient.input);
      const feedback = generateFeedback(analysis);

      expect(feedback.summary.score).toBeDefined();
      expect(feedback.summary.maxScore).toBeDefined();
      expect(feedback.summary.percentage).toBeDefined();
      expect(feedback.summary.grade).toBeDefined();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('handles very long prompts without crashing', () => {
      const veryLong = 'a'.repeat(100000);
      expect(() => analyzePrompt(veryLong)).not.toThrow();
    });

    test('handles special characters', () => {
      const special = '!@#$%^&*()_+-=[]{}|;\':",./<>?';
      expect(() => analyzePrompt(special)).not.toThrow();
    });

    test('handles unicode and emoji', () => {
      const unicode = '你好 🚀 café Ñoño';
      expect(() => analyzePrompt(unicode)).not.toThrow();
    });

    test('handles null input gracefully', () => {
      const result = analyzePrompt(null);
      expect(result.error).toBeDefined();
    });

    test('handles undefined input gracefully', () => {
      const result = analyzePrompt(undefined);
      expect(result.error).toBeDefined();
    });
  });
});

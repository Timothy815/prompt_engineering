/**
 * Test fixtures for prompt analysis testing
 * These represent real-world examples at different skill levels
 */

export const testPrompts = {
  // Novice level - minimal prompt
  novice: {
    input: "Summarize this.",
    expectedScore: 0,
    expectedGrade: "Novice",
    expectedChecks: {
      contextLength: false,
      persona: false,
      delimiters: false,
      outputFormat: false,
      chainOfThought: false
    }
  },

  // Developing level - has some elements
  developing: {
    input: `You are a helpful assistant.
Summarize the following text:
"""
The prompt engineering field has evolved significantly over the past few years.
"""`,
    expectedScore: 3,
    expectedGrade: "Developing",
    expectedChecks: {
      contextLength: true,
      persona: true,
      delimiters: true,
      outputFormat: false,
      chainOfThought: false
    }
  },

  // Proficient level - well-structured
  proficient: {
    input: `You are an expert technical writer with experience in AI education.

Summarize the text below for high school students:
"""
The prompt engineering field has evolved significantly over the past few years.
Modern LLMs require careful context management and clear instructions.
"""

Output as a markdown bullet list with 3-5 points.`,
    expectedScore: 5,
    expectedGrade: "Proficient",
    expectedChecks: {
      contextLength: true,
      persona: true,
      delimiters: true,
      outputFormat: true,
      chainOfThought: false
    }
  },

  // Expert level - XML structured with CoT
  expert: {
    input: `<system_role>
You are a senior technical writer with 10 years of experience in AI education.
</system_role>

<context>
The audience is high school students learning prompt engineering for the first time.
They understand basic computer concepts but are new to AI.
</context>

<task>
Summarize the following text. Think step-by-step about the key points that would be most relevant for beginners.
</task>

<input>
"""
The prompt engineering field has evolved significantly over the past few years.
Modern LLMs require careful context management and clear instructions.
Professional prompt engineers use structured approaches like XML tagging and Chain of Thought reasoning.
"""
</input>

<constraints>
- Output as a markdown bullet list
- Use simple vocabulary (avoid jargon)
- Maximum 5 bullets
- Include one practical example
</constraints>`,
    expectedScore: 7,
    expectedGrade: "Expert",
    expectedChecks: {
      contextLength: true,
      persona: true,
      delimiters: true,
      outputFormat: true,
      chainOfThought: true
    }
  },

  // Empty prompt
  empty: {
    input: "",
    expectedScore: 0,
    expectedGrade: "Novice",
    error: "Empty prompt"
  },

  // Whitespace only
  whitespace: {
    input: "   \n\t  \n  ",
    expectedScore: 0,
    expectedGrade: "Novice",
    error: "Empty prompt"
  },

  // PII - dangerous prompt with email
  piiEmail: {
    input: "Send this analysis to john.doe@gmail.com when complete.",
    expectedPII: ['email address'],
    hasSecurityIssues: true
  },

  // PII - dangerous prompt with phone
  piiPhone: {
    input: "Call me at 555-123-4567 with the results.",
    expectedPII: ['phone number'],
    hasSecurityIssues: true
  },

  // PII - dangerous prompt with SSN
  piiSSN: {
    input: "My SSN is 123-45-6789 for verification.",
    expectedPII: ['SSN'],
    hasSecurityIssues: true
  },

  // PII - multiple types
  piiMultiple: {
    input: `Contact john.doe@example.com or call 555-123-4567.
    IP address: 192.168.1.1
    Password: secretPass123`,
    expectedPII: ['email address', 'phone number', 'IP address', 'credentials'],
    hasSecurityIssues: true
  },

  // Persona variations
  personaActAs: {
    input: "Act as a cybersecurity expert and explain SQL injection vulnerabilities.",
    expectedChecks: {
      persona: true
    }
  },

  personaYouAre: {
    input: "You are a senior automotive technician. Diagnose this engine problem.",
    expectedChecks: {
      persona: true
    }
  },

  personaRole: {
    input: "In your role as a database administrator, optimize this query.",
    expectedChecks: {
      persona: true
    }
  },

  // Delimiter variations
  delimiterTripleQuotes: {
    input: `Analyze this code:
    """
    function hello() { console.log('world'); }
    """`,
    expectedChecks: {
      delimiters: true
    }
  },

  delimiterTripleBackticks: {
    input: `Review this code:
    \`\`\`
    def analyze(): pass
    \`\`\``,
    expectedChecks: {
      delimiters: true
    }
  },

  delimiterXML: {
    input: `<input>Sample text to analyze</input>`,
    expectedChecks: {
      delimiters: true
    }
  },

  // Output format variations
  formatJSON: {
    input: "List all users in JSON format.",
    expectedChecks: {
      outputFormat: true
    }
  },

  formatMarkdown: {
    input: "Create a summary as a markdown table.",
    expectedChecks: {
      outputFormat: true
    }
  },

  formatCSV: {
    input: "Export the results as CSV.",
    expectedChecks: {
      outputFormat: true
    }
  },

  // Chain of Thought variations
  cotStepByStep: {
    input: "Solve this problem step by step.",
    expectedChecks: {
      chainOfThought: true
    }
  },

  cotThinkThrough: {
    input: "Think through the logic carefully before answering.",
    expectedChecks: {
      chainOfThought: true
    }
  },

  cotReasoning: {
    input: "Explain your reasoning for each decision.",
    expectedChecks: {
      chainOfThought: true
    }
  },

  cotDeepBreath: {
    input: "Take a deep breath and analyze this methodically.",
    expectedChecks: {
      chainOfThought: true
    }
  },

  // XML structure variations
  xmlMinimal: {
    input: "<task>Summarize this text</task>",
    expectedXML: {
      found: true,
      isAdvanced: false,
      count: 1
    }
  },

  xmlPartial: {
    input: `<system_role>Expert assistant</system_role>
    <task>Complete this analysis</task>`,
    expectedXML: {
      found: true,
      isAdvanced: false,
      count: 2
    }
  },

  xmlAdvanced: {
    input: `<system_role>Expert</system_role>
    <context>Educational setting</context>
    <task>Analyze</task>
    <constraints>Keep it simple</constraints>`,
    expectedXML: {
      found: true,
      isAdvanced: true,
      count: 4
    }
  },

  // Edge cases
  veryLong: {
    input: "a".repeat(10000),
    expectedChecks: {
      contextLength: true
    }
  },

  specialCharacters: {
    input: "Analyze this: !@#$%^&*()_+-=[]{}|;':\",./<>?",
    expectedChecks: {
      contextLength: false
    }
  },

  unicodeCharacters: {
    input: "分析这个提示: 你是一个专家助手 🤖 analyze with émojis and àccents",
    expectedChecks: {
      contextLength: true
    }
  },

  // Case sensitivity tests
  caseSensitivePersona: {
    input: "YOU ARE AN EXPERT. Act AS a professional.",
    expectedChecks: {
      persona: true
    }
  },

  caseSensitiveFormat: {
    input: "Output as JSON or MARKDOWN format.",
    expectedChecks: {
      outputFormat: true
    }
  }
};

// Batch test sets for comprehensive testing
export const testSets = {
  allPersonaVariations: [
    testPrompts.personaActAs,
    testPrompts.personaYouAre,
    testPrompts.personaRole
  ],

  allDelimiterVariations: [
    testPrompts.delimiterTripleQuotes,
    testPrompts.delimiterTripleBackticks,
    testPrompts.delimiterXML
  ],

  allFormatVariations: [
    testPrompts.formatJSON,
    testPrompts.formatMarkdown,
    testPrompts.formatCSV
  ],

  allCotVariations: [
    testPrompts.cotStepByStep,
    testPrompts.cotThinkThrough,
    testPrompts.cotReasoning,
    testPrompts.cotDeepBreath
  ],

  allPIITypes: [
    testPrompts.piiEmail,
    testPrompts.piiPhone,
    testPrompts.piiSSN,
    testPrompts.piiMultiple
  ],

  allSkillLevels: [
    testPrompts.novice,
    testPrompts.developing,
    testPrompts.proficient,
    testPrompts.expert
  ]
};

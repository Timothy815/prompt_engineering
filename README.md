# Prompt Engineering SOP Handbook

![Tests](https://github.com/Timothy815/prompt_engineering/actions/workflows/test.yml/badge.svg)

An interactive, comprehensive guide to professional prompt engineering based on industry-leading frameworks from Andrew Ng, Andrej Karpathy, Anthropic Research, and Sander Schulhoff.

## 🎯 Overview

This project transforms casual AI interaction into professional prompt engineering through structured learning and hands-on practice. The handbook features:

- **11 Interactive Sections** covering foundations to advanced techniques
- **Live Prompt Assessment Workbench** with real-time feedback
- **Multimedia Resources** including video, audio, and slides
- **Comprehensive Test Suite** ensuring reliability
- **Expert-Backed Frameworks** from AI industry leaders

## 🚀 Quick Start

### Viewing the Handbook

**Option 1: Direct Open**
```bash
open promptEngineering.html
```

**Option 2: Local Server** (recommended for full functionality)
```bash
python3 -m http.server 8000
# Visit http://localhost:8000/promptEngineering.html
```

**Option 3: npm Script**
```bash
npm install
npm run serve
# Visit http://localhost:8000/promptEngineering.html
```

## 📚 Content Sections

### The Basics
1. **Introduction** - From "chatting" to engineering
2. **Foundations (Ng)** - Clarity & delimiters
3. **Context (Karpathy)** - Context engineering principles
4. **Structure (Anthropic)** - XML tagging methodology
5. **Reasoning (Schulhoff)** - Chain of Thought prompting

### Advanced Protocols
6. **Debugging & Iteration** - The 3-turn rule
7. **Safety & Ethics** - Data sanitization & PII protection
8. **Domain Patterns** - Python, cybersecurity, automotive

### Interactive Features
9. **Multimedia Hub** - Video, audio, slides, infographic
10. **Interactive Lab** - Prompt assessment workbench
11. **Resource Library** - Official documentation links

## 🧪 Testing

This project includes a comprehensive test suite with unit tests and end-to-end tests.

### Run All Tests
```bash
npm install
npm run test:all
```

### Unit Tests
```bash
npm test                  # Run unit tests
npm run test:coverage     # With coverage report
npm run test:watch        # Watch mode
```

### E2E Tests
```bash
npm run test:e2e          # All browsers
npm run test:e2e:chromium # Chrome only
npm run test:e2e:headed   # See browser
npm run test:e2e:debug    # Debug mode
```

### Coverage Requirements
- Branches: 80%
- Functions: 85%
- Lines: 85%
- Statements: 85%

See [tests/README.md](tests/README.md) for detailed testing guide.

## 🏗️ Architecture

### File Structure
```
prompt_engineering/
├── promptEngineering.html          # Main handbook (single-page app)
├── promptEngineering.{mp4,m4a,pdf,png}  # Multimedia resources
├── src/                            # Extracted JavaScript modules
│   ├── promptAnalyzer.js          # Core analyzer logic
│   └── config.js                  # Configuration constants
├── tests/                          # Test suite
│   ├── unit/                      # Jest unit tests
│   ├── e2e/                       # Playwright E2E tests
│   └── fixtures/                  # Test data
├── .github/workflows/              # CI/CD automation
├── CLAUDE.md                       # AI development guide
├── TESTING_STRATEGY.md            # Comprehensive testing strategy
└── WORKBENCH_IMPROVEMENTS.md      # Enhancement roadmap
```

### Technology Stack
- **Frontend:** Pure HTML, CSS, JavaScript (no framework dependencies)
- **Testing:** Jest (unit) + Playwright (E2E)
- **CI/CD:** GitHub Actions
- **Linting:** ESLint

## 🔧 Development

### Prerequisites
- Node.js 18.x or 20.x
- Python 3 (for local server)
- Git

### Setup
```bash
# Clone repository
git clone https://github.com/Timothy815/prompt_engineering.git
cd prompt_engineering

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run tests to verify setup
npm run test:all
```

### Development Workflow
```bash
# Start local server
npm run serve

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📊 Interactive Workbench

The Prompt Assessment Workbench analyzes prompts against professional standards:

### Evaluation Criteria
- ✅ **Context Length** - Sufficient background (Karpathy)
- ✅ **Persona Assignment** - Role definition (Miessler)
- ✅ **Delimiters** - Instruction/data separation (Ng)
- ✅ **Output Format** - Structured response specification
- ✅ **Chain of Thought** - Step-by-step reasoning (Schulhoff)
- ✅ **XML Structure** - Advanced organization (Anthropic)
- 🚨 **PII Detection** - Privacy & security checks

### Scoring System
- **Expert (100%):** All criteria met
- **Proficient (75-99%):** Strong fundamentals
- **Developing (50-74%):** Basic structure present
- **Novice (<50%):** Needs improvement

## 🎓 Educational Use

This handbook is designed for:
- **Students** learning AI interaction
- **Educators** teaching prompt engineering
- **Professionals** improving AI workflow
- **Researchers** studying prompt patterns

### Key Learning Outcomes
1. Understand the difference between "chatting" and "engineering"
2. Apply structured frameworks from industry leaders
3. Write prompts that consistently produce quality results
4. Recognize and avoid security/privacy pitfalls
5. Iterate and debug prompts systematically

## 🔒 Safety & Privacy

The handbook emphasizes:
- **PII Sanitization:** Never include real names, emails, passwords
- **Data Privacy:** Treat AI as a "public space"
- **Hallucination Awareness:** Always verify factual outputs
- **Ethical Use:** Responsible AI interaction principles

## 📖 Documentation

- **[CLAUDE.md](CLAUDE.md)** - Guide for AI-assisted development
- **[TESTING_STRATEGY.md](TESTING_STRATEGY.md)** - Complete testing approach
- **[WORKBENCH_IMPROVEMENTS.md](WORKBENCH_IMPROVEMENTS.md)** - Enhancement roadmap
- **[tests/README.md](tests/README.md)** - Testing guide

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass (`npm run test:all`)
5. Submit a pull request

### Code Standards
- ESLint rules enforced
- 85%+ test coverage required
- All E2E tests must pass in all browsers
- Follow existing code style

## 📝 License

MIT License - See LICENSE file for details

## 👥 Credits

### Framework Authors
- **Andrew Ng** & **Isa Fulford** - Delimiter methodology (OpenAI)
- **Andrej Karpathy** - Context engineering principles (Tesla/OpenAI)
- **Anthropic Research** - XML structuring techniques
- **Sander Schulhoff** - Chain of Thought prompting (LearnPrompting.org)
- **Daniel Miessler** - Persona patterns (Fabric framework)

### Project
- **Creator:** Timothy Koerner
- **Repository:** https://github.com/Timothy815/prompt_engineering
- **Issues:** https://github.com/Timothy815/prompt_engineering/issues

## 📧 Contact

For questions, suggestions, or feedback:
- Open an issue on GitHub
- Review the documentation in this repository
- Check existing resources in the handbook

## 🔗 Resources

### Official Documentation
- [Anthropic Prompt Design](https://platform.claude.com/docs/en/prompt-design-intro)
- [OpenAI Prompt Engineering](https://platform.openai.com/docs/guides/prompt-engineering)
- [Google Gemini Prompting](https://ai.google.dev/gemini-api/docs/prompting-strategies)

### Frameworks & Tools
- [Fabric Framework](https://github.com/danielmiessler/fabric) - Daniel Miessler
- [Learn Prompting](https://learnprompting.org/) - Sander Schulhoff
- [DeepLearning.AI Course](https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/)

---

**Version:** 4.1.0
**Last Updated:** 2025-12-06
**Status:** Active Development

Made with [Claude Code](https://claude.com/claude-code) 🤖

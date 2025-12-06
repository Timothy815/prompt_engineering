# Testing Strategy - Prompt Engineering Handbook

## Overview
This document outlines the comprehensive testing strategy for the Prompt Engineering SOP Handbook, with particular focus on the interactive prompt assessment workbench.

---

## Testing Philosophy

**Goal:** Ensure the educational tool works reliably across browsers and that all prompt analysis logic behaves correctly.

**Approach:** Hybrid testing strategy combining:
1. **Unit Tests** - Fast, isolated tests for analyzer logic
2. **End-to-End Tests** - Real browser tests for user interactions
3. **Continuous Integration** - Automated testing on every commit

---

## Architecture Changes for Testability

### Current State
- Single `promptEngineering.html` file with embedded JavaScript
- All logic inline in `<script>` tags
- No separation of concerns

### Refactored Structure
```
prompt_engineering/
├── promptEngineering.html          # Main HTML (lighter, imports JS)
├── src/
│   ├── promptAnalyzer.js          # Core analyzer logic (testable)
│   ├── uiController.js            # DOM manipulation
│   └── config.js                  # Configuration constants
├── tests/
│   ├── unit/
│   │   ├── analyzer.test.js       # Unit tests for analyzer
│   │   └── validation.test.js     # Tests for validation rules
│   └── e2e/
│       ├── workbench.spec.js      # E2E tests for simulator
│       └── navigation.spec.js     # E2E tests for tab navigation
├── .github/
│   └── workflows/
│       └── test.yml               # GitHub Actions CI/CD
├── package.json                    # Dependencies and scripts
└── playwright.config.js           # E2E test configuration
```

---

## Unit Testing Strategy

### Framework: Jest
**Why Jest?**
- Zero configuration
- Fast execution
- Built-in coverage reporting
- Wide adoption and documentation

### What to Test

#### 1. Prompt Analyzer Core Logic
**File:** `tests/unit/analyzer.test.js`

**Test Cases:**
```javascript
describe('Prompt Analyzer', () => {
  describe('Context Length Check', () => {
    test('passes when prompt > 50 characters', () => {})
    test('fails when prompt < 50 characters', () => {})
    test('handles empty strings', () => {})
  })

  describe('Persona Detection', () => {
    test('detects "You are" pattern', () => {})
    test('detects "Act as" pattern', () => {})
    test('detects "role" keyword', () => {})
    test('case insensitive detection', () => {})
    test('returns false for prompts without persona', () => {})
  })

  describe('Delimiter Detection', () => {
    test('detects triple quotes', () => {})
    test('detects triple backticks', () => {})
    test('detects XML tags', () => {})
    test('returns false when no delimiters present', () => {})
  })

  describe('Output Format Detection', () => {
    test('detects JSON format request', () => {})
    test('detects markdown format request', () => {})
    test('detects multiple format keywords', () => {})
    test('case insensitive format detection', () => {})
  })

  describe('Chain of Thought Detection', () => {
    test('detects "step by step"', () => {})
    test('detects "think through"', () => {})
    test('detects "reasoning"', () => {})
    test('handles hyphenated variations', () => {})
  })

  describe('PII Detection', () => {
    test('detects email addresses', () => {})
    test('detects phone numbers (various formats)', () => {})
    test('detects SSN patterns', () => {})
    test('detects IP addresses', () => {})
    test('detects password/credential keywords', () => {})
    test('returns empty array when no PII found', () => {})
  })

  describe('XML Structure Detection', () => {
    test('detects system_role tags', () => {})
    test('detects context tags', () => {})
    test('detects task tags', () => {})
    test('counts total XML tags correctly', () => {})
    test('awards bonus points for 3+ tags', () => {})
  })

  describe('Score Calculation', () => {
    test('calculates correct score for perfect prompt', () => {})
    test('calculates correct score for novice prompt', () => {})
    test('handles edge case: all checks fail', () => {})
    test('handles edge case: all checks pass', () => {})
  })

  describe('Grade Assignment', () => {
    test('assigns "Expert" for 100%', () => {})
    test('assigns "Proficient" for 75-99%', () => {})
    test('assigns "Developing" for 50-74%', () => {})
    test('assigns "Novice" for <50%', () => {})
  })
})
```

**Coverage Target:** 90%+ for analyzer logic

---

#### 2. Validation Rules Tests
**File:** `tests/unit/validation.test.js`

**Test Cases:**
- Input sanitization
- HTML injection prevention
- Special character handling
- Maximum input length enforcement

---

### Unit Test Execution

```bash
# Run all unit tests
npm test

# Run with coverage report
npm run test:coverage

# Run in watch mode (during development)
npm run test:watch

# Run specific test file
npm test analyzer.test.js
```

**Expected Output:**
```
PASS  tests/unit/analyzer.test.js
  Prompt Analyzer
    Context Length Check
      ✓ passes when prompt > 50 characters (2ms)
      ✓ fails when prompt < 50 characters (1ms)
    ...

Test Suites: 2 passed, 2 total
Tests:       24 passed, 24 total
Coverage:    92.5% Statements | 88.3% Branches | 95.1% Functions | 91.7% Lines
```

---

## End-to-End Testing Strategy

### Framework: Playwright
**Why Playwright?**
- Cross-browser testing (Chrome, Firefox, Safari)
- Fast and reliable
- Built-in test runner and reporting
- Excellent debugging tools
- Auto-waiting and retry logic

### What to Test

#### 1. Workbench Interaction Flow
**File:** `tests/e2e/workbench.spec.js`

**Test Scenarios:**
```javascript
describe('Prompt Assessment Workbench', () => {
  test('loads correctly with initial state', async ({ page }) => {
    // Verify simulator displays welcome message
    // Verify input field is empty
    // Verify analyze button is present
  })

  test('analyzes a novice-level prompt correctly', async ({ page }) => {
    // Enter simple prompt
    // Click analyze
    // Verify low score displayed
    // Verify specific feedback messages appear
    // Verify warning tags present
  })

  test('analyzes an expert-level prompt correctly', async ({ page }) => {
    // Enter complex XML-structured prompt
    // Click analyze
    // Verify high score (4+/5)
    // Verify success tags present
    // Verify "Expert" grade shown
  })

  test('detects PII and shows security warning', async ({ page }) => {
    // Enter prompt with email address
    // Click analyze
    // Verify red warning box appears
    // Verify specific PII types listed
  })

  test('loads preset examples correctly', async ({ page }) => {
    // Select "Bad Prompt" from dropdown
    // Verify textarea populated
    // Select "Expert Prompt" from dropdown
    // Verify different content loaded
  })

  test('links to handbook sections work', async ({ page }) => {
    // Analyze prompt missing persona
    // Click "Learn about Persona Patterns" link
    // Verify navigation to correct section
    // Verify section content visible
  })

  test('handles empty input gracefully', async ({ page }) => {
    // Click analyze with empty textarea
    // Verify no crash
    // Verify appropriate message
  })

  test('handles very long input (stress test)', async ({ page }) => {
    // Enter 10,000 character prompt
    // Click analyze
    // Verify analysis completes
    // Verify no performance issues
  })

  test('suggestion improvement button appears for low scores', async ({ page }) => {
    // Enter bad prompt
    // Verify "Suggest Improvement" button visible
    // Click button
    // Verify improved version displayed
  })
})
```

---

#### 2. Navigation Tests
**File:** `tests/e2e/navigation.spec.js`

**Test Scenarios:**
```javascript
describe('Handbook Navigation', () => {
  test('switches between all sections correctly', async ({ page }) => {
    // Click each navigation item
    // Verify correct content displayed
    // Verify active state applied
  })

  test('maintains state when navigating away and back', async ({ page }) => {
    // Enter text in workbench
    // Navigate to different section
    // Return to workbench
    // Verify text still present (if that's desired behavior)
  })

  test('multimedia resources load correctly', async ({ page }) => {
    // Navigate to multimedia section
    // Verify video player present
    // Verify audio player present
    // Verify PDF iframe loads
    // Verify image displays
  })
})
```

---

### E2E Test Execution

```bash
# Run all E2E tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run in specific browser
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit

# Debug mode with Playwright Inspector
npm run test:e2e:debug

# Generate HTML report
npm run test:e2e:report
```

---

## Visual Regression Testing (Optional)

### Tool: Playwright Visual Comparisons

**Test Cases:**
- Screenshot comparison of workbench before/after analysis
- Verify styling consistency across browsers
- Detect unintended UI changes

**Implementation:**
```javascript
test('workbench visual regression', async ({ page }) => {
  await page.goto('/');
  await page.click('[onclick="switchTab(\'simulator\')"]');
  await expect(page).toHaveScreenshot('workbench-initial.png');
});
```

---

## Continuous Integration Strategy

### GitHub Actions Workflow
**File:** `.github/workflows/test.yml`

**Triggers:**
- Every push to `main` branch
- Every pull request
- Manual workflow dispatch

**Jobs:**
1. **Unit Tests** (runs on: ubuntu-latest, Node 18+)
   - Install dependencies
   - Run Jest tests
   - Upload coverage reports
   - Fail build if coverage < 80%

2. **E2E Tests** (runs on: ubuntu-latest, matrix: chrome/firefox/webkit)
   - Install Playwright browsers
   - Run E2E test suite
   - Upload test artifacts (screenshots, videos on failure)
   - Generate HTML report

3. **Linting** (runs on: ubuntu-latest)
   - ESLint for JavaScript quality
   - HTMLHint for HTML validation

**Status Badge:**
Add to README.md:
```markdown
![Tests](https://github.com/Timothy815/prompt_engineering/actions/workflows/test.yml/badge.svg)
```

---

## Test Data Management

### Fixtures
**File:** `tests/fixtures/prompts.js`

```javascript
export const testPrompts = {
  novice: {
    input: "Summarize this.",
    expectedScore: 0,
    expectedGrade: "Novice"
  },

  developing: {
    input: `You are a helpful assistant.
            Summarize the following text:
            """
            [Sample text here]
            """`,
    expectedScore: 2,
    expectedGrade: "Developing"
  },

  proficient: {
    input: `You are an expert technical writer.

            Summarize the text below in bullet points:
            """
            [Sample text here]
            """

            Output as a markdown list.`,
    expectedScore: 4,
    expectedGrade: "Proficient"
  },

  expert: {
    input: `<system_role>
            You are a senior technical writer with 10 years experience.
            </system_role>

            <context>
            The audience is high school students learning prompt engineering.
            </context>

            <task>
            Summarize the following text. Think step-by-step about the key points.
            </task>

            <input>
            """
            [Sample text here]
            """
            </input>

            <constraints>
            - Output as markdown bullet list
            - Use simple vocabulary
            - Maximum 5 bullets
            </constraints>`,
    expectedScore: 7,
    expectedGrade: "Expert"
  },

  piiDangerous: {
    input: `Send this to john.doe@gmail.com and call 555-123-4567`,
    expectedPII: ['email address', 'phone number']
  }
}
```

---

## Performance Testing

### Metrics to Track
- **Analyzer execution time** - Should complete in < 100ms
- **Page load time** - Should load in < 2s
- **Memory usage** - Monitor for leaks in long sessions

### Tools
- Lighthouse CI for performance budgets
- Chrome DevTools Performance profiling

---

## Accessibility Testing

### Tools
- **axe-core** integration with Playwright
- **pa11y** for automated accessibility checks

### Requirements
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility

**Test Example:**
```javascript
test('workbench is accessible', async ({ page }) => {
  await page.goto('/');
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

---

## Test Maintenance Guidelines

### When to Update Tests

1. **New Feature Added** - Write tests BEFORE implementation (TDD)
2. **Bug Fixed** - Add regression test to prevent recurrence
3. **Refactoring** - Tests should still pass without changes
4. **Requirements Changed** - Update assertions accordingly

### Test Code Quality

- **DRY Principle** - Use helper functions for repeated logic
- **Descriptive Names** - Test name should explain what's being tested
- **Single Assertion Focus** - Each test validates one behavior
- **Independent Tests** - Tests should not depend on each other
- **Fast Execution** - Keep unit tests under 10ms each

---

## Coverage Goals

| Test Type | Target Coverage |
|-----------|----------------|
| Unit Tests | 90%+ |
| E2E Critical Paths | 100% |
| Edge Cases | 80%+ |
| Overall | 85%+ |

---

## Reporting and Monitoring

### Test Reports Generated

1. **Jest Coverage Report** (HTML)
   - Located at: `coverage/lcov-report/index.html`
   - View with: `npm run test:coverage && open coverage/lcov-report/index.html`

2. **Playwright Test Report** (HTML)
   - Located at: `playwright-report/index.html`
   - View with: `npm run test:e2e:report`

3. **GitHub Actions Summary**
   - Visible in PR checks
   - Downloadable artifacts for failures

### Metrics Dashboard (Future)

- Test execution trends over time
- Flaky test detection
- Coverage trends
- Performance regression tracking

---

## Local Development Workflow

### Before Committing
```bash
# Run full test suite
npm run test:all

# Check coverage
npm run test:coverage

# Lint code
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Pre-commit Hook (Recommended)
Install Husky to run tests automatically:
```bash
npm install --save-dev husky
npx husky install
npx husky add .husky/pre-commit "npm test"
```

---

## Troubleshooting Common Issues

### Issue: Tests timing out
**Solution:** Increase timeout in playwright.config.js
```javascript
timeout: 30000 // 30 seconds
```

### Issue: Flaky E2E tests
**Solution:** Use Playwright's auto-waiting and add explicit waits
```javascript
await page.waitForSelector('.sim-message.sim-ai');
```

### Issue: Coverage not including all files
**Solution:** Update Jest config to include all source files
```javascript
collectCoverageFrom: ['src/**/*.js']
```

---

## Next Steps After Setup

1. Run baseline tests to verify setup
2. Review and adjust coverage thresholds
3. Integrate with PR workflow
4. Train team on writing/maintaining tests
5. Monitor test execution times
6. Iterate on test quality

---

## Resources

- **Jest Documentation:** https://jestjs.io/docs/getting-started
- **Playwright Documentation:** https://playwright.dev/docs/intro
- **GitHub Actions:** https://docs.github.com/en/actions
- **Testing Best Practices:** https://testingjavascript.com/

---

**Document Version:** 1.0
**Last Updated:** 2025-12-06
**Next Review:** After initial implementation

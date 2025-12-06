# Testing Guide

This directory contains the comprehensive test suite for the Prompt Engineering Handbook.

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm run test:all

# Run only unit tests
npm test

# Run only E2E tests
npm run test:e2e

# Run with coverage
npm run test:coverage
```

## Test Structure

```
tests/
├── unit/                   # Unit tests for analyzer logic
│   └── analyzer.test.js   # Tests for promptAnalyzer.js functions
├── e2e/                    # End-to-end tests with Playwright
│   ├── workbench.spec.js  # Tests for interactive simulator
│   └── navigation.spec.js # Tests for tab navigation
└── fixtures/               # Test data and fixtures
    └── prompts.js         # Sample prompts for testing
```

## Unit Tests

### What We Test
- Individual analyzer functions (context length, persona detection, etc.)
- PII detection logic
- Score calculation and grading
- Edge cases and error handling

### Running Unit Tests

```bash
# Run all unit tests
npm test

# Run in watch mode (auto-rerun on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage

# View coverage in browser
npm run test:coverage && open coverage/lcov-report/index.html
```

### Coverage Requirements
- **Branches:** 80%
- **Functions:** 85%
- **Lines:** 85%
- **Statements:** 85%

Tests will fail if coverage drops below these thresholds.

## E2E Tests

### What We Test
- Full user interaction flows
- UI behavior and responsiveness
- Navigation between sections
- Multimedia resource loading
- Accessibility and keyboard navigation
- Cross-browser compatibility

### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run specific browser
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit

# Debug tests
npm run test:e2e:debug

# View HTML report
npm run test:e2e:report
```

### Supported Browsers
- Chromium (Chrome/Edge)
- Firefox
- WebKit (Safari)
- Mobile Chrome
- Mobile Safari

## Test Fixtures

The `fixtures/prompts.js` file contains real-world examples at different skill levels:

- **Novice:** Minimal prompts
- **Developing:** Prompts with some structure
- **Proficient:** Well-structured prompts
- **Expert:** XML-structured with CoT

### Using Fixtures in Tests

```javascript
import { testPrompts } from '../fixtures/prompts.js';

test('analyzes expert prompt correctly', () => {
  const result = analyzePrompt(testPrompts.expert.input);
  expect(result.grade).toBe('Expert');
});
```

## Writing New Tests

### Unit Test Template

```javascript
describe('Feature Name', () => {
  test('should do something specific', () => {
    // Arrange
    const input = 'test data';

    // Act
    const result = functionToTest(input);

    // Assert
    expect(result).toBe(expectedValue);
  });
});
```

### E2E Test Template

```javascript
test('user can complete workflow', async ({ page }) => {
  // Navigate
  await page.goto('/promptEngineering.html');

  // Interact
  await page.fill('#userInput', 'test prompt');
  await page.click('button:has-text("Analyze")');

  // Assert
  await expect(page.locator('.result')).toBeVisible();
});
```

## Debugging Tests

### Unit Tests
```bash
# Use console.log in tests
test('debug test', () => {
  const result = analyzePrompt('test');
  console.log('Result:', result);
  expect(result).toBeDefined();
});

# Run single test file
npm test analyzer.test.js

# Run tests matching pattern
npm test -- -t "persona detection"
```

### E2E Tests
```bash
# Run with Playwright Inspector
npm run test:e2e:debug

# Run in headed mode with slow motion
PWDEBUG=console npm run test:e2e:headed

# Take screenshots for debugging
test('debug test', async ({ page }) => {
  await page.screenshot({ path: 'debug.png' });
});
```

## Continuous Integration

Tests run automatically on:
- Every push to `main` or `develop` branches
- Every pull request
- Manual workflow dispatch

### CI Pipeline
1. **Unit Tests** - Run on Node 18.x and 20.x
2. **E2E Tests** - Run on all supported browsers
3. **Lint** - ESLint code quality checks
4. **Test Summary** - Aggregate results

### Viewing CI Results
- Check the "Actions" tab in GitHub
- View test artifacts for failures
- Download screenshots/videos on failure

## Common Issues

### Issue: Tests timing out
**Solution:** Increase timeout in test file
```javascript
test.setTimeout(30000); // 30 seconds
```

### Issue: Flaky E2E tests
**Solution:** Use Playwright's auto-waiting
```javascript
await page.waitForSelector('.element', { state: 'visible' });
```

### Issue: Coverage not including files
**Solution:** Update Jest config in package.json
```json
"collectCoverageFrom": ["src/**/*.js"]
```

### Issue: Playwright browsers not installed
**Solution:** Install browsers
```bash
npx playwright install
```

## Performance Guidelines

- Unit tests should run in < 10ms each
- E2E tests should complete in < 30 seconds total
- Page load time target: < 2 seconds
- Tab switch time target: < 500ms

## Best Practices

### Do's ✅
- Write tests before fixing bugs (TDD)
- Use descriptive test names
- Keep tests independent
- Mock external dependencies
- Test edge cases and error states
- Use fixtures for consistency

### Don'ts ❌
- Don't test implementation details
- Don't write tests that depend on each other
- Don't use timeouts unless necessary
- Don't skip tests without good reason
- Don't test third-party libraries

## Accessibility Testing

E2E tests include accessibility checks:

```javascript
test('workbench is accessible', async ({ page }) => {
  // Keyboard navigation
  await page.keyboard.press('Tab');

  // ARIA attributes
  await expect(button).toHaveAttribute('aria-label');

  // Color contrast (manual review needed)
});
```

## Mobile Testing

E2E tests include mobile viewport testing:

```javascript
test('mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  // Test mobile-specific behavior
});
```

## Maintenance

### When to Update Tests

1. **New Feature** - Write tests first (TDD)
2. **Bug Fix** - Add regression test
3. **Refactoring** - Tests should still pass
4. **Requirements Change** - Update assertions

### Test Review Checklist
- [ ] Tests are independent
- [ ] Descriptive names
- [ ] Edge cases covered
- [ ] Fast execution
- [ ] No console warnings
- [ ] Passes in all browsers

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Best Practices](https://testingjavascript.com/)
- [TESTING_STRATEGY.md](../TESTING_STRATEGY.md) - Full strategy document

## Getting Help

- Check existing tests for examples
- Review TESTING_STRATEGY.md for architecture decisions
- Open an issue if tests are failing unexpectedly
- Ask in PR reviews for guidance

---

**Last Updated:** 2025-12-06
**Maintainer:** Timothy Koerner

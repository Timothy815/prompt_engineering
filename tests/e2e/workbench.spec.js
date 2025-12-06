/**
 * E2E tests for Prompt Assessment Workbench
 * Tests the full user interaction flow with the simulator
 */

const { test, expect } = require('@playwright/test');

test.describe('Prompt Assessment Workbench', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/promptEngineering.html');
    // Navigate to simulator tab
    await page.click('text=Interactive Lab');
    await page.waitForSelector('#chatDisplay');
  });

  test('loads correctly with initial state', async ({ page }) => {
    // Verify welcome message is displayed
    await expect(page.locator('.sim-message.sim-ai')).toContainText('System Ready');

    // Verify input field is present and empty
    const textarea = page.locator('#userInput');
    await expect(textarea).toBeVisible();
    await expect(textarea).toHaveValue('');

    // Verify analyze button is present
    await expect(page.locator('button:has-text("Analyze")')).toBeVisible();
  });

  test('analyzes a novice-level prompt correctly', async ({ page }) => {
    // Enter simple prompt
    await page.fill('#userInput', 'Summarize this.');

    // Click analyze button
    await page.click('button:has-text("Analyze")');

    // Wait for analysis to appear
    await page.waitForSelector('.sim-message.sim-ai:nth-of-type(2)');

    // Verify low score feedback
    const analysis = page.locator('.sim-message.sim-ai').last();
    await expect(analysis).toContainText('Analysis Report');

    // Verify warning/fail tags present
    await expect(analysis.locator('.tag-fail, .tag-info')).toHaveCount(3); // At least some failures
  });

  test('analyzes a proficient-level prompt correctly', async ({ page }) => {
    const proficientPrompt = `You are an expert technical writer.

Summarize the text below:
"""
Sample text here
"""

Output as a markdown list.`;

    await page.fill('#userInput', proficientPrompt);
    await page.click('button:has-text("Analyze")');

    await page.waitForSelector('.sim-message.sim-ai:nth-of-type(2)');

    const analysis = page.locator('.sim-message.sim-ai').last();

    // Verify success tags present
    const successTags = analysis.locator('.tag-success');
    await expect(successTags).toHaveCount(4); // Should have multiple successes
  });

  test('analyzes an expert-level XML structured prompt', async ({ page }) => {
    const expertPrompt = `<system_role>
You are a senior developer with 10 years experience.
</system_role>

<context>
Teaching beginners programming concepts.
</context>

<task>
Explain functions step-by-step.
</task>

<constraints>
- Use simple language
- Output as markdown
</constraints>`;

    await page.fill('#userInput', expertPrompt);
    await page.click('button:has-text("Analyze")');

    await page.waitForSelector('.sim-message.sim-ai:nth-of-type(2)');

    const analysis = page.locator('.sim-message.sim-ai').last();

    // Verify expert-level feedback
    await expect(analysis).toContainText('XML Structure');
    await expect(analysis.locator('.tag-success')).toHaveCount(5); // Many successes
  });

  test('detects PII and shows security warning', async ({ page }) => {
    const piiPrompt = 'Send results to john.doe@gmail.com and call 555-123-4567';

    await page.fill('#userInput', piiPrompt);
    await page.click('button:has-text("Analyze")');

    await page.waitForSelector('.sim-message.sim-ai:nth-of-type(2)');

    const analysis = page.locator('.sim-message.sim-ai').last();

    // Verify security warning appears
    await expect(analysis.locator('.warning-box')).toBeVisible();
    await expect(analysis).toContainText('SAFETY ALERT');
    await expect(analysis).toContainText('email address');
    await expect(analysis).toContainText('phone number');
  });

  test('handles empty input gracefully', async ({ page }) => {
    // Click analyze with empty textarea
    await page.click('button:has-text("Analyze")');

    // Should not crash - verify page still functional
    await expect(page.locator('#userInput')).toBeVisible();

    // Verify no new analysis message was added (empty inputs should be ignored)
    const messages = page.locator('.sim-message.sim-user');
    await expect(messages).toHaveCount(0);
  });

  test('clears input field after submission', async ({ page }) => {
    await page.fill('#userInput', 'Test prompt');
    await page.click('button:has-text("Analyze")');

    await page.waitForSelector('.sim-message.sim-user');

    // Verify input field is cleared
    await expect(page.locator('#userInput')).toHaveValue('');
  });

  test('displays user input in chat display', async ({ page }) => {
    const testPrompt = 'This is my test prompt for analysis';
    await page.fill('#userInput', testPrompt);
    await page.click('button:has-text("Analyze")');

    // Verify user message appears in chat
    const userMessage = page.locator('.sim-message.sim-user').last();
    await expect(userMessage).toContainText(testPrompt);
  });

  test('handles multiple consecutive analyses', async ({ page }) => {
    // First analysis
    await page.fill('#userInput', 'First prompt');
    await page.click('button:has-text("Analyze")');
    await page.waitForSelector('.sim-message.sim-ai:nth-of-type(2)');

    // Second analysis
    await page.fill('#userInput', 'Second prompt');
    await page.click('button:has-text("Analyze")');
    await page.waitForSelector('.sim-message.sim-ai:nth-of-type(3)');

    // Verify both analyses are present
    const userMessages = page.locator('.sim-message.sim-user');
    await expect(userMessages).toHaveCount(2);

    const aiMessages = page.locator('.sim-message.sim-ai');
    await expect(aiMessages).toHaveCount(3); // Welcome + 2 analyses
  });

  test('auto-scrolls to show latest analysis', async ({ page }) => {
    // Fill chat with multiple analyses
    for (let i = 0; i < 3; i++) {
      await page.fill('#userInput', `Prompt ${i + 1}`);
      await page.click('button:has-text("Analyze")');
      await page.waitForTimeout(600); // Wait for animation
    }

    // Verify scroll position is at bottom
    const chatDisplay = page.locator('#chatDisplay');
    const scrollTop = await chatDisplay.evaluate(el => el.scrollTop);
    const scrollHeight = await chatDisplay.evaluate(el => el.scrollHeight);
    const clientHeight = await chatDisplay.evaluate(el => el.clientHeight);

    // Should be scrolled to bottom (with some tolerance)
    expect(scrollTop + clientHeight).toBeGreaterThanOrEqual(scrollHeight - 10);
  });

  test('handles very long input (stress test)', async ({ page }) => {
    const longPrompt = 'a'.repeat(5000);
    await page.fill('#userInput', longPrompt);
    await page.click('button:has-text("Analyze")');

    await page.waitForSelector('.sim-message.sim-ai:nth-of-type(2)');

    // Verify analysis completes without errors
    const analysis = page.locator('.sim-message.sim-ai').last();
    await expect(analysis).toContainText('Analysis Report');
  });

  test('handles special characters in input', async ({ page }) => {
    const specialPrompt = 'Test with special chars: !@#$%^&*()_+-=[]{}|;\':",./<>?';
    await page.fill('#userInput', specialPrompt);
    await page.click('button:has-text("Analyze")');

    await page.waitForSelector('.sim-message.sim-user');

    // Verify special characters are displayed correctly
    const userMessage = page.locator('.sim-message.sim-user').last();
    await expect(userMessage).toContainText('!@#$%^&*()');
  });

  test('detects all persona variations', async ({ page }) => {
    const personaVariations = [
      'You are an expert',
      'Act as a professional',
      'In your role as a teacher'
    ];

    for (const variation of personaVariations) {
      await page.fill('#userInput', variation);
      await page.click('button:has-text("Analyze")');
      await page.waitForSelector('.sim-message.sim-ai:nth-of-type(2)');

      const analysis = page.locator('.sim-message.sim-ai').last();
      await expect(analysis).toContainText('Persona Detected');

      // Reload page for next test
      if (variation !== personaVariations[personaVariations.length - 1]) {
        await page.reload();
        await page.click('text=Interactive Lab');
      }
    }
  });

  test('provides educational references in feedback', async ({ page }) => {
    await page.fill('#userInput', 'You are an expert. Summarize this.');
    await page.click('button:has-text("Analyze")');

    await page.waitForSelector('.sim-message.sim-ai:nth-of-type(2)');

    const analysis = page.locator('.sim-message.sim-ai').last();

    // Verify references to framework authors
    const text = await analysis.textContent();
    const hasReference = text.includes('Karpathy') ||
                        text.includes('Miessler') ||
                        text.includes('Ng') ||
                        text.includes('Schulhoff') ||
                        text.includes('Anthropic');

    expect(hasReference).toBe(true);
  });
});

test.describe('Accessibility Tests', () => {
  test('workbench is keyboard navigable', async ({ page }) => {
    await page.goto('/promptEngineering.html');
    await page.click('text=Interactive Lab');

    // Tab to textarea
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Type in textarea via keyboard
    await page.keyboard.type('Test prompt');

    // Tab to button and press Enter
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Verify analysis ran
    await page.waitForSelector('.sim-message.sim-user');
    const userMessage = page.locator('.sim-message.sim-user').last();
    await expect(userMessage).toContainText('Test prompt');
  });

  test('has proper ARIA labels and roles', async ({ page }) => {
    await page.goto('/promptEngineering.html');
    await page.click('text=Interactive Lab');

    // Verify semantic HTML structure
    const textarea = page.locator('#userInput');
    const button = page.locator('button:has-text("Analyze")');

    await expect(textarea).toBeVisible();
    await expect(button).toBeVisible();

    // Buttons should have proper type
    await expect(button).toHaveAttribute('type', 'button');
  });
});

test.describe('Mobile Responsiveness', () => {
  test('workbench displays correctly on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/promptEngineering.html');
    await page.click('text=Interactive Lab');

    // Verify elements are visible and usable
    await expect(page.locator('#userInput')).toBeVisible();
    await expect(page.locator('button:has-text("Analyze")')).toBeVisible();

    // Test interaction
    await page.fill('#userInput', 'Mobile test');
    await page.click('button:has-text("Analyze")');

    await page.waitForSelector('.sim-message.sim-user');
    await expect(page.locator('.sim-message.sim-user')).toContainText('Mobile test');
  });
});

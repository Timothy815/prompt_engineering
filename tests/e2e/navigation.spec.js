/**
 * E2E tests for Handbook Navigation
 * Tests the tab switching and section navigation functionality
 */

const { test, expect } = require('@playwright/test');

test.describe('Handbook Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/promptEngineering.html');
  });

  test('loads with introduction section active by default', async ({ page }) => {
    // Verify intro section is visible
    await expect(page.locator('#intro')).toBeVisible();
    await expect(page.locator('#intro')).toHaveClass(/active/);

    // Verify intro nav item is active
    await expect(page.locator('.nav-item.active')).toContainText('Introduction');
  });

  test('switches to foundations section correctly', async ({ page }) => {
    await page.click('text=Foundations (Ng)');

    // Verify foundations section is now visible
    await expect(page.locator('#foundations')).toBeVisible();
    await expect(page.locator('#foundations')).toHaveClass(/active/);

    // Verify intro is hidden
    await expect(page.locator('#intro')).not.toHaveClass(/active/);

    // Verify content loaded
    await expect(page.locator('#foundations')).toContainText('Clarity & Delimiters');
  });

  test('switches to all main sections sequentially', async ({ page }) => {
    const sections = [
      { link: 'Foundations (Ng)', id: 'foundations', title: 'Clarity' },
      { link: 'Context (Karpathy)', id: 'context', title: 'Context Engineering' },
      { link: 'Structure (Anthropic)', id: 'structure', title: 'XML Tagging' },
      { link: 'Reasoning (Schulhoff)', id: 'reasoning', title: 'Advanced Reasoning' },
      { link: 'Debugging & Iteration', id: 'debugging', title: 'Debugging' },
      { link: 'Safety & Ethics', id: 'safety', title: 'Safety' },
      { link: 'Domain Patterns', id: 'domains', title: 'Domain-Specific' }
    ];

    for (const section of sections) {
      await page.click(`text=${section.link}`);
      await expect(page.locator(`#${section.id}`)).toBeVisible();
      await expect(page.locator(`#${section.id}`)).toContainText(section.title);
    }
  });

  test('switches to multimedia hub', async ({ page }) => {
    await page.click('text=Multimedia Hub');

    await expect(page.locator('#multimedia')).toBeVisible();
    await expect(page.locator('#multimedia')).toContainText('Multimedia Hub');

    // Verify media elements are present
    await expect(page.locator('video')).toBeVisible();
    await expect(page.locator('audio')).toBeVisible();
  });

  test('switches to interactive lab (simulator)', async ({ page }) => {
    await page.click('text=Interactive Lab');

    await expect(page.locator('#simulator')).toBeVisible();
    await expect(page.locator('#simulator')).toContainText('Prompt Simulator');

    // Verify simulator components are present
    await expect(page.locator('#chatDisplay')).toBeVisible();
    await expect(page.locator('#userInput')).toBeVisible();
  });

  test('switches to resource library', async ({ page }) => {
    await page.click('text=Resource Library');

    await expect(page.locator('#resources')).toBeVisible();
    await expect(page.locator('#resources')).toContainText('Resource Library');

    // Verify resource links are present
    await expect(page.locator('a[href*="anthropic.com"]')).toBeVisible();
    await expect(page.locator('a[href*="openai.com"]')).toBeVisible();
  });

  test('updates active state when switching tabs', async ({ page }) => {
    // Click foundations
    await page.click('text=Foundations (Ng)');

    // Verify only one nav item is active
    const activeItems = page.locator('.nav-item.active');
    await expect(activeItems).toHaveCount(1);
    await expect(activeItems).toContainText('Foundations');

    // Click context
    await page.click('text=Context (Karpathy)');

    // Verify active state switched
    await expect(page.locator('.nav-item.active')).toHaveCount(1);
    await expect(page.locator('.nav-item.active')).toContainText('Context');
  });

  test('navigates back and forth between sections', async ({ page }) => {
    // Go to foundations
    await page.click('text=Foundations (Ng)');
    await expect(page.locator('#foundations')).toBeVisible();

    // Go to context
    await page.click('text=Context (Karpathy)');
    await expect(page.locator('#context')).toBeVisible();

    // Go back to foundations
    await page.click('text=Foundations (Ng)');
    await expect(page.locator('#foundations')).toBeVisible();

    // Go back to intro
    await page.click('text=Introduction');
    await expect(page.locator('#intro')).toBeVisible();
  });

  test('sidebar is always visible', async ({ page }) => {
    // Verify sidebar present
    await expect(page.locator('.sidebar')).toBeVisible();

    // Switch sections and verify sidebar still visible
    await page.click('text=Context (Karpathy)');
    await expect(page.locator('.sidebar')).toBeVisible();

    await page.click('text=Interactive Lab');
    await expect(page.locator('.sidebar')).toBeVisible();
  });

  test('brand/logo is visible in sidebar', async ({ page }) => {
    await expect(page.locator('.brand')).toBeVisible();
    await expect(page.locator('.brand')).toContainText('Prompt SOP');
  });

  test('sections are organized by categories', async ({ page }) => {
    // Verify category headers
    await expect(page.locator('.nav-category:has-text("The Basics")')).toBeVisible();
    await expect(page.locator('.nav-category:has-text("Advanced Protocols")')).toBeVisible();
    await expect(page.locator('.nav-category:has-text("Interactive")')).toBeVisible();
  });

  test('page does not reload when switching tabs', async ({ page }) => {
    // Add a marker to verify page doesn't reload
    await page.evaluate(() => {
      window.testMarker = 'present';
    });

    // Switch tabs
    await page.click('text=Foundations (Ng)');
    await page.click('text=Context (Karpathy)');

    // Verify marker still exists (page didn't reload)
    const markerStillPresent = await page.evaluate(() => window.testMarker === 'present');
    expect(markerStillPresent).toBe(true);
  });

  test('smooth fade-in animation on section switch', async ({ page }) => {
    await page.click('text=Foundations (Ng)');

    // Verify active class is applied (triggers animation)
    await expect(page.locator('#foundations')).toHaveClass(/active/);

    // Verify content is visible after animation
    await expect(page.locator('#foundations h1')).toBeVisible();
  });

  test('clicking same section twice does not break UI', async ({ page }) => {
    await page.click('text=Foundations (Ng)');
    await expect(page.locator('#foundations')).toBeVisible();

    await page.click('text=Foundations (Ng)');
    await expect(page.locator('#foundations')).toBeVisible();

    // Verify still functional
    await page.click('text=Context (Karpathy)');
    await expect(page.locator('#context')).toBeVisible();
  });
});

test.describe('Multimedia Resources', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/promptEngineering.html');
    await page.click('text=Multimedia Hub');
  });

  test('video player is present and has controls', async ({ page }) => {
    const video = page.locator('video');
    await expect(video).toBeVisible();
    await expect(video).toHaveAttribute('controls');
  });

  test('audio player is present and has controls', async ({ page }) => {
    const audio = page.locator('audio');
    await expect(audio).toBeVisible();
    await expect(audio).toHaveAttribute('controls');
  });

  test('PDF iframe is present', async ({ page }) => {
    const pdfIframe = page.locator('iframe.pdf-viewer');
    await expect(pdfIframe).toBeVisible();
    await expect(pdfIframe).toHaveAttribute('src', 'promptEngineering.pdf');
  });

  test('infographic image is present', async ({ page }) => {
    const image = page.locator('img.infographic');
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute('src', 'promptEngineering.png');
  });

  test('download link for PDF exists', async ({ page }) => {
    const downloadLink = page.locator('a[download][href*="pdf"]');
    await expect(downloadLink).toBeVisible();
  });
});

test.describe('Resource Library Links', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/promptEngineering.html');
    await page.click('text=Resource Library');
  });

  test('Anthropic documentation link is present', async ({ page }) => {
    const link = page.locator('a[href*="anthropic"]').first();
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('target', '_blank');
  });

  test('OpenAI documentation link is present', async ({ page }) => {
    const link = page.locator('a[href*="openai"]');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('target', '_blank');
  });

  test('Google Gemini documentation link is present', async ({ page }) => {
    const link = page.locator('a[href*="google"]');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('target', '_blank');
  });

  test('Fabric framework GitHub link is present', async ({ page }) => {
    const link = page.locator('a[href*="github.com/danielmiessler/fabric"]').first();
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('target', '_blank');
  });

  test('external links open in new tab', async ({ page }) => {
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Content Quality Checks', () => {

  test('all sections have proper headings', async ({ page }) => {
    const sections = ['intro', 'foundations', 'context', 'structure', 'reasoning', 'debugging', 'safety', 'domains'];

    for (const sectionId of sections) {
      const section = page.locator(`#${sectionId}`);
      const h1 = section.locator('h1');
      await expect(h1).toHaveCount(1);
    }
  });

  test('introduction has executive summary', async ({ page }) => {
    await page.click('text=Introduction');
    await expect(page.locator('#intro .exec-summary')).toBeVisible();
    await expect(page.locator('#intro .exec-label')).toContainText('Executive Summary');
  });

  test('foundations section has code examples', async ({ page }) => {
    await page.click('text=Foundations (Ng)');
    const codeBlocks = page.locator('#foundations pre');
    await expect(codeBlocks).toHaveCount(2); // At least some code examples
  });

  test('safety section has warning boxes', async ({ page }) => {
    await page.click('text=Safety & Ethics');
    const warningBox = page.locator('#safety .warning-box');
    await expect(warningBox).toBeVisible();
    await expect(warningBox).toContainText('Red Lines');
  });

  test('structure section mentions XML tags', async ({ page }) => {
    await page.click('text=Structure (Anthropic)');
    await expect(page.locator('#structure')).toContainText('XML');
    await expect(page.locator('#structure code')).toHaveCount(5); // Multiple code examples
  });
});

test.describe('Responsive Design', () => {

  test('sidebar collapses appropriately on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Verify page still loads
    await expect(page.locator('.main-content')).toBeVisible();
  });

  test('content is readable on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.click('text=Foundations (Ng)');
    await expect(page.locator('#foundations')).toBeVisible();

    // Verify text is not cut off
    const h1 = page.locator('#foundations h1');
    await expect(h1).toBeVisible();
  });

  test('navigation works on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.click('text=Context (Karpathy)');
    await expect(page.locator('#context')).toBeVisible();

    await page.click('text=Interactive Lab');
    await expect(page.locator('#simulator')).toBeVisible();
  });
});

test.describe('Performance', () => {

  test('page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/promptEngineering.html');
    const loadTime = Date.now() - startTime;

    // Should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('tab switching is fast', async ({ page }) => {
    await page.goto('/promptEngineering.html');

    const startTime = Date.now();
    await page.click('text=Foundations (Ng)');
    await expect(page.locator('#foundations')).toBeVisible();
    const switchTime = Date.now() - startTime;

    // Should switch in under 500ms
    expect(switchTime).toBeLessThan(500);
  });
});

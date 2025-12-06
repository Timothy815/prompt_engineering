# Prompt Assessment Workbench - Enhancement Plan

## Overview
This document outlines proposed improvements to the interactive prompt simulator feature in `promptEngineering.html`. The workbench is currently one of the strongest pedagogical features of the handbook, and these enhancements will make it even more effective for teaching professional prompt engineering.

---

## Current Strengths

- ✅ **Clear pedagogical alignment** - Each check ties directly to a framework author (Karpathy, Ng, Miessler)
- ✅ **Immediate feedback loop** - Users learn by doing, excellent for retention
- ✅ **Visual tag system** - Success/fail/info badges make feedback scannable
- ✅ **Safety-conscious** - PII detection demonstrates ethics awareness
- ✅ **Progressive difficulty** - Checks build from basic to advanced concepts

---

## Enhancement Roadmap

### Priority 1: Core Functionality Improvements

#### 1.1 Display Score and Grade
**Status:** High Impact, Easy Implementation
**Lines affected:** `analyzePrompt()` function (lines 551-619)

**Current behavior:**
- Calculates `score` variable but never displays it
- No overall grade or performance metric shown

**Proposed implementation:**
```javascript
// After all checks, before displaying feedback (around line 608)
const maxScore = 4;
const percentage = (score / maxScore) * 100;
let grade, gradeColor;

if (percentage === 100) {
    grade = 'Expert';
    gradeColor = '#166534'; // green
} else if (percentage >= 75) {
    grade = 'Proficient';
    gradeColor = '#075985'; // blue
} else if (percentage >= 50) {
    grade = 'Developing';
    gradeColor = '#d97706'; // orange
} else {
    grade = 'Novice';
    gradeColor = '#991b1b'; // red
}

feedback += `<hr style="margin: 20px 0; border: none; border-top: 1px solid var(--border);">`;
feedback += `<p style="font-size: 1.1rem;"><strong>Overall Score:</strong> ${score}/${maxScore} (${percentage}%)</p>`;
feedback += `<p><span class="tag" style="background: ${gradeColor}20; color: ${gradeColor}; font-size: 0.9rem; padding: 4px 12px;">${grade} Level</span></p>`;
```

**Educational benefit:** Gamification encourages iteration and improvement

---

#### 1.2 Add Chain of Thought Detection
**Status:** High Priority - Aligns with Section 5
**Lines affected:** Add new check around line 603

**Current gap:**
- Section 5 teaches CoT reasoning (Schulhoff's framework)
- Simulator doesn't check for CoT phrases

**Proposed implementation:**
```javascript
// CHECK: Chain of Thought (Schulhoff)
const cotPhrases = [
    'step by step',
    'step-by-step',
    'think through',
    'reasoning',
    'explain your thinking',
    'show your work',
    'break it down',
    'take a deep breath'
];

if (cotPhrases.some(phrase => lower.includes(phrase))) {
    feedback += "<p><span class='tag tag-success'>✅ CoT Reasoning</span> You're encouraging the AI to think step-by-step (Schulhoff's method).</p>";
    score++;
    maxScore = 5; // Update max score
} else {
    feedback += "<p><span class='tag tag-info'>ℹ️ Advanced Tip</span> For complex tasks, add 'Think step-by-step' to improve reasoning accuracy.</p>";
}
```

**Educational benefit:** Reinforces Section 5 concepts in practice

---

#### 1.3 Enhanced PII Detection
**Status:** Medium Priority - Security Enhancement
**Lines affected:** Replace current PII check (line 605)

**Current behavior:**
- Only detects exact strings: "student name", "password", "@gmail.com"
- Misses actual PII like phone numbers, SSNs, real email addresses

**Proposed implementation:**
```javascript
// CHECK: Safety & PII (Enhanced)
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|edu|net|gov)/gi;
const phoneRegex = /(\d{3}[-.\s]??\d{3}[-.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-.\s]??\d{4})/g;
const ssnRegex = /\d{3}-\d{2}-\d{4}/g;
const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;

let piiFound = [];

if (emailRegex.test(input)) piiFound.push('email address');
if (phoneRegex.test(input)) piiFound.push('phone number');
if (ssnRegex.test(input)) piiFound.push('SSN');
if (ipRegex.test(input)) piiFound.push('IP address');
if (lower.includes('password') || lower.includes('api key') || lower.includes('token')) {
    piiFound.push('credentials');
}

if (piiFound.length > 0) {
    feedback += `<div class='warning-box' style='margin-top:10px; padding:15px;'>
        🚨 <strong>SAFETY ALERT:</strong> Detected possible PII: ${piiFound.join(', ')}.
        Review Section 7 on data sanitization before submitting prompts with sensitive information.
    </div>`;
}
```

**Educational benefit:** Teaches real-world data privacy patterns

---

### Priority 2: User Experience Enhancements

#### 2.1 Preset Example Prompts
**Status:** High Educational Value
**Implementation:** Add dropdown above simulator

**Proposed UI addition (before line 499):**
```html
<div style="margin-bottom: 15px;">
    <label style="font-weight: 600; margin-right: 10px;">Load Example:</label>
    <select id="exampleSelector" onchange="loadExample()" style="padding: 8px; border-radius: 6px; border: 2px solid var(--border);">
        <option value="">-- Choose an example --</option>
        <option value="bad">❌ Bad Prompt (Novice)</option>
        <option value="good">✅ Good Prompt (SOP Compliant)</option>
        <option value="expert">🏆 Expert Prompt (XML Structured)</option>
    </select>
</div>
```

**Proposed JavaScript function:**
```javascript
function loadExample() {
    const selector = document.getElementById('exampleSelector');
    const input = document.getElementById('userInput');

    const examples = {
        bad: "Summarize this text about cars.",

        good: `You are an automotive technology instructor at a career center.

Summarize the following text for high school students in simple terms:
"""
[Insert text about vehicle diagnostics here]
"""

Output as a bulleted list.`,

        expert: `<system_role>
You are a Senior Automotive Technology instructor with 15 years of experience teaching diagnostics.
</system_role>

<context>
My students are high school juniors in an automotive program. They understand basic engine components but are new to OBDII diagnostics.
</context>

<task>
Create a diagnostic decision tree for troubleshooting a P0300 code (random misfire).
</task>

<constraints>
- Use IF/THEN format
- Keep steps to 5 or fewer
- Focus on the most common causes first
- Output as a markdown flowchart
</constraints>`
    };

    if (selector.value) {
        input.value = examples[selector.value];
    }
}
```

**Educational benefit:** Students learn by comparing bad vs. good examples

---

#### 2.2 XML Structure Detection
**Status:** Medium Priority - Aligns with Section 4
**Lines affected:** Add new check after delimiter detection

**Proposed implementation:**
```javascript
// CHECK: XML Structure (Anthropic)
const xmlTags = ['<system_role>', '<context>', '<task>', '<constraints>', '<instructions>', '<output>', '<examples>'];
const xmlTagsFound = xmlTags.filter(tag => input.includes(tag));

if (xmlTagsFound.length >= 3) {
    feedback += `<p><span class='tag tag-success'>✅ XML Structure</span> Professional-grade architecture! Found ${xmlTagsFound.length} structured sections.</p>`;
    score += 2; // Bonus points for advanced technique
} else if (xmlTagsFound.length > 0) {
    feedback += `<p><span class='tag tag-info'>ℹ️ Partial Structure</span> You're using some XML tags. See Section 4 for the complete template.</p>`;
}
```

**Educational benefit:** Rewards use of advanced structuring from Section 4

---

#### 2.3 Interactive Section Links
**Status:** High Value - Creates Cohesive Learning
**Lines affected:** Update all feedback messages

**Current behavior:**
- Tells users what's wrong
- Doesn't direct them to learning resources

**Proposed implementation:**
Replace each feedback string with enhanced version including links:

```javascript
// Example for Persona check
if (lower.includes('act as') || lower.includes('you are') || lower.includes('role')) {
    feedback += "<p><span class='tag tag-success'>✅ Persona Detected</span> You successfully assigned a role to the AI.</p>";
    score++;
} else {
    feedback += `<p><span class='tag tag-fail'>⚠️ No Persona</span> Who is the AI supposed to be?
    <a href='#' onclick='switchTab("context"); return false;' style='font-weight: 600;'>→ Learn about Persona Patterns</a></p>`;
}

// Example for Delimiters
if (input.includes('"""') || input.includes("```") || input.includes("<")) {
    feedback += "<p><span class='tag tag-success'>✅ Delimiters Used</span> Great job separating instructions from data.</p>";
    score++;
} else {
    feedback += `<p><span class='tag tag-info'>ℹ️ Tip</span> If you are pasting text to be summarized/edited, wrap it in triple quotes.
    <a href='#' onclick='switchTab("foundations"); return false;' style='font-weight: 600;'>→ See Section 2: Delimiters</a></p>`;
}
```

**Educational benefit:** Transforms simulator into navigation hub

---

### Priority 3: Advanced Features

#### 3.1 "Suggest Improvements" Button
**Status:** Advanced - Requires Prompt Generation Logic
**Implementation:** Add button after analysis, generate improved version

**Proposed UI addition:**
```javascript
// Add to end of feedback (before display)
if (score < maxScore) {
    feedback += `<div style="margin-top: 20px; text-align: center;">
        <button onclick="suggestImprovement()" style="background: var(--primary); color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
            💡 Generate Improved Version
        </button>
    </div>`;
}
```

**Proposed function:**
```javascript
function suggestImprovement() {
    const originalPrompt = document.querySelectorAll('.sim-message.sim-user');
    const lastPrompt = originalPrompt[originalPrompt.length - 1].innerText;

    let improved = lastPrompt;

    // Add persona if missing
    if (!improved.toLowerCase().includes('you are')) {
        improved = 'You are an expert assistant.\n\n' + improved;
    }

    // Add output format if missing
    const formats = ['json', 'csv', 'table', 'markdown', 'list'];
    if (!formats.some(f => improved.toLowerCase().includes(f))) {
        improved += '\n\nOutput as a markdown list.';
    }

    // Wrap in delimiters if not present
    if (!improved.includes('"""') && !improved.includes('```')) {
        improved = improved.replace(/(.+text.+)/i, '$1\n"""\n[Insert text here]\n"""');
    }

    // Display improved version
    const display = document.getElementById('chatDisplay');
    const suggestionMsg = document.createElement('div');
    suggestionMsg.className = 'sim-message sim-ai';
    suggestionMsg.innerHTML = `<h4>📝 Suggested Improvement:</h4><pre style="white-space: pre-wrap; background: #f8fafc; color: #334155; padding: 15px; border-radius: 6px; border: 2px solid var(--primary);">${improved}</pre><button onclick="copyToInput('${improved.replace(/'/g, "\\'")}')">Copy to Input</button>`;
    display.appendChild(suggestionMsg);
    display.scrollTop = display.scrollHeight;
}

function copyToInput(text) {
    document.getElementById('userInput').value = text;
}
```

**Educational benefit:** Shows concrete improvements, not just criticism

---

#### 3.2 Comparison Mode
**Status:** Advanced
**Implementation:** Add split-screen interface

**Concept:**
- Two text areas side-by-side
- "Compare" button runs analysis on both
- Shows score difference
- Highlights which version is better for each criterion

**UI mockup:**
```html
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
    <div>
        <h4>Version A</h4>
        <textarea id="compareA"></textarea>
    </div>
    <div>
        <h4>Version B</h4>
        <textarea id="compareB"></textarea>
    </div>
</div>
<button onclick="comparePrompts()">⚖️ Compare Both</button>
```

---

#### 3.3 Export Analysis Report
**Status:** Medium Priority
**Implementation:** Add export button after analysis

**Proposed implementation:**
```javascript
function exportAnalysis() {
    const display = document.getElementById('chatDisplay');
    const messages = display.querySelectorAll('.sim-message');

    let markdown = '# Prompt Analysis Report\n\n';
    markdown += `**Generated:** ${new Date().toLocaleString()}\n\n`;

    messages.forEach((msg, i) => {
        if (msg.classList.contains('sim-user')) {
            markdown += `## Prompt ${Math.floor(i/2) + 1}\n\n\`\`\`\n${msg.innerText}\n\`\`\`\n\n`;
        } else {
            markdown += `### Analysis\n\n${msg.innerText}\n\n---\n\n`;
        }
    });

    // Download as .md file
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt_analysis_report.md';
    a.click();
}
```

**Educational benefit:** Students can include in portfolios

---

#### 3.4 Progress Tracking
**Status:** Advanced - Requires localStorage
**Implementation:** Track user's improvement over time

**Concept:**
- Store scores from each session in localStorage
- Display trend chart showing improvement
- "Your Best Score: X/Y" motivational element
- Weekly/monthly progress stats

**Key code:**
```javascript
function saveScore(score, maxScore) {
    const history = JSON.parse(localStorage.getItem('promptHistory') || '[]');
    history.push({
        date: new Date().toISOString(),
        score: score,
        maxScore: maxScore,
        percentage: (score / maxScore) * 100
    });
    localStorage.setItem('promptHistory', JSON.stringify(history));
}

function showProgress() {
    const history = JSON.parse(localStorage.getItem('promptHistory') || '[]');
    // Generate chart/stats display
}
```

---

## Implementation Priority Matrix

| Enhancement | Impact | Difficulty | Priority |
|------------|--------|------------|----------|
| 1.1 Display Score & Grade | High | Low | **Do First** |
| 1.2 CoT Detection | High | Low | **Do First** |
| 2.1 Preset Examples | High | Medium | **Do First** |
| 2.3 Section Links | High | Medium | **Do Second** |
| 1.3 Enhanced PII | Medium | Medium | Do Second |
| 2.2 XML Detection | Medium | Low | Do Second |
| 3.1 Suggest Improvements | High | High | Do Third |
| 3.3 Export Reports | Medium | Medium | Do Third |
| 3.2 Comparison Mode | Medium | High | Future |
| 3.4 Progress Tracking | Medium | High | Future |

---

## Quick Wins (Implement Today)

If selecting just **3-4 improvements** for immediate implementation:

1. **Display Score & Grade** (1.1) - 10 lines of code, massive UX improvement
2. **CoT Detection** (1.2) - Aligns handbook sections, easy to add
3. **Preset Examples** (2.1) - Huge learning accelerator
4. **Section Links** (2.3) - Transforms isolated tool into integrated learning hub

These four changes would elevate the workbench from "good" to "exceptional" with minimal development time.

---

## Testing Checklist

After implementing improvements:

- [ ] Test with all 3 preset examples
- [ ] Verify score displays correctly for 0/X, X/2, X/X scenarios
- [ ] Test PII detection with real email/phone formats
- [ ] Verify section links navigate correctly
- [ ] Test on mobile viewport (responsive design)
- [ ] Validate HTML/CSS (no console errors)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Accessibility check (keyboard navigation, screen readers)

---

## Future Vision

**Version 2.0 Concept:**
- AI-powered analysis (integrate with OpenAI/Anthropic APIs for real feedback)
- Prompt library with community submissions
- Challenge mode: "Fix this broken prompt in 3 tries"
- Leaderboard for educators to compete
- Integration with LMS platforms for gradebook sync

---

**Document Version:** 1.0
**Last Updated:** 2025-12-06
**Maintainer:** Timothy Koerner
**Feedback:** Submit issues or suggestions via GitHub repository

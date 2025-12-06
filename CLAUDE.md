# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **Prompt Engineering Educational Resource** - a self-contained interactive handbook teaching professional prompt engineering techniques. The primary deliverable is a single-page HTML application with embedded multimedia resources.

## Architecture

### Single-Page Application Structure
- **Main Document**: `promptEngineering.html` - A standalone HTML file containing all content, styling, and interactivity
- **No Build System**: Pure HTML/CSS/JavaScript with no dependencies or compilation steps
- **Embedded Resources**: All multimedia files are referenced locally

### Content Organization
The HTML uses a **tab-based navigation system** with 11 distinct sections:

**Core Curriculum (Sections 1-5)**
- Introduction to prompt engineering fundamentals
- Foundations (Andrew Ng's delimiter methodology)
- Context engineering (Andrej Karpathy's approach)
- XML structure patterns (Anthropic research)
- Advanced reasoning (Chain of Thought prompting)

**Advanced Topics (Sections 6-8)**
- Debugging and iterative refinement
- Safety protocols and data sanitization
- Domain-specific patterns (Python/Cybersecurity, Automotive)

**Interactive Features (Sections 9-11)**
- Multimedia hub with embedded video/audio/PDF/image viewers
- Interactive prompt simulator with real-time analysis
- Resource library with external documentation links

### Key Technical Components

**Navigation System**
- JavaScript `switchTab()` function toggles between sections
- CSS classes `.section-content.active` control visibility
- Sidebar `.nav-item` elements trigger tab switching

**Interactive Simulator**
- `analyzePrompt()` function performs client-side prompt analysis
- Checks for: context length, persona assignment, delimiters, output format, PII detection
- Provides scored feedback with visual tags (success/fail/info)

**Multimedia Integration**
- Video: `promptEngineering.mp4`
- Audio: `promptEngineering.m4a`
- PDF slides: `promptEngineering.pdf` (embedded via iframe)
- Infographic: `promptEngineering.png`

## Common Tasks

### Testing the Interactive Features
```bash
# Open in browser to test (macOS)
open promptEngineering.html

# Or use Python's built-in server
python3 -m http.server 8000
# Then navigate to http://localhost:8000/promptEngineering.html
```

### Validating HTML Structure
```bash
# Check for syntax errors (requires tidy)
tidy -errors promptEngineering.html
```

### Modifying Content Sections
Each section is wrapped in a `<div id="sectionName" class="section-content container">` block. To add/edit content:
1. Locate the target section by its `id` attribute
2. Modify the HTML within the container
3. Ensure proper heading hierarchy (h1 for titles, h2 for major subsections, h3 for minor)
4. Add corresponding navigation entry in the sidebar if creating new sections

### Updating the Simulator Logic
The prompt analysis engine is in the `analyzePrompt()` JavaScript function (lines 551-619). It evaluates:
- Context length threshold (>50 characters)
- Persona keywords: "act as", "you are", "role"
- Delimiter detection: `"""`, ` ``` `, `<` (XML tags)
- Output format keywords: json, csv, table, markdown, list, code, python, html, tree
- PII detection: "student name", "password", email patterns

### Styling Conventions
- CSS variables in `:root` define the color scheme
- Component classes: `.exec-summary`, `.warning-box`, `.media-card`, `.sim-container`
- Responsive design uses flexbox (sidebar) and grid (media cards)
- Monospace code blocks use `--code-bg: #1e293b` with syntax highlighting via `<code>` tags

## Important Design Principles

**Self-Contained Design**
All resources must be locally referenced. The HTML is designed to work offline. Do not introduce external CDN dependencies.

**Educational Focus**
Content is structured around industry frameworks from recognized experts (Andrew Ng, Andrej Karpathy, Anthropic Research, Daniel Miessler). Maintain academic rigor and cite sources when adding content.

**Safety-First Messaging**
The handbook emphasizes data sanitization and PII protection. Any new examples must demonstrate proper handling of sensitive information.

**Progressive Disclosure**
Content flows from basic (delimiters) to advanced (Chain of Thought). New sections should maintain this learning progression.

## File Dependencies

The HTML file expects these multimedia files in the same directory:
- `promptEngineering.mp4` (video)
- `promptEngineering.m4a` (audio)
- `promptEngineering.pdf` (slides)
- `promptEngineering.png` (infographic)

Missing files will result in broken media embeds but won't break the core functionality.

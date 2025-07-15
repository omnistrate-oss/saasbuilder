# GitHub Copilot Instructions for Omnistrate Website

## Code Review Guidelines

When reviewing code for this project, please include the following checks:

### English Syntax and Grammar Review

- **Text Content**: Carefully review all user-facing text content including:
  - Marketing copy and value propositions
  - Headlines, subheadings, and CTAs (Call-to-Actions)
  - Component text and labels
  - Error messages and notifications
  - Comments in code
  - Documentation strings
  - README files and documentation
  - Meta descriptions and SEO content
  - Legal pages (privacy policy, terms of service)
  - Configuration files with text content

- **Grammar and Syntax Checks**:
  - Check for proper grammar, spelling, and punctuation
  - Ensure consistent tone and voice across the application
  - Verify proper capitalization and formatting (follow AP Style for headlines)
  - Look for typos and misspellings
  - Check for clarity and readability of user-facing messages
  - Ensure proper use of active voice over passive voice
  - Verify sentence structure and flow for marketing content

- **Content Standards**:
  - Ensure professional and clear communication appropriate for enterprise B2B audience
  - Maintain consistency with existing content style and brand voice
  - Verify that technical terms are used correctly and consistently
  - Check that abbreviations and acronyms are properly defined when first used
  - Ensure marketing claims are clear, accurate, and not misleading
  - Verify accessibility compliance (WCAG 2.1 AA standards)
  - Check for inclusive language and avoid jargon that may exclude audiences

### Deprecated Terms (Flag for Replacement)
When reviewing content, flag these outdated terms and suggest the correct alternatives:

| Deprecated Term | Correct Term |
|----------------|--------------|
| Service | SaaS Product |
| SaaS Offer | SaaS Product |
| Service Plan | Plan |
| Create SaaS Offer | Create SaaS Product |
| service name | product name |
| Service Component | Resource |
| Service Provider | SaaS Provider |
| Service Blueprint | Plan Blueprint |
| Service Environment | Environment |
| Hosting Model | Tenancy Type |
| Events | Notification |
| Alarm | Alerts |
| Docker image | Container image |

### Technical Review Areas

- **React/Next.js Components**: Review JSX content for text accuracy and SEO optimization
- **TypeScript/JavaScript**: Check string literals, comments, and documentation
- **Configuration Files**: Verify text content in JSON, YAML, and other config files
- **Styling**: Review CSS class names and text-related styles for consistency
- **SEO Elements**: Review meta tags, structured data, and page titles
- **Performance**: Ensure text content doesn't negatively impact Core Web Vitals
- **Accessibility**: Check ARIA labels, alt text, and screen reader compatibility

### Specific Focus Areas for This Project

- **Marketing copy and messaging accuracy** - ensure value propositions are clear and compelling
- **Technical documentation clarity** - make complex concepts accessible to non-technical stakeholders
- **Error handling messages** - provide helpful, actionable guidance to users
- **User interface text and microcopy** - maintain consistency in button labels, form fields, tooltips
- **SEO-related content** (meta descriptions, titles, headings) - optimize for search visibility
- **Legal compliance** - ensure privacy policy, terms of service, and cookie notices are accurate
- **Brand consistency** - maintain consistent messaging across all touchpoints
- **Conversion optimization** - ensure CTAs and form copy drive desired user actions

## Review Process

1. **Content Review**: Always include grammar and syntax feedback alongside technical feedback
2. **Brand Voice**: Ensure content aligns with professional, enterprise-focused tone
3. **Suggestions**: Provide specific suggestions for improving text clarity and correctness
4. **Consistency**: Flag any inconsistencies in terminology or writing style
5. **Accessibility**: Ensure text content is accessible and easy to understand
6. **SEO Compliance**: Verify content follows SEO best practices for B2B SaaS
7. **Legal Compliance**: Check that legal language and disclaimers are accurate
8. **Conversion Optimization**: Ensure marketing copy drives desired user actions

## Examples of What to Flag

```typescript
// ❌ Flag this - grammar error
const errorMessage = "An error has occured while processing your request";

// ✅ Suggest this instead
const errorMessage = "An error has occurred while processing your request";
```

```jsx
// ❌ Flag this - inconsistent capitalization and weak CTA
<Button>get Started for free</Button>

// ✅ Suggest this instead
<Button>Get Started for Free</Button>
```

```jsx
// ❌ Flag this - deprecated terminology
<h2>Create Your Service</h2>

// ✅ Suggest this instead
<h2>Create Your SaaS Product</h2>
```

```html
<!-- ❌ Flag this - missing accessibility -->
<img src="product-screenshot.png" />

<!-- ✅ Suggest this instead -->
<img src="product-screenshot.png" alt="Omnistrate dashboard showing SaaS product deployment interface" />
```

Please integrate these English syntax and grammar checks into your standard code review process for this project.

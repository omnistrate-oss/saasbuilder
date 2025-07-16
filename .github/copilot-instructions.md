# GitHub Copilot Instructions for Omnistrate Website

## Code Review Guidelines

When reviewing code for this project, please include the following checks:

### TypeScript Implementation Review

- **Type Definitions**: Ensure all code has proper TypeScript implementation:

  - **Components**: All React components should have defined props interfaces/types
  - **Hooks**: Custom hooks should have proper return type definitions and parameter types
  - **API Layer**: All API calls (Axios, TanStack Query, OpenAPI Fetch) should have defined request/response types
  - **Forms**: Form validation, submission handlers, and form data should be properly typed
  - **State Management**: Redux slices, context providers, and state should have defined types
  - **Utility Functions**: All utility functions should have proper input/output types

- **Type Safety Best Practices**:

  - Avoid using `any` type - use proper type definitions or `unknown` when appropriate
  - Implement proper null and undefined checks using optional chaining (`?.`) and nullish coalescing (`??`)
  - Use type guards and type assertions correctly
  - Ensure proper error handling with typed error objects
  - Use generic types appropriately for reusable components and functions
  - Implement proper enum usage instead of string literals where applicable
  - Use `strict` mode TypeScript configuration compliance

- **Code Examples to Flag**:

```typescript
// ❌ Flag this - missing types and null checks
const Component = (props) => {
  const data = props.data.map(item => item.name);
  return <div>{data}</div>;
};

// ✅ Suggest this instead
interface ComponentProps {
  data: Array<{ name: string; id: string }>;
}

const Component: React.FC<ComponentProps> = ({ data }) => {
  const names = data?.map(item => item.name) ?? [];
  return <div>{names.join(', ')}</div>;
};
```

```typescript
// ❌ Flag this - untyped API call
const fetchUser = async (id) => {
  const response = await axios.get(`/api/users/${id}`);
  return response.data;
};

// ✅ Suggest this instead
interface User {
  id: string;
  name: string;
  email: string;
}

const fetchUser = async (id: string): Promise<User> => {
  const response = await axios.get<User>(`/api/users/${id}`);
  return response.data;
};
```

### Testing Requirements

- **Test Coverage**: Ensure comprehensive test coverage for all new features:

  - **Required**: Every new feature must have either integration tests OR E2E tests (or both) to ensure the feature works correctly in realistic scenarios

- **General Testing Best Practices**:

  - Use proper test structure (Arrange, Act, Assert)
  - Mock external dependencies appropriately
  - Test error scenarios and edge cases
  - Ensure tests are deterministic and don't rely on external state
  - Use meaningful test descriptions that explain what is being tested

- **Playwright E2E Testing Best Practices**:

  - **Test Organization**: Use `test.describe()` for grouping related tests and `test.describe.configure({ mode: "serial" })` for dependent test sequences
  - **Page Object Pattern**: Always use page objects for reusable UI interactions (see existing `page-objects/` directory)
  - **Data Test IDs**: Use `getByTestId()` for reliable element selection instead of text-based selectors when possible
  - **Wait Strategies**: Use appropriate wait strategies (`waitForLoadState("networkidle")`, `waitForResponse()`, `waitFor()`) instead of fixed timeouts
  - **Environment Variables**: Always use environment variables for test data (emails, passwords, URLs)
  - **State Management**: Use the GlobalStateManager for sharing data between tests
  - **Authentication**: Leverage the user-setup.spec.ts pattern with `storageState` for authenticated test scenarios
  - **API Integration**: Use API clients (`UserAPIClient`, `ProviderAPIClient`) for setup/teardown and data verification
  - **Timeouts**: Configure appropriate timeouts for different test types (current: 12 minutes for E2E, 30 seconds for actions)

- **Required Test Types for New Features**:

```typescript
// ❌ Flag this - missing tests for new feature
const calculatePricing = (plan: Plan, usage: Usage): number => {
  // Complex pricing logic
  return price;
};

// ✅ Suggest this instead - with accompanying tests
describe("calculatePricing", () => {
  it("should calculate correct price for basic plan", () => {
    const plan = { type: "basic", basePrice: 10 };
    const usage = { requests: 1000 };
    expect(calculatePricing(plan, usage)).toBe(10);
  });

  it("should handle null usage gracefully", () => {
    const plan = { type: "basic", basePrice: 10 };
    expect(() => calculatePricing(plan, null)).not.toThrow();
  });
});
```

- **Playwright Test Examples to Follow**:

```typescript
// ✅ Good Playwright test structure
test.describe("Feature Name", () => {
  let pageObject: PageObjectClass;

  test.beforeEach(async ({ page }) => {
    pageObject = new PageObjectClass(page);
    await pageObject.navigate();
    await page.waitForLoadState("networkidle");
  });

  test("should perform basic functionality", async ({ page }) => {
    // Arrange
    const dataTestIds = pageObject.dataTestIds;

    // Act
    await page.getByTestId(dataTestIds.inputField).fill("test value");
    await page.getByTestId(dataTestIds.submitButton).click();

    // Assert
    await expect(page.getByTestId(dataTestIds.successMessage)).toBeVisible();
  });
});
```

```typescript
// ✅ Good pattern for API integration
test("should create resource and verify in UI", async ({ page }) => {
  // Setup via API
  const apiClient = new UserAPIClient();
  const resource = await apiClient.createResource(testData);

  // Verify in UI
  await pageObject.navigate();
  await expect(page.getByTestId(resource.id)).toBeVisible();

  // Cleanup via API
  await apiClient.deleteResource(resource.id);
});
```

```typescript
// ✅ Good pattern for waiting and response interception
test("should handle async operations", async ({ page }) => {
  // Intercept API response
  const responsePromise = page.waitForResponse((response) => response.url().includes("/api/endpoint"));

  await page.getByTestId("trigger-button").click();

  const response = await responsePromise;
  const data = await response.json();

  // Verify response data
  expect(data.status).toBe("success");
});
```

- **Playwright Anti-Patterns to Flag**:

```typescript
// ❌ Flag this - avoid fixed timeouts
await page.waitForTimeout(5000);

// ✅ Suggest this instead
await page.waitForLoadState("networkidle");
// or
await expect(page.getByTestId("element")).toBeVisible();

// ❌ Flag this - avoid text-based selectors for dynamic content
await page.getByText("Submit").click();

// ✅ Suggest this instead
await page.getByTestId("submit-button").click();

// ❌ Flag this - missing cleanup
test("should create resource", async () => {
  const resource = await apiClient.createResource();
  // test logic but no cleanup
});

// ✅ Suggest this instead
test("should create resource", async () => {
  const resource = await apiClient.createResource();
  // test logic

  // Cleanup
  await apiClient.deleteResource(resource.id);
});
```

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

| Deprecated Term     | Correct Term        |
| ------------------- | ------------------- |
| Service             | SaaS Product        |
| SaaS Offer          | SaaS Product        |
| Service Plan        | Plan                |
| Create SaaS Offer   | Create SaaS Product |
| service name        | product name        |
| Service Component   | Resource            |
| Service Provider    | SaaS Provider       |
| Service Blueprint   | Plan Blueprint      |
| Service Environment | Environment         |
| Hosting Model       | Tenancy Type        |
| Events              | Notification        |
| Alarm               | Alerts              |
| Docker image        | Container image     |

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

```jsx
// ❌ Flag this - incorrect capitalization of SaaS
<p>Our Saas platform provides enterprise solutions</p>

// ✅ Suggest this instead
<p>Our SaaS platform provides enterprise solutions</p>
```

```jsx
// ❌ Flag this - inconsistent confirmation text and action
<Text>To confirm deletion type <b>unsubscribe</b> in the dialog below</Text>

// ✅ Suggest this instead
<Text>To confirm deletion type <b>deleteme</b> in the dialog below</Text>
```

```html
<!-- ❌ Flag this - missing accessibility -->
<img src="product-screenshot.png" />

<!-- ✅ Suggest this instead -->
<img src="product-screenshot.png" alt="Omnistrate dashboard showing SaaS product deployment interface" />
```

Please integrate these English syntax and grammar checks into your standard code review process for this project.

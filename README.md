# Salesforce Playwright TypeScript Automation Framework

A scalable Page Object Model (POM) test automation framework designed specifically for Salesforce Lightning UI applications using Playwright & TypeScript.

## Quick Start Instructions

1. Extract the downloaded ZIP file.
2. Open the project folder in VS Code:
   ```bash
   cd salesforce-playwright-framework
   ```
3. Install dependencies:
   ```bash
   npm install
   npx playwright install
   ```

## Running Tests

- **Run all tests in headed mode**:
  ```bash
  npm run test:headed
  ```
- **Run Scenario 1 (Lead -> Opportunity -> Closed Won)**:
  ```bash
  npm run test:scenario1
  ```
- **Run Scenario 2 (Case Creation & Status Lifecycle)**:
  ```bash
  npm run test:scenario2
  ```
- **View Execution HTML Report**:
  ```bash
  npm run report
  ```

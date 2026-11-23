import { test } from '@playwright/test';
import { ENV } from '../config/environment';
import { NavigationPage } from '../pages/NavigationPage';
import { CasePage } from '../pages/CasePage';

test.describe('Salesforce Scenario 2: Service App Case Status Lifecycle', () => {
  test('Validate case fields, save case, cycle statuses and verify', async ({ page }) => {
    const navPage = new NavigationPage(page);
    const casePage = new CasePage(page);

    const statusesToCycle = ['Working', 'Escalated','Closed'];

    // Session is already active via storageState - directly open App
    await page.goto(ENV.BASE_URL);
    await navPage.switchApp('Service');

    // Navigate to Cases & Create initial Case
    await navPage.navigateToTab('Cases');
    await casePage.createCase('Phone');

    // Cycle through status updates
    for (const status of statusesToCycle) {
      await casePage.updateAndValidateCaseStatus(status);
    }
  });
});
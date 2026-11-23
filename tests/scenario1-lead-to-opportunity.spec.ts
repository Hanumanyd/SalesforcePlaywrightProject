import { test } from '@playwright/test';
import { ENV } from '../config/environment';
import { NavigationPage } from '../pages/NavigationPage';
import { LeadPage } from '../pages/LeadPage';
import { OpportunityPage } from '../pages/OpportunityPage';

test.describe('Salesforce Scenario 1: Lead Conversion & Closed Won Flow', () => {
  test('Create Lead, convert to Opportunity, add products, and set Closed Won', async ({ page }) => {
    const navPage = new NavigationPage(page);
    const leadPage = new LeadPage(page);
    const oppPage = new OpportunityPage(page);

    const timeStamp = Date.now();
    const lastName = `AutoLead_${timeStamp}`;
    const company = `TestCompany_${timeStamp}`;

    // Session is already active via storageState - directly open App
    await page.goto(ENV.BASE_URL);
    await navPage.switchApp('Sales');

    // Lead operations
    await navPage.navigateToTab('Leads');
    await leadPage.createLead(lastName, company);

    // Convert Lead
    await leadPage.convertLead();
    await leadPage.validateAndOpenOpportunity();

    // Opportunity operations
    await oppPage.addProductAndQuantity('2');
    await oppPage.markOpportunityAsClosedWon();
    await oppPage.validateOpportunityStage('Closed Won');
  });
});
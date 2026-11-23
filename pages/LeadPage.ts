import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LeadPage extends BasePage {
  private newButton = this.page.locator('a[title="New"], button[name="New"], lightning-button:has-text("New")');
  
  // Resilient selectors handling both name="company" and label="Company"
  private lastNameInput = this.page.locator(
    'input[name="lastName"], input[name="LastName"], //label[contains(text(),"Last Name")]/following::input[1]'
  ).first();

  private companyInput = this.page.locator(
    'input[name="company"], input[name="Company"], //label[contains(text(),"Company")]/following::input[1]'
  ).first();

  private saveButton = this.page.locator('button[name="SaveEdit"], button:has-text("Save")').first();
  private convertButton = this.page.locator('button[name="Convert"], a[title="Convert"]');
  private finishConvertButton = this.page.locator('button.convertedTabConvertToOpportunity, button:has-text("Convert")').last();
  private goToOpportunityLink = this.page.locator('//div[contains(@class,"convertedSuccess")]//a[contains(@href,"Opportunity")]').first();

  async createLead(lastName: string, company: string) {
    await this.newButton.click();
    await this.waitForSpinnerToDisappear();

    await this.lastNameInput.waitFor({ state: 'visible', timeout: 20000 });
    await this.lastNameInput.fill(lastName);

    await this.companyInput.waitFor({ state: 'visible', timeout: 20000 });
    await this.companyInput.fill(company);

    await this.saveButton.click();
    await this.waitForSpinnerToDisappear();
  }

  async convertLead() {
    await this.convertButton.click();
    await this.waitForSpinnerToDisappear();
    await this.finishConvertButton.click();
    await this.waitForSpinnerToDisappear();
  }

  async validateAndOpenOpportunity() {
    await expect(this.goToOpportunityLink).toBeVisible({ timeout: 25000 });
    await this.goToOpportunityLink.click();
    await this.waitForSpinnerToDisappear();
  }
}
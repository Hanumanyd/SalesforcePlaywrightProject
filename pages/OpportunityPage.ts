import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class OpportunityPage extends BasePage {
  private addProductsButton = this.page.locator('button[name="AddProduct"], a[title="Add Products"]');
  private firstProductCheckbox = this.page.locator('table tbody tr input[type="checkbox"]').first();
  private nextButton = this.page.locator('button:has-text("Next")');
  private quantityInput = this.page.locator('input[name="Quantity"], table tbody tr input.input').first();
  private saveProductButton = this.page.locator('button:has-text("Save")');
  private markStageCompleteButton = this.page.locator('button:has-text("Mark Stage as Complete"), button:has-text("Mark as Current Stage")');
  private stagePathButton = (stageName: string) => this.page.locator(`//a[@title='${stageName}']`);

  async addProductAndQuantity(quantity: string = '1') {
    await this.addProductsButton.click();
    await this.waitForSpinnerToDisappear();
    await this.firstProductCheckbox.check();
    await this.nextButton.click();
    await this.quantityInput.fill(quantity);
    await this.saveProductButton.click();
    await this.waitForSpinnerToDisappear();
  }

  async markOpportunityAsClosedWon() {
    await this.stagePathButton('Closed').click();
    await this.markStageCompleteButton.click();
    
    const selectClosedStageDropdown = this.page.locator('select');
    if (await selectClosedStageDropdown.isVisible()) {
      await selectClosedStageDropdown.selectOption({ label: 'Closed Won' });
      await this.saveProductButton.click();
    }
    await this.waitForSpinnerToDisappear();
  }

  async validateOpportunityStage(expectedStage: string) {
    const stageHeader = this.page.locator(`//slot[@name="primaryField"]//lightning-formatted-text[text()='${expectedStage}'] | //span[text()='Stage']/parent::div/following-sibling::div//span[text()='${expectedStage}']`);
    await expect(stageHeader).toBeVisible();
  }
}

import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForSpinnerToDisappear() {
    const blockers = this.page.locator(
      '.slds-spinner_container, .auraLoadingBox, div.slds-spinner, div.forceModalSpinner, div.modal-glass.visible'
    );
    try {
      if (await blockers.first().isVisible({ timeout: 2000 })) {
        await blockers.first().waitFor({ state: 'detached', timeout: 30000 });
      }
    } catch {
      // Ignored if already detached
    }
  }

  async selectDropdownOption(labelName: string, optionText: string) {
    await this.waitForSpinnerToDisappear();

    // Find the latest active dropdown trigger button
    const dropdown = this.page.locator(
      `//lightning-combobox[contains(., '${labelName}')]//button | //label[contains(text(),'${labelName}')]/following::button[1] | //button[@aria-label='${labelName}' or contains(@aria-label, '${labelName}')]`
    ).last();

    await dropdown.waitFor({ state: 'visible', timeout: 15000 });
    await dropdown.scrollIntoViewIfNeeded();
    await dropdown.click();

    // Find and select the matching dropdown option
    const option = this.page.locator(
      `//lightning-base-combobox-item//span[@title='${optionText}' or normalize-space(text())='${optionText}'] | //div[@role='listbox']//lightning-base-combobox-item[contains(.,'${optionText}')]`
    ).first();

    await option.waitFor({ state: 'visible', timeout: 15000 });
    await option.scrollIntoViewIfNeeded();
    await option.click({ force: true });
    await this.waitForSpinnerToDisappear();
  }
}

import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CasePage extends BasePage {
  private newButton = this.page.locator('a[title="New"], button[name="New"], lightning-button:has-text("New")');

  async createCase(originOption: string = 'Phone') {
    await this.newButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.newButton.click();
    await this.waitForSpinnerToDisappear();

    // 1. Wait for New Case modal dialog
    const modalDialog = this.page.locator('div[role="dialog"], .slds-modal__container').first();
    await modalDialog.waitFor({ state: 'visible', timeout: 20000 });

    // 2. Validate key fields exist on modal
    await expect(this.page.locator('//label[contains(text(),"Status")]').first()).toBeVisible();
    await expect(this.page.locator('//label[contains(text(),"Case Origin")]').first()).toBeVisible();

    // 3. Fill Case Origin and save
    await this.selectDropdownOption('Case Origin', originOption);
    const saveBtn = modalDialog.locator('button[name="SaveEdit"], button:has-text("Save")').last();
    await saveBtn.click();

    // 4. Wait for creation modal to detach and navigate to the Case record page
    await modalDialog.waitFor({ state: 'detached', timeout: 30000 }).catch(() => {});
    await this.waitForSpinnerToDisappear();
    await this.page.waitForURL(/.*lightning\/r\/Case\/.*/, { timeout: 30000 }).catch(() => {});
    await this.page.waitForLoadState('domcontentloaded');
  }

  async updateAndValidateCaseStatus(statusName: string) {
    await this.waitForSpinnerToDisappear();

    // 1. Open the Edit modal for the current Case record
    const editBtn = this.page.locator('button[name="Edit"], a[title="Edit"]').first();
    const moreActionsBtn = this.page.locator('lightning-button-menu button, button[aria-label="Show more actions"]').first();

    if (await editBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await editBtn.click();
    } else if (await moreActionsBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await moreActionsBtn.click();
      const editMenuItem = this.page.locator('runtime_platform_actions-ribbon-menu-item a[title="Edit"], a[role="menuitem"]:has-text("Edit")').first();
      await editMenuItem.waitFor({ state: 'visible', timeout: 5000 });
      await editMenuItem.click();
    } else {
      // Fallback: click inline edit pencil on Details tab
      const detailsTab = this.page.locator('//a[@data-tab-value="detailTab" or @title="Details" or text()="Details"]').first();
      if (await detailsTab.isVisible({ timeout: 3000 }).catch(() => false)) {
        await detailsTab.click();
        await this.waitForSpinnerToDisappear();
      }
      const inlineEditBtn = this.page.locator('button[title="Edit Status"], button[aria-label="Edit Status"]').first();
      await inlineEditBtn.scrollIntoViewIfNeeded();
      await inlineEditBtn.click({ force: true });
    }

    await this.waitForSpinnerToDisappear();

    // 2. Target the active edit dialog
    const activeDialog = this.page.locator('div[role="dialog"]:not([aria-hidden="true"]), .slds-modal__container').last();
    await activeDialog.waitFor({ state: 'visible', timeout: 15000 });

    // 3. Select the new Status in the dialog
    await this.selectDropdownOption('Status', statusName);

    // 4. Click Save in the active dialog and wait for it to be enabled
    const dialogSaveBtn = activeDialog.locator('button[name="SaveEdit"], button:has-text("Save")').last();
    await dialogSaveBtn.waitFor({ state: 'visible', timeout: 10000 });
    await expect(dialogSaveBtn).toBeEnabled({ timeout: 10000 });
    await dialogSaveBtn.click();

    // 5. Wait for the edit dialog to close
    await activeDialog.waitFor({ state: 'detached', timeout: 25000 }).catch(() => {});
    await this.waitForSpinnerToDisappear();
    await this.page.waitForLoadState('domcontentloaded');

    // 6. Validate updated status on detail page
    const updatedStatusValue = this.page.locator(
      `//span[text()="Status"]/parent::div/following-sibling::div//lightning-formatted-text[text()='${statusName}'] | //records-record-layout-item[@field-label="Status"]//lightning-formatted-text[text()='${statusName}'] | //slot[@name="primaryField"]//lightning-formatted-text[text()='${statusName}']`
    ).first();

    await expect(updatedStatusValue).toBeVisible({ timeout: 15000 });
  }
}
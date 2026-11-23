import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class NavigationPage extends BasePage {
  private appLauncher = this.page.locator('.slds-icon-waffle');
  private viewAllLink = this.page.locator('button[aria-label="View All Applications"]');
  private searchAppInput = this.page.locator('input[placeholder="Search apps or items..."]');

  async switchApp(appName: string) {
    await this.waitForSpinnerToDisappear();
    await this.appLauncher.waitFor({ state: 'visible', timeout: 30000 });
    await this.appLauncher.click();

    await this.viewAllLink.waitFor({ state: 'visible', timeout: 15000 });
    await this.viewAllLink.click();

    await this.searchAppInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.searchAppInput.fill(appName);
    await this.page.waitForTimeout(1000); // Allow Lightning list animation to filter

    // Exact tile match to prevent clicking 'Salesforce Chatter' when searching 'Sales'
    const exactAppTile = this.page.locator(
      `//one-app-launcher-app-tile//p[normalize-space(.)='${appName}'] | //lightning-formatted-rich-text[normalize-space(.)='${appName}']`
    ).first();

    await exactAppTile.waitFor({ state: 'visible', timeout: 15000 });
    await exactAppTile.click();

    // DO NOT USE 'networkidle' in Salesforce; wait for DOM content and Lightning spinners instead
    await this.waitForSpinnerToDisappear();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToTab(tabName: string) {
    await this.waitForSpinnerToDisappear();

    // Standard Salesforce navigation bar item locator
    const standardTab = this.page.locator(
      `//one-app-nav-bar-item-root//a[@title='${tabName}' or .//span[normalize-space(text())='${tabName}']]`
    ).first();

    // If the tab is visible on the bar, click it
    if (await standardTab.isVisible({ timeout: 5000 }).catch(() => false)) {
      await standardTab.click({ force: true });
    } else {
      // Check if tab is nested under the "More" overflow menu
      const moreMenu = this.page.locator(
        '//one-app-nav-bar-menu-button | //button[contains(@aria-label, "More Tabs")] | //span[normalize-space(text())="More"]'
      ).first();

      if (await moreMenu.isVisible({ timeout: 3000 }).catch(() => false)) {
        await moreMenu.click();
        const overflowTab = this.page.locator(
          `//one-app-nav-bar-menu-item//span[normalize-space(text())='${tabName}'] | //a[@role='menuitem']//span[normalize-space(text())='${tabName}']`
        ).first();
        await overflowTab.waitFor({ state: 'visible', timeout: 10000 });
        await overflowTab.click({ force: true });
      } else {
        // Fallback: direct click with forceful locator resolution
        await standardTab.waitFor({ state: 'visible', timeout: 20000 });
        await standardTab.click({ force: true });
      }
    }

    await this.waitForSpinnerToDisappear();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
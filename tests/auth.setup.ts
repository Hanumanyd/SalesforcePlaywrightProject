import { test as setup, expect } from '@playwright/test';
import { ENV } from '../config/environment';
import * as fs from 'fs';
import * as path from 'path';

const authDir = path.resolve(__dirname, '../playwright/.auth');
const authFile = path.join(authDir, 'user.json');

setup('authenticate', async ({ page }) => {
  // 1. Ensure the auth directory exists
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // 2. Open login page and sign in
  await page.goto(ENV.BASE_URL);
  await page.locator('#username').fill(ENV.USERNAME);
  await page.locator('#password').fill(ENV.PASSWORD);
  await page.locator('#Login').click();

  // 3. Handle MFA / Verification screen if prompted
  const mfaInput = page.locator('#emc, input[name="emc"]');
  try {
    if (await mfaInput.isVisible({ timeout: 7000 })) {
      console.log('>>> Verification Code requested! Please enter the code in the opened browser window and submit.');
      // Wait for you to submit code and land on Lightning home (up to 2 minutes)
      await page.waitForURL(/.*lightning\.force\.com.*/, { timeout: 120000 });
    }
  } catch {
    // No MFA screen, continue
  }

  // 4. Verify login succeeded by checking App Launcher
  await page.locator('.slds-icon-waffle').waitFor({ state: 'visible', timeout: 60000 });

  // 5. Save the authenticated storage state
  await page.context().storageState({ path: authFile });
  console.log('>>> Auth session successfully saved to user.json!');
});
import { test, expect } from '@playwright/test';

export const scrubbedElements = ['.cookie-banner', '#live-chat'];

test(`Should match snapshot`, async ({ page }, testInfo) => {
    const deviceName = testInfo.project.name;
    await page.goto(`/`);
    await expect(page).toHaveScreenshot(`home-${deviceName}.png`);
});

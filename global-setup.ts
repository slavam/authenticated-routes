import { chromium } from '@playwright/test'

export default async function globalSetup() {
    const browser = await chromium.launch()
    const page = await browser.newPage()
    await page.goto('http://localhost:3000/login')
    await page.fill('input[name="username"]', 'testuser')
    await page.fill('input[name="password"]', 'password')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/dashboard')
    await page.context().storageState({ path: 'auth.json' })
    await browser.close()
}
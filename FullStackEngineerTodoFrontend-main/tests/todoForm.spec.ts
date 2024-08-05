import { test, expect } from '@playwright/test';

test.describe("ToDo Form page", () => {
  test('Add form has visible title, description, priority, and add form elements', async ({page}) => {
    await page.goto('/');
    await page.getByLabel('Add Todo link').click();

    await expect(page.getByPlaceholder('Title')).toBeVisible();
    await expect(page.getByPlaceholder('Description')).toBeVisible();
    await expect(page.locator('select[name="priority"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
  })
  
  test('Add form does not allow submission with empty fields', async ({page}) => {
    await page.goto('/add');
    await expect(page.getByPlaceholder('Title')).toBeEmpty();
    await expect(page.getByPlaceholder('Description')).toBeEmpty();

    await page.getByRole('button', { name: 'Add' }).click();

    const currentUrl = page.url();
    const urlObj = new URL(currentUrl);
    const urlPath = urlObj.pathname;
    expect(urlPath).toEqual('/add');
  })

  test('Edit form will prefill data from an existing ToDo', async ({page}) => {
    // Visit Add Form
    await page.goto('/add');
    // Generate random strings for title and description
    const title = randomString(8);
    const description = randomString(8);

    // Fill title and description fields with generated strings
    // Select the Medium priority option (value of '2')
    // Submit ToDo
    await page.getByPlaceholder('Title').fill(title);
    await page.getByPlaceholder('Description').fill(description);
    await page.locator('select[name="priority"]').selectOption('2');
    await page.getByRole('button', { name: 'Add' }).click();

    // Click the created ToDo to visit its Details page
    await page.getByRole('link', { name: title }).click();
    
    // Click the Edit link to visit the Edit Form
    await page.getByLabel('Edit todo').click();

    // Assert that generated strings and Medium priority have prefilled the inputs
    await expect(page.getByPlaceholder('Title')).toHaveValue(title);
    await expect(page.getByPlaceholder('Description')).toHaveValue(description);
    await expect(page.locator('select[name="priority"]')).toHaveValue('2');
  })
})

function randomString(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = '';
  
    for (let i = 0; i < length; i++) {
      const randomIdx = Math.floor(Math.random() * chars.length);
      result += chars[randomIdx];
    }
  
    return result;
}
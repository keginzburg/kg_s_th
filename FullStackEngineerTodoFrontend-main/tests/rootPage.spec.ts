import { test, expect } from '@playwright/test';

test.describe("Root/List page", () => {
  test('Has visible ToDo app title', async ({page}) => {
    await page.goto('/');

    const appLink = await page.getByRole('link', { name: 'App Logo and Name link' });
    await expect(appLink).toHaveText(/ToDo/);
  })
  
  test('ToDo app title links to root path', async ({page}) => {
    await page.goto('/');
    
    const appLink = await page.getByRole('link', { name: 'App Logo and Name link' });
    await appLink.click();

    const currentUrl = page.url();
    const urlObj = new URL(currentUrl);
    const urlPath = urlObj.pathname;
    expect(urlPath).toEqual('/');
  })

  test('Has visible action items', async ({page}) => {
    await page.goto('/');

    const listLink = await page.getByLabel('ToDo List link');
    const addLink = await page.getByLabel('Add Todo link');
    await expect(listLink).toHaveText(/View List/);
    await expect(addLink).toHaveText(/Add Todo/);
  })

  test('"View List" links to root path', async ({page}) => {
    await page.goto('/');
    
    const listLink = await page.getByLabel('ToDo List link');
    await listLink.click();

    const currentUrl = page.url();
    const urlObj = new URL(currentUrl);
    const urlPath = urlObj.pathname;
    expect(urlPath).toEqual('/');
  })

  test('"Add Todo" links to "/add" path', async ({page}) => {
    await page.goto('/');
    
    const addLink = await page.getByLabel('Add Todo link');
    await addLink.click();

    const currentUrl = page.url();
    const urlObj = new URL(currentUrl);
    const urlPath = urlObj.pathname;
    expect(urlPath).toEqual('/add');
  })

  test('Has visible ToDo list heading', async ({page}) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'My List' })).toBeVisible();
  })

  // Flaky test due to timeout
  test('Displays "No Todos available" if no ToDo records exist', async ({page}) => {
    await page.goto('/');

    await page.waitForLoadState('networkidle');

    try {
      await page.waitForSelector('[aria-label="Delete todo"]', { timeout: 3000 });
    } catch (error) {
      console.log('Delete button error:', error);
    }

    let deleteTodoButtons = page.locator('[aria-label="Delete todo"]');
    let count = await deleteTodoButtons.count();

    while (count > 0) {
      console.log(`${count} delete buttons left before clicking.`)
      // Click the first button
      await deleteTodoButtons.first().click();
    
      // Wait for the network to be idle after the click
      await page.waitForLoadState('networkidle');

      await page.waitForTimeout(500);
    
      // Re-fetch the locator and count
      deleteTodoButtons = page.locator('[aria-label="Delete todo"]');
      count = await deleteTodoButtons.count();
      console.log(`${count} delete buttons remaining after clicking.`)
    }

    await expect(page.getByText('No Todos available')).toBeVisible();
  })

  test('Displays a Todo\'s title if a Todo is created', async ({page}) => {
    await page.goto('/');
    const title = randomString(8);
    const description = randomString(8);

    // Assert that no ToDo with unique test title exists already
    await expect(page.getByRole('link', { name: title })).not.toBeVisible();

    // Visit ToDoForm
    await page.getByLabel('Add Todo link').click();

    // Fill in ToDoForm inputs with data and submit it to visit List page
    await page.getByPlaceholder('Title').fill(title);
    await page.getByPlaceholder('Description').fill(description);
    await page.getByRole('button', { name: 'Add' }).click()

    // Asset that ToDo with unique test title exists after creation
    await expect(page.getByRole('link', { name: title })).toBeVisible();
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
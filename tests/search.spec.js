// @ts-check
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const defaultUsers = 9;

test("Search has title", async ({ page }) => {
  await page.goto("/search");
  await expect(page).toHaveTitle(/Search/);
});

test("Navigate to the Search page", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Search" })
    .click();
  await expect(page.locator("h1")).toHaveText("Search");
});

test("Search works correctly", async ({ page }) => {
  // 1. navigate to search page
  await page.goto("/search");

  // 2. show no users are listed
  await expect(page.locator("main li")).toHaveCount(defaultUsers);

  // 3. type in search and check that user with the name exist and check a name doesn't exist
  const input = page.locator("[name='keyword']");
  await input.type("_test-profile-user-1");

  await expect(page.locator("main li")).toHaveCount(1);
});

test("Search page has random results when no search term used", async ({
  page,
}) => {
  await page.goto("/search");

  const input = page.locator("[name='keyword']");
  await input.type("");

  await expect(page.locator("main li")).toHaveCount(defaultUsers);
});

test("Search page shows random results after typing 1 characters", async ({
  page,
}) => {
  await page.goto("/search");

  const input = page.locator("[name='keyword']");
  await input.type("e");

  await expect(page.locator("main li")).toHaveCount(defaultUsers);
});

test("Search page shows results after typing 3 characters", async ({
  page,
}) => {
  await page.goto("/search");

  const input = page.locator("[name='keyword']");
  await input.type("aka");

  await expect(page.locator("main li")).toContainText(["aka"]);
});

test("After search click profile", async ({ page }) => {
  // 1. Perform search
  await page.goto("/search");
  const input = page.locator("[name='keyword']");
  await input.type("eddiejaoude");

  // 2. Click on the searched profile
  const profileLinkSelector = 'a[href="/eddiejaoude"]';
  const profileLink = page.locator(profileLinkSelector);
  await profileLink.click();
  await page.waitForLoadState("networkidle");

  // 3. Check if the profile is displayed
  const profileHeader = page.locator("h1");
  const profileHeaderText = await profileHeader.innerText();
  await expect(profileHeaderText).toContain("Eddie Jaoude"); 
});

test.fixme(
  "find the profile after providing concise name",
  async () => {
    // 1. click on search profile
    // 2. type the whole name
    // 3. Display the profile if the name is correct
  }
);

test.describe("accessibility tests (light)", () => {
  test.use({ colorScheme: "light" });

  test("should pass axe wcag accessibility tests (light)", async ({ page }) => {
    await page.goto("/search");
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe("accessibility tests (dark)", () => {
  test.use({ colorScheme: "dark" });

  test("should pass axe wcag accessibility tests (dark)", async ({ page }) => {
    await page.goto("/search");
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

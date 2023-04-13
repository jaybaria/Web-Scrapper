import { ProductInfo, insertProductInfo } from "./models";

const puppeteer = require("puppeteer");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

export async function puppeteerScrapper(website_link: string) {
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: true, // Run Puppeteer in headless mode
    defaultViewport: null, // Set the viewport size to null
  });

  const page = await browser.newPage();
  await page.goto(website_link);

  // Inserting the pin-code to check for delivery serviceability
  const inputField = await page.waitForSelector("input._166SQN");
  await inputField.type("400001");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(15000);
  await page.setDefaultNavigationTimeout(40000);

  // Find all href links
  const hrefElements = await page.$$('div[class^="_1AtVbE col-12-12"] a');
  const hrefs = await Promise.all(
    hrefElements.map((el: { getProperty: (arg0: string) => any }) =>
      el.getProperty("href")
    )
  );
  const hrefStrings = await Promise.all(hrefs.map((href) => href.jsonValue()));

  // Filter out unwanted hrefs and limit the number of hrefs to 2 for testing
  const products = await page.evaluate((hrefs: any[]) => {
    const filteredHrefs = hrefs.filter((href: string) => {
      return (
        href.startsWith("https://www.flipkart.com/") &&
        !href.includes("/grocery/packaged-food/pr?")
      );
    });
    // limited to only 2 hrefs for testing
    const uniqueHrefs = Array.from(new Set(filteredHrefs));
    return uniqueHrefs.slice(0, 5);
  }, hrefStrings);

  // Create an array to store the product information
  const productInfo: ProductInfo[] = [];

  for (const productLink of products) {
    try {
      await page.goto(productLink);

      const product_name = await page.$eval(".B_NuCI", (el: any) =>
        el.textContent.trim()
      );

      const product_price = await page.$eval("._30jeq3._16Jk6d", (el: any) =>
        el.textContent.trim()
      );

      // look into this
      // const description = await page.$eval(
      //   "div._1mXcCf",
      //   (el: { textContent: string }) => el.textContent.trim()
      // );

      const image_links = await page.evaluate(() => {
        const image_index = document.querySelectorAll("div._2mLllQ img.q6DClP");
        return Array.from(image_index).map((img) => img.getAttribute("src"));
      });

      const brand_name = await page.$$eval("tr td", (tds: any[]) => {
        const brand_index = tds.findIndex(
          (td: { textContent: string }) => td.textContent === "Brand"
        );
        const brand_name = tds[brand_index + 1].querySelector("li");
        return brand_name ? brand_name.textContent.trim() : null;
      });

      const quantity = await page.$$eval("tr td", (tds: any[]) => {
        const brand_index = tds.findIndex(
          (td: { textContent: string }) => td.textContent === "Quantity"
        );
        const quantity = tds[brand_index + 1].querySelector("li");
        return quantity ? quantity.textContent.trim() : null;
      });

      const ingredients = await page.$$eval("tr td", (tds: any[]) => {
        const brand_index = tds.findIndex(
          (td: { textContent: string }) => td.textContent === "Ingredients"
        );
        const ingredients = tds[brand_index + 1].querySelector("li");
        return ingredients ? ingredients.textContent.trim() : null;
      });

      const nutritions = await page.$$eval("tr td", (tds: any[]) => {
        const brand_index = tds.findIndex(
          (td: { textContent: string }) => td.textContent === "Nutrient Content"
        );
        const nutritions = tds[brand_index + 1].querySelector("li");
        return nutritions ? nutritions.textContent.trim() : null;
      });

      const veg_non_veg = await page.$$eval("tr td", (tds: any[]) => {
        const brand_index = tds.findIndex(
          (td: { textContent: string }) => td.textContent === "Food Preference"
        );
        const veg_non_veg = tds[brand_index + 1].querySelector("li");
        return veg_non_veg ? veg_non_veg.textContent.trim() : null;
      });
      let id = 1;
      productInfo.push({
        product_name,
        image_links,
        //description,
        brand_name,
        product_price,
        quantity,
        ingredients,
        nutritions,
        veg_non_veg,
      });
    } catch (error) {
      console.log(`Error while scraping product ${productLink}:`, error);
    }
  }

  await browser.close();

  return { productInfo };
}

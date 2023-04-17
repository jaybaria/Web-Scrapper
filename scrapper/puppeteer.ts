import { ProductInfo } from "./models";
const puppeteer = require("puppeteer");

export async function dataFetcher(page: any) {
  // Find all href links
  const href_elements = await page.$$(
    "div._1YokD2._3Mn1Gg.col-12-12 div._1AtVbE.col-12-12 a"
  );
  const hrefs = await Promise.all(
    href_elements.map((el: { getProperty: (arg0: string) => any }) =>
      el.getProperty("href")
    )
  );
  const href_strings = await Promise.all(
    hrefs.map((product_href) => product_href.jsonValue())
  );

  // Filter out unwanted hrefs and limit the number of hrefs to 2 for testing
  const products = await page.evaluate((hrefs: any[]) => {
    const filtered_hrefs = hrefs.filter((href: string) => {
      return (
        href.startsWith("https://www.flipkart.com/") &&
        !href.includes("/grocery/packaged-food/pr?")
      );
    });
    const unique_hrefs = Array.from(new Set(filtered_hrefs));
    //  Set number of records to be Fetched
    return unique_hrefs; //.slice(0, 5);
  }, href_strings);
  // Create an array to store the product information
  const productInfo: ProductInfo[] = [];

  for (const productLink of products) {
    try {
      await page.goto(productLink);
      const product_link = productLink;

      const product_name = await page.$eval(".B_NuCI", (el: any) =>
        el.textContent.trim()
      );

      const product_price = await page.$eval("._30jeq3._16Jk6d", (el: any) =>
        el.textContent.trim()
      );

      let description;
      try {
        description = await page.$eval(
          "div._1mXcCf, _1mXcCf RmoJUa",
          (el: { textContent: string }) => el.textContent.trim()
        );
      } catch (error) {
        description = "N/A";
      }

      const image_links = await page.evaluate(() => {
        const image_index = document.querySelectorAll("div._2mLllQ img.q6DClP");
        return Array.from(image_index).map((img) => img.getAttribute("src"));
      });

      const brand_name = await page.$$eval("tr td", (tds: any[]) => {
        const brand_index = tds.findIndex(
          (td: { textContent: string }) => td.textContent === "Brand"
        );
        const brand_name = tds[brand_index + 1].querySelector("li");
        return brand_name ? brand_name.textContent.trim() : "N/A";
      });

      const quantity = await page.$$eval("tr td", (tds: any[]) => {
        const brand_index = tds.findIndex(
          (td: { textContent: string }) => td.textContent === "Quantity"
        );
        const quantity = tds[brand_index + 1].querySelector("li");
        return quantity ? quantity.textContent.trim() : "N/A";
      });

      const ingredients = await page.$$eval("tr td", (tds: any[]) => {
        const brand_index = tds.findIndex(
          (td: { textContent: string }) => td.textContent === "Ingredients"
        );
        const ingredients = tds[brand_index + 1].querySelector("li");
        const formatted_ingredients = ingredients
          ? ingredients.textContent.trim().replace(/[\n\r]+/g, ", ")
          : "N/A";
        return formatted_ingredients === "NA" ? "N/A" : formatted_ingredients;
      });

      const nutritions = await page.$$eval("tr td", (tds: any[]) => {
        const brand_index = tds.findIndex(
          (td: { textContent: string }) => td.textContent === "Nutrient Content"
        );
        const nutritions = tds[brand_index + 1].querySelector("li");
        const formatted_nutritions = nutritions
          ? nutritions.textContent.trim().replace(/[\n\r]+/g, ", ")
          : "N/A";
        return formatted_nutritions === "NA" ? "N/A" : formatted_nutritions;
      });

      const veg_non_veg = await page.$$eval("tr td", (tds: any[]) => {
        const brand_index = tds.findIndex(
          (td: { textContent: string }) => td.textContent === "Food Preference"
        );
        const veg_non_veg = tds[brand_index + 1].querySelector("li");
        const formated_veg_non_veg = veg_non_veg
          ? veg_non_veg.textContent.trim().replace(/[\n\r]+/g, ", ")
          : "N/A";
        return formated_veg_non_veg === "NA" ? "N/A" : formated_veg_non_veg;
      });

      productInfo.push({
        product_name,
        image_links,
        description,
        brand_name,
        product_price,
        quantity,
        ingredients,
        nutritions,
        veg_non_veg,
        product_link,
      });
    } catch (error) {
      console.log(`Error while scraping product ${productLink}:`, error);
    }
  }

  return { productInfo };
}

export async function puppeteerScrapper(website_link: string) {
  try {
    // Launch the browser
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.goto(website_link);

    // Inserting the pin-code to check for delivery serviceability
    const input_field = await page.waitForSelector("input._166SQN");
    await input_field.type("400001");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(5000);
    // await page.setDefaultNavigationTimeout(40000);
    const result = await dataFetcher(page);
    return result;
  } catch (error) {
    console.log("Got Error While Initializing Puppeteer", error);
    throw error;
  }
}

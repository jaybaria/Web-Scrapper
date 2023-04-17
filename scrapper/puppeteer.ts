import { ProductInfo } from "./models";
const puppeteer = require("puppeteer");

export async function dataFetcher(page: any) {
  // Find all href links
  const href_strings = await page.$$eval(
    "div._1YokD2._3Mn1Gg.col-12-12 div._1AtVbE.col-12-12 a",
    (elements: any[]) => elements.map((el: { href: any }) => el.href)
  );

  // Filter out unwanted hrefs and limit the number of hrefs to 2 for testing
  const products = await page.evaluate((hrefs: any[]) => {
    return hrefs
      .filter(
        (href: string) =>
          href.startsWith("https://www.flipkart.com/") &&
          !href.includes("/grocery/packaged-food/pr?")
      )
      .slice(0, 5);
  }, href_strings);

  // Create an array to store the product information
  const productInfo: ProductInfo[] = [];

  for (const productLink of products) {
    try {
      await page.goto(productLink);

      const product_link = productLink;

      const getProductValue = async (label: string) => {
        try {
          const tdElements = await page.$$("tr td");
          const index = tdElements.findIndex(
            (td: { textContent: string }) => td.textContent === label
          );
          const liElement = tdElements[index + 1].querySelector("li");
          return liElement
            ? liElement.textContent.trim().replace(/[\n\r]+/g, ", ")
            : "N/A";
        } catch (error) {
          return "N/A";
        }
      };

      const product_name = await page.$eval(
        ".B_NuCI",
        (el: { textContent: string }) => el.textContent.trim()
      );
      const product_price = await page.$eval(
        "._30jeq3._16Jk6d",
        (el: { textContent: string }) => el.textContent.trim()
      );
      const description = await page
        .$eval("div._1mXcCf, _1mXcCf RmoJUa", (el: { textContent: string }) =>
          el.textContent.trim()
        )
        .catch(() => "N/A");
      const image_links = await page.$$eval(
        "div._2mLllQ img.q6DClP",
        (imgs: any[]) =>
          imgs.map((img: { getAttribute: (arg0: string) => any }) =>
            img.getAttribute("src")
          )
      );
      const brand_name = await getProductValue("Brand");
      const quantity = await getProductValue("Quantity");
      const ingredients = await getProductValue("Ingredients");
      const nutritions = await getProductValue("Nutrient Content");
      const veg_non_veg = await getProductValue("Food Preference");

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
      console.log(
        `Error while scraping product details ${productLink}:`,
        error
      );
    }
  }

  return { productInfo };
}

export async function puppeteerScrapper(website_link: string) {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.goto(website_link);

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

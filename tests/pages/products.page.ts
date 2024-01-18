import { Locator, Page } from "@playwright/test";
import { SiteBasePage } from "./base.page";

export class SiteProductsPage extends SiteBasePage {
    readonly page: Page;
    readonly url: string;
    readonly inventoryContainer: Locator;
    readonly inventorySort: Locator;
    readonly inventoryTitle: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.url = "https://www.saucedemo.com/inventroy.html";

        this.inventoryTitle = page.getByText("Products");
        this.inventorySort = page.locator(
            '[data-test="product_sort_container"]'
        );
        this.inventoryContainer = page.locator("#inventory_container").nth(1);
    }
}

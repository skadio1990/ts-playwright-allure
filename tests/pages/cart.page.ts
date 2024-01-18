import { Locator, Page } from "@playwright/test";
import { SiteBasePage } from "./base.page";

export class SiteCartPage extends SiteBasePage {
    readonly page: Page;
    readonly url: string;
    readonly title: Locator;
    readonly checkout: Locator;
    readonly shopping: Locator;
    readonly table: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.url = "https://www.saucedemo.com/cart.html";

        this.title = page.getByText("Your Cart");
        this.checkout = page.locator('[data-test="checkout"]');
        this.shopping = page.locator('[data-test="continue-shopping"]');
        this.table = page.getByText("QTYDescription");
    }
}

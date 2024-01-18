import { Locator, Page } from "@playwright/test";
import { SiteBasePage } from "./base.page";

export class SiteCheckoutPage extends SiteBasePage {
    readonly page: Page;
    readonly url: string;
    readonly title: Locator;
    readonly cancel: Locator;
    readonly checkout: Locator;
    readonly continue: Locator;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly zipCode: Locator;
    readonly error: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.url = "https://www.saucedemo.com/checkout-step-one.html";

        this.cancel = page.locator('[data-test="cancel"]');
        this.checkout = page.locator('[data-test="checkout"]');
        this.continue = page.locator('[data-test="continue"]');
        this.title = page.getByText("Checkout: Your Information");
        this.firstName = page.locator('[data-test="firstName"]');
        this.lastName = page.locator('[data-test="lastName"]');
        this.zipCode = page.locator('[data-test="postalCode"]');
        this.error = page.locator('[data-test="error"]');
    }
}

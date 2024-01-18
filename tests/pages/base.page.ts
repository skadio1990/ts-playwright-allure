import { Page, Locator, expect } from "@playwright/test";
import config from "../../playwright.config";

export class SiteBasePage {
    readonly page: Page;
    readonly baseURL: string | undefined;
    readonly header: Locator;
    readonly shoppingCart: Locator;
    readonly openMenu: Locator;
    readonly closeMenu: Locator;
    readonly allItems: Locator;
    readonly about: Locator;
    readonly logout: Locator;
    readonly resetAppState: Locator;
    readonly linkTwitter: Locator;
    readonly linkFacebook: Locator;
    readonly linkLinkedIn: Locator;
    readonly rightsReserved: Locator;
    readonly currentYear: number = new Date().getFullYear();

    constructor(page: Page) {
        this.page = page;
        this.baseURL = config.use?.baseURL;

        // header
        this.header = page
            .locator("div")
            .filter({ hasText: /^Swag Labs$/ })
            .first();
        this.shoppingCart = page.locator("#shopping_cart_container a");

        // Menu
        this.openMenu = page.getByRole("button", { name: "Open Menu" });
        this.closeMenu = page.getByRole("button", { name: "Close Menu" });
        this.allItems = page.getByRole("link", { name: "All Items" });
        this.about = page.getByRole("link", { name: "About" });
        this.logout = page.getByRole("link", { name: "Logout" });
        this.resetAppState = page.getByRole("link", {
            name: "Reset App State",
        });
        // footer
        this.linkTwitter = page.getByRole("link", { name: "Twitter" });
        this.linkFacebook = page.getByRole("link", { name: "Facebook" });
        this.linkLinkedIn = page.getByRole("link", { name: "LinkedIn" });
        this.rightsReserved = page.getByText(
            `© ${this.currentYear} Sauce Labs. All Rights`
        );
    }

    async goto(url: string) {
        await this.page.goto(url);

        this.page.on("console", (msg) => {
            expect
                .soft(
                    msg.type() === "error",
                    `Console Log: ${msg.text()} ${msg.location().url}`
                )
                .toBe(false);
        });
    }
}

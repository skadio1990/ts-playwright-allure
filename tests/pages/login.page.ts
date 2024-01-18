import { Locator, Page } from "@playwright/test";
import { SiteBasePage } from "./base.page";

export class SiteLoginPage extends SiteBasePage {
    readonly page: Page;
    readonly url: string;
    readonly title: Locator;
    readonly username: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;
    readonly errorField: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.url = "https://www.saucedemo.com/";
        
        this.title = page.locator(".login_logo", { hasText: "Swag Labs" });
        this.username = page.locator('[data-test="username"]');
        this.password = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.errorField = page.locator('[data-test="error"]');
    }

    async useCredentials(username: string, password: string = "secret_sauce") {
        await this.goto(this.url);
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }
}

import { test as baseTest } from "@playwright/test";
import getPort from "get-port";
import { SiteBasePage } from "../pages/base.page";
import { SiteLoginPage } from "../pages/login.page";
import { SiteProductsPage } from "../pages/products.page";
import { SiteCartPage } from "../pages/cart.page";
import { SiteCheckoutPage } from "../pages/checkout.page";
// import * as playwright from "playwright";

export const test = baseTest.extend<
    {
        basePage: SiteBasePage;
        loginPage: SiteLoginPage;
        productsPage: SiteProductsPage;
        cartPage: SiteCartPage;
        checkoutPage: SiteCheckoutPage;
    },
    {
        port: number;
        // browser: Browser;
    }
>({
    basePage: async ({ page }, use) => {
        await use(new SiteBasePage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new SiteLoginPage(page));
    },
    productsPage: async ({ page }, use) => {
        await use(new SiteProductsPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new SiteCartPage(page));
    },
    checkoutPage: async ({ page }, use) => {
        await use(new SiteCheckoutPage(page));
    },
    port: [
        async ({}, use) => {
            const port = await getPort();
            await use(port);
        },
        { scope: "worker" },
    ],
    // browser: [
    //     async ({ port }, use) => {

    //         const browser = await playwright[browserName].launch({
    //             args: [`--remote-debugging-port=${port}`],
    //         });
    //         await use(browser);
    //     },
    //     { scope: "worker" },
    // ],
});

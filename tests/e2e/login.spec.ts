import { test } from "../fixtures/test";
import { expect } from "../fixtures/expect";
import { report } from "../utils/report";

// test.only("Login without username", async ({ loginPage }) => {
//     await loginPage.useCredentials("");
//     await expect(loginPage.errorField).toContainText("Username");
// });


test.describe("Login Tests", () => {
    test.beforeEach(async () => {
        report({
            suite: "WebUI",
            subSuite: "Authentication",
        });
    });

    test("Login without username", async ({ loginPage }) => {
        await loginPage.useCredentials("");
        await expect(loginPage.errorField).toContainText("Username");
    });

    test("Login without password", async ({ loginPage }) => {
        await loginPage.useCredentials("standard_user", "");
        await expect(loginPage.errorField).toContainText("Password");
    });

    test("Login non-existing user", async ({ loginPage }) => {
        await loginPage.useCredentials("No Such User");
        await expect(loginPage.errorField).toContainText("not match");
    });

    test("Login locked out user", async ({ loginPage }) => {
        await loginPage.useCredentials("locked_out_user");
        await expect(loginPage.errorField).toContainText("locked");
    });

    test("Login performance glitch user", async ({
        loginPage,
        productsPage,
    }) => {
        await loginPage.useCredentials("performance_glitch_user");
        await expect(productsPage).toHaveProducts();
        await expect(productsPage).toHaveNavigation();
    });

    test("Login standard user", async ({ loginPage, productsPage }) => {
        await loginPage.useCredentials("standard_user");
        await expect(productsPage).toHaveProducts();
        await expect(productsPage).toHaveNavigation();
    });

    test("Login problem user", async ({ loginPage, productsPage }) => {
        await loginPage.useCredentials("problem_user");
        await expect(productsPage).toHaveProducts();
        await expect(productsPage).toHaveNavigation();
    });

    test("Login error user", async ({ loginPage, productsPage }) => {
        await loginPage.useCredentials("error_user");
        await expect(productsPage).toHaveProducts();
        await expect(productsPage).toHaveNavigation();
    });

    test("Login visual user", async ({ loginPage, productsPage }) => {
        await loginPage.useCredentials("visual_user");
        await expect(productsPage).toHaveProducts();
        await expect(productsPage).toHaveNavigation();
    });
});

import { expect as baseExpect, APIResponse } from "@playwright/test";
import { APIActions } from "../utils/APIactions";

export const expect = baseExpect.extend({
    async toHaveProducts(productsPage) {
        try {
            await expect.soft(productsPage.inventoryTitle).toBeVisible();
            await expect.soft(productsPage.inventoryContainer).toBeVisible();
            await expect.soft(productsPage.inventorySort).toBeVisible();
            return {
                pass: true,
                message: () => `Pass`,
            };
        } catch (error) {
            return {
                pass: false,
                message: () => `Custom Assert Failed : ${error.message}`,
            };
        }
    },

    async toHaveNavigation(basePage) {
        try {
            //header
            await expect.soft(basePage.shoppingCart).toBeVisible();
            await expect.soft(basePage.header).toBeVisible();

            //menu
            await expect.soft(basePage.openMenu).toBeVisible();
            await basePage.openMenu.click();
            await expect.soft(basePage.closeMenu).toBeVisible();
            await expect.soft(basePage.allItems).toBeVisible();
            await expect.soft(basePage.about).toBeVisible();
            await expect.soft(basePage.logout).toBeVisible();
            await expect.soft(basePage.resetAppState).toBeVisible();
            await basePage.closeMenu.click();

            //footer
            await expect.soft(basePage.linkTwitter).toBeVisible();
            await expect.soft(basePage.linkFacebook).toBeVisible();
            await expect.soft(basePage.linkLinkedIn).toBeVisible();
            await expect.soft(basePage.rightsReserved).toBeVisible();

            return {
                pass: true,
                message: () => `Pass`,
            };
        } catch (error) {
            return {
                pass: false,
                message: () => `Custom Assert Failed : ${error.message}`,
            };
        }
    },

    async toBeStructuredLike(response: APIResponse, jsonExamplePath: string) {
        const apiActions = new APIActions();

        try {
            await apiActions.toHaveValidStatusAndData(
                response,
                jsonExamplePath
            );
            return {
                pass: true,
                message: () =>
                    "API response is structured like the expected JSON example.",
            };
        } catch (error) {
            return {
                pass: false,
                message: () =>
                    `API response does not match the expected structure. Details: ${error.message}`,
            };
        }
    },

    async toBeOk(response: APIResponse) {
        const apiActions = new APIActions();
        try {
            await apiActions.verifyStatusCode(response);
            return {
                pass: true,
                message: () =>
                    "API response is structured like the expected JSON example.",
            };
        } catch (error) {
            return {
                pass: false,
                message: () =>
                    `API response does not match the expected structure. Details: ${error.message}`,
            };
        }
    },
});

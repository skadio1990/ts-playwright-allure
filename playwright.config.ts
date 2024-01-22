import { defineConfig, devices } from "@playwright/test";
import * as os from "os";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: "./tests",
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 4 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
        [`./tests/utils/logger.ts`],
        [
            "allure-playwright",
            {
                outputFolder: "test-results",
                categories: [
                    {
                        name: "Validations",
                        messageRegex: ".*Validate.*",
                    },
                    {
                        name: "Console Errors",
                        messageRegex: ".*Console.*",
                    },
                ],
                environmentInfo: {
                    baseURL: "https://www.saucedemo.com/",
                    jenkinsURL: "http://localhost:8080/job/BuildJob/",
                    framework: "Playwright",
                    os_platform: os.platform(),
                    os_release: os.release(),
                    os_version: os.version(),
                    node_version: process.version,
                },
            },
        ],
        // [`html`, { outputFolder: "html-report", open: "never" }],
    ],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: "https://www.saucedemo.com/",

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: "retain-on-failure",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
    },

    projects: [
        {
            name: "Chrome",
            use: { ...devices["Desktop Chrome"], channel: "chrome" },
        },
        {
            name: "Chrome (Mobile)",
            use: { ...devices["Pixel 5"] },
        },
        {
            name: "Firefox",
            use: { ...devices["Desktop Firefox"] },
        },
        {
            name: "Microsoft Edge",
            use: { ...devices["Desktop Edge"], channel: "msedge" },
        },
        {
            name: "Safari",
            use: { ...devices["Desktop Safari"] },
        },
        {
            name: "Safari (Mobile)",
            use: { ...devices["iPhone 12"] },
        },
    ],

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   url: 'http://127.0.0.1:3000',
    //   reuseExistingServer: !process.env.CI,
    // },
});

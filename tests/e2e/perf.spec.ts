import { test } from "../fixtures/test";
import { report } from "../utils/report";
import { playAudit } from "playwright-lighthouse";
import * as playwright from "playwright";
import { allure } from "allure-playwright";
import fs from "fs";

test("Performance Test", async ({ browserName, loginPage, port }, testInfo) => {
    report({ suite: "Performance", subSuite: "Audit" });

    if (browserName === "firefox" || browserName == "webkit") {
        allure.logStep(`ignoring unsupported browser ${browserName}`);
        return;
    }

    const browser = await playwright[browserName].launch({
        args: [`--remote-debugging-port=${port}`],
    });

    const page = await browser.newPage();

    const reportName = `${testInfo.title}_${testInfo.project.name}`.replace(
        / /g,
        "_"
    );

    try {
        await page.goto(loginPage.url);

        await playAudit({
            page,
            thresholds: {
                performance: 80,
                accessibility: 70,
                "best-practices": 75,
                seo: 70,
                pwa: 80,
            },
            reports: {
                formats: { html: true },
                name: reportName,
            },
            port,
        });
    } finally {
        await browser.close();

        allure.attachment(
            "HTML Audit Report",
            fs.readFileSync(`./lighthouse/${reportName}.html`),
            {
                contentType: "text/html",
            }
        );
    }
});

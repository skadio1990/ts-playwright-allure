import { APIResponse, expect } from "@playwright/test";
import { allure } from "allure-playwright";
import * as fs from "fs";

export class APIActions {
    generateAssertionMessage(count, entityName) {
        const pluralize = (count) => (count !== 1 ? "ies" : "y");
        return `Asserting ${entityName} - ${count} entr${pluralize(count)}`;
    }

    async toHaveValidStatusAndData(
        response: APIResponse,
        jsonExamplePath: string
    ): Promise<void> {
        await this.verifyStatusCode(response);
        await this.verifyDataIntegrity(response, jsonExamplePath);
    }

    async verifyStatusCode(response: APIResponse): Promise<void> {
        const response_body = await response.json();
        await allure.attachment(
            "Response Body",
            JSON.stringify(response_body, null, "\t"),
            {
                contentType: "application/json",
            }
        );
        expect(
            response,
            `${response.status()} status code was received for url: ${response.url()}`
        ).toBeOK();
    }

    async verifyDataIntegrity(
        response: APIResponse,
        jsonExamplePath: string
    ): Promise<void> {
        const expectedResponse = JSON.parse(
            fs.readFileSync(jsonExamplePath, "utf-8")
        )[0];
        await allure.attachment(
            "JSON Example",
            JSON.stringify(expectedResponse, null, "\t"),
            {
                contentType: "application/json",
            }
        );

        const actualResponse = await response.json();

        await allure.step(
            this.generateAssertionMessage(
                actualResponse.length,
                "Response Body"
            ),
            async () => {
                for (const responseEntry of actualResponse) {
                    await allure.step(
                        `Validate Data Integrity of allele ID ${responseEntry.id}`,
                        async () => {
                            this.validateEntry(responseEntry, expectedResponse);
                        }
                    );
                }
            }
        );
    }

    private validateEntry(
        responseEntry: Record<string, any>,
        expectedResponse: Record<string, any>
    ): void {
        const allKeys = Array.from(
            new Set([
                ...Object.keys(expectedResponse),
                ...Object.keys(responseEntry),
            ])
        );

        for (const key of allKeys) {
            allure.step(
                `${key} is ${responseEntry[key] as string[]}`,
                async () => {
                    expect
                        .soft(
                            responseEntry.hasOwnProperty(key) &&
                                expectedResponse.hasOwnProperty(key),
                            `Validate ${key} is present`
                        )
                        .toBe(true);

                    const expectedType = expectedResponse[key];
                    const actualType = responseEntry[key];
                    const message = `Validate ${key} type is ${expectedType}`;

                    if (actualType === null || expectedType === null) {
                        expect.soft(actualType, message).toBe(expectedType);
                    } else {
                        expect
                            .soft(typeof actualType, message)
                            .toBe(expectedType);
                    }
                }
            );
        }
    }
}

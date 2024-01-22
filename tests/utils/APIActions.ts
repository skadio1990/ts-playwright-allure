/**
 * Utility class for performing API-related actions and assertions.
 */
import { APIResponse, expect } from "@playwright/test";
import { allure } from "allure-playwright";
import * as fs from "fs";

export class APIActions {
    /**
     * Generates an assertion message based on the count and entity name.
     * @param count - Number of entities.
     * @param entityName - Name of the entity.
     * @returns Assertion message.
     */
    generateAssertionMessage(count: number, entityName: string): string {
        const pluralize = (count: number): string =>
            count !== 1 ? "ies" : "y";
        return `Asserting ${entityName} - ${count} entr${pluralize(count)}`;
    }

    /**
     * Asserts that the response has a valid status code and data integrity.
     * @param response - API response object.
     * @param jsonExamplePath - Path to the JSON example file for data comparison.
     */
    async toHaveValidStatusAndData(
        response: APIResponse,
        jsonExamplePath: string
    ): Promise<void> {
        await this.verifyStatusCode(response);
        await this.verifyDataIntegrity(response, jsonExamplePath);
    }

    /**
     * Verifies the status code of the API response and attaches the response body to the allure report.
     * @param response - API response object.
     */
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

    /**
     * Verifies the data integrity of the API response against a JSON example file.
     * @param response - API response object.
     * @param jsonExamplePath - Path to the JSON example file for data comparison.
     */
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

    /**
     * Validates the data integrity of a response entry against the expected response.
     * @param responseEntry - Actual response entry.
     * @param expectedResponse - Expected response structure.
     */
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

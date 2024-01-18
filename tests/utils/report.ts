import { allure } from "allure-playwright";

export interface ReportArgs {
    /**
     * @example
     * report({description: "Test Description"});
     */
    description?: string;
    /**
     * @example
     * report({severity: "blocker"});
     * report({severity: "critical"});
     * report({severity: "normal"});
     * report({severity: "minor"});
     * report({severity: "trivial"});
     */
    severity?: string;
    /**
     * @example
     * report({owner: "Denis Krasilnikov"});
     */
    owner?: string;
    /**
     * @example
     * report({parentSuite: "WebUI"});
     */
    parentSuite?: string;
    /**
     * @example
     * report({epic: "WebUI"});
     */
    epic?: string;
    /**
     * @example
     * report({suite: "Essential"});
     */
    suite?: string;
    /**
     * @example
     * report({feature: "Essential"});
     */
    feature?: string;
    /**
     * @example
     * report({subSuite: "Login"});
     */
    subSuite?: string;
    /**
     * @example
     * report({story: "Login"});
     */
    story?: string;
    /**
     * @example
     * report({issue: ["https://example.com", "Issue_ID"]});
     * report({issue: "https://example.com"});
     */
    issue?: [string, string] | string;
    /**
     * @example
     * report({tms: ["https://example.com", "TMS_ID"]});
     * report({tms: "https://example.com"});
     */
    tms?: [string, string] | string;
    /**
     * @example
     * report({link: ["https://example.com", "Link Name"]});
     * report({link: "https://example.com"});
     */
    link?: [string, string] | string;
    /**
     * @example
     * report({parameter: ["Parameter Name", "Parameter Value"]});
     */
    parameter?: [string, string];
    /**
     * @example
     * report({tag: "Authentication"});
     */
    tag?: string;
    /**
     * @example
     * report({tags: ["Authentication", "Authorization", "Login"]});
     */
    tags?: string[];
}
/**
 * Reports test information to Allure.
 *
 * @param args - An object containing optional parameters for the Allure report.
 * @param args.description - Description of the test.
 * @param args.severity - Severity of the test.
 * @param args.owner - Owner of the test.
 * @param args.parentSuite - Parent suite of the test.
 * @param args.epic - Epic information for the test.
 * @param args.suite - Suite information for the test.
 * @param args.feature - Feature information for the test.
 * @param args.subSuite - Sub-suite information for the test.
 * @param args.story - Story information for the test.
 * @param args.issue - Issue information for the test, can be a url or [url, description].
 * @param args.tms - Test management system information for the test, can be a url or [url, description].
 * @param args.link - Link information for the test, can be a url or [url, description].
 * @param args.parameter - Parameter information for the test, can be [name, value].
 * @param args.tag - Tag for the test.
 * @param args.tags - Array of tags for the test.
 */
export async function report(args: ReportArgs) {
    for (const [key, value] of Object.entries(args)) {
        if (value) {
            if (Array.isArray(value)) {
                await allure[key](...value);
            } else {
                await allure[key](value);
            }
        }
    }
}

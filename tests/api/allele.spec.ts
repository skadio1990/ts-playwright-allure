import { test } from "../fixtures/test";
import { expect } from "../fixtures/expect";
import { report } from "../utils/report";

test("Assert Data Integrity", async ({ request }) => {
  report({
    suite: "API",
    subSuite: "Functional",
    description:
      'Verify successful execution of a GET request to the \
        "allele" endpoint, ensuring that the response status code is 200 \
        and subsequently validating the integrity of the API data returned.',
    severity: "blocker",
    link: ["https://api.cpicpgx.org", "Documentation"]
  });

  const response = await request.get("https://data.cpicpgx.org/v1/allele", {
    params: {
      limit: 1,
    },
  });

  const exampleJson = "./tests/api/allele.json";
  
  await expect(response).toBeStructuredLike(exampleJson);
});

# Define variables for readability
BUILD_NAME="$BUILD_NUMBER"
BUILD_URL_WITH_CHANGES="$BUILD_URLchanges#$GIT_COMMIT"
REPORT_NAME="Allure Report #$BUILD_NAME"

# Construct the JSON payload in a more readable way
JSON_PAYLOAD='{
  "name": "Jenkins CI/CD",
  "type": "jenkins",
  "reportName": "'$REPORT_NAME'",
  "buildOrder": "'$BUILD_NAME'",
  "reportUrl": "'$BUILD_URL_WITH_CHANGES'",
  "buildName": "'$BUILD_NAME'",
  "buildUrl": "'$BUILD_URL_WITH_CHANGES'"
}'

# Write the JSON payload to a file
echo "$JSON_PAYLOAD" > /Users/skadio/playground/test-results/executor.json
echo "Done creating executor json metadata for allure report"

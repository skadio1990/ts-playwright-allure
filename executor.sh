echo '{\"name\": \"Jenkins CI/CD\", \"type\": \"jenkins\", \"reportName\": \"Allure Report #'$BUILD_NUMBER'\", \"buildOrder\": \"'$BUILD_NUMBER'\", \"buildName\": \"'$BUILD_NUMBER'\", \"buildUrl\": \"'$BUILD_URL'changes#'$GIT_COMMIT'\"}' > /Users/skadio/playground/test-results/executor.json
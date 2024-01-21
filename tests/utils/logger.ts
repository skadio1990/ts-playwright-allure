import {
    Reporter,
    TestCase,
    TestError,
    TestResult,
    TestStep,
} from "@playwright/test/reporter";
import winston from "winston";

const logger = winston.createLogger({
    level: "debug", // set lowest log level
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
            ({ timestamp, level, message }) =>
                `${timestamp} [${level}] ${message}`
        )
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: "logs/text.log",
            options: { flags: "w" },
        }),
        new winston.transports.File({
            filename: "logs/json.log",
            options: { flags: "w" },
            format: winston.format.json(),
        }),
    ],
});

export default class CustomReporter implements Reporter {
    // onTestBegin(test: TestCase): void {
    //     logger.info(`Test started : ${test.title}`);
    // }

    // onStepBegin(test: TestCase, result: TestResult, step: TestStep): void {
    //     if (step.category === "test.step") {
    //         logger.info(`Step started : ${step.title}`);
    //     }
    // }

    // onTestEnd(test: TestCase, result: TestResult): void {
    //     logger[result.status === "passed" ? "info" : "error"](
    //         `Test ${result.status} after ${result.duration}ms : ${test.title}`
    //     );
    // }

    // onTestEnd(test: TestCase, result: TestResult): void {
    //     logger.error(`Test ${result.status} after ${result.duration}ms : ${test.title}`);
    // }

    onStdOut(
        chunk: string | Buffer,
        test: void | TestCase,
        result: void | TestResult
    ): void {
        logger.debug(`${test?.title} : ${chunk}`);
    }

    // onStdErr(
    //     chunk: string | Buffer,
    //     test: void | TestCase,
    //     result: void | TestResult
    // ): void {
    //     logger.error(`${test?.title} : ${chunk}`);
    // }

    onError(error: TestError): void {
        logger.error(
            `${
                (error.location,
                error.message,
                error.snippet,
                error.stack,
                error.value)
            }`
        );
    }
}

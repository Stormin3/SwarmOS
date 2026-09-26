## 2024-05-23 - Timer Leak DoS in Token Endpoints
**Vulnerability:** A `setTimeout` was created for every requested WebSocket token, which could lead to a memory leak and Denial of Service if requested rapidly.
**Learning:** `setTimeout` shouldn't be used to expire dynamically generated items like short-lived tokens, as they pile up in memory.
**Prevention:** Use a lazy-cleanup pattern (checking expiration on access) and probabilistic garbage collection (`Math.random() < 0.1`) to manage short-lived tokens without background timers.

## 2024-05-23 - Avoiding Supertest without types
**Vulnerability:** Not a vulnerability, but a test failure. Using `supertest` in test files causes `pnpm lint` (`tsc --noEmit`) to fail because `@types/supertest` is not installed.
**Learning:** Always check package.json for available dependencies before introducing new ones in tests.
**Prevention:** Use native `fetch` against a locally running server for simple API endpoint testing instead of bringing in new test framework dependencies.

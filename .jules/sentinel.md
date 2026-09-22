## 2025-02-14 - Fix missing WebSocket authentication
**Vulnerability:** The WebSocket endpoint `/api/ws` lacked authentication, allowing unauthorized users to connect and proxy requests to the Gemini API, bypassing intended origin checks (which can be spoofed in non-browser clients).
**Learning:** Relying solely on the `Origin` header in `verifyClient` is insufficient for WebSocket security because origin headers can be trivially forged by programmatic clients or scripts.
**Prevention:** Implement a token-based authentication mechanism where a short-lived token is requested via an HTTP endpoint (which enforces CORS) and passed in the WebSocket connection URL to validate the request.

## 2025-02-14 - Fix missing WebSocket authentication
**Vulnerability:** The WebSocket endpoint `/api/ws` lacked authentication, allowing unauthorized users to connect and proxy requests to the Gemini API, bypassing intended origin checks (which can be spoofed in non-browser clients).
**Learning:** Relying solely on the `Origin` header in `verifyClient` is insufficient for WebSocket security because origin headers can be trivially forged by programmatic clients or scripts.
**Prevention:** Implement a token-based authentication mechanism where a short-lived token is requested via an HTTP endpoint (which enforces CORS) and passed in the WebSocket connection URL to validate the request.

## 2024-05-24 - Rate Limiting on Authentication Endpoints
**Vulnerability:** Missing rate limit on `/api/ws-token` endpoint.
**Learning:** Endpoints that generate tokens (even short-lived ones) must have rate limiting to prevent Denial of Service (DoS) and memory exhaustion.
**Prevention:** Use `express-rate-limit` on sensitive API endpoints.

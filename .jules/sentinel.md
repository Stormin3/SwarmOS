## 2025-02-14 - Fix missing WebSocket authentication
**Vulnerability:** The WebSocket endpoint `/api/ws` lacked authentication, allowing unauthorized users to connect and proxy requests to the Gemini API, bypassing intended origin checks (which can be spoofed in non-browser clients).
**Learning:** Relying solely on the `Origin` header in `verifyClient` is insufficient for WebSocket security because origin headers can be trivially forged by programmatic clients or scripts.
**Prevention:** Implement a token-based authentication mechanism where a short-lived token is requested via an HTTP endpoint (which enforces CORS) and passed in the WebSocket connection URL to validate the request.
## 2025-02-14 - Missing Rate Limiting on Token Endpoint
**Vulnerability:** The `/api/ws-token` endpoint lacked rate limiting, allowing an attacker to request unlimited tokens rapidly. This could exhaust server memory due to unconstrained `Set` growth and excessive `setTimeout` timers, leading to a Denial of Service (DoS).
**Learning:** Endpoints that generate state (like adding to a Set and creating timers) must have strict rate limits, even if the state is short-lived.
**Prevention:** Always implement IP-based rate limiting on endpoints that allocate memory or create background tasks.

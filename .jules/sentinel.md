## 2025-02-14 - Fix missing WebSocket authentication
**Vulnerability:** The WebSocket endpoint `/api/ws` lacked authentication, allowing unauthorized users to connect and proxy requests to the Gemini API, bypassing intended origin checks (which can be spoofed in non-browser clients).
**Learning:** Relying solely on the `Origin` header in `verifyClient` is insufficient for WebSocket security because origin headers can be trivially forged by programmatic clients or scripts.
**Prevention:** Implement a token-based authentication mechanism where a short-lived token is requested via an HTTP endpoint (which enforces CORS) and passed in the WebSocket connection URL to validate the request.
## 2023-10-25 - Fix DoS risk in websocket token generation
**Vulnerability:** Unbounded `setTimeout` per request and lack of rate limiting on the `/api/ws-token` endpoint could lead to memory leaks and denial of service.
**Learning:** Using `setTimeout` for temporary state cleanup creates an unbounded timer per request, which is a DoS vector.
**Prevention:** Use a lazy-cleanup pattern by checking expiration timestamps on access, combined with probabilistic garbage collection, to prevent unbounded timers.

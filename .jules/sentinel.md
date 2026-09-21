## 2025-09-21 - Unauthenticated WebSocket Proxy Access
**Vulnerability:** The backend WebSocket proxy at `/api/ws` was completely unauthenticated, only relying on a naive `origin` header check.
**Learning:** Browsers enforce `origin` for WebSockets, but standard scripts or other backend clients can easily spoof it, turning the proxy into an open, unauthenticated gateway to a paid LLM API.
**Prevention:** Implement a one-time-use secure token exchange via a REST endpoint (which enforces CORS correctly for browsers) before allowing WebSocket connections to upgrade, protecting the socket endpoint.

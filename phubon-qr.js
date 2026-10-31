// Phu Bon v1.2.0: QR UI only. Preserve upload, storage, camera and view settings.
(function () {
  "use strict";
  function record(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }
  function header(headers, name) {
    var keys = Object.keys(headers || {});
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].toLowerCase() === name.toLowerCase()) return String(headers[keys[i]]);
    }
    return "";
  }
  try {
    var request = typeof $request === "object" ? $request : {};
    if (!/Locket/i.test(header(request.headers, "user-agent")) ||
        !/^https:\/\/firebaseremoteconfig\.googleapis\.com\/v1\/projects\/locket-4252a\/.+/.test(String(request.url || ""))) {
      return $done({});
    }
    if (typeof $response !== "object" || typeof $response.body !== "string") return $done({});
    var payload = JSON.parse($response.body);
    if (!record(payload) || !record(payload.entries) ||
        (payload.state !== undefined && payload.state !== "UPDATE")) return $done({});

    var original = payload.entries.qr_code_config;
    var qr = original === undefined ? {} : typeof original === "string" ? JSON.parse(original) : original;
    if (!record(qr)) return $done({});
    var updated = Object.assign({}, qr, { profile_enabled: true, scanning_enabled: true });
    // Preserve the server's other QR fields and its representation when present.
    payload.entries.qr_code_config = original !== undefined && typeof original !== "string"
      ? updated : JSON.stringify(updated);
    payload.entries.profile_menu_v2_enabled = "true";
    return $done({ body: JSON.stringify(payload) });
  } catch (error) {
    return $done({});
  }
})();

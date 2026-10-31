// Phu Bon - local Locket entitlement response customization, v1.4.1.
// Changes only the response received by this device; does not record a purchase.
(function () {
  "use strict";

  // EDIT THESE TWO DATES. +07:00 is Viet Nam time.
  var SETTINGS = {
    goldSince: "2005-11-01T00:00:00+07:00",
    goldUntil: "2099-12-31T23:59:59+07:00",
    productId: "locket_1600_1y",
    entitlementId: "Gold"
  };

  function header(headers, name) {
    var keys = Object.keys(headers || {});
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].toLowerCase() === name.toLowerCase()) return String(headers[keys[i]]);
    }
    return "";
  }
  function record(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  try {
    var request = typeof $request === "object" ? $request : {};
    var url = String(request.url || "");
    var ua = header(request.headers, "user-agent");
    if (!/Locket/i.test(ua) ||
        !/^https:\/\/api\.revenuecat\.com\/v1\/(?:receipts|subscribers\/[^/?]+)\/?(?:\?.*)?$/.test(url)) {
      return $done({});
    }
    if (typeof $response !== "object" || typeof $response.body !== "string") return $done({});
    var payload = JSON.parse($response.body);
    if (!record(payload) || !record(payload.subscriber)) return $done({});
    var subscriber = payload.subscriber;
    if ((subscriber.subscriptions !== undefined && !record(subscriber.subscriptions)) ||
        (subscriber.entitlements !== undefined && !record(subscriber.entitlements))) return $done({});

    var start = new Date(SETTINGS.goldSince);
    var end = new Date(SETTINGS.goldUntil);
    if (!isFinite(start.getTime()) || !isFinite(end.getTime()) || end <= start) return $done({});
    var since = start.toISOString();
    var until = end.toISOString();
    subscriber.subscriptions = subscriber.subscriptions || {};
    subscriber.entitlements = subscriber.entitlements || {};

    var oldSubscription = subscriber.subscriptions[SETTINGS.productId];
    var subscription = Object.assign({}, record(oldSubscription) ? oldSubscription : {}, {
      auto_resume_date: null,
      billing_issues_detected_at: null,
      expires_date: until,
      grace_period_expires_date: null,
      is_sandbox: true,
      original_purchase_date: since,
      ownership_type: "PURCHASED",
      period_type: "normal",
      purchase_date: since,
      refunded_at: null,
      store: "app_store",
      unsubscribe_detected_at: null
    });
    // Do not invent a receipt, transaction number, charged price, or account ID.
    subscriber.subscriptions[SETTINGS.productId] = subscription;
    var oldEntitlement = subscriber.entitlements[SETTINGS.entitlementId];
    subscriber.entitlements[SETTINGS.entitlementId] = Object.assign(
      {}, record(oldEntitlement) ? oldEntitlement : {}, {
        product_identifier: SETTINGS.productId,
        purchase_date: since,
        expires_date: until,
        grace_period_expires_date: null
      }
    );
    return $done({ body: JSON.stringify(payload) });
  } catch (error) {
    // Invalid JSON or a changed response schema: leave the response unchanged.
    return $done({});
  }
})();

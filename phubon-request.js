// Phu Bon - refresh Locket CustomerInfo without the RevenueCat ETag cache.
(function () {
  "use strict";
  try {
    var request = typeof $request === "object" ? $request : {};
    var headers = request.headers || {};
    var keys = Object.keys(headers);
    var ua = "";
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].toLowerCase() === "user-agent") ua = String(headers[keys[i]]);
    }
    if (!/Locket/i.test(ua) ||
        !/^https:\/\/api\.revenuecat\.com\/v1\/(?:receipts|subscribers\/[^/?]+)\/?(?:\?.*)?$/.test(String(request.url || ""))) {
      return $done({});
    }
    var output = Object.assign({}, headers);
    for (var j = 0; j < keys.length; j++) {
      if (keys[j].toLowerCase() === "x-revenuecat-etag") delete output[keys[j]];
    }
    return $done({ headers: output });
  } catch (error) {
    return $done({});
  }
})();

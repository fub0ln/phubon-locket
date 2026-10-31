// Run: node kiem_tra.cjs. Uses synthetic data only; no network or real accounts.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const scripts = Object.fromEntries(['gold', 'request', 'features'].map(name =>
  [name, fs.readFileSync(path.join(__dirname, `phubon-${name}.js`), 'utf8')]));
let checks = 0;
function check(value, message) { assert.ok(value, message); checks++; }
function run(name, options = {}) {
  const isFeatures = name === 'features';
  const request = {
    url: options.url || (isFeatures
      ? 'https://firebaseremoteconfig.googleapis.com/v1/projects/locket-4252a/namespaces/firebase:fetch'
      : 'https://api.revenuecat.com/v1/subscribers/synthetic-user'),
    headers: options.headers || { 'User-Agent': options.ua === undefined ? 'Locket/1.0.0' : options.ua }
  };
  const body = options.raw === undefined
    ? JSON.stringify(options.payload || (isFeatures ? { entries: { existing_flag: 'keep' } } : {
      request_date: '2026-10-31T00:00:00Z',
      subscriber: { original_app_user_id: 'synthetic-user', subscriptions: {}, entitlements: {
        Other: { product_identifier: 'other-product', expires_date: null }
      } }
    })) : options.raw;
  const beforeRequest = JSON.stringify(request);
  const output = [];
  vm.runInNewContext(scripts[name], {
    $request: request, $response: { body }, $done: value => output.push(value)
  }, { timeout: 1000 });
  check(output.length === 1, `${name}: calls done exactly once`);
  check(JSON.stringify(request) === beforeRequest, `${name}: input request not mutated`);
  return JSON.parse(JSON.stringify(output[0]));
}
const goldResult = JSON.parse(run('gold').body);
const gold = goldResult.subscriber.entitlements.Gold;
const subscription = goldResult.subscriber.subscriptions[gold.product_identifier];
check(gold.product_identifier === 'locket_1600_1y', 'known product identifier is consistent');
check(gold.purchase_date === '2026-10-30T17:00:00.000Z', 'Viet Nam date converted correctly');
check(subscription.purchase_date === gold.purchase_date && subscription.original_purchase_date === gold.purchase_date, 'purchase dates consistent');
check(subscription.expires_date === gold.expires_date, 'expiration dates consistent');
check(goldResult.subscriber.entitlements.Other.product_identifier === 'other-product', 'other entitlements preserved');
check(goldResult.subscriber.original_app_user_id === 'synthetic-user', 'user identity preserved');
check(!('store_transaction_id' in subscription) && !('price' in subscription), 'no invented transaction or price');
check(goldResult.request_date === '2026-10-31T00:00:00Z', 'server request date preserved');
check(!!run('gold', {url: 'https://api.revenuecat.com/v1/receipts'}).body, 'receipt response hook works');
check(!!run('gold', {headers: {'uSeR-aGeNt': 'Locket/1.0.0'}}).body, 'case-insensitive header lookup');
for (const options of [
  { ua: 'DifferentApp/1.0.0' }, { headers: {} },
  { url: 'https://api.revenuecat.com.attacker.invalid/v1/subscribers/x' },
  { url: 'https://other.invalid/v1/subscribers/x' },
  { url: 'https://api.revenuecat.com/v1/offerings' },
  { raw: 'not json' }, { raw: '' }, { raw: 'null' }, { payload: { error: 'denied' } },
  { payload: { subscriber: { subscriptions: [], entitlements: {} } } }
]) check(Object.keys(run('gold', options)).length === 0, 'unrelated or invalid Gold response unchanged');
const requestResult = run('request', { headers: {
  'User-Agent': 'Locket/1.0.0', 'X-RevenueCat-ETag': 'synthetic-cache',
  Authorization: 'synthetic-header', 'X-RevenueCat-Response-Signature': 'preserve'
} });
check(!('X-RevenueCat-ETag' in requestResult.headers), 'ETag removed');
check(requestResult.headers.Authorization === 'synthetic-header', 'other headers preserved');
check(requestResult.headers['X-RevenueCat-Response-Signature'] === 'preserve', 'signature-related header preserved');
check(Object.keys(run('request', {ua: 'DifferentApp/1.0.0'})).length === 0, 'other-app request unchanged');
const features = JSON.parse(run('features').body);
check(features.entries.existing_flag === 'keep', 'unrelated remote setting preserved');
const overlays = JSON.parse(features.entries.overlay_items);
check(overlays.reduce((sum, section) => sum + section.items.length, 0) === 217, '217 overlay entries retained');
check(JSON.parse(features.entries.camera_filter_config).picker_filters.length === 35, '35 filter identifiers retained');
check(features.Attention.includes('Phú Bôn'), 'personalization applied');
check(!JSON.stringify(features).includes('i.postimg.cc'), 'external promotional images removed');
for (const options of [
  {ua: 'DifferentApp'}, {raw: 'not json'}, {raw: 'null'}, {payload: {entries: []}},
  {url: 'https://firebaseremoteconfig.googleapis.com/v1/projects/another-app/namespaces/firebase:fetch'}
]) check(Object.keys(run('features', options)).length === 0, 'unrelated or invalid Remote Config unchanged');
for (const source of Object.values(scripts)) {
  check(!/\$(?:httpClient|httpAPI|task)|\bfetch\s*\(|XMLHttpRequest|\beval\s*\(/.test(source), 'no active network calls or evaluated downloads');
}
console.log(`Passed ${checks} offline checks. Not tested against Locket or on an iPhone.`);

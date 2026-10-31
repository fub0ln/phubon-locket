// Run: node kiem_tra.cjs. Uses synthetic data only; no network or real accounts.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const scripts = Object.fromEntries(['gold', 'request', 'features', 'qr'].map(name =>
  [name, fs.readFileSync(path.join(__dirname, `phubon-${name}.js`), 'utf8')]));
let checks = 0;
function check(value, message) { assert.ok(value, message); checks++; }
function run(name, options = {}) {
  const isFeatures = name === 'features' || name === 'qr';
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
  const response = { body };
  const beforeResponse = JSON.stringify(response);
  const output = [];
  vm.runInNewContext(scripts[name], {
    $request: request, $response: response, $done: value => output.push(value)
  }, { timeout: 1000 });
  check(output.length === 1, `${name}: calls done exactly once`);
  check(JSON.stringify(request) === beforeRequest, `${name}: input request not mutated`);
  check(JSON.stringify(response) === beforeResponse, `${name}: input response not mutated`);
  return JSON.parse(JSON.stringify(output[0]));
}
const goldResult = JSON.parse(run('gold').body);
const gold = goldResult.subscriber.entitlements.Gold;
const subscription = goldResult.subscriber.subscriptions[gold.product_identifier];
check(gold.product_identifier === 'locket_1600_1y', 'known product identifier is consistent');
check(gold.purchase_date === '2005-10-31T17:00:00.000Z', 'Viet Nam date converted correctly');
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
// Regression: old module references must no longer overwrite upload, QR,
// viewers, captions, CDN, storage, or any other Remote Config settings.
const originalRemoteConfig = { state: 'UPDATE', entries: {
  upload_main: 'server-upload-mode',
  storage_bucket: 'gs://server-selected-bucket',
  cdn_domain_replacements: '{"original":"original-cdn"}',
  qr_code_config: '{"original_qr_setting":true}',
  get_moment_views_as_cloud_function: 'server-selected-view-api',
  overlay_items: '[{"original_caption":"keep"}]',
  unknown_future_setting: 'preserve'
} };
check(Object.keys(run('features', {payload: originalRemoteConfig})).length === 0,
  'compatibility script leaves complete server configuration untouched');
for (const options of [
  {ua: 'DifferentApp'}, {raw: 'not json'}, {raw: 'null'},
  {payload: {state: 'NO_CHANGE'}}, {payload: {entries: []}}
]) check(Object.keys(run('features', options)).length === 0,
  'compatibility script preserves invalid and NO_CHANGE responses');

// Regression: Gold hooks may not run on account, QR, view, or upload services.
for (const url of [
  'https://api.locketcamera.com/upload',
  'https://us-central1-locket-4252a.cloudfunctions.net/getViews',
  'https://firebasestorage.googleapis.com/v0/b/locket/o',
  'https://firebaseremoteconfig.googleapis.com/v1/projects/locket-4252a/namespaces/firebase:fetch'
]) {
  for (const name of ['gold', 'request']) {
    check(Object.keys(run(name, {url})).length === 0, `${name} leaves ${url} unchanged`);
  }
}
const moduleSource = fs.readFileSync(path.join(__dirname, 'PhuBon_1_1.module'), 'utf8');
check(!moduleSource.includes('firebaseremoteconfig.googleapis.com'), 'Firebase is absent from active hooks and MITM hostnames');
check(!moduleSource.includes('phubon_features'), 'Remote Config rewrite is disabled');
check((moduleSource.match(/script-path=/g) || []).length === 2, 'only the two RevenueCat hooks remain');
check((moduleSource.match(/\?v=1\.1\.0/g) || []).length === 2, 'new version URLs avoid an old script cache');
// QR patch must preserve the complete server-provided configuration except
// the two QR menu keys; it must not reintroduce the v1.0 upload/view overrides.
const qrPayload = { state: 'UPDATE', entries: {
  upload_main: 'keep-server-mode', storage_bucket: 'gs://keep-server-bucket',
  camera: '{"server_duration":10}',
  get_moment_views_as_cloud_function: 'keep-server-api',
  feature_gates: '{"server_gold_gate":"keep"}',
  qr_code_config: '{"profile_enabled":false,"scanning_enabled":false,"server_template":"keep","nested":{"preserve":true}}',
  profile_menu_v2_enabled: 'false', unknown_future_setting: 'preserve'
} };
const qrOutput = JSON.parse(run('qr', {payload: qrPayload}).body);
const qrExpected = JSON.parse(JSON.stringify(qrPayload));
qrExpected.entries.qr_code_config = JSON.stringify({profile_enabled:true, scanning_enabled:true, server_template:'keep', nested:{preserve:true}});
qrExpected.entries.profile_menu_v2_enabled = 'true';
check(JSON.stringify(qrOutput) === JSON.stringify(qrExpected), 'QR patch changes only the intended two entries and preserves other QR fields');
const objectQr = JSON.parse(run('qr', {payload:{entries:{qr_code_config:{server_template:'keep'}}}}).body);
check(typeof objectQr.entries.qr_code_config === 'object' && objectQr.entries.qr_code_config.server_template === 'keep', 'object QR representation preserved');
for (const options of [
  {ua:'DifferentApp'}, {headers:{}}, {raw:'not json'}, {raw:'null'},
  {payload:{state:'NO_CHANGE',entries:{qr_code_config:'{}'}}},
  {payload:{state:'EMPTY_CONFIG',entries:{}}}, {payload:{state:'UPDATE'}},
  {payload:{entries:{qr_code_config:'not json'}}},
  {payload:{entries:{qr_code_config:'[]'}}},
  {url:'https://firebaseremoteconfig.googleapis.com/v1/projects/another-app/namespaces/firebase:fetch'},
  {url:'https://firebaseremoteconfig.googleapis.com.attacker.invalid/v1/projects/locket-4252a/namespaces/firebase:fetch'}
]) check(Object.keys(run('qr', options)).length === 0, 'QR patch preserves unrelated, invalid and unchanged responses');
const qrModule = fs.readFileSync(path.join(__dirname,'PhuBon_1_2.module'),'utf8');
check(qrModule.includes('phubon-qr.js?v=1.2.0') && !qrModule.includes('phubon-full.js'), 'working QR fallback keeps only its original hook');
check((qrModule.match(/script-path=/g)||[]).length === 3 && qrModule.includes('phubon-qr.js?v=1.2.0'), 'only the dedicated QR hook is added');
check(!qrModule.includes('phubon-features.js'), 'old bulk feature rewrite stays disabled');
for (const source of Object.values(scripts)) {
  check(!/\$(?:httpClient|httpAPI|task)|\bfetch\s*\(|XMLHttpRequest|\beval\s*\(/.test(source), 'no active network calls or evaluated downloads');
}
console.log(`Passed ${checks} offline checks. Not tested against Locket or on an iPhone.`);

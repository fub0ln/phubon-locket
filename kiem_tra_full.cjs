// node kiem_tra_full.cjs - synthetic data, no network or real account data.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, 'phubon-full.js'), 'utf8');
let checks = 0;
function check(ok, message) { assert.ok(ok, message); checks++; }
function run(options = {}) {
  const request = {
    url: options.url || 'https://firebaseremoteconfig.googleapis.com/v1/projects/locket-4252a/namespaces/firebase:fetch',
    headers: options.headers || {'User-Agent':options.ua === undefined ? 'Locket/1.0.0' : options.ua}
  };
  const response = {body: options.raw === undefined ? JSON.stringify(options.payload || {state:'UPDATE',entries:{}}) : options.raw};
  const before = JSON.stringify({request,response});
  const outputs = [];
  vm.runInNewContext(source, {$request:request,$response:response,$done:v=>outputs.push(v)}, {timeout:1000});
  check(outputs.length === 1, 'one completion callback');
  check(JSON.stringify({request,response}) === before, 'original request and response not mutated');
  return JSON.parse(JSON.stringify(outputs[0]));
}
const original = {state:'UPDATE',entries:{
  upload_main:'server-mode', upload_main_image_size:'server-size',
  storage_bucket:'gs://server-bucket', storage_bucket_video:'gs://server-video',
  cdn_domain_replacements:'{ "server": "server-cdn" }',
  firestore_refresh_v3:'server-value', fetch_users_from_cloud_function:'false',
  get_moment_views_as_cloud_function:'server-view-api', moment_views_enabled:'server-views',
  moment_views_v2:'server-v2', record_moment_views:'server-record', notify_moment_views:'server-notify',
  send_to_self_only_mode:'server-audience', widget_sync_token_reload_mode:'server-sync',
  feature_gates:'{"locket_views":"server-gate","unknown_gate":"keep"}',
  upsell_features:'{"locket_views":"server-upsell"}',
  camera:'{"quality_mbps":2.5,"telephoto":false,"ultra_wide":true,"native_codec":"keep","max_duration":10}',
  camera_roll:'{"qualityMbps":2.5,"native_upload_options":{"keep":true}}',
  qr_code_config:'{"profile_enabled":false,"server_template":"keep","nested":{"keep":true}}',
  camera_filter_config:'{"native_filter_setting":true,"picker_filters":["server_filter"],"sheet_filters":[{"title":{"en":"Goofy","vi":"Native translation"},"filter_ids":["server_filter"],"native_group_setting":true}]}',
  overlay_items:'[{"section":"General","native_section_setting":true,"items":[{"overlay_id":"caption:standard","source":"local","native_item_setting":true},{"overlay_id":"caption:server_only","source":"local"}]}]',
  overlay_dynamic_captions:'["server_only"]', unknown_future_setting:'keep'
}};
const output = JSON.parse(run({payload:original}).body);
for (const key of [
  'upload_main','upload_main_image_size','storage_bucket','storage_bucket_video',
  'cdn_domain_replacements','firestore_refresh_v3','fetch_users_from_cloud_function',
  'get_moment_views_as_cloud_function','moment_views_enabled','moment_views_v2',
  'record_moment_views','notify_moment_views','send_to_self_only_mode',
  'widget_sync_token_reload_mode','unknown_future_setting'
]) check(output.entries[key] === original.entries[key], `preserve ${key}`);
const camera = JSON.parse(output.entries.camera);
check(camera.max_duration === 30 && camera.gold_max_duration === 30, 'requested camera duration configured');
check(camera.quality_mbps === 2.5 && camera.telephoto === false && camera.ultra_wide === true && camera.native_codec === 'keep', 'native codec, bitrate and hardware settings preserved');
const roll = JSON.parse(output.entries.camera_roll);
check(roll.qualityMbps === 2.5 && roll.native_upload_options.keep, 'native gallery upload options preserved');
check(output.entries.video_sound_enabled === 'true' && output.entries.camera_microphone_enabled === 'true', 'audio configuration restored');
const qr = JSON.parse(output.entries.qr_code_config);
check(qr.profile_enabled && qr.scanning_enabled && qr.server_template === 'keep' && qr.nested.keep, 'working QR merge behavior preserved');
check(JSON.parse(output.entries.feature_gates).locket_views === 'server-gate', 'working view gate preserved');
check(JSON.parse(output.entries.feature_gates).unknown_gate === 'keep', 'unknown feature gates preserved');
check(JSON.parse(output.entries.upsell_features).locket_views === 'server-upsell', 'native views upsell preserved');
const filters = JSON.parse(output.entries.camera_filter_config);
check(filters.picker_filters.includes('server_filter') && filters.picker_filters.length === 36, '35 preset filters added without dropping native filters');
check(filters.native_filter_setting && filters.sheet_filters[0].native_group_setting && filters.sheet_filters[0].title.vi === 'Native translation', 'native filter metadata preserved');
check(filters.sheet_filters[0].filter_ids.includes('server_filter'), 'native filter IDs preserved inside groups');
const sections = JSON.parse(output.entries.overlay_items);
const items = sections.flatMap(s=>s.items);
check(items.length === 218 && new Set(items.map(x=>x.overlay_id)).size === 218, '217 presets merged with native entries without duplicate IDs');
check(items.find(x=>x.overlay_id==='caption:standard').native_item_setting === true, 'native standard caption metadata preserved');
check(items.some(x=>x.overlay_id==='caption:server_only'), 'server-only captions preserved');
check(sections[0].native_section_setting === true, 'native caption section metadata preserved');
check(JSON.parse(output.entries.overlay_dynamic_captions).includes('server_only'), 'native dynamic caption preserved');
check(JSON.stringify(JSON.parse(run({payload:output}).body)) === JSON.stringify(output), 'reapplying full configuration is idempotent');
const empty = JSON.parse(run().body).entries;
check(JSON.parse(empty.overlay_items).flatMap(x=>x.items).length === 217, '217 preset captions available on empty valid configuration');
check(JSON.parse(empty.camera_filter_config).picker_filters.length === 35, '35 filters available on empty valid configuration');
for (const key of ['upload_main','storage_bucket','cdn_domain_replacements','get_moment_views_as_cloud_function','send_to_self_only_mode','fetch_users_from_cloud_function']) {
  check(!(key in empty), `never invent ${key}`);
}
const malformed = {state:'UPDATE',entries:{camera:'not json',qr_code_config:'[]',overlay_items:'{"unexpected_schema":true}'}};
const preserved = JSON.parse(run({payload:malformed}).body).entries;
check(preserved.camera === 'not json' && preserved.qr_code_config === '[]' && preserved.overlay_items === malformed.entries.overlay_items, 'unrecognized server schemas preserved');
for (const options of [
  {ua:'AnotherApp'}, {headers:{}}, {raw:'not json'}, {raw:'null'},
  {payload:{state:'NO_CHANGE',entries:{}}}, {payload:{state:'EMPTY_CONFIG',entries:{}}},
  {payload:{state:'UPDATE'}}, {payload:{entries:[]}},
  {url:'https://firebaseremoteconfig.googleapis.com/v1/projects/another-project/namespaces/firebase:fetch'},
  {url:'https://firebaseremoteconfig.googleapis.com.attacker.invalid/v1/projects/locket-4252a/namespaces/firebase:fetch'}
]) check(Object.keys(run(options)).length === 0, 'unrelated, invalid and unchanged responses preserved');
check(!/\$(?:httpClient|httpAPI|task)|\bfetch\s*\(|XMLHttpRequest|\beval\s*\(/.test(source), 'no outgoing requests or evaluated remote code');
const fullModule = fs.readFileSync(path.join(__dirname,'PhuBon_1_3_Full.module'),'utf8');
check(fullModule.includes('phubon-full.js?v=1.3.0') && !fullModule.includes('phubon-full-1.4.js'), 'original Full fallback keeps its tested script');
check((fullModule.match(/script-path=/g)||[]).length === 3 && fullModule.includes('phubon-full.js?v=1.3.0'), 'single full configuration hook');
check(!fullModule.includes('phubon-qr.js') && !fullModule.includes('phubon-features.js'), 'no overlapping QR or legacy full hooks');
console.log(`Passed ${checks} full-feature regression checks. Device testing remains required.`);

// Checks configuration deltas only; cannot prove the app/server's privacy behavior.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const oldSource = fs.readFileSync(path.join(__dirname,'phubon-full.js'),'utf8');
const newSource = fs.readFileSync(path.join(__dirname,'phubon-full-1.4.js'),'utf8');
let checks = 0;
function check(value,message) { assert.ok(value,message); checks++; }
function run(source,payload,options={}) {
  const request = {url:options.url || 'https://firebaseremoteconfig.googleapis.com/v1/projects/locket-4252a/namespaces/firebase:fetch',headers:{'User-Agent':options.ua || 'Locket/1.0.0'}};
  const response = {body:JSON.stringify(payload)};
  const before = JSON.stringify({request,response});
  const output=[];
  vm.runInNewContext(source,{$request:request,$response:response,$done:v=>output.push(v)},{timeout:1000});
  check(output.length===1,'one completion callback');
  check(JSON.stringify({request,response})===before,'original request/response unchanged');
  return output[0].body ? JSON.parse(output[0].body) : null;
}
for (const entries of [
  {},
  {send_to_self_only_mode:'disabled',default_audience:'friends',recipient_ids:'["synthetic-friend"]',visibility:'server-policy',upload_main:'server-mode',get_moment_views_as_cloud_function:'server-api',qr_code_config:'{"server_template":"keep"}'},
  {send_to_self_only_mode:'always_enabled',default_recipients:'server-value',camera:'{"native_codec":"keep"}'}
]) {
  const payload={state:'UPDATE',entries};
  const expected=run(oldSource,payload);
  expected.entries.send_to_self_only_mode='always_enabled';
  const actual=run(newSource,payload);
  assert.deepEqual(actual,expected);
  check(true,'only configuration delta is the requested native self-only feature flag');
  assert.deepEqual(run(newSource,actual),actual);
  check(true,'repeat application is idempotent');
}
for (const [payload,options] of [
  [{state:'NO_CHANGE',entries:{}},{}],
  [{state:'EMPTY_CONFIG',entries:{}},{}],
  [{entries:[]},{}],
  [{entries:{}},{ua:'AnotherApp'}],
  [{entries:{}},{url:'https://firebaseremoteconfig.googleapis.com/v1/projects/another-app/namespaces/firebase:fetch'}]
]) check(run(newSource,payload,options)===null,'unrelated and unchanged data preserved');
const latest=fs.readFileSync(path.join(__dirname,'PhuBon.module'),'utf8');
check(latest===fs.readFileSync(path.join(__dirname,'PhuBon_1_4_Full.module'),'utf8'),'latest module matches private-option version');
check(latest.includes('phubon-full-1.4.js?v=1.4.0'),'new version uses a distinct script URL');
check((latest.match(/script-path=/g)||[]).length===3,'only one feature response hook');
check(!/\$(?:httpClient|httpAPI|task)|\bfetch\s*\(|XMLHttpRequest|\beval\s*\(/.test(newSource),'no active posting, outgoing requests or remote execution');
console.log(`Passed ${checks} private-option checks. Native recipient selection and server privacy remain unverified.`);

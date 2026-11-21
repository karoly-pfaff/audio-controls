import { readManifest } from './run-npm.mjs';
import {
  assertReleaseIdentity,
  assertReleaseVersion,
  assertPublishContext,
} from './release-contract.mjs';
import { readCandidate } from './candidate-report.mjs';

const manifest = readManifest();

assertReleaseIdentity(manifest);
assertReleaseVersion(manifest, process.env.RELEASE_VERSION ?? manifest.version);
if (process.env.PUBLISH_REQUESTED === 'true') assertPublishContext(manifest, process.env);

const report = readCandidate();

console.log('Release candidate verified: ' + report.name + '@' + report.version);
console.log('Registry: https://npm.pkg.github.com · no publication performed.');

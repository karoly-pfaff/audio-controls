import { readManifest } from './run-npm.mjs';
import { assertPublishContext } from './release-contract.mjs';

assertPublishContext(readManifest(), process.env);

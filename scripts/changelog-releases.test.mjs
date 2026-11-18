import test from "node:test";
import assert from "node:assert/strict";
import { getNewComponentRelease } from "../lib/changelog-releases.ts";

const previousRelease = { releasedOn: "2026-11-18", newComponents: ["kalos-combobox"] };
const pendingRelease = { releasedOn: null, newComponents: ["kalos-test"] };
const patchRelease = { releasedOn: "2026-11-19", newComponents: [] };

test("keeps the last published component badges across patches and pending releases", () => {
  const releases = { "0.3.7": pendingRelease, "0.3.6": patchRelease, "0.3.5": previousRelease };
  assert.deepEqual(getNewComponentRelease(releases), { version: "0.3.5", slugs: new Set(["kalos-combobox"]) });
});

test("replaces the previous badges when a release with new components is published", () => {
  const releases = {
    "0.3.7": { ...pendingRelease, releasedOn: "2026-11-20" },
    "0.3.6": patchRelease,
    "0.3.5": previousRelease,
  };
  assert.deepEqual(getNewComponentRelease(releases), { version: "0.3.7", slugs: new Set(["kalos-test"]) });
});

test("omits badges when no published release introduced components", () => {
  assert.equal(getNewComponentRelease({ "0.3.7": pendingRelease, "0.3.6": patchRelease }), undefined);
});

import test from "ava";
import type { ExecutionContext } from "ava";

import * as apiSurface from "../../../main/typescript/public-api";

test("Library can be loaded", async (t: ExecutionContext) => {
  t.truthy(apiSurface, "apiSurface truthy OK");
});

--- a/src/server/routes.ts
+++ b/src/server/routes.ts
@@ -10,3 +10,6 @@ export async function router(req, res) {
+  try {
     return await handleRequest(req, res);
+  } catch (err) {
+    return res.status(500).json({ error: 'Recovered cleanly' });
+  }
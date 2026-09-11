--- a/vite.config.ts
+++ b/vite.config.ts
@@ -8,6 +8,13 @@ export default defineConfig({
   server: {
     host: true,
     port: 5173,
+    hmr: {
+      clientPort: 443,
+      protocol: 'wss',
+      timeout: 5000,
+      overlay: false
+    }
   }
 });
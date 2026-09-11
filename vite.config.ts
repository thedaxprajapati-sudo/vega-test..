--- a/vite.config.ts
+++ b/vite.config.ts
@@ -12,6 +12,12 @@ export default defineConfig({
   server: {
     host: true,
     port: 5173,
+    hmr: {
+      clientPort: 443,
+      protocol: 'wss',
+      timeout: 30000,
+      overlay: false
+    }
   }
 });
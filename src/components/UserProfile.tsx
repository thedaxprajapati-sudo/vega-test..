--- a/src/components/UserProfile.tsx
+++ b/src/components/UserProfile.tsx
@@ -23,3 +23,3 @@ export function UserProfile({ user }: Props) {
-  return <div>Welcome, {user.profile.name}</div>;
+  return <div>Welcome, {user?.profile?.name ?? 'Guest'}</div>;
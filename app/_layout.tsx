import { Slot, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../components/Provider/AuthProvider";

import { useEffect } from "react";

const Layout = () => {
  const { initialized, session } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    const protectedGroup = segments[0] === "(protected)";
    if (session && !protectedGroup) {
      router.replace("/files");
    } else if (!session) {
      router.replace("/");
    }
  }, [initialized, session]);

  return <Slot />;
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

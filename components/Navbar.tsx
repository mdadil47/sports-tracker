import { auth } from "@/auth";
import NavbarClient from "./NavbarClient";
import LiveTicker from "./LiveTicker";

export default async function Navbar() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  return (
    <>
      <NavbarClient userName={session?.user?.name ?? null} />
      {userId && <LiveTicker userId={userId} />}
    </>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function UnsaveButton({ teamId, teamName }: { teamId: string; teamName: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  async function handleUnsave() {
    setLoading(true);
    const res = await fetch(`/api/saved-teams/${teamId}`, { method: "DELETE" });
    setLoading(false);

    if (res.ok) {
      showToast(`${teamName} removed`, "info");
      router.refresh();
    } else {
      showToast("Failed to remove team", "error");
    }
  }

  return (
    <button
      onClick={handleUnsave}
      disabled={loading}
      className="text-[var(--muted)] hover:text-red-400 transition-colors p-1"
      aria-label={`Remove ${teamName}`}
    >
      <X className="w-4 h-4" />
    </button>
  );
}
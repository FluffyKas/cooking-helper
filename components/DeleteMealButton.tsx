"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ConfirmDialog from "./ConfirmDialog";

interface DeleteMealButtonProps {
  mealId: string;
  mealName: string;
}

export default function DeleteMealButton({ mealId, mealName }: DeleteMealButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setError("You must be logged in to delete recipes.");
        setIsDeleting(false);
        return;
      }

      const response = await fetch(`/api/meals/${mealId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Error deleting meal:", err);
      setError("Failed to delete recipe. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 bg-coral-100 text-coral-300 font-semibold rounded-2xl hover:bg-coral-200 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <span className="hidden sm:inline">DELETE</span>
      </button>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete Recipe"
        message={error || `Are you sure you want to delete "${mealName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        onCancel={() => { setShowConfirm(false); setError(""); }}
        isLoading={isDeleting}
      />
    </>
  );
}

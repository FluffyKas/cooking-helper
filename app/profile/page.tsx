"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function ProfilePage() {
  const { user, updatePassword, updateEmail, updateProfile, signOut } = useAuth();
  const router = useRouter();

  // Nickname state
  const [nickname, setNickname] = useState(user?.user_metadata?.nickname || "");
  const [nicknameError, setNicknameError] = useState("");
  const [nicknameSuccess, setNicknameSuccess] = useState("");
  const [nicknameLoading, setNicknameLoading] = useState(false);

  // Password change state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Email change state
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleNicknameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setNicknameError("");
    setNicknameSuccess("");

    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) {
      setNicknameError("Please enter a nickname");
      return;
    }

    setNicknameLoading(true);
    const { error } = await updateProfile({ nickname: trimmedNickname });

    if (error) {
      setNicknameError(error.message);
    } else {
      setNicknameSuccess("Nickname updated!");
    }
    setNicknameLoading(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordLoading(true);
    const { error } = await updatePassword(newPassword);

    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSuccess("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    }
    setPasswordLoading(false);
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setEmailSuccess("");

    if (!newEmail || !newEmail.includes("@")) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (newEmail === user?.email) {
      setEmailError("New email is the same as current email");
      return;
    }

    setEmailLoading(true);
    const { error } = await updateEmail(newEmail);

    if (error) {
      setEmailError(error.message);
    } else {
      setEmailSuccess("Confirmation email sent! Please check your inbox to verify the new email address.");
      setNewEmail("");
    }
    setEmailLoading(false);
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");
    setDeleteLoading(true);

    try {
      // Get current session token
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setDeleteError("No active session found");
        setDeleteLoading(false);
        return;
      }

      const response = await fetch("/api/account", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete account");
      }

      // Sign out and redirect to login
      await signOut();
      router.push("/login");
    } catch (error: any) {
      setDeleteError(error.message || "Failed to delete account");
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Redirect to login if not authenticated
  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <Link
          href="/"
          className="inline-block mb-6 text-mint-500 font-medium hover:underline"
        >
          ← Back to recipes
        </Link>

        <h1 className="text-4xl font-bold mb-8">Profile</h1>

        {/* Account Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Account Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg">
            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-medium text-gray-800">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Member since</p>
              <p className="font-medium text-gray-800">{formatDate(user.created_at)}</p>
            </div>
            <div className="sm:col-span-2">
              <form onSubmit={handleNicknameChange} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-sm text-gray-500 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent bg-gray-50 text-gray-800"
                    placeholder="Enter your nickname"
                    maxLength={30}
                  />
                </div>
                <button
                  type="submit"
                  disabled={nicknameLoading || !nickname.trim()}
                  className="self-end px-5 py-2 bg-mint-300 text-nav-dark font-semibold rounded-xl hover:bg-mint-400 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {nicknameLoading ? "Saving..." : "Save"}
                </button>
              </form>
              {nicknameError && (
                <p className="mt-2 text-sm text-coral-300" role="alert" aria-live="polite">{nicknameError}</p>
              )}
              {nicknameSuccess && (
                <p className="mt-2 text-sm text-mint-500" role="status" aria-live="polite">{nicknameSuccess}</p>
              )}
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Change Password</h2>
          <form onSubmit={handlePasswordChange}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent bg-gray-50 text-gray-800"
                  placeholder="New password"
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent bg-gray-50 text-gray-800"
                  placeholder="Confirm password"
                  minLength={6}
                />
              </div>
            </div>

            {passwordError && (
              <div className="mt-4 p-3 bg-coral-100 border border-coral-200 rounded-xl text-coral-300 text-sm max-w-lg" role="alert" aria-live="polite">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="mt-4 p-3 bg-mint-100 border border-mint-200 rounded-xl text-mint-500 text-sm max-w-lg" role="status" aria-live="polite">
                {passwordSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={passwordLoading || !newPassword || !confirmPassword}
              className="mt-6 px-6 py-3 bg-mint-300 text-nav-dark font-semibold rounded-xl hover:bg-mint-400 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Change Email */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Change Email</h2>
          <form onSubmit={handleEmailChange}>
            <div className="max-w-sm">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                New Email Address
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent bg-gray-50 text-gray-800"
                placeholder="Enter new email address"
              />
              <p className="mt-2 text-sm text-gray-500">
                A confirmation email will be sent to verify the new address.
              </p>
            </div>

            {emailError && (
              <div className="mt-4 p-3 bg-coral-100 border border-coral-200 rounded-xl text-coral-300 text-sm max-w-sm" role="alert" aria-live="polite">
                {emailError}
              </div>
            )}

            {emailSuccess && (
              <div className="mt-4 p-3 bg-mint-100 border border-mint-200 rounded-xl text-mint-500 text-sm max-w-sm" role="status" aria-live="polite">
                {emailSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={emailLoading || !newEmail}
              className="mt-6 px-6 py-3 bg-mint-300 text-nav-dark font-semibold rounded-xl hover:bg-mint-400 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {emailLoading ? "Updating..." : "Update Email"}
            </button>
          </form>
        </div>

        {/* Delete Account */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-coral-200">
          <h2 className="text-xl font-semibold mb-2 text-coral-300">Danger Zone</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>

          {deleteError && (
            <div className="p-3 bg-coral-100 border border-coral-200 rounded-xl text-coral-300 text-sm mb-6 max-w-md" role="alert" aria-live="assertive">
              {deleteError}
            </div>
          )}

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-6 py-3 bg-coral-200 text-coral-300 font-semibold rounded-xl hover:bg-coral-300 hover:text-white transition-colors"
          >
            Delete Account
          </button>
        </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Delete Account"
          message="Are you sure you want to delete your account? This will permanently remove all your data including saved recipes and favorites. This action cannot be undone."
          confirmLabel="Delete Account"
          cancelLabel="Cancel"
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteConfirm(false)}
          isLoading={deleteLoading}
        />
      </div>
    </main>
  );
}

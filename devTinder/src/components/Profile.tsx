import React, { useEffect, useMemo, useState } from "react";

type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  location: string;
  bio: string;
  avatarUrl: string;
};

const defaultProfile: ProfileData = {
  fullName: "Guest User",
  email: "guest@example.com",
  phone: "",
  role: "Member",
  location: "Bengaluru, IN",
  bio: "Add a short bio about yourself.",
  avatarUrl:
    "https://static.vecteezy.com/system/resources/previews/021/190/188/non_2x/user-profile-outline-icon-in-transparent-background-basic-app-and-web-ui-bold-line-icon-eps10-free-vector.jpg",
};

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const isValidPhone = (phone: string) =>
  phone.trim() === "" || /^[0-9+\-\s()]{8,15}$/.test(phone.trim());

export const Profile: React.FC = () => {
  // In real app, you will fetch from API / context / store
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [draft, setDraft] = useState<ProfileData>(defaultProfile);

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Example: If you store user in localStorage, hydrate here
  useEffect(() => {
    const stored = localStorage.getItem("profile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<ProfileData>;
        const merged = { ...defaultProfile, ...parsed };
        setProfile(merged);
        setDraft(merged);
      } catch {
        // ignore invalid storage
      }
    }
  }, []);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!draft.fullName.trim()) e.fullName = "Name is required";
    if (!draft.email.trim()) e.email = "Email is required";
    else if (!isValidEmail(draft.email)) e.email = "Enter a valid email";
    if (!isValidPhone(draft.phone)) e.phone = "Enter a valid phone number";
    return e;
  }, [draft]);

  const hasErrors = Object.keys(errors).length > 0;

  const startEdit = () => {
    setEditMode(true);
    setDraft(profile);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setDraft(profile);
  };

  const saveProfile = async () => {
    if (hasErrors) {
      setToast("Please fix the highlighted fields.");
      return;
    }

    try {
      setSaving(true);

      // TODO: Replace with API call
      // await updateProfile(draft);

      // Simulate API latency
      await new Promise((r) => setTimeout(r, 700));

      setProfile(draft);
      localStorage.setItem("profile", JSON.stringify(draft)); // optional
      setEditMode(false);
      setToast("Profile updated successfully ✅");
    } catch (e) {
      setToast("Failed to update profile. Please try again.");
      console.error(e);
    } finally {
      setSaving(false);
      // Auto-hide toast
      setTimeout(() => setToast(null), 2500);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-base-200">
      {/* Toast */}
      {toast && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-info shadow-lg">
            <span>{toast}</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Profile</h1>
            <p className="text-base-content/70 mt-1">
              View and manage your profile details.
            </p>
          </div>

          <div className="flex gap-2">
            {!editMode ? (
              <button className="btn btn-primary" onClick={startEdit}>
                Edit Profile
              </button>
            ) : (
              <>
                <button className="btn btn-ghost" onClick={cancelEdit} disabled={saving}>
                  Cancel
                </button>
                <button
                  className={`btn btn-primary ${saving ? "btn-disabled" : ""}`}
                  onClick={saveProfile}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Card: Avatar + Summary */}
          <div className="card bg-base-100 shadow-md lg:col-span-1">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <div className="avatar">
                  <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={profile.avatarUrl} alt="profile avatar" />
                  </div>
                </div>
                <div>
                  <p className="text-xl font-semibold">{profile.fullName}</p>
                  <p className="text-sm text-base-content/70">{profile.role}</p>
                </div>
              </div>

              <div className="divider my-2"></div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-base-content/70">Email</span>
                  <span className="font-medium">{profile.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Phone</span>
                  <span className="font-medium">{profile.phone || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Location</span>
                  <span className="font-medium">{profile.location}</span>
                </div>
              </div>

              <div className="divider my-2"></div>

              <div>
                <p className="text-sm text-base-content/70 mb-1">Bio</p>
                <p className="text-sm leading-relaxed">{profile.bio}</p>
              </div>
            </div>
          </div>

          {/* Right Card: Editable Form */}
          <div className="card bg-base-100 shadow-md lg:col-span-2">
            <div className="card-body">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <p className="text-sm text-base-content/70">
                Keep your details up-to-date so we can personalize your experience.
              </p>

              <div className="divider"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Full Name :</span>
                  </label>
                  <input
                    className={`input input-bordered ${errors.fullName ? "input-error" : ""} left-20`}
                    value={editMode ? draft.fullName : profile.fullName}
                    onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
                    disabled={!editMode || saving}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.fullName}</span>
                    </label>
                  )}
                </div>

                {/* Email */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium">Email :</span>
                  </label>
                  <input
                    className={`input input-bordered ${errors.email ? "input-error" : ""} left-28`}
                    value={editMode ? draft.email : profile.email}
                    onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                    disabled={!editMode || saving}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.email}</span>
                    </label>
                  )}
                </div>
                {/* Phone */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Phone Number :</span>
                  </label>
                  <input
                    className={`input input-bordered ${errors.phone ? "input-error" : ""} left-12.5`}
                    value={editMode ? draft.phone : profile.phone}
                    onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                    disabled={!editMode || saving}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.phone}</span>
                    </label>
                  )}
                </div>

                {/* Location */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium">Location :</span>
                  </label>
                  <input
                    className="input input-bordered left-23"
                    value={editMode ? draft.location : profile.location}
                    onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                    disabled={!editMode || saving}
                    placeholder="City, Country"
                  />
                </div>

                {/* Bio */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium mr-31.5">Bio :</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered min-h-24 l-28"
                    value={editMode ? draft.bio : profile.bio}
                    onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                    disabled={!editMode || saving}
                    placeholder="Tell us something about you..."
                  />
                </div>
              </div>

              {/* Helpful Footer Note */}
              <div className="mt-4 text-xs text-base-content/60">
                Tip: Your changes are saved only when you click <b>Save Changes</b>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from "react";

type State = {
  name: string;
  email: string;
  company: string;
};

export default function EarlyAccessForm() {
  const [form, setForm] = useState<State>({
    name: "",
    email: "",
    company: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.trim()) return "Email is required";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(form.email)) return "Invalid email address";
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      // Replace YOUR_FORM_ID with your Formspree form ID
      const res = await fetch("https://formspree.io/f/xjggpgdy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company || "Not provided",
        }),
      });

      if (res.ok) {
        setSuccess("✅ Thanks! We received your request.");
        setForm({ name: "", email: "", company: "" });
      } else {
        throw new Error("Submission failed");
      }
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="early-access" className="py-12 sm:py-20 px-4 bg-gray-50">
      <div className="max-w-md mx-auto bg-white shadow-xl rounded-xl p-4 sm:p-6 md:p-8">
        <h3 className="text-xl sm:text-2xl font-semibold text-center mb-1 sm:mb-2">
          Get Early Access
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 text-center mb-4 sm:mb-6">
          Join the waitlist to try the beta.
        </p>

        <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
          <input
            name="name"
            placeholder="Your name"
            value={form.name}
            onChange={onChange}
            className="w-full rounded-lg border px-3 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={onChange}
            className="w-full rounded-lg border px-3 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="company"
            placeholder="Company (optional)"
            value={form.company}
            onChange={onChange}
            className="w-full rounded-lg border px-3 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error && (
            <p className="text-red-600 text-xs sm:text-sm text-center">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-xs sm:text-sm text-center">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 sm:py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors text-sm sm:text-base"
          >
            {loading ? "Submitting..." : "Join Waitlist"}
          </button>
        </form>
      </div>
    </section>
  );
}

/* 
SETUP INSTRUCTIONS (takes 2 minutes):
======================================

1. Go to https://formspree.io/
2. Click "Get Started" (no credit card needed for free tier)
3. Create a new form
4. Copy your form ID (looks like: xjkvvdwb)
5. Replace YOUR_FORM_ID in the code above
6. Done!

Formspree will:
- Send you emails with submissions
- Store them in a dashboard
- Let you export to Excel/CSV

Free tier: 50 submissions/month (perfect for early access!)
*/
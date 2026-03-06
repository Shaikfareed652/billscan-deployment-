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
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="early-access" className="py-12 sm:py-20 px-4">
      
      {/* Glass Card */}
      <div className="max-w-md mx-auto rounded-xl p-4 sm:p-6 md:p-8 border border-white/40 bg-white/10 backdrop-blur-md shadow-xl">

        <h3 className="text-xl sm:text-2xl text-white font-semibold text-center mb-1 sm:mb-2">
          Get Early Access
        </h3>

        <p className="text-xs sm:text-sm text-white/80 text-center mb-4 sm:mb-6">
          Join the waitlist to try the beta.
        </p>

        <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">

          <input
            name="name"
            placeholder="Your name"
            value={form.name}
            onChange={onChange}
            className="w-full rounded-lg border border-white/40 bg-white/20 text-white placeholder-white/70 px-3 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={onChange}
            className="w-full rounded-lg border border-white/40 bg-white/20 text-white placeholder-white/70 px-3 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="company"
            placeholder="Company (optional)"
            value={form.company}
            onChange={onChange}
            className="w-full rounded-lg border border-white/40 bg-white/20 text-white placeholder-white/70 px-3 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error && (
            <p className="text-red-400 text-xs sm:text-sm text-center">{error}</p>
          )}

          {success && (
            <p className="text-green-400 text-xs sm:text-sm text-center">{success}</p>
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
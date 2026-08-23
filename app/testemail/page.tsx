"use client";

import { useState } from "react";

export default function TestEmailPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSendEmail = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "emmanuel.learmount@gmail.com",
          subject: "Test Email from Next.js Route",
          body: "Hello! This email was sent via the API route using Amazon SES.",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(`Success! Message ID: ${data.messageId}`);
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setStatus(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px" }} className="mt-20">
      <button
        onClick={handleSendEmail}
        disabled={loading}
        style={{ padding: "10px 16px", cursor: "pointer" }}
      >
        {loading ? "Sending..." : "Send Email via API Route"}
      </button>

      {status && <p style={{ marginTop: "12px" }}>{status}</p>}
    </div>
  );
}
"use client";

import { useState } from "react";

export function APITester() {
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/todos/1");
  const [method, setMethod] = useState<"GET" | "POST" | "PUT" | "DELETE">("GET");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  async function handleSend() {
    setLoading(true);
    setResponse("");
    setStatus("");
    try {
      const res = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? body : undefined,
      });
      setStatus(`${res.status} ${res.statusText}`);
      const text = await res.text();
      setResponse(text);
    } catch (err: unknown) {
      setStatus("Network error");
      setResponse(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-col md:flex-row gap-2">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as typeof method)}
          className="rounded-md border px-3 py-2 text-sm bg-background"
          aria-label="HTTP method"
        >
          {(["GET", "POST", "PUT", "DELETE"] as const).map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 rounded-md border px-3 py-2 text-sm bg-background"
          placeholder="Request URL"
          aria-label="Request URL"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
      {(method === "POST" || method === "PUT") && (
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="JSON body"
          className="min-h-28 rounded-md border px-3 py-2 text-sm bg-background font-mono"
          aria-label="JSON body"
        />
      )}
      <div className="rounded-md border">
        <div className="px-3 py-2 text-xs text-muted-foreground border-b">{status || "Response"}</div>
        <pre className="p-3 overflow-auto text-xs bg-card">
{response}
        </pre>
      </div>
    </div>
  );
}



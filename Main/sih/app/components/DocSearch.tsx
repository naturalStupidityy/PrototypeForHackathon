"use client";

import { useMemo, useState } from "react";

type DocItem = {
  id: string;
  title: string;
  section: string;
  url?: string;
};

const SAMPLE_DOCS: DocItem[] = [
  { id: "arch", title: "System Architecture", section: "Technical documentation" },
  { id: "setup", title: "Local Development Setup", section: "Technical documentation" },
  { id: "ehr2016", title: "EHR 2016 Certification Summary", section: "Compliance" },
  { id: "wcag", title: "WCAG 2.1 AA Conformance", section: "Compliance" },
  { id: "security", title: "Security Practices", section: "Security" },
  { id: "api-auth", title: "API Authentication", section: "API" },
];

export function DocSearch() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SAMPLE_DOCS;
    return SAMPLE_DOCS.filter((d) =>
      [d.title, d.section].some((f) => f.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documentation..."
          className="w-full rounded-md border px-3 py-2 text-sm bg-background"
          aria-label="Search documentation"
        />
      </div>
      <ul className="mt-4 divide-y rounded-md border">
        {results.map((item) => (
          <li key={item.id} className="p-3 hover:bg-muted/50">
            <div className="text-sm font-medium">{item.title}</div>
            <div className="text-xs text-muted-foreground">{item.section}</div>
          </li>
        ))}
        {results.length === 0 && (
          <li className="p-3 text-sm text-muted-foreground">No results</li>
        )}
      </ul>
    </div>
  );
}



"use client";

import { useMemo, useState } from "react";

type ChecklistItem = {
  id: string;
  label: string;
  standard: "EHR 2016" | "WCAG 2.1 AA";
};

const ITEMS: ChecklistItem[] = [
  { id: "ehr-audit", label: "Audit log for clinical actions", standard: "EHR 2016" },
  { id: "ehr-export", label: "Data export in standardized format", standard: "EHR 2016" },
  { id: "wcag-contrast", label: "Color contrast >= 4.5:1", standard: "WCAG 2.1 AA" },
  { id: "wcag-keyboard", label: "Keyboard navigable UI", standard: "WCAG 2.1 AA" },
];

export function ComplianceChecker() {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<"All" | "EHR 2016" | "WCAG 2.1 AA">("All");

  const filtered = useMemo(() => {
    if (filter === "All") return ITEMS;
    return ITEMS.filter((i) => i.standard === filter);
  }, [filter]);

  const total = filtered.length;
  const passed = filtered.filter((i) => checks[i.id]).length;
  const percent = total === 0 ? 0 : Math.round((passed / total) * 100);

  function toggle(id: string) {
    setChecks((c) => ({ ...c, [id]: !c[id] }));
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm">Standard</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="rounded-md border px-3 py-2 text-sm bg-background"
          aria-label="Compliance standard filter"
        >
          <option>All</option>
          <option>EHR 2016</option>
          <option>WCAG 2.1 AA</option>
        </select>
        <div className="ml-auto text-sm text-muted-foreground">{passed}/{total} passed • {percent}%</div>
      </div>
      <ul className="divide-y rounded-md border">
        {filtered.map((item) => (
          <li key={item.id} className="flex items-center gap-3 p-3">
            <input
              id={item.id}
              type="checkbox"
              checked={!!checks[item.id]}
              onChange={() => toggle(item.id)}
              className="size-4"
            />
            <label htmlFor={item.id} className="text-sm flex-1">
              {item.label}
              <span className="ml-2 text-xs text-muted-foreground">({item.standard})</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}



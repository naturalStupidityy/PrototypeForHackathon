"use client";

import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";

type NodeData = {
  id: string;
  name: string;
  category: number;
  status: "validated" | "pending" | string;
  symbolSize: number;
};

type LinkData = { source: string; target: string; value: number };

const SAMPLE_NODES: NodeData[] = [];
const SAMPLE_LINKS: LinkData[] = [];

type TerminologyData = {
  ayushSystems: Array<{
    name: string;
    code: string;
    description: string;
    terminologyCount: number;
    validatedMappings: number;
    pendingMappings: number;
  }>;
  icd11Modules: Array<{ module: string; name: string; description: string; launchDate: string; status: string }>;
  mappingStats: { totalMappings: number; validatedMappings: number; pendingValidation: number; validationRate: number; lastUpdated: string };
};

export function MappingWindow() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const echartsRef = useRef<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [stats, setStats] = useState<TerminologyData["mappingStats"] | null>(null);
  const [echartsReady, setEchartsReady] = useState(false);
  const [allNodes, setAllNodes] = useState<NodeData[]>([]);
  const [allLinks, setAllLinks] = useState<LinkData[]>([]);
  const [showValidated, setShowValidated] = useState(true);
  const [showPending, setShowPending] = useState(true);
  const [minConfidence, setMinConfidence] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as NodeData[];
    return allNodes.filter((n) =>
      [n.id, n.name].some((f) => f.toLowerCase().includes(q))
    );
  }, [query, allNodes]);

  useEffect(() => {
    if (!echartsReady) return;
    function initChart() {
      const echarts = (window as any).echarts;
      if (!echarts || !chartRef.current) return;
      echartsRef.current = echarts.init(chartRef.current);
      const isDark = document.documentElement.classList.contains("dark");
      const textColor = isDark ? "#ffffff" : "#111111";
      const tooltipBg = isDark ? "rgba(20,20,20,0.9)" : "rgba(255,255,255,0.95)";
      echartsRef.current.setOption({
        backgroundColor: "transparent",
        tooltip: {
          trigger: "item",
          backgroundColor: tooltipBg,
          textStyle: { color: textColor },
          formatter: function (params: any) {
            if (params.dataType === "node") {
              return `<strong>${params.data.name}</strong><br/>Type: ${
                params.data.category === 0 ? "NAMASTE" : "ICD-11-TM2"
              }<br/>Status: ${params.data.status || "Unknown"}`;
            } else {
              return `Mapping: ${params.data.source} → ${params.data.target}`;
            }
          },
        },
        legend: {
          data: ["NAMASTE", "ICD-11-TM2", "Validated", "Pending"],
          bottom: 10,
          textStyle: { color: textColor },
        },
        series: [
          {
            type: "graph",
            layout: "force",
            animation: true,
            roam: true,
            focusNodeAdjacency: true,
            force: {
              repulsion: 1000,
              gravity: 0.1,
              edgeLength: 200,
              layoutAnimation: true,
            },
            data: SAMPLE_NODES,
            links: SAMPLE_LINKS,
            label: { show: false, color: textColor },
            categories: [
              { name: "NAMASTE", itemStyle: { color: "#2C5F5D" } },
              { name: "ICD-11-TM2", itemStyle: { color: "#E67E22" } },
              { name: "Validated", itemStyle: { color: "#27ae60" } },
              { name: "Pending", itemStyle: { color: "#f1c40f" } },
            ],
            itemStyle: {
              borderColor: isDark ? "#ffffff" : "#ffffff",
              borderWidth: 2,
              shadowBlur: 10,
              shadowColor: "rgba(0,0,0,0.3)",
            },
            lineStyle: { color: "source", curveness: 0.3, opacity: 0.7 },
            emphasis: {
              focus: "adjacency",
              lineStyle: { width: 6 },
            },
          },
        ],
      });

      echartsRef.current.on("click", function (params: any) {
        if (params.dataType === "node") {
          setSelectedId(params.data.id);
        }
      });

      function handleResize() {
        echartsRef.current?.resize();
      }
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }

    const done = initChart();

    // load dynamic nodes/links from CSV API AFTER chart is ready
    fetch("/api/mappings")
      .then((r) => r.json())
      .then((payload: { nodes: NodeData[]; links: LinkData[] }) => {
        setAllNodes(payload.nodes);
        setAllLinks(payload.links);
        if (echartsRef.current) {
          echartsRef.current.setOption({ series: [{ type: "graph", layout: "force", focusNodeAdjacency: true, data: payload.nodes, links: payload.links }] });
        }
      })
      .catch(() => {});

    // fetch stats
    fetch("/api/terminology")
      .then((r) => r.json())
      .then((d: TerminologyData) => setStats(d.mappingStats))
      .catch(() => {});

    // Observe theme changes to update chart text/tooltip colors
    const observer = new MutationObserver(() => {
      if (!echartsRef.current) return;
      const isDarkNow = document.documentElement.classList.contains("dark");
      const textColorNow = isDarkNow ? "#ffffff" : "#111111";
      const tooltipBgNow = isDarkNow ? "rgba(20,20,20,0.9)" : "rgba(255,255,255,0.95)";
      echartsRef.current.setOption({
        tooltip: { backgroundColor: tooltipBgNow, textStyle: { color: textColorNow } },
        legend: { textStyle: { color: textColorNow } },
        series: [{ label: { color: textColorNow } }],
      });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      if (typeof done === "function") done();
      echartsRef.current?.dispose?.();
      observer.disconnect();
    };
  }, [echartsReady]);

  // Apply filters to nodes/links and update the chart
  useEffect(() => {
    if (!echartsRef.current) return;
    const allowedStatuses = new Set<string>();
    if (showValidated) allowedStatuses.add("validated");
    if (showPending) allowedStatuses.add("pending");

    const nodesById = new Map(allNodes.map((n) => [n.id, n] as const));

    // If no statuses are selected, treat as all allowed (to avoid empty graph)
    const statusAllowed = (id: string) => {
      if (allowedStatuses.size === 0) return true;
      const n = nodesById.get(id);
      if (!n) return false;
      return allowedStatuses.has(String(n.status));
    };

    const filteredLinks = allLinks.filter((l) => l.value >= minConfidence && statusAllowed(String(l.source)) && statusAllowed(String(l.target)));

    const nodeIncluded = new Set<string>();
    for (const link of filteredLinks) {
      nodeIncluded.add(String(link.source));
      nodeIncluded.add(String(link.target));
    }
    let filteredNodes = allNodes.filter((n) => nodeIncluded.has(n.id));

    // Fallback: if filter removed everything, show original
    if (filteredNodes.length === 0 || filteredLinks.length === 0) {
      filteredNodes = allNodes;
    }

    const isDarkNow = document.documentElement.classList.contains("dark");
    const textColorNow = isDarkNow ? "#ffffff" : "#111111";

    echartsRef.current.setOption({
      series: [{
        type: "graph",
        layout: "force",
        focusNodeAdjacency: true,
        data: filteredNodes,
        links: filteredLinks.length ? filteredLinks : allLinks,
        label: { show: false, color: textColorNow },
        force: { repulsion: 1000, gravity: 0.1, edgeLength: 200, layoutAnimation: true },
        lineStyle: { color: "source", curveness: 0.3, opacity: 0.7 },
      }],
    });
  }, [allNodes, allLinks, showValidated, showPending, minConfidence]);

  const selectedDetails = useMemo(() => {
    if (!selectedId) return null;
    const node = allNodes.find((n) => n.id === selectedId);
    if (!node) return null;
    const neighbors = allLinks
      .filter((l) => String(l.source) === selectedId || String(l.target) === selectedId)
      .map((l) => {
        const otherId = String(l.source) === selectedId ? String(l.target) : String(l.source);
        const other = allNodes.find((n) => n.id === otherId);
        return {
          id: otherId,
          name: other?.name || otherId,
          category: other?.category ?? -1,
          status: other?.status ?? "unknown",
          confidence: l.value,
        };
      });
    return {
      node,
      links: neighbors,
    };
  }, [selectedId, allNodes, allLinks]);

  return (
    <div className="grid gap-4">
      <Script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js" strategy="afterInteractive" onReady={() => setEchartsReady(true)} />

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-md border p-3 bg-card">
            <div className="text-xs text-muted-foreground">Total mappings</div>
            <div className="text-lg font-semibold">{stats.totalMappings.toLocaleString()}</div>
          </div>
          <div className="rounded-md border p-3 bg-card">
            <div className="text-xs text-muted-foreground">Validated</div>
            <div className="text-lg font-semibold">{stats.validatedMappings.toLocaleString()}</div>
          </div>
          <div className="rounded-md border p-3 bg-card">
            <div className="text-xs text-muted-foreground">Pending</div>
            <div className="text-lg font-semibold">{stats.pendingValidation.toLocaleString()}</div>
          </div>
          <div className="rounded-md border p-3 bg-card">
            <div className="text-xs text-muted-foreground">Validation rate</div>
            <div className="text-lg font-semibold">{stats.validationRate}%</div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search terms or codes (e.g., AAE-16)"
          className="flex-1 rounded-md border px-3 py-2 text-sm bg-background"
          aria-label="Search mappings"
        />
        <button
          type="button"
          onClick={() => setQuery("")}
          className="inline-flex items-center rounded-md border px-4 py-2 text-sm"
        >
          Clear
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-3 rounded-md border p-3 bg-card">
        <div className="flex items-center gap-3">
          <label className="text-sm flex items-center gap-2">
            <input type="checkbox" className="size-4" checked={showValidated} onChange={(e) => setShowValidated(e.target.checked)} />
            Validated
          </label>
          <label className="text-sm flex items-center gap-2">
            <input type="checkbox" className="size-4" checked={showPending} onChange={(e) => setShowPending(e.target.checked)} />
            Pending
          </label>
        </div>
        <div className="md:col-span-2 flex items-center gap-3">
          <label className="text-sm whitespace-nowrap">Min confidence: {minConfidence.toFixed(2)}</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={minConfidence}
            onChange={(e) => setMinConfidence(Number(e.target.value))}
            className="w-full"
            aria-label="Minimum confidence"
          />
        </div>
      </div>

      {results.length > 0 && (
        <div className="rounded-md border p-3 bg-card">
          <div className="text-xs text-muted-foreground mb-2">Results</div>
          <div className="grid md:grid-cols-3 gap-2">
            {results.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedId(r.id)}
                className="text-left rounded-md border px-3 py-2 text-sm hover:bg-muted"
              >
                <div className="font-medium">{r.id}</div>
                <div className="text-xs text-muted-foreground">{r.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 rounded-lg border bg-card" style={{ minHeight: 420 }}>
          <div ref={chartRef} className="w-full h-[420px]" aria-label="Mapping network graph" />
        </div>
        <div className="rounded-lg border p-4 bg-card">
          <div className="text-sm font-medium">Mapping details</div>
          {!selectedDetails && (
            <p className="mt-2 text-sm text-muted-foreground">Select a node to view details.</p>
          )}
          {selectedDetails && (
            <div className="mt-3 grid gap-3 text-sm">
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground mb-1">Selected node</div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{selectedDetails.node.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{selectedDetails.node.id}</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full border">
                    {selectedDetails.node.category === 0 ? "NAMASTE" : "ICD-11 TM2"}
                  </span>
                </div>
              </div>

              <div className="rounded-md border p-3">
                <div className="font-semibold mb-2">Connected mappings</div>
                {selectedDetails.links.length === 0 && (
                  <div className="text-xs text-muted-foreground">No linked mappings found.</div>
                )}
                <div className="grid gap-2">
                  {selectedDetails.links.map((m) => (
                    <div key={m.id} className="rounded border p-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{m.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">{m.id}</div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full border">
                          {m.category === 0 ? "NAMASTE" : m.category === 1 ? "ICD-11 TM2" : "Unknown"}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">Confidence: {Math.round(m.confidence * 100)}%</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-3 py-2 text-xs">Validate</button>
                <button className="inline-flex items-center rounded-md border px-3 py-2 text-xs">Export</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



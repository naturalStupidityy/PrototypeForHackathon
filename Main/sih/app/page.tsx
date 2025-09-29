import { Nav } from "@/app/components/Nav";
import { DocSearch } from "@/app/components/DocSearch";
import { APITester } from "@/app/components/APITester";
import { ComplianceChecker } from "@/app/components/ComplianceChecker";
import { Reveal } from "@/app/components/Reveal";
import { MappingWindow } from "@/app/components/MappingWindow";
import { Spotlight } from "@/components/ui/spotlight-new";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <section className="relative isolate overflow-hidden">
        <Spotlight />
        <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <Reveal>
              <div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight">NAMASTE-FHIR Terminology Mapping Service</h1>
                <p className="mt-4 text-muted-foreground text-base md:text-lg">
                  Centralized project information, compliance, security, APIs, and documentation — all in one place.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <a href="#docs" className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90">Browse Docs</a>
                  <a href="#mapping-interface" className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">Open Mapping</a>
                </div>
              </div>
            </Reveal>
            <Reveal delayMs={100}>
              <div className="rounded-lg border p-4 md:p-6 bg-card">
                <DocSearch />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <main className="flex-1">
        <section id="overview" className="mx-auto w-full max-w-6xl px-4 py-16 border-t">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-semibold">Project overview and mission</h2>
          </Reveal>
          <Reveal delayMs={75}>
            <p className="mt-3 text-muted-foreground">
              Provide a concise summary of objectives, stakeholders, timelines, and the mission driving this initiative.
            </p>
          </Reveal>
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <Reveal className="rounded-lg border p-4 bg-card">
              <div className="text-sm font-medium">Objectives</div>
              <p className="mt-1 text-sm text-muted-foreground">Key outcomes and success metrics.</p>
            </Reveal>
            <Reveal delayMs={75} className="rounded-lg border p-4 bg-card">
              <div className="text-sm font-medium">Stakeholders</div>
              <p className="mt-1 text-sm text-muted-foreground">Teams, roles, and responsibilities.</p>
            </Reveal>
            <Reveal delayMs={150} className="rounded-lg border p-4 bg-card">
              <div className="text-sm font-medium">Timeline</div>
              <p className="mt-1 text-sm text-muted-foreground">Milestones and delivery dates.</p>
            </Reveal>
          </div>
        </section>

        <section id="docs" className="mx-auto w-full max-w-6xl px-4 py-16 border-t">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-semibold">Technical documentation</h2>
          </Reveal>
          <Reveal delayMs={75}>
            <p className="mt-3 text-muted-foreground">Search and explore architecture, setup, and integration guides.</p>
          </Reveal>
          <Reveal delayMs={100}>
            <div className="mt-6 rounded-lg border p-4 bg-card">
              <DocSearch />
            </div>
          </Reveal>
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <Reveal className="">
              <a className="rounded-lg border p-4 hover:bg-muted block" href="#">Getting Started</a>
            </Reveal>
            <Reveal delayMs={50} className="">
              <a className="rounded-lg border p-4 hover:bg-muted block" href="#">Architecture</a>
            </Reveal>
            <Reveal delayMs={100} className="">
              <a className="rounded-lg border p-4 hover:bg-muted block" href="#">Deployment</a>
            </Reveal>
            <Reveal delayMs={150} className="">
              <a className="rounded-lg border p-4 hover:bg-muted block" href="#">SDKs</a>
            </Reveal>
          </div>
        </section>

        <section id="compliance" className="mx-auto w-full max-w-6xl px-4 py-16 border-t">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-semibold">Compliance information</h2>
          </Reveal>
          <Reveal delayMs={75}>
            <p className="mt-3 text-muted-foreground">Covers EHR 2016 and WCAG 2.1 AA requirements and status.</p>
          </Reveal>
          <Reveal delayMs={100}>
            <div className="mt-6 rounded-lg border p-4 bg-card">
              <ComplianceChecker />
            </div>
          </Reveal>
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <Reveal className="rounded-lg border p-4 bg-card">
              <div className="text-sm font-medium">EHR 2016</div>
              <p className="mt-1 text-sm text-muted-foreground">Certification scope and criteria mapping.</p>
            </Reveal>
            <Reveal delayMs={75} className="rounded-lg border p-4 bg-card">
              <div className="text-sm font-medium">WCAG 2.1 AA</div>
              <p className="mt-1 text-sm text-muted-foreground">Accessibility conformance status and gaps.</p>
            </Reveal>
          </div>
        </section>

        <section id="security" className="mx-auto w-full max-w-6xl px-4 py-16 border-t">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-semibold">Security and privacy details</h2>
          </Reveal>
          <Reveal delayMs={75}>
            <ul className="mt-3 list-disc pl-5 text-muted-foreground space-y-1">
              <li>Data retention and encryption at rest/in transit</li>
              <li>Access controls, audit logging, incident response</li>
              <li>PHI/PII handling and privacy commitments</li>
            </ul>
          </Reveal>
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <Reveal className="rounded-lg border p-4 bg-card">
              <div className="text-sm font-medium">Encryption</div>
              <p className="mt-1 text-sm text-muted-foreground">TLS 1.2+, AES-256-at-rest.</p>
            </Reveal>
            <Reveal delayMs={75} className="rounded-lg border p-4 bg-card">
              <div className="text-sm font-medium">Access</div>
              <p className="mt-1 text-sm text-muted-foreground">RBAC, least privilege, SSO.</p>
            </Reveal>
            <Reveal delayMs={150} className="rounded-lg border p-4 bg-card">
              <div className="text-sm font-medium">Monitoring</div>
              <p className="mt-1 text-sm text-muted-foreground">SIEM, alerting, audits.</p>
            </Reveal>
          </div>
        </section>

        <section id="api" className="mx-auto w-full max-w-6xl px-4 py-16 border-t">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-semibold">API documentation and testing</h2>
          </Reveal>
          <Reveal delayMs={75}>
            <p className="mt-3 text-muted-foreground">Explore endpoints and test live requests.</p>
          </Reveal>
          <Reveal delayMs={100}>
            <div className="mt-6 rounded-lg border p-4 bg-card">
              <APITester />
            </div>
          </Reveal>
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <Reveal className="">
              <a className="rounded-lg border p-4 hover:bg-muted block" href="#">REST Reference</a>
            </Reveal>
            <Reveal delayMs={50} className="">
              <a className="rounded-lg border p-4 hover:bg-muted block" href="#">Authentication</a>
            </Reveal>
            <Reveal delayMs={100} className="">
              <a className="rounded-lg border p-4 hover:bg-muted block" href="#">Errors</a>
            </Reveal>
            <Reveal delayMs={150} className="">
              <a className="rounded-lg border p-4 hover:bg-muted block" href="#">Rate limits</a>
            </Reveal>
          </div>
        </section>

        <section id="mapping-interface" className="mx-auto w-full max-w-6xl px-4 py-16 border-t">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-semibold">Mapping interface</h2>
          </Reveal>
          <Reveal delayMs={100}>
            <div className="mt-6">
              <MappingWindow />
            </div>
          </Reveal>
          <div className="mt-10 grid md:grid-cols-3 gap-4">
            <Reveal className="rounded-lg border p-4 bg-card">
              <div className="text-sm font-medium">Legend</div>
              <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5">
                <li>NAMASTE nodes (left)</li>
                <li>ICD-11 TM2 nodes (right)</li>
                <li>Link thickness = confidence</li>
              </ul>
            </Reveal>
            <Reveal delayMs={75} className="rounded-lg border p-4 bg-card">
              <div className="text-sm font-medium">Filters</div>
              <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5">
                <li>Status: Validated / Pending</li>
                <li>Confidence: Min threshold</li>
              </ul>
            </Reveal>
            <Reveal delayMs={150} className="rounded-lg border p-4 bg-card">
              <div className="text-sm font-medium">Workflow</div>
              <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5">
                <li>Select node → view details</li>
                <li>Validate or export mapping</li>
              </ul>
            </Reveal>
          </div>
          <Reveal delayMs={200}>
            <div className="mt-6 rounded-lg border p-4 bg-card flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Export visible mappings as CSV</div>
              <button className="inline-flex items-center rounded-md border px-3 py-2 text-sm">Export CSV</button>
            </div>
          </Reveal>
        </section>

        <section id="contact" className="mx-auto w-full max-w-6xl px-4 py-16 border-t">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-semibold">Contact and support</h2>
          </Reveal>
          <Reveal delayMs={75}>
            <p className="mt-3 text-muted-foreground">Reach the team at support@example.com or open a ticket.</p>
          </Reveal>
          <Reveal delayMs={100}>
            <form className="mt-6 grid gap-3 max-w-xl">
              <input className="rounded-md border px-3 py-2 text-sm bg-background" placeholder="Your email" aria-label="Your email" />
              <textarea className="min-h-28 rounded-md border px-3 py-2 text-sm bg-background" placeholder="Your message" aria-label="Your message" />
              <button type="button" className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium">Send</button>
            </form>
          </Reveal>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Project Portal</p>
          <div className="flex items-center gap-4">
            <a href="#overview" className="hover:underline">Overview</a>
            <a href="#docs" className="hover:underline">Docs</a>
            <a href="#compliance" className="hover:underline">Compliance</a>
            <a href="#api" className="hover:underline">API</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

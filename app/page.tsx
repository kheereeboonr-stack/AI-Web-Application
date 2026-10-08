import { FeatureCard } from "@/components/FeatureCard";
import { AppHeader } from "@/components/AppHeader";
import { CounterPanel } from "@/components/CounterPanel";
import { ApiStatus } from "@/components/ApiStatus";
import Link from "next/link";

export default function Home() {
  return (
    <main className="ux-shell">
      <AppHeader />
      <div className="ux-grid">
        <FeatureCard
          title="Counter"
          description="นับจำนวนด้วยการกดเพิ่ม ลด และรีเซ็ต"
        />
        <FeatureCard
          title="Count History"
          description="บันทึกและดูประวัติการนับย้อนหลัง"
        />
      </div>
      <section className="sp-home-card">
        <div>
          <p className="sp-home-eyebrow">NEW IN WEEK 6</p>
          <h2>Count History</h2>
          <p>Save and review the counts you have recorded.</p>
        </div>
        <Link href="/saved-prompts" className="sp-home-link">
          Open Count History →
        </Link>
      </section>
      <CounterPanel />
      <ApiStatus />
    </main>
  );
}
import { FeatureCard } from "@/components/FeatureCard";
import { AppHeader } from "@/components/AppHeader";
export default function Home() {
  return (
    <main>
      <AppHeader />
      <br></br>
      <FeatureCard
        title="Object Detection"
        description="ตรวจจับวัตถุจากรูปภาพด้วย AI"
      />
      <FeatureCard
        title="AI Chat"
        description="สนทนากับ AI"
      />
      <button>
        Start Detection
      </button>
    </main>
  );
}
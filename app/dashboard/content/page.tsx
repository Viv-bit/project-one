import type { Metadata } from "next";
import { ContentExplorerView } from "@/components/content/content-explorer-view";

export const metadata: Metadata = {
  title: "Content & Taxonomy Explorer · Past 16 Uploads",
  description:
    "Explore Whisper STT transcripts, hook typology distributions, and retention hold percentages across your 16 recent video uploads.",
};

export default function ContentPage() {
  return <ContentExplorerView />;
}

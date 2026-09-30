import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { pageMeta } from "@/lib/seo";
import { SITE_MAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "AI disclosure",
  description: "Every image on this site is AI-generated. Here is exactly how our generation pipeline works and how we label it.",
  path: "/ai-disclosure",
});

export default function AiDisclosurePage() {
  return (
    <LegalPage
      title="AI disclosure"
      intro={`Transparency matters. ${SITE_NAME} produces AI-generated images, and here's exactly what that means.`}
      mail={SITE_MAIL}
      blocks={[
        {
          h: "All pictures are AI-generated",
          body: [
            `Every image on this site — templates, examples and gallery — was created by an AI image model. No image is an unedited photograph of a real animal event.`,
          ],
        },
        {
          h: "How generation works",
          body: [
            `When you use the studio, a language model (GLM by Zhipu AI) rewrites your request into a detailed image prompt. An image model (Seedream by Volcengine/BytePlus) then paints the picture, using your uploaded photo only as a reference for your pet's identity — face, fur markings and eye color.`,
            `Uploaded photos are not used to train any AI model, ours or theirs.`,
          ],
        },
        {
          h: "How we label",
          body: [
            `The site footer and the AI pages state that all portraits are AI-generated. Gallery captions say so too. We ask you to keep this honesty when sharing: don't present an AI portrait as an unedited photo or use it to enter "real photo" contests.`,
          ],
        },
        {
          h: "Responsible use",
          body: [
            `We block requests that involve people (especially minors), violence, explicit content, trademarks or public figures. If you spot a generated image that concerns you, email ${SITE_MAIL} and we'll act on it.`,
          ],
        },
      ]}
    />
  );
}

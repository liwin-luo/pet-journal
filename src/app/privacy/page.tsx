import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { pageMeta } from "@/lib/seo";
import { SITE_MAIL, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Privacy policy",
  description: `What we collect, what we do with your pet photos (and what we never do), how long we keep them, and your rights under GDPR and CCPA.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      intro={`${SITE_NAME} is a website that turns pet photos into AI-generated pictures. This policy explains, in plain words, what we collect and what happens to it.`}
      mail={SITE_MAIL}
      blocks={[
        {
          h: "What we collect",
          body: [
            `Photos you upload, the text you type into the generator, and the pictures we generate for you. A random ID stored in a cookie so we can apply the free daily limit. If you post to the public gallery: the name, pet name and review you choose to submit.`,
            `If you sign in (required only for downloading pictures): your Google name, email and profile picture, plus a signed session cookie that keeps you signed in for 30 days. We never see or store your Google password.`,
            `We don't show ads and don't use tracking cookies.`,
          ],
        },
        {
          h: "What we use it for",
          body: [
            `Only to generate your picture and keep the product working (rate limits, error fixing). We do not sell your photos or generated images. We do not use your photos to train AI models.`,
          ],
        },
        {
          h: "Who else sees your photo",
          body: [
            `To create your picture we send the uploaded photo and a short text prompt to our AI service providers: a language model (Zhipu AI) that writes the image prompt, and an image model (Volcengine / BytePlus Seedream) that paints the picture. They process your photo only to return a result to us, under their own privacy and security terms.`,
            `Pictures appear publicly ONLY if you submit them to the gallery yourself. Submissions are reviewed before publishing, and you can ask us to remove one at any time.`,
          ],
        },
        {
          h: "How long we keep it",
          body: [
            `Uploaded photos are deleted automatically within 7 days. Generated pictures may be kept a little longer so your share link keeps working; ask us and we'll delete yours sooner.`,
          ],
        },
        {
          h: "Your rights (GDPR / CCPA)",
          body: [
            `You can ask us for a copy of the data linked to your device ID, ask for corrections, or ask for deletion ("right to be forgotten"). Email ${SITE_MAIL} and we'll respond within 30 days. If you are in the EEA/UK, our lawful basis for processing is your consent (by using the generator) and our legitimate interest in operating the service. California residents have the right to know and delete as described above — we do not discriminate for exercising these rights.`,
          ],
        },
        {
          h: "Children",
          body: [
            `${SITE_NAME} is for adults. Please don't upload photos of children or use the service if you are under 16 (under 13 in the US).`,
          ],
        },
        {
          h: "Changes",
          body: [
            `If this policy changes materially we'll update the date above. The version at ${SITE_URL}/privacy is always the current one.`,
          ],
        },
      ]}
    />
  );
}

import { makeLegalPage } from "@/components/LegalPage";

const { Page, generateMetadata } = makeLegalPage("privacy", "privacyTitle", "privacyDesc", "/privacy");
export { generateMetadata };
export default Page;

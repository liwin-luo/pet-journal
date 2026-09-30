import { makeLegalPage } from "@/components/LegalPage";

const { Page, generateMetadata } = makeLegalPage("terms", "termsTitle", "termsDesc", "/terms");
export { generateMetadata };
export default Page;

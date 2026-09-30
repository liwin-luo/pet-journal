import { makeLegalPage } from "@/components/LegalPage";

const { Page, generateMetadata } = makeLegalPage("ai", "aiTitle", "aiDesc", "/ai-disclosure");
export { generateMetadata };
export default Page;

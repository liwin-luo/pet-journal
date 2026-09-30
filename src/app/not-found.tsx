import Link from "next/link";
import { PawIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <PawIcon className="mx-auto h-12 w-12 text-coral" />
      <h1 className="h-display mt-4 text-3xl">This page wandered off</h1>
      <p className="mt-2 text-coffee">Even good pets chase the wrong squirrel sometimes.</p>
      <Link href="/" className="btn-primary mt-6">Back to the studio</Link>
    </div>
  );
}

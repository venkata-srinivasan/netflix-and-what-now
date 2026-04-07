import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tv } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Tv className="h-7 w-7 text-primary" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Page not found</h2>
      <p className="text-muted-foreground text-sm max-w-md mb-6">
        Looks like this page doesn&apos;t exist. Maybe it went on a commercial break.
      </p>
      <Link href="/">
        <Button variant="outline">Back to home</Button>
      </Link>
    </div>
  );
}

import Link from "next/link";

export function FooterComponent() {
  return (
    <>
      <footer className="bg-muted text-muted-foreground py-4 px-6 w-full">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          <p>&copy; 2024 ChilizProof. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <Link href="#" className="hover:text-accent" prefetch={false}>
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-accent" prefetch={false}>
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}

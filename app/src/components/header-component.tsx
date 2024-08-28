import Link from "next/link";
import { Button } from "./ui/button";

interface HeaderProps {
  account: string;
  connectWallet: () => void;
  disConnectWallet: () => void;
}

export function HeaderComponent({
  account,
  connectWallet,
  disConnectWallet,
}: HeaderProps) {
  return (
    <>
      <header className="bg-primary text-primary-foreground py-4 px-6 w-full">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          <Link href="/" className="text-xl font-bold" prefetch={false}>
            ChilizProof
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              href="my-ticket"
              className="hover:text-accent"
              prefetch={false}
            >
              My Ticket
            </Link>
            {account ? (
              <Button onClick={disConnectWallet} className="hover:text-accent">
                Disconnect ({account.substring(0, 6)}...{account.slice(-4)})
              </Button>
            ) : (
              <Button onClick={connectWallet} className="hover:text-accent">
                Connect Wallet
              </Button>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}

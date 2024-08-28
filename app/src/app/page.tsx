import { HeaderComponent } from "@/components/header-component";
import { FooterComponent } from "@/components/footer-component";
import { useWallet } from "@/contexts/WalletContext";

export default function Home() {
  const { account, signer, connectWallet, disConnectWallet } = useWallet();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <>
        <HeaderComponent
          account={account}
          connectWallet={connectWallet}
          disConnectWallet={disConnectWallet}
        />
        <FooterComponent />
      </>
    </main>
  );
}

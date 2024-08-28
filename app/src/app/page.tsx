import { HeaderComponent } from "@/components/header-component";
import { FooterComponent } from "@/components/footer-component";
import { TicketListComponent } from "@/components/ticket-list-component";
import { useAccount, useChainId } from "wagmi";

export default function Home() {
  // Error: (0 , wagmi__WEBPACK_IMPORTED_MODULE_4__.useChainId) is not a function
  // const chainId = useChainId();
  // console.log("chainId", chainId);
  const chainId = 88882;
  const account = "0xa2fb2553e57436b455F57270Cc6f56f6dacDA1a5";

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <>
        <HeaderComponent />
        <TicketListComponent chainId={chainId} account={account} />
        <FooterComponent />
      </>
    </main>
  );
}

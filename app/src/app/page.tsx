import { HeaderComponent } from "@/components/header-component";
import { FooterComponent } from "@/components/footer-component";
import { TicketListComponent } from "@/components/ticket-list-component";
import { useChainId } from "wagmi";

export default function Home() {
  // Error: (0 , wagmi__WEBPACK_IMPORTED_MODULE_4__.useChainId) is not a function
  // const chainId = useChainId();
  // console.log("chainId", chainId);
  const chainId = 88882;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <>
        <HeaderComponent />
        <TicketListComponent chainId={chainId} />
        <FooterComponent />
      </>
    </main>
  );
}

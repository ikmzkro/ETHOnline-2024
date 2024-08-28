import { HeaderComponent } from "@/components/header-component";
import { FooterComponent } from "@/components/footer-component";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <>
        {/* <HeaderComponent /> */}
        <FooterComponent />
      </>
    </main>
  );
}

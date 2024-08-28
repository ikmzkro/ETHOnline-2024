"use client";

import { FooterComponent } from "@/components/footer-component";
import { HeaderComponent } from "@/components/header-component";
import { MyNftComponent } from "@/components/my-nft-component";

export default function MyNft() {
  return (
    <>
      <HeaderComponent />
      <MyNftComponent
        chainId={88882}
        account="0xa2fb2553e57436b455F57270Cc6f56f6dacDA1a5"
      />
      <FooterComponent />
    </>
  );
}

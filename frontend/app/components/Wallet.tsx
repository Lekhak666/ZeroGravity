"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Wallet() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        mounted,
        authenticationStatus,
        openAccountModal,
        openChainModal,
        openConnectModal,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        if (!connected) {
          return (
            <button
              onClick={openConnectModal}
              className="
                px-6 py-3 rounded-2xl
                bg-gradient-to-r
                from-violet-600 to-fuchsia-500
                hover:scale-105
                transition-all shadow-lg
              "
            >
              Connect Wallet
            </button>
          );
        }

        if (chain.unsupported) {
          return (
            <button
              onClick={openChainModal}
              className="
                px-6 py-3 rounded-2xl
                bg-red-600 hover:bg-red-500
              "
            >
              Wrong Network
            </button>
          );
        }

        return (
          <button
            onClick={openAccountModal}
            className="
              px-6 py-3 rounded-2xl
              border border-violet-500
              bg-zinc-950
              hover:border-fuchsia-400
              transition-all
            "
          >
            {account.displayName}
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}

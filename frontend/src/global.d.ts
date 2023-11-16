import type {BrowserProvider, Eip1193Provider} from "ethers";

declare global {
  interface Window {
    ethereum: (BrowserProvider & Eip1193Provider) | undefined;
  }
}

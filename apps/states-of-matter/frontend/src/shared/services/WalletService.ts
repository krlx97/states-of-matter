import {accountStore} from "stores";
import {get} from "svelte/store";

class WalletService {
  public getFee (): void {
    const balanceFloat = parseFloat(this.getToken("TLOS"));
    const feeFloat = parseFloat("0.1000");
    const total = balanceFloat - feeFloat;
    const isValidBalanceFee = total >= 0;

    // isEnoughForFee = isValidBalanceFee;
  }

  getToken (symbol: string): any {
    const token = get(accountStore).wallet.fungible.find((fToken) => fToken.key.sym.includes(symbol));
    return token;
  }
}

export {WalletService};

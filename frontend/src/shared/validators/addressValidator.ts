import { ethers } from "ethers";
import { get } from "svelte/store";
import { accountStore } from "../stores/global";

interface AddressValidator {
  hasValue: boolean;
  isValid: boolean;
  isntSelf: boolean;
}

const addressValidator = (address: string): AddressValidator => {
  return {
    hasValue: address.length > 0,
    isValid: ethers.utils.isAddress(address),
    isntSelf: address.toLowerCase() !== get(accountStore).publicKey.toLowerCase()
  };
};

export {addressValidator};

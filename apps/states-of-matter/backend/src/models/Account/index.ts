import type {Document} from "mongodb";

interface AccountSocial {
  friends: string[];
  requests: string[];
  blocked: string[];
}

interface Account extends Document {
  name: string;
  privateKeyHash: string;
  social: AccountSocial;
}

export type {Account};

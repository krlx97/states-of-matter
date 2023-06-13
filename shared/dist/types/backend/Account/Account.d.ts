import type { Document } from "mongodb";
import type { AccountSocial } from "./AccountSocial.js";
interface Account extends Document {
    name: string;
    passwordHash: string;
    publicKey: string;
    avatarId: number;
    bannerId: number;
    social: AccountSocial;
}
export type { Account };

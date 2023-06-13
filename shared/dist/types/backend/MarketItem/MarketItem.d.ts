import type { Document } from "mongodb";
interface MarketItem extends Document {
    sellerName: string;
    sellerAddress: string;
    listingId: string;
    skinId: string;
    amount: string;
    price: string;
}
export type { MarketItem };

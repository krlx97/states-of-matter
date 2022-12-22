import type {CardType} from "@som/shared/enums";

export interface SelectedCardHand {
  gid: number;
  type: CardType;
}

export interface SelectedCard {
  field: "" | "a" | "b" | "c" | "d";
  hand: SelectedCardHand;
}

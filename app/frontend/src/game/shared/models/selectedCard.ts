import type {CardType} from "@som/shared/enums";

interface SelectedCardHand {
  gid: number;
  type: CardType;
}

type SelectedCardField = "" | "A" | "B" | "C" | "D" | "hero";

interface SelectedCard {
  field: SelectedCardField;
  hand: SelectedCardHand;
}

export type {SelectedCardHand, SelectedCardField, SelectedCard};

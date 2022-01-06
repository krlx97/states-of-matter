import type {CardType} from "enums";

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

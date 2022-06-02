interface Card {
  id: number;
  klass: number;
  type: number;
  name: string;
  damage?: number;
  health?: number;
  manaCost: number;
  lore: string;
  effects: number[];
}

export type {Card};

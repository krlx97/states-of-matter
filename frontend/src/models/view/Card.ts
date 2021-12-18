interface Card {
  id: number;
  klass: number;
  type: number;
  name: string;
  damage?: number;
  health?: number;
  manaCost: number;
  effect: string;
}

export type {Card};

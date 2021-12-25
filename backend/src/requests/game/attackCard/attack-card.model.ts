interface AttackCard {
  attacker: "magic" | "minionA" | "minionB" | "minionC" | "minionD" | "trap";
  attacked: "magic" | "minionA" | "minionB" | "minionC" | "minionD" | "trap";
}

export type {AttackCard};

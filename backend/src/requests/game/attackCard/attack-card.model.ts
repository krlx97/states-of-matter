interface AttackCard {
  attacker: "magic" | "minionA" | "minionB" | "minionC" | "minionD" | "trap" | "hero";
  attacked: "magic" | "minionA" | "minionB" | "minionC" | "minionD" | "trap" | "hero";
}

export type {AttackCard};

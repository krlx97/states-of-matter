const getXpRequired = (lv: number): number => 1000 + (lv % 10) * 100;

export {getXpRequired};

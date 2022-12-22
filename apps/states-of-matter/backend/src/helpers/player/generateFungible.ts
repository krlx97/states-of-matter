const generateFungible = (fungible: any): any => {
  const symbols = ["TLOS", "VMT", "SPT"];
  const tokens: any[] = [];

  const getTotal = (token: any): string => {
    const liquid = parseFloat(token.value.liquid);
    const staked = parseFloat(token.value.staked);
    const unstaking = parseFloat(token.value.unstaking);
    const total = liquid + staked + unstaking;

    return `${total} ${token.key.sym.slice(2)}`;
  };

  fungible.forEach((token: any): void => {
    const {sym, contract} = token.key;
    const {liquid, staked, unstaking, claimable} = token.value;
    const symbol = sym.slice(2);
    const total = getTotal(token);

    tokens.push({symbol, contract, total, liquid, staked, unstaking, claimable});
    symbols.splice(symbols.indexOf(symbol), 1);
  });

  symbols.forEach((symbol): void => {
    tokens.push({
      symbol,
      contract: "",
      total: `0.0000 ${symbol}`,
      liquid: `0.0000 ${symbol}`,
      staked: `0.0000 ${symbol}`,
      unstaking: `0.0000 ${symbol}`,
      claimable: []
    });
  });

  return tokens.sort((a, b) => {
    if (a.symbol === "TLOS") {
      return -1;
    } else {
      return 1;
    }
  });
};

export {generateFungible};

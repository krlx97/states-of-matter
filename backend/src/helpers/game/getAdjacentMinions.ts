const getAdjacentMinions = (field: "a" | "b" | "c" | "d") => {
  const adjacentFields = [];

  switch (field) {
    case "a":
      adjacentFields.push("b");
      break;
    case "b":
      adjacentFields.push("a", "c");
      break;
    case "c":
      adjacentFields.push("b", "d");
      break;
    case "d":
      adjacentFields.push("c");
      break;
  }

  return adjacentFields;
};

export {getAdjacentMinions};

const getAdjacentMinions = (field: "a" | "b" | "c" | "d") => {
  let adjacentFields = [];

  switch (field) {
    case "a":
      adjacentFields = ["b"];
      break;
    case "b":
      adjacentFields = ["a", "c"];
      break;
    case "c":
      adjacentFields = ["b", "d"];
      break;
    case "d":
      adjacentFields = ["c"];
      break;
  }

  return adjacentFields;
};

export {getAdjacentMinions};

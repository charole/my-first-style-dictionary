const TOKEN_MAPS = {
  typography: {
    weight: {
      SemiBold: "600",
      Bold: "bold",
      Regular: "normal",
    },
  },
  color: {},
  size: {},
};

const getTokenType = (tokenName) => {
  if (tokenName?.includes("weight")) return "weight";
  if (tokenName?.includes("color")) return "color";
  if (tokenName?.includes("size")) return "size";
  return "other";
};

export const getMappedValue = ({ tokenName, value }) => {
  const tokenType = getTokenType(tokenName);

  if (tokenType === "weight") {
    return TOKEN_MAPS.typography.weight[value] || value;
  }

  return value;
};

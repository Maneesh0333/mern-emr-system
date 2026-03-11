type Stats = Record<string, number>;

export const getChips = (stats: Stats = {}, total = 0) => {
  const chips = Object.entries(stats).map(([key, value]) => ({
    label: `${key} (${value})`,
    value: key,
  }));

  return [
    ...chips,
    {
      label: `All (${total})`,
      value: "All",
    },
  ];
};
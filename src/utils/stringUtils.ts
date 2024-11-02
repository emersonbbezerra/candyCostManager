export const capitalize = (str: string) => {
  return str
    .toLowerCase()
    .replace(/(?:^|\s|[\p{P}\p{S}])\p{L}/gu, (char) => char.toUpperCase());
};

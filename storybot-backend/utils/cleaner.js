export const cleanText = (text, maxLength = 10000) => {
  return text
    .replace(/[*_>[]()`#+-]/g, "")
    .replace(/http\S+/g, "")
    .replace(/\n+/g, " ")
    .trim()
    .slice(0, maxLength);
};

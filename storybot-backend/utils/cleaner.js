export const cleanText = (text, maxLength = 500) => {
  return text
    .replace(/[*_>[]()`#+-]/g, '')
    .replace(/http\S+/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, maxLength);
};
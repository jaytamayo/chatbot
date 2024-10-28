export const getMessagePureId = (id?: string) => {
  const strings = id?.split('_') ?? [];
  if (strings.length > 0) {
    return strings.at(-1);
  }
  return id;
};

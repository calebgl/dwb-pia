export const normalizeDate = (date: Date): Date => {
  return date.toLocaleString() as unknown as Date;
};

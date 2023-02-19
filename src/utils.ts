export const timeNow = (): string => {
  return beautifyTime(null);
};

export const beautifyTime = (time: string | null | undefined): string => {
  const date = getDate(time);
  const dateOptions: any = {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  };
  const timeOptions: any = { hour: "2-digit", minute: "2-digit" };

  const dateString = date.toLocaleDateString("de-DE", dateOptions);
  const timeString = date.toLocaleTimeString("de-DE", timeOptions);

  return `${dateString} ${timeString}`;
};

export const getDate = (time: string | null | undefined): Date => {
  return time ? new Date(time) : new Date();
}


export const olderThanDays = (time: string | null | undefined, days: number): boolean => {
  if(!time) return false;

  const date = getDate(time);

  const now = Date.now();
  const daysAgo = now - days * 24 * 60 * 60 * 1000;

  return date.getTime() < daysAgo;
}
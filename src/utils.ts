export const timeNow = (): string => {
  return beautifyTime(null);
};

export const beautifyTime = (time: string | null | undefined): string => {
  const date = time ? new Date(time) : new Date();
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

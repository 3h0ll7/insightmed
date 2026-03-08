import ar from "./ar";

export const t = (key: string): string => {
  return (ar as Record<string, string>)[key] || key;
};

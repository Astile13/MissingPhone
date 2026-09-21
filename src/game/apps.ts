export type AppDefinition = {
  id: number;
  name: string;
  glyph: string;
  accent: string;
};

export const appDefinitions: AppDefinition[] = [
  { id: 1, name: "Notes", glyph: "N", accent: "#d9c38d" },
  { id: 2, name: "Gallery", glyph: "G", accent: "#9aabb9" },
  { id: 3, name: "Calculator", glyph: "+", accent: "#b9a99a" },
  { id: 4, name: "Messages", glyph: "M", accent: "#8ca99b" },
  { id: 5, name: "Maps", glyph: "⌖", accent: "#a6a18d" },
  { id: 6, name: "Music", glyph: "♫", accent: "#aa91a1" },
  { id: 7, name: "Files", glyph: "F", accent: "#bd9c78" },
  { id: 8, name: "Calendar", glyph: "□", accent: "#a78f88" },
  { id: 9, name: "Browser", glyph: "◉", accent: "#8c9eaa" },
  { id: 10, name: "Unknown", glyph: "?", accent: "#817c88" },
];

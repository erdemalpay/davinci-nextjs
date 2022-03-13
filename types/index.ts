export type Gameplay = {
  date: string;
  startHour: string;
  playerCount: number;
  game: number;
  mentor: string;
};

export type Location = {
  id: number;
  name: string;
};

export type Table = {
  name: string;
  date: string;
  playerCount: number;
  location?: Number;
  startHour: string;
  finishHour?: string;
  gameplays: Gameplay[];
};

export type User = {
  name: string;
  role: string;
};

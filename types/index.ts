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
  _id?: number;
  name: string;
  date: string;
  playerCount: number;
  location?: number;
  startHour: string;
  finishHour?: string;
  gameplays: Gameplay[];
};

export type User = {
  name: string;
  role: string;
};

export type TagType<T> = {
  name: string;
  _id: string;
} & T;

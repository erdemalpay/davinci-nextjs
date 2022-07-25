export type Gameplay = {
  _id?: number;
  date: string;
  startHour: string;
  finishHour?: string;
  playerCount: number;
  game?: number;
  mentor: User;
  location: number;
};

export type Location = {
  _id: number;
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
  _id: string;
  name: string;
  role: string;
};

export type Game = {
  _id: number;
  name: string;
  image: string;
  thumbnail: string;
  expansion: boolean;
};

export type TagType<T> = {
  _id: string | number;
  name: string;
} & T;

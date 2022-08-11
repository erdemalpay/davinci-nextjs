export type Gameplay = {
  _id?: number;
  date: string;
  startHour: string;
  finishHour?: string;
  playerCount: number;
  game?: Game | number;
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

export type Visit = {
  _id: number;
  location: number;
  date: string;
  user: User;
  startHour: string;
  finishHour?: string;
};

export type Membership = {
  _id: number;
  name: string;
  startDate: string;
  endDate: string;
};

export type TagType<T> = {
  _id: string | number;
  name: string;
} & T;

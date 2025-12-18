// types/deck.ts
export type DeckEntry = {
  card_id: number;
  quantity: number;
};

export type DeckState = Record<number, DeckEntry>;

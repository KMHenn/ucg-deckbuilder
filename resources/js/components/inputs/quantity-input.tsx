import { NumberInput, Button } from '@mantine/core';
import { useState } from 'react';

type Card = { id: number; name: string };

type Props = {
  card: Card;
  max?: number;
  initialQuantity?: number;
  onCommit: (card: Card, quantity: number) => void;
};

export default function QuantityInput({ card, max = 50, initialQuantity = 0, onCommit }: Props) {
  const [value, setValue] = useState<number>(initialQuantity);

  const commit = () => {
    onCommit(card, value ?? 0); 
  };

  return (
    <div className="flex gap-2 items-center">
      <NumberInput
        value={value}
        min={0}
        max={max}
        onChange={(val) => setValue(val ?? 0)}
        w={70}
      />

      <Button size="xs" onClick={commit}>
        Update
      </Button>
    </div>
  );
}

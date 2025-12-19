import { Paper, Stack, Text, Group } from '@mantine/core';

type TooltipPayload = {
  name: string;
  value: number;
  payload: Record<string, any>;
  color: string;
};

type Props = {
  label?: string;
  payload?: TooltipPayload[];
};

export default function DeckTooltip({ label, payload }: Props) {
  if (!payload?.length) return null;

  const row = payload[0].payload;

  return (
    <Paper px="sm" py="xs" shadow="md" radius="sm">
      <Stack gap={4}>
        <Text fw={600}>{label}</Text>

        {/* Character % of deck */}
        {row.deckPercent !== undefined && (
          <Text size="xs" c="dimmed">
            {row.deckPercent}% of deck
          </Text>
        )}

        {payload.map(item => {
          const percentKey = `${item.name}Percent`;
          const percent = row[percentKey];

          return (
            <Group key={item.name} gap="xs">
              <div
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: item.color,
                  borderRadius: 2,
                }}
              />
              <Text size="sm">
                {item.name}: {item.value}
                {percent !== undefined && (
                  <Text span c="dimmed">
                    {' '}({percent}%)
                  </Text>
                )}
              </Text>
            </Group>
          );
        })}
      </Stack>
    </Paper>
  );
}

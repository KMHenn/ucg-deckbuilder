import { BarChart } from '@mantine/charts';
import { Card, Loader, Center, Text, Stack } from '@mantine/core';
import { useMemo, useState } from 'react';

type DeckBreakdownRow = {
  character: string;
  [key: string]: string | number;
};

type Props = {
  data?: DeckBreakdownRow[];
  loading?: boolean;
  height?: number;
};

const LEVEL_COLORS: Record<string, string> = {
    level_0: 'grey',
    level_1: 'blue',
    level_2: 'green',
    level_3: 'orange',
    level_4: 'red',
    level_5: 'yellow',
    level_6: 'purple',
    level_7: 'pink'
};

export default function DeckStatistics({
  data = [],
  loading = false,
  height = 300,
}: Props) {
  const series = useMemo(() => {
    if (!data.length) return [];

    const levels = new Set<string>();

    data.forEach(row => {
      Object.keys(row).forEach(key => {
        if (key.startsWith('level_')) {
          levels.add(key);
        }
      });
    });

    return Array.from(levels)
      .sort()
      .map(level => ({
        name: level,
        color: LEVEL_COLORS[level] ?? 'gray',
      }));
  }, [data]);

  if (loading) {
    return (
      <Center h={height}>
        <Loader />
      </Center>
    );
  }

  if (!data.length) {
    return (
      <Center h={height}>
        <Text c="dimmed">No deck data available</Text>
      </Center>
    );
  }

  return (
    <Card withBorder radius="md">
      <Stack gap="sm">
        <BarChart
          h={height}
          data={data}
          dataKey="character"
          type="stacked"
          series={series}
          withLegend
          withTooltip
          gridAxis="y"
        />
      </Stack>
    </Card>
  );
}

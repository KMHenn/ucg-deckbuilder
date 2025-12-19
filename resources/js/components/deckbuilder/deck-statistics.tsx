import { BarChart } from '@mantine/charts';
import { Card, Loader, Center, Text, Stack, Modal, Button } from '@mantine/core';
import { useMemo, useState } from 'react';
import '@mantine/charts/styles.css';

type DeckBreakdownRow = {
  character: string;
  [key: string]: string | number;
};

type Props = {
  data?: DeckBreakdownRow[];
  loading?: boolean;
  height?: number;
};

const yTicks = Array.from({ length: 11 }, (_, i) => i * 5); // 0–50

const LEVEL_COLORS: Record<string, string> = {
    'Level 1': 'blue.1',
    'Level 2': 'blue.3',
    'Level 3': 'blue.5',
    'Level 4': 'orange.3',
    'Level 5': 'red.3',
    'Level 6': 'red.5',
    'Level 7': 'red.9',
    'Round 0': 'green.3',
    'Round 1': 'green.4',
    'Round 2': 'green.5',
    'Round 3': 'green.6',
    'Round 4': 'green.7',
    'Round 5': 'green.8',
    'Round 6': 'green.9',
};

export default function DeckStatistics({
  data = [],
  loading = false,
  height = 500,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  const series = useMemo(() => {
    if (!data.length) return [];

    const analytics = new Set<string>();

    data.forEach(row => {
      Object.keys(row).forEach(key => {
        if (key.startsWith('Level ') || key.startsWith('Round ')) {
          analytics.add(key);
        }
      });
    });

    return Array.from(analytics)
      .sort()
      .map(analytic => ({
        name: analytic,
        color: LEVEL_COLORS[analytic] ?? 'gray',
      }));
  }, [data]);
  return (
    <>
      <Button onClick={() => setModalOpen(true)}>View Analytics</Button>

      <Modal size="xl" opened={modalOpen} onClose={() => setModalOpen(false)} title="Deck Analytics">
        <Card withBorder radius="md">
          <Stack gap="sm">

            {loading && (
              <Center h={height}>
                <Loader />
              </Center>
            )}

            {!data.length && (
              <Center h={height}>
                <Text c="dimmed">No deck data available</Text>
              </Center>
            )}
            <BarChart
              h={height}
              data={data}
              dataKey="character"
              type="stacked"
              series={series}
              withLegend
              yAxisProps={{ tickMargin: 5, ticks: yTicks, domain: [0,50] }}
              
              legendProps={{ verticalAlign: 'bottom', height: 50 }}
              withTooltip
              gridAxis="y"
            />
          </Stack>
        </Card>
      </Modal>
    </>
  );
}

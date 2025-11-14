import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

import { Burger, Container, Group, Button} from '@mantine/core';

export default function BaseLayout({ children }) {
  // const { auth } = usePage<SharedData>().props;
  const links = [
    { link: '/', label: 'Home' },
    { link: '/deckbuilder', label: 'Deckbuilder' },
    { link: '/card-tracker', label: 'Card Tracker' },
  ];

  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);

  return (
    <MantineProvider>
      <div className="min-h-screen">
        <header className="flex h-[60px] items-center shadow-sm px-6 md:px-8">
          <Container size="md" class="flex justify-between w-full">
            <Group gap={5} class="flex gap-4" visibleFrom="xs" >
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.link}
                  className="hover:shadow-md rounded-md"
                  data-active={active === link.link || undefined}
                  onClick={(event) => {
                    setActive(link.link);
                  }}
                >
                  {link.label}
                </a>
              ))}
            </Group>

            <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />

            <Group gap={5} class="flex gap-4">
              <Button variant="default">Log in</Button>
              <Button >Sign up</Button>
            </Group>

          </Container>
        </header>
        <main className="py-4 px-6 md:px-8">{children}</main>
      </div>
    </MantineProvider>
  );
}
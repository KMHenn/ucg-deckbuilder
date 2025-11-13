import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { HeadlessMantineProvider } from '@mantine/core';
import { Burger, Container, Group, Button} from '@mantine/core';
import classes from '../../css/modules/header.module.css';

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
    <HeadlessMantineProvider>
      <header className={classes.header}>
        <Container size="md" className={classes.inner}>
          <Group gap={5} visibleFrom="xs" className={classes.inner}>
            {links.map((link) => (
              <a
                key={link.label}
                href={link.link}
                className="hover:bg-blue-400"
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

          <Group>
            <Button variant="default">Log in</Button>
            <Button>Sign up</Button>
          </Group>

        </Container>
      </header>
      <main className="py-4 px-6 md:px-12">{children}</main>
    </HeadlessMantineProvider>
  );
}
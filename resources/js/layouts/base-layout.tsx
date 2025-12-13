import { usePage, Inertia } from '@inertiajs/react';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { MantineProvider, TextInput, PasswordInput } from '@mantine/core';
import '@mantine/core/styles.css';
import 'mantine-datatable/styles.layer.css';
import { useAuth } from '../auth/auth-context';

import { Burger, Container, Group, Button, Text} from '@mantine/core';
import Login from '@/components/auth/login';
import Register from '@/components/auth/register';

export default function BaseLayout({ children }) {
  // const { auth } = usePage<SharedData>().props;
    const { user, logout, loading } = useAuth();

    if(!user){
      console.log('no user logged in');
    }
    else{
    console.log('user: ' + user.username);
    }
  const links = [
    { link: '/', label: 'Home' },
    { link: '/deckbuilder', label: 'Deckbuilder' },
    { link: '/card-tracker', label: 'Card Tracker' },
  ];

  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);
  const [loginOpened, login] = useDisclosure(false);
  const [registerOpened, register] = useDisclosure(false);

  return (
    <MantineProvider>
      <div className="min-h-screen">
        <header className="flex h-[60px] items-center shadow-sm px-6 md:px-8">
          
          <Container size="md" class="flex justify-between w-full">
            <Group class="flex gap-6" visibleFrom="md">
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

            <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />

            { user ? (        
              <Group>
                  <Text size="sm">{user.username}</Text>
                  <Button size="xs" variant="outline" onClick={logout}>
                    Logout
                  </Button>
              </Group>) : (
                <>
            <Group gap="md">
                <Button variant="subtle" onClick={register.open}>
                    Register
                </Button>

                <Button variant="filled" onClick={login.open}>
                    Login
                </Button>
            </Group>

            <Login opened={loginOpened} onClose={login.close} />
            <Register opened={registerOpened} onClose={register.close} />
            </>
            )}

          </Container>
        </header>
        <main className="py-4 px-6 md:px-8">{children}</main>
      </div>
    </MantineProvider>
  );
}
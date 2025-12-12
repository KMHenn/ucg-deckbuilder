import { usePage, Inertia } from '@inertiajs/react';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { MantineProvider, TextInput, PasswordInput } from '@mantine/core';
import '@mantine/core/styles.css';
import 'mantine-datatable/styles.layer.css';

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
  const [loginModal, setLoginModal] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [signupModal, setSignupModal] = useState(false);

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

            <Group gap={5} class="flex gap-4">
              <Button variant="default" onClick={() => setLoginModal(true)} >Log in</Button>
              <Button onClick={() => setSignupModal(true)}>Sign up</Button>
            </Group>

            {loginModal &&
            <>
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-60 z-10"  
                        onClick={() => setModal(false)}>
                    </div>
                    <div className="absolute left-0 right-0 w-max h-max  m-auto z-20">
                        <div className="w-[80vw] md:w-[50vw] h-max m-auto bg-white p-5 grid gap-x-4 gap-y-2 rounded-md">
                          <form onSubmit={handleLogin}>
                            <TextInput
                            name="username"
                            label="Username"
                            placeholder="Username"
                            required/>
                            <PasswordInput
                            name="password"
                            label="Password"
                            placeholder="Password"
                            required/>
                            <input type="submit" value="Log In"/>
                          </form>
                        </div>
                    </div>
                </>
            }

          </Container>
        </header>
        <main className="py-4 px-6 md:px-8">{children}</main>
      </div>
    </MantineProvider>
  );
}
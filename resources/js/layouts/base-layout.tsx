import { useDisclosure } from '@mantine/hooks';
import { MantineProvider, Drawer, ScrollArea, NavLink } from '@mantine/core';
import {usePage, Link as InertiaLink} from '@inertiajs/react';
import '@mantine/core/styles.css';
import 'mantine-datatable/styles.layer.css';
import { useAuth } from '../auth/auth-context';
import { Burger, Container, Group, Text} from '@mantine/core';
import Login from '@/components/auth/login';
import Register from '@/components/auth/register';
import Logout from '@/components/auth/logout';

export default function BaseLayout({ children }) {
    const { user } = useAuth();
    const [burgerOpened, { toggle }] = useDisclosure(false);
    const {url} = usePage();
    const links = [
      { link: '/', label: 'Home' },
      { link: '/deckbuilder', label: 'Deckbuilder' },
      { link: '/card-tracker', label: 'Card Tracker' },
    ];

    const navLinks = links.map((link) => (
      <NavLink 
        noWrap
        active={url === link.link}
        key={'desktop-nav-' + link.label} 
        component={InertiaLink} 
        href={link.link}
        label={link.label}/>
    ));

    if(!user){
      console.log('no user logged in');
    }
    else{
    console.log('user: ' + user.username);
    }

  return (
    <MantineProvider>
      <div className="min-h-screen">
        <header className="flex h-[60px] items-center shadow-sm px-6 md:px-8">
          
          {/* Navbar */}
          <Container size="md" class="flex justify-between w-full">
            <Group class="hidden md:flex gap-6" visibleFrom="md">
              {navLinks}
            </Group>

            <Burger opened={burgerOpened} onClick={toggle} hiddenFrom="md" size="sm" />
            <Drawer opened={burgerOpened} onClose={toggle}>
              <ScrollArea>              
                {navLinks}
              </ScrollArea>
            </Drawer>

          {/* Auth buttons */}
            { user ? (        
              <Group>
                  <Text size="sm">{user.username}</Text>
                  <Logout/>
              </Group>) : (
              <Group gap="md">
                  <Register/>
                  <Login />
              </Group>
            )}
          </Container>
        </header>
        <main className="py-4 px-6 md:px-8">{children}</main>
      </div>
    </MantineProvider>
  );
}
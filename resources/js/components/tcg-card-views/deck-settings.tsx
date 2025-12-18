import { useAuth } from '@/auth/auth-context';
import { Button, Modal, TextInput, Alert, NativeSelect } from '@mantine/core';
import { useState } from 'react';
import { IconExclamationCircle } from '@tabler/icons-react';

export default function DeckSettings({deck}){
    const {user} = useAuth();
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setModalOpen(true)}>Deck Options</Button>
            <Modal size="xl" opened={modalOpen} onClose={() => setModalOpen(false)} title="Deck Options">
                <div className="h-fit w-full flex flex-col gap-8">
                    <div className="flex flex-col gap-4 p-4 shadow-sm rounded-md">
                        <h1 className="font-bold">Validate Current Deck</h1>
                        <div className="flex flex-col gap-4">
                            <p>Check more complex comparisons for deck validity.</p>
                            <Button name="validate-deck" size='auto'>Validate</Button>
                            <div></div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 p-4 shadow-sm rounded-md">
                        <h1 className="font-bold">Save Deck</h1>
                        {!user &&
                            <Alert 
                            variant='light' 
                            color='blue'
                            icon={<IconExclamationCircle/>}> You must be logged in to save your deck.</Alert> 
                        }
                        <div className="flex gap-4">
                            <TextInput name="deck" placeholder="New deck"/>
                            <Button name="save-deck" disabled={!user} variant="filled">Save</Button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 shadow-sm rounded-md p-4">
                        <h1 className="font-bold">Load Deck</h1>
                        {!user &&
                            <Alert 
                            variant='light' 
                            color='blue'
                            icon={<IconExclamationCircle/>}> You must be logged in to load a deck.</Alert> 
                        }
                        <div className="flex justify-between">
                            <NativeSelect data={[]}/>
                            <Button name="load-deck" disabled={!user}>Load</Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
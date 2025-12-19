import { useAuth } from '@/auth/auth-context';
import { Button, Modal, TextInput, Alert, NativeSelect } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconExclamationCircle, IconTools } from '@tabler/icons-react';
import { api } from '@/lib/api';

export default function DeckSettings({deck, setDeck, setDeckSize, setDeckStats, setDeckId}){
    const {user} = useAuth();
    const [modalOpen, setModalOpen] = useState(false);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [deckName, setDeckName] = useState('');
    const saveDeck = async() =>{
        try {
            await api.post('/decks', {
                name: deckName,
                deck: deck, // send the current deck data
            });
            setModalOpen(false);
            setSaving(false);
        } catch (err: any) {
            console.error(err);
            setError('Failed to save deck. Please try again.');
        } finally {
            setSaving(false);
        }
    }
    
    const [selectedUserDeckId, setSelectedUserDeckId] = useState('');
    const [userDecks, setUserDecks] = useState([]);
    useEffect(() => {
        api.get(`/decks`)
            .then(response => setUserDecks(response.data.data))
            .catch(console.error);
    }, []);
    
    const loadDeck = async() => {
        try{
            const response = await api.get(`decks/${selectedUserDeckId}/load`);
            const deckData = response.data.data.cards; // this is the { [cardId]: { card, quantity } } object
            setDeck(deckData);
            setDeckName(response.data.data.name);
            setDeckId(response.data.data.id);

            const total = Object.values(deckData).reduce((sum, entry) => sum + entry.quantity, 0);
            setDeckSize(total);

            setDeckStats(response.data.data.statistics);

            setModalOpen(false);
        } catch (err: any) {
            console.error(err);
            setError('Failed to load deck. Please try again.');
        } finally {
            setSaving(false);
        }
    };


    return (
        <>
            <Button onClick={() => setModalOpen(true)} rightSection={<IconTools/>}>Deck Options</Button>

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
                            <TextInput onBlur={(e) => setDeckName(e.currentTarget.value)} name="deck" placeholder="New deck"/>
                            <Button onClick={saveDeck} name="save-deck" disabled={!user || !deckName || saving} variant="filled">Save</Button>
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

                        <div className="flex flex-col gap-4">
                            <div className="w-full">
                                <Alert 
                                variant='light' 
                                color='red'
                                icon={<IconExclamationCircle/>}>This will overwrite your current deck.</Alert> 
                            </div>
                            <div className="flex gap-4">
                             <NativeSelect
                                data={userDecks.map((userDeck) => ({ value: userDeck.id, label: userDeck.name }))}
                                value={selectedUserDeckId}
                                onChange={(event) => setSelectedUserDeckId(event.currentTarget.value)}
                                placeholder="Select a deck"
                            />
                            <Button name="load-deck" onClick={loadDeck} disabled={!user}>Load</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
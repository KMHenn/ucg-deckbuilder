import BaseLayout from '../layouts/base-layout';
import { useState, useEffect } from 'react';
import '@mantine/core/styles/Modal.css';
import {api} from '../lib/api';
import {Modal} from '@mantine/core';
import DetailedView from '@/components/tcg-card-views/detailed-view';
import CardList from '@/components/deckbuilder/card-list';
import Deck from '@/components/deckbuilder/deck';

export default function Deckbuilder() {
    const [deckSize, setDeckSize] = useState(0);
    const [deck, setDeck] = useState<{ [cardId: number]: { card: any, quantity: number } }>({});
    const [deckId, setDeckId] = useState(null);
    const [deckStats, setDeckStats] = useState([]);
    const setCardQuantity = (card: Object, quantity: number) => {
        setDeck(prev => {
            const copy = { ...prev };
            if (quantity <= 0) {
                delete copy[card.id];
            } else {
                copy[card.id] = { card, quantity };
            }
            return copy;
        });
    };

    useEffect(() => {
        const total = Object.values(deck).reduce((sum, entry) => sum + entry.quantity, 0);
        setDeckSize(total);
    }, [deck]);

     // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalCard, setModalCard] = useState(null);
    const openCardModal = async (cardId) => {
        try{
            const response = await api.get(`/cards/${cardId}`);
            setModalCard(response.data.data);
            setModalOpen(true);
        }
        catch(err){
            console.error(err);
        }
    }

    return (
        <BaseLayout>
            <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-between">
                    <div className="md:col-span-2 grid shadow-md p-4 max-h-[90vh] overflow-y-scroll rounded-sm">
                        <Deck
                            deckSize={deckSize}
                            setDeckSize={setDeckSize}
                            deck={deck}
                            deckId={deckId}
                            setDeckId={setDeckId}
                            setDeck={setDeck}
                            deckStats={deckStats}
                            setDeckStats={setDeckStats}
                            openCardModal={openCardModal} />
                    </div>

                    <div className="shadow-md rounded-sm">
                        <CardList
                            deck={deck}
                            openCardModal={openCardModal}
                            setCardQuantity={setCardQuantity}/>
                    </div>
                </div>
            </div>

            <Modal size="lg" opened={modalOpen} onClose={() => setModalOpen(false)} title={modalCard?.number}>
                 {modalCard ? (
                        <DetailedView 
                            quantity={deck[modalCard.id]?.quantity ?? 0} 
                            card={modalCard} 
                            onSetQuantity={setCardQuantity}/>
                    ) : (
                        <p>Loading...</p>
                    )}
            </Modal>
        </BaseLayout>
    );
}

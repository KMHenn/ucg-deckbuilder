import BaseLayout from '../layouts/base-layout';
import { useState, useEffect } from 'react';
import '@mantine/core/styles/Modal.css';
import {api} from '../lib/api';
import { useAuth } from '@/auth/auth-context';
import Filters from '@/components/tcg-card-views/filters';
import { Alert, Modal, Pagination, } from '@mantine/core';
import { IconExclamationCircle} from '@tabler/icons-react';
import DetailedView from '@/components/tcg-card-views/detailed-view';
import CompactView from '@/components/tcg-card-views/compact-view';
import DeckSettings from '@/components/tcg-card-views/deck-settings';

export default function Deckbuilder() {
    const {user} = useAuth();

    // Card listing 
    const recordsPerPage = 12;
    const [cardList, setCardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({});
    const [selectedFilters, setSelectedFilters] = useState({});
    const [totalCards, setTotalCards] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Deck info
    const [deckSize, setDeckSize] = useState(0);
    const [deck, setDeck] = useState<{ [cardId: number]: { card: any, quantity: number } }>({});
    const setCardQuantity = (card: Object, quantity: number) => {
        console.log(card);
        console.log(quantity);
        console.log('setting quantity for cardId ' + card.id + ' to ' + quantity )
        setDeck(prev => {
            const copy = { ...prev };
            if (quantity <= 0) {
                delete copy[card.id];
            } else {
                copy[card.id] = { card, quantity };
            }
            return copy;
        });

        console.log(deck);
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
    
    // Load available filters
    useEffect(() => {
        api.get(`/cards/filters`)
            .then(response => setFilters(response.data.data))
            .catch(console.error);
    }, []);
    
    // Load card list based on filters, page, and per_page
    useEffect(() => {
        let requestUrl = `/cards?page=${currentPage}&per_page=${recordsPerPage}`;
        if (Object.keys(selectedFilters).length > 0) {
          const filterQuery = Object.entries(selectedFilters)
            .map(([key, vals]) =>
              vals.length ? vals.map(v => `${key}[]=${encodeURIComponent(v)}`).join('&') : ''
            )
            .filter(Boolean)
            .join('&');
          requestUrl += '&' + filterQuery;
        }
    
        api.get(requestUrl)
          .then(response => {
            setCardList(response.data.data);
            setTotalCards(response.data.meta.total_cards);
            setTotalPages(totalCards / recordsPerPage);
          })
          .catch(console.error);
    }, [currentPage, selectedFilters]);
    
    // Reset page when filters change
    useEffect(() => setCurrentPage(1), [selectedFilters]);

    return (
        <BaseLayout>
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-between">
                    <div className="md:col-span-1 grid shadow-md content-baseline p-4">
                            <div className="w-full flex justify-between items-center">
                                <h1 className="h-fit">{deckSize} / 50</h1>

                                {deckSize > 50 && (        
                                    <Alert className="w-fit h-fit" 
                                        variant="light" 
                                        color="red" 
                                        title="Deck Limit Exceeded" 
                                        icon={<IconExclamationCircle/>}/>
                                )}

                                <DeckSettings deck={deck} setDeck={setDeck}/>
                            </div>
                            
                          <div className="grid grid-cols-2 xl:grid-cols-3 gap-2 xl:gap-4 mb-auto h-[70vh] overflow-y-scroll">
                            {Object.entries(deck).map(([id, { card, quantity }]) => (
                                <CompactView 
                                    key={'deck-' + id}
                                    card={card} 
                                    quantity={quantity}
                                    onSetQuantity={setCardQuantity}
                                    onClick={() => openCardModal(card.id)}
                                />
                            ))}
                        </div>
                    </div>
                    {/** @TODO modal for viewing graph */}
                    <div className="shadow-md p-4 gap-y-4 flex flex-col">
                        <Filters 
                            filters={filters}
                            selectedFilters={selectedFilters}
                            onChange={setSelectedFilters}/>
                        <div className="h-[70vh] grid grid-cols-2 gap-2 xl:gap-4 overflow-y-scroll">
                            {cardList.map(card => {
                                return (<CompactView 
                                    quantity={deck[card.id]?.quantity ?? 0}
                                    onSetQuantity={setCardQuantity}
                                    onClick={() => openCardModal(card.id)}
                                    card={card} 
                                    key={card.id} />);
                            })}
                        </div>
                        <div className="flex justify-center items-center z-10">
                             <Pagination total={totalPages} onChange={setCurrentPage} />
                        </div>
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

import CardDisplay from '@/components/tcg-card-views/card-display';
import BaseLayout from '../layouts/base-layout';
import { useState, useEffect } from 'react';
import CardModal from '@/components/tcg-card-views/card-modal';
import { useDisclosure } from '@mantine/hooks';
import '@mantine/core/styles/Modal.css';


const style = {
  position: 'relative',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40vw',
  background: 'black',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius: '5%',
  p: 4,
};

export default function Deckbuilder() {
    const [cardList, setCardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalOpened, {open, close}] = useDisclosure(false);
    const [deck, setDeck] = useState([]);

    const handleOpen = (card) => {
        setSelectedCard(card);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setSelectedCard(null);
        setIsModalOpen(false);
    };

    const updateDeck = (card, qty) => {
        setDeck((prevDeck) => {
            if(qty === 0){
                return prevDeck.filter((c) => c.id !== card.id);
            }

            if(prevDeck.find((c) => c.id === card.id)){
                return prevDeck.map((c) => c.id === card.id ? {...card, qty} : c);
            }

            return [...prevDeck, {...card, qty}];
        });
    } 

    const totalCards = deck.reduce((sum, card) => sum + (card.qty || 0), 0);

    useEffect(() => {
        fetch(`/cards?page=${currentPage}&format=cards`)
            .then(response => response.json())
            .then(dataCollection => setCardList(dataCollection.data))
            .catch(error => console.error(error));
    }, [currentPage])

    return (
        <BaseLayout>
            <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-between">
                    <div className="md:col-span-2 grid shadow-md content-baseline p-4">
                            <div className="h-fit w-full flex flex-grow pb-4">
                                <h1>{totalCards} / 50</h1>
                                {totalCards > 50 ? 'Deck Limit Exceeded' : ''}
                            </div>
                          <div className="h-fit grid grid-cols-2 xl:grid-cols-3 gap-2 xl:gap-4 mb-auto">
                            {deck.map(card => (
                                <CardDisplay 
                                    onUpdate={updateDeck}
                                    quantity={card.qty}
                                    card={card} 
                                    key={card.id}
                                    onClick={() => handleOpen(card)}/> 
                            ))}
                        </div>
                    </div>
                    <div className="shadow-md p-4">
                        <div className="w-full flex flex-grow pb-4">
                            {/* <TextField size="small" fullWidth id="search-field" label="Search cards" variant="outlined" />
                            <Button size="small" classes="grow-0" variant="contained">Search</Button> */}
                        </div>
                        <div className=" h-fit grid grid-cols-2 gap-2 xl:gap-4">
                            {cardList.map(card => {
                                const deckCard = deck.find((c) => c.id === card.id);
                                const qty = deckCard ? deckCard.qty : 0;

                                /** @TODO why isn't the quantity showing in the modal when opened from the card list */
                                return (<CardDisplay 
                                    quantity={qty}
                                    onUpdate={updateDeck}
                                    card={card} 
                                    key={card.id} 
                                    quantity={qty}
                                    onClick={() => handleOpen(card)} />);
                            })}
                        </div>
                        <div className="flex justify-center items-center">
                             {/* <Pagination className="w-fit" count={totalPages} onChange={(event, pageNumber) => setCurrentPage(pageNumber)} /> */}
                        </div>
                    </div>
                </div>
            </div>

            <CardModal
                onUpdate={updateDeck}
                opened={modalOpened}
                card={selectedCard}
                onClose={close}/>
        </BaseLayout>
    );
}

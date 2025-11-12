import TcgCardDisplay from '@/components/tcg-card-display';
import BaseLayout from '../layouts/base-layout';
import { useState, useEffect } from 'react';
import TcgCardModal from '@/components/tcg-card-modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';


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

export default function Deckbuilder({ totalPages = 1 }) {
    const [cardList, setCardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        fetch(`/api/cards?page=${currentPage}`)
            .then(response => response.json())
            .then(dataCollection => setCardList(dataCollection.data))
            .catch(error => console.error(error));
    }, [currentPage])

    return (
        <BaseLayout>
            <div>
                <h1>Deckbuilder</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-between">
                    <div className="grid bg-rose-50 text-black content-baseline p-4">
                            <div className="h-fit w-full flex flex-grow pb-4">
                                <h1>{totalCards} / 50</h1>
                                {totalCards > 50 ? 'Deck Limit Exceeded' : ''}
                            </div>
                          <div className="h-fit grid grid-cols-2 xl:grid-cols-3 gap-2 xl:gap-4 mb-auto">
                            {deck.map(card => (
                                <TcgCardDisplay 
                                    onUpdate={updateDeck}
                                    quantity={card.qty}
                                    card={card} 
                                    key={card.id}
                                    onClick={() => handleOpen(card)}/> 
                            ))}
                        </div>
                    </div>
                    <div className=" bg-amber-50 p-4">
                        <div className="w-full flex flex-grow pb-4">
                            <TextField size="small" fullWidth id="search-field" label="Search cards" variant="outlined" />
                            <Button size="small" classes="grow-0" variant="contained">Search</Button>
                        </div>
                        <div className=" h-fit grid grid-cols-2 xl:grid-cols-3 gap-2 xl:gap-4">
                            {cardList.map(card => {
                                const deckCard = deck.find((c) => c.id === card.id);
                                const qty = deckCard ? deckCard.qty : 0;

                                return (<TcgCardDisplay 
                                    quantity={qty}
                                    onUpdate={updateDeck}
                                    card={card} 
                                    key={card.id} 
                                    onClick={() => handleOpen(card)} />);
                            })}
                        </div>
                        <div className="flex justify-center items-center">
                             <Pagination className="w-fit" count={totalPages} onChange={(event, pageNumber) => setCurrentPage(pageNumber)} />
                        </div>
                    </div>
                </div>
            </div>

            <TcgCardModal
                onUpdate={updateDeck}
                open={isModalOpen}
                card={selectedCard}
                onClose={handleClose}>    
            </TcgCardModal>
        </BaseLayout>
    );
}

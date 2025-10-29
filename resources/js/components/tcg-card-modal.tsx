import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TcgCard from '@/components/tcg-card';
import NumberInput from './inputs/number-input';
import { useState, useEffect } from 'react';

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

export default function TcgCardModal({card, open, onUpdate, onClose}) {
    if(!card){
        return null;
    }

    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        console.log('setting qty');
        if(card.qty){
            setQuantity(card.qty);
            console.log('set to ' + card.qty);
        }
        else{
            setQuantity(0);
            console.log('set to ' + 0);
        }
    }, [card]);

    const handleQuantityChange = (newQty) => {
        setQuantity(newQty);
        onUpdate(card, newQty);
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>
                {card && (
                    <div className="flex flex-col items-center">
                        <div className="mb-4">
                            <h2 className="text-4xl font-bold">{card.name}</h2>
                            <h3 className="mx-auto w-fit">{card.subtitle ?? ''}</h3>
                        </div>
                        <img className="max-w-[50vh] max-h-[40vh] mb-4" src={card.thumbnail_url} alt={card.detailed_name}/>
                        <p className="mb-4">{card.effect} {card.errata !== null ? (<a className="text-cyan-500 hover:underline" href={card.errata} target="_blank">Errata Issued</a>) : ''}</p>
                            <NumberInput 
                                label="Qty" 
                                id={"card-qty-" + card.id} 
                                min="0" 
                                max={card.override_card_limit ? "50" : "4"}
                                value={quantity}
                                onChange={(value) => handleQuantityChange(value ?? 0)}/>
                        <div className="flex flex-col items-center">
                            <span className="w-fit mx-auto">Variants</span>
                            <div className="grid grid-cols-3 gap-4">
                                {card.related_cards != [] ?     
                                    card.related_cards.map(relatedCard => (
                                        <TcgCard card={relatedCard} key={relatedCard.id}></TcgCard>
                                    )) 
                                    : ''
                                }
                            </div>
                        </div>
                    </div>
                )}
            </Box>
        </Modal>
    );
}
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
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

export default function TcgCardTableRow({card, onUpdate}) {
    if(!card){
        return null;
    }

    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        // console.log('setting qty');
        if(card.qty){
            setQuantity(card.qty);
            // console.log('set to ' + card.qty);
        }
        else{
            setQuantity(0);
            // console.log('set to ' + 0);
        }
    }, [card]);

    const handleQuantityChange = (newQty) => {
        setQuantity(newQty);
        onUpdate(card, newQty);
        // @TODO hit server
    }

    return (
        <TableRow key={card.number} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
            <TableCell><img className="w-auto h-auto max-w-30 max-h-30" src={card.thumbnail_url} alt={card.number}/></TableCell>
            <TableCell>
                {card.name}
            </TableCell>
            <TableCell>{card.feature}</TableCell>
            <TableCell>{card.number}</TableCell>
            <TableCell>
                <NumberInput 
                    label="" 
                    id={"card-qty-" + card.id} 
                    min="0" 
                    max={card.override_card_limit ? "50" : "4"}
                    value={quantity}
                    onChange={(value) => handleQuantityChange(value ?? 0)}/>
                </TableCell>
        </TableRow>
    );
}
import '@mantine/core/styles/Modal.css';
import { Alert, Modal, Pagination, } from '@mantine/core';
import { IconExclamationCircle} from '@tabler/icons-react';
import CompactView from '@/components/tcg-card-views/compact-view';
import DeckSettings from '@/components/deckbuilder/deck-settings';
import DeckStatistics from '@/components/deckbuilder/deck-statistics';
export default function Deck({deck, deckSize, setDeck, setDeckSize, openCardModal, deckStats, setDeckStats}){
    
    return (
        <div>
            <div className="w-full flex justify-between items-center">
                <h1 className="h-fit">{deckSize} / 50</h1>

                {deckSize > 50 && (        
                    <Alert className="w-fit h-fit" 
                        variant="light" 
                        color="red" 
                        title="Deck Limit Exceeded" 
                        icon={<IconExclamationCircle/>}/>
                )}

                <DeckSettings deck={deck} setDeck={setDeck} setDeckSize={setDeckSize} setDeckStats={setDeckStats}/>
            </div>
                
            <DeckStatistics data={deckStats}/>

            <div className="p-4 grid grid-cols-3 xl:grid-cols-4 gap-2 xl:gap-4 mb-auto">
                {Object.entries(deck).map(([id, { card, quantity }]) => (
                    <CompactView 
                        key={'deck-' + id}
                        card={card} 
                        quantity={quantity}
                        disableQuantityInput={true}
                        onClick={() => openCardModal(card.id)}
                    />
                ))}
            </div>
        </div>
    );
}
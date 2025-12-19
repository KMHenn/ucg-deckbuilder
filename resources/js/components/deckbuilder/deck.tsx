import '@mantine/core/styles/Modal.css';
import { Alert } from '@mantine/core';
import { IconExclamationCircle} from '@tabler/icons-react';
import CompactView from '@/components/tcg-card-views/compact-view';
import DeckSettings from '@/components/deckbuilder/deck-settings';
import DeckStatistics from '@/components/deckbuilder/deck-statistics';
import HandSimulator from './hand-simulator';
export default function Deck({deck, deckSize, deckId, setDeckId, setDeck, setDeckSize, openCardModal, deckStats, setDeckStats}){
    
    return (
        <div>
            {deckSize > 50 && (        
                <Alert className="w-full h-fit mb-2" 
                    variant="light" 
                    color="red" 
                    title="Deck Limit Exceeded" 
                    icon={<IconExclamationCircle/>}/>
            )}
            <div className="w-full flex justify-between items-center">
                <h1 className="h-fit">{deckSize} / 50</h1>

                <div className="flex gap-2">
                    <HandSimulator deckId={deckId} deckSize={deckSize} openCardModal={openCardModal}/>
                    <DeckStatistics data={deckStats}/>
                    <DeckSettings deck={deck} setDeck={setDeck} setDeckSize={setDeckSize} setDeckStats={setDeckStats} setDeckId={setDeckId}/>
                </div>
            </div>

            <div className="p-4 grid grid-cols-3 xl:grid-cols-4 gap-2 xl:gap-4 mb-auto">
                {Object.entries(deck).map(([id, { card, quantity }]) => (
                    <CompactView 
                        key={'deck-card-' + id}
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
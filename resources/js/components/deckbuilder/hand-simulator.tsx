import { Button, Modal } from "@mantine/core";
import { IconHandStop, IconRefresh } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import CompactView from "../tcg-card-views/compact-view";

export default function HandSimulator({deckId, deckSize, openCardModal}){
    const [hand, setHand] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const modalButton = <Button 
        disabled={deckSize != 50} 
        rightSection={<IconHandStop/>} 
        onClick={() => setModalOpen(true)}>Simulate Hand
    </Button>;

    const fetchHand = () => {
        setLoading(true);
        api.get(`/decks/${deckId}/hand`)
            .then(response => setHand(response.data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (modalOpen) {
            fetchHand();
        }
    }, [modalOpen]);
    
    if(deckSize != 50){ 
        return modalButton;
    }

    return (
        <>
        {modalButton}
        <Modal size="xl" opened={modalOpen} onClose={() => setModalOpen(false)} title="Hand Simulator">
            <div className="flex flex-col">
                <div className="grid grid-cols-3 md:grid-cols-6">
                    {hand.length > 0 ? (
                        hand.map((card, index) => (
                            <img key={'hand-' + index} 
                                src={card.thumbnail_url} 
                                className="w-auto h-auto max-w-20 max-h-20 md:max-w-36 md:max-h-36 mx-auto" 
                                alt={card.formatted_name}/>
                                // onClick={() => openCardModal(card.id)}/>
                        ))
                    ) : (
                        <span>No cards in hand yet.</span>
                    )}
                </div>
                <div className="w-auto mx-auto mt-4">
                    <Button
                        size="xs"
                        rightSection={<IconRefresh />}
                        onClick={fetchHand}
                        loading={loading}>
                        Re-draw Hand
                    </Button>
                </div>
            </div>
        </Modal>
        </>
    )
}
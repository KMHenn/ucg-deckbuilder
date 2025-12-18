import Tags from '@/components/tcg-card-views/tags';
import QuantityInput from '../inputs/quantity-input';

export default function CompactView({ card, quantity = 0, onClick, onSetQuantity}) {
    return (
        <div className="flex flex-col w-full bg-[#ffffffeb] shadow-md rounded-md p-2 text-black gap-4">
            <div 
                onClick={onClick}
                key={card.id} 
                data-id={card.id}>
                <div className="items-center pb-2 my-auto mx-auto">
                    <img 
                        alt={card.number} 
                        title={card.subtitle} 
                        className="w-auto h-auto max-h-32 max-w-32 xl:max-h-36 xl:max-w-36 hover:cursor-pointer mx-auto" 
                        src={card.thumbnail_url}>
                    </img>
                </div>

                <div className="flex flex-col gap-4 text-black">
                    <div className="mx-auto">
                        <h1 className="text-sm font-semibold">{card.name}</h1>
                        <h2 className="text-xs">{card.subtitle}</h2>
                    </div>
                    
                    <Tags tags={card.tags}/> 
                </div>
            </div>

            <div className="mx-auto w-fit">
                <QuantityInput
                    aria-label={card.number + ' quantity input'}
                    initialQuantity={quantity}
                    card={card}
                    min={0}
                    max={card.override_card_limit ? 50 : 4}
                    onCommit={onSetQuantity}/>
            </div>
        </div>
    );
}

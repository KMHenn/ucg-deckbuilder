import Tags from '@/components/tcg-card-views/tags';
import QuantityInput from '../inputs/quantity-input';

export default function CompactView({ card, quantity = 0, disableQuantityInput = false, onClick, onSetQuantity}) {
    return (
          <div className="flex flex-col w-full  h-fit justify-between bg-[#ffffffeb] shadow-md rounded-md p-2 text-black gap-4">
            <div onClick={onClick} className="hover:cursor-pointer gap-4">  
                <div className="flex flex-col items-center gap-1 text-black mb-2">
                    <h1 className="w-fit text-sm font-semibold">{card.name}</h1>
                    <h2 className="w-fit text-xs">{card.subtitle}</h2>
                </div>
                <div
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
                </div>

                {/* <Tags className="hidden xl:flex flex-wrap gap-2 w-auto" tags={card.tags}/>  */}
            </div>

            <div className="mx-auto w-fit">
                {disableQuantityInput ? 
                    (<div className="font-semibold text-sm">{quantity} in deck</div>)
                : 
                (<QuantityInput
                    aria-label={card.number + ' quantity input'}
                    initialQuantity={quantity}
                    card={card}
                    min={0}
                    max={card.override_card_limit ? 50 : 4}
                    onCommit={onSetQuantity}/>
                )}
            </div>
        </div>
    );
}

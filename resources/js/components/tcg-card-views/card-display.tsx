import CardDetailTags from '@/components/tcg-card-views/detail-tags';

export default function CardDisplay({ card, quantity, onClick }) {
    return (
    <div className="flex flex-col w-full bg-[#ffffffeb] shadow-md rounded-md p-2 text-black" key={card.id} data-id={card.id} onClick={onClick}>
        {quantity > 0 && (
            <div className="absolute self-end bg-black text-white text-xs font-bold rounded-full w-fit h-fit p-2 mb-2 flex items-center ml-auto">
                x{quantity}
            </div>
        )}

        {/* @TODO hate how images are adjusting to window scaling, especially scenes */}
        <div className="items-center pb-2 my-auto mx-auto">
            <img 
                alt={card.number} 
                title={card.subtitle} 
                className="w-auto h-auto max-h-40 max-w-40 xl:max-h-46 xl:max-w-48 hover:cursor-pointer" 
                src={card.thumbnail_url}>
            </img>
        </div>

        <div className="flex flex-col gap-4 text-black">
            <div>
                <h1 className="text-sm font-semibold">{card.name}</h1>
                <h2 className="text-xs">{card.subtitle}</h2>
            </div>
            
            <CardDetailTags details={card.details}/>      
      </div>
    </div>
    );
}

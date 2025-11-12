
export default function TcgCardDisplay({ card, quantity, onClick }) {
    // @TODO fix formatting on card details
    return (
    <div className="flex flex-col w-full bg-[#00000020] rounded-md p-2 text-black" key={card.id} data-id={card.id} onClick={onClick}>
        {quantity > 0 && (
            <div className="bg-black text-white text-xs font-bold rounded-full w-fit h-fit p-2 mb-2 flex items-center ml-auto">
                x{quantity}
            </div>
        )}
        <div className="items-center pb-2 my-auto mx-auto">
            <img 
                alt={card.number} 
                title={card.subtitle} 
                className="w-auto h-auto max-h-40 max-w-40 xl:max-h-46 xl:max-w-48 hover:cursor-pointer" 
                src={card.thumbnail_url}>
            </img>
        </div>

        <div className="flex justify-between">
            <div className="mr-2">
                <h1 className="text-black text-sm font-semibold">{card.name}</h1>
                <h2 className="text-black text-xs">{card.subtitle}</h2>
            </div>
            
            <div className="flex flex-col text-xs text-right ml-2">
                <span>{card.feature}</span>
                { card.feature === 'Scene' ? 
                    <span>Round {card.round}</span> : 
                    <>
                    <span>{card.type}</span>
                    <span>Level {card.level}</span>
                    </>
                }
            </div>
      </div>
    </div>
    );
}

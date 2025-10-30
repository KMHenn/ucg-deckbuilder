
export default function TcgCard({ card, quantity, onClick }) {
    let classes="absolute bg-black text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center";
    if(card.feature === 'scene'){
        classes += ' bottom-4 right-[-.115rem]'
    }
    else{
        classes += ' bottom-[-.5rem] right-6'
    }
    return (
    <div className="relative" key={card.id} data-id={card.id} onClick={onClick}>
        <div className="flex flex-col items-center align-middle w-34 lg:w-44 h-34 lg:h-44">
            <img alt={card.number} title={card.subtitle} className="m-auto w-auto h-auto max-w-34 lg:max-w-44 max-h-34 lg:max-h-44 hover:cursor-pointer" src={card.thumbnail_url}></img>
        </div>
        {quantity > 0 && (
        <div className={classes}>
          x{quantity}
        </div>
      )}
    </div>
    );
}

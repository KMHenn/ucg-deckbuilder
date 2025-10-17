
export default function TcgCard({ card, onClick }) {
    return (
    <div key={card.id} data-id={card.id} onClick={onClick}>
        <div className="flex flex-col items-center align-middle w-34 lg:w-44 h-34 lg:h-44">
            <img alt={card.number} title={card.subtitle} className="m-auto w-auto h-auto max-w-34 lg:max-w-44 max-h-34 lg:max-h-44 hover:cursor-pointer" src={card.thumbnail_url}></img>
        </div>
    </div>
    );
}

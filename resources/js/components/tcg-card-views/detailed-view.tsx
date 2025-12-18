import Tags from "./tags";

export default function DetailedView({card, quantity = 0, onSetQuantity}){
    // const [draft, setDraft] = useState(quantity ?? 0);

    return (
        <>
        <div className="px-4 flex gap-x-8">
            <div className="flex flex-col gap-y-2">
                <div>
                    <h1 className="text-lg font-bold mx-auto w-fit">{card.formatted_name}</h1>
                    <h2 className="text-sm mx-auto w-fit">{card.number}</h2>
                </div>

                <img className="w-auto h-auto max-w-40 max-h-40 md:max-w-60 md:max-h-60 mx-auto" src={card.thumbnail_url} alt={card.formatted_name + ' image'}/>
            </div>

            <div className="flex flex-col justify-start gap-y-8">
                {card.effect && (
                    <div>
                        <h3 className="font-semibold">Effect</h3>
                    <p>{card.effect}</p>
                    </div>
                )}
                <div>
                    <h3 className="font-semibold">Tags</h3>
                    <Tags tags={card.tags}/>
                </div>
            </div>
        </div>
        </>
    );
}
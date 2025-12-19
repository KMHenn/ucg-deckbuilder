import { Alert } from "@mantine/core";
import Tags from "./tags";
import { IconExclamationCircle } from "@tabler/icons-react";

export default function DetailedView({card}){
    // const [draft, setDraft] = useState(quantity ?? 0);

    return (
        <>
        {card.ascended && (
            <div className="w-full">
                <Alert 
                    title="Ascended Card"
                    color="red"
                    icon={<IconExclamationCircle/>}>
                    This card is no longer legal for official tournaments.
                </Alert>
            </div>
        )}
        <div className="px-4 grid grid-cols-2 gap-x-8">
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
                { card.errata_url && 
                    <div>
                    <h3 className="font-semibold">Errata Posted</h3>
                    <a href={card.errata_url} target="_blank" className="underline hover:text-blue-900">{card.errata_url}</a>
                    </div>
                }
            </div>
        </div>
        </>
    );
}
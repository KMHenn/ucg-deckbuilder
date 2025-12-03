import CardDetailTags from '@/components/tcg-card-views/detail-tags';
import { NumberInput, MultiSelect} from '@mantine/core';

export default function CardTableMobileView({card, quantity}){
    return (
        <div className="flex flex-col w-full bg-[#ffffffeb] shadow-md rounded-md p-2 text-black" key={'mobile-' + card.id} data-id={card.id}>
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
                    <h1 className="text-sm font-semibold">{card.formatted_name}</h1>
                    <h2 className="text-xs">{card.number}</h2>
                </div>
                
                <CardDetailTags details={card.details}/>      
          </div>
          <div>
            <NumberInput 
                aria-label={card.number + ' quantity input'} 
                min="0" 
                value={quantity ? quantity : 0} 
                className="w-20 md:w-24 mx-auto"/>
          </div>
        </div>);
}
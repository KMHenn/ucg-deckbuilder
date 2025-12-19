import { useEffect, useState } from "react";
import CompactView from "../tcg-card-views/compact-view";
import Filters from "../tcg-card-views/filters";
import { api } from "@/lib/api";
import { Pagination } from "@mantine/core";

export default function CardList({deck, openCardModal, setCardQuantity}){
    const recordsPerPage = 12;
    const [cardList, setCardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({});
    const [selectedFilters, setSelectedFilters] = useState({});
    const [totalPages, setTotalPages] = useState(0);

    // Load available filters
    useEffect(() => {
        api.get(`/cards/filters`)
            .then(response => setFilters(response.data.data))
            .catch(console.error);
    }, []);
    
    // Load card list based on filters, page, and per_page
    useEffect(() => {
        let requestUrl = `/cards?page=${currentPage}&per_page=${recordsPerPage}`;
        if (Object.keys(selectedFilters).length > 0) {
          const filterQuery = Object.entries(selectedFilters)
            .map(([key, vals]) =>
              vals.length ? vals.map(v => `${key}[]=${encodeURIComponent(v)}`).join('&') : ''
            )
            .filter(Boolean)
            .join('&');
          requestUrl += '&' + filterQuery;
        }
    
        api.get(requestUrl)
          .then(response => {
            setCardList(response.data.data);
            const total = response.data.meta.total_cards;
            setTotalPages(Math.ceil(total / recordsPerPage));
          })
          .catch(console.error);
    }, [currentPage, selectedFilters]);
    
    // Reset page when filters change
    useEffect(() => setCurrentPage(1), [selectedFilters]);

    return (
            <div className="p-4 gap-y-4 flex flex-col">
                <Filters 
                    filters={filters}
                    selectedFilters={selectedFilters}
                    onChange={setSelectedFilters}/>
                    
                <div className="h-[75vh] grid grid-cols-1 xl:grid-cols-2 gap-2 xl:gap-4 overflow-y-scroll">
                    {cardList.map(card => {
                        return (<CompactView 
                            quantity={deck[card.id]?.quantity ?? 0}
                            onSetQuantity={setCardQuantity}
                            onClick={() => openCardModal(card.id)}
                            card={card} 
                            key={card.id} />);
                    })}
                </div>
                <div className="flex justify-center items-center z-20">
                    <Pagination total={totalPages} siblings={0} onChange={setCurrentPage} />
                </div>
            </div>
    );
}
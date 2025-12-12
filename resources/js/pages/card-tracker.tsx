import BaseLayout from '../layouts/base-layout';
import { useState, useEffect } from 'react';
import { NumberInput, MultiSelect} from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import '@mantine/core/styles/NumberInput.css';
import '@mantine/core/styles/Pagination.css';
import Tags from '@/components/tcg-card-views/tags';
import CardTableMobileView from '@/components/tcg-card-views/card-table-mobile-view';
import CardFilters from '@/components/tcg-card-views/card-filters';

export default function CardTracker({totalCards = 1}) {
    const [cardList, setCardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [filters, setFilters] = useState({});
    const [selectedFilters, setSelectedFilters] = useState({});

    useEffect(() => {
        fetch(`/api/v1/cards/filters`)
            .then(response => response.json())
            .then(json => setFilters(json.data))
            .catch(error => console.error(error));
    }, []);
        
    useEffect(() => {
        let cardListRequest = `/api/v1/cards?page=${currentPage}&per_page=${recordsPerPage}`;
        if(Object.keys(selectedFilters).length > 0){
          const filterQuery = Object.entries(selectedFilters)
            .map(([key, vals]) =>
                vals.length
                  ? vals.map((v) => `${key}[]=${encodeURIComponent(v)}`).join("&")
                  : ""
            )
            .filter(Boolean)
            .join('&');

          cardListRequest = cardListRequest + '&' + filterQuery;
        }

        // @TODO totalCards broken after filtering- not updating
        fetch(`${cardListRequest}`)
            .then(response => response.json())
            .then(dataCollection => setCardList(dataCollection.data))
            .then()
            .catch(error => console.error(error));
    }, [currentPage, recordsPerPage, selectedFilters]);
  
    
    return (
        <BaseLayout>
          <div className="h-full w-full grow flex gap-2">
            <div className="flex flex-col grow-0 w-[15vw]">
              <CardFilters
                filters={filters}
                selectedFilters={selectedFilters}
                onChange={setSelectedFilters}/>
            </div>
            
            <DataTable
              page={currentPage}
              height={'85vh'}
              onPageChange={setCurrentPage}
              totalRecords={totalCards}
              recordsPerPage={recordsPerPage}
              recordsPerPageOptions={[10, 25, 50]}
              onRecordsPerPageChange={setRecordsPerPage}
              withTableBorder
              borderRadius="sm"
              withColumnBorders
              striped
              records={cardList}
              columns={[
                {
                  accessor: 'mobile',
                  title:'',
                  visibleMediaQuery: (theme) => `(max-width: ${theme.breakpoints.sm})`,
                  render: (record) => <CardTableMobileView card={record} quantity="0"/>
                },
                {
                  accessor: 'number',
                  visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.md})`,
                  width: '15vw',
                },
                {
                  accessor: 'thumbnail_url',
                  width: '6vw',
                  title: 'Preview',
                  visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.md})`,
                  render: ({thumbnail_url, number}) => (
                    <img className="mx-auto w-auto h-auto max-w-[4vw] max-h-[4vw]" src={thumbnail_url} alt={number + ' thumbnail'}/>
                  )
                },
                { 
                  accessor: 'formatted_name',
                  title: 'Name',
                  width: '20vw',
                  visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.md})`,
                },
                {
                  accessor: 'tags',
                  title: 'Tags',
                  visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.md})`,
                  render: ({tags}) => (
                    <Tags tags={tags}/>        
                  )
                },
                {
                  accessor: 'qty',
                  title: 'Quantity',
                  width: '10vw',
                  visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.md})`,
                  render: ({qty, number}) => (
                    <NumberInput 
                      aria-label={number + ' quantity input'} 
                      min="0" 
                      value={qty ? qty : 0} 
                      className="w-20 md:w-24 mx-auto"/>
                  )
                }
              ]}
            />
          </div>
        </BaseLayout>
    );
}

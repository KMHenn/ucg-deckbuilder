import BaseLayout from '../layouts/base-layout';
import { useState, useEffect } from 'react';
import { NumberInput, MultiSelect} from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import '@mantine/core/styles/NumberInput.css';
import '@mantine/core/styles/Pagination.css';
import CardDetailTags from '@/components/tcg-card-views/detail-tags';
import CardTableMobileView from '@/components/tcg-card-views/card-table-mobile-view';
import CardFilters from '@/components/tcg-card-views/card-filters';

export default function CardTracker({totalCards = 1}) {
    const [cardList, setCardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [filters, setFilters] = useState({});
    const [selectedFilters, setSelectedFilters] = useState({});

    useEffect(() => {
        fetch(`/api/cards/filters`)
            .then(response => response.json())
            .then(json => setFilters(json.data))
            .catch(error => console.error(error));
    }, []);
        
    useEffect(() => {
        const filterQuery = Object.entries(selectedFilters)
          .map(([key, vals]) => vals.length ? `${key}=${vals.join(',')}` : '')
          .filter(Boolean)
          .join('&');

        // @TODO totalCards broken after filtering- not updating
        fetch(`/api/cards?page=${currentPage}&per_page=${recordsPerPage}&format=table&${filterQuery}`)
            .then(response => response.json())
            .then(dataCollection => setCardList(dataCollection.data))
            .then()
            .catch(error => console.error(error));
    }, [currentPage, recordsPerPage, selectedFilters]);
  
    
    return (
        <BaseLayout>
          <div className="h-full">
            <div>
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
                  width: '10vw',
                  title: 'Preview',
                  visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.md})`,
                  render: ({thumbnail_url, number}) => (
                    <img className="mx-auto w-auto h-auto max-w-[8vw] max-h-[8vw]" src={thumbnail_url} alt={number + ' thumbnail'}/>
                  )
                },
                { 
                  accessor: 'formatted_name',
                  title: 'Name',
                  width: '20vw',
                  visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.md})`,
                },
                {
                  accessor: 'details',
                  title: 'Tags',
                  visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.md})`,
                  render: ({details}) => (
                    <CardDetailTags details={details}/>        
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

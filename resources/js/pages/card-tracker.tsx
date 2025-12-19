import BaseLayout from '../layouts/base-layout';
import { useState, useEffect } from 'react';
import { NumberInput, Alert} from '@mantine/core';
import {IconInfoCircle} from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import '@mantine/core/styles/NumberInput.css';
import '@mantine/core/styles/Pagination.css';
import Tags from '@/components/tcg-card-views/tags';
import Filters from '@/components/tcg-card-views/filters';
import { useAuth } from '../auth/auth-context';
import { api } from '@/lib/api';

export default function CardTracker() {
    const { user } = useAuth();
    const [cardList, setCardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [filters, setFilters] = useState({});
    const [selectedFilters, setSelectedFilters] = useState({});
    const [totalCards, setTotalCards] = useState(0);

    // Load filters
    useEffect(() => {
        api.get(`/cards/filters`)
            .then(response => {
              setFilters(response.data.data)})
            .catch(error => console.error(error));
    }, []);
        
    // Get card listing
    useEffect(() => {
        let cardListRequest = `/cards?page=${currentPage}&per_page=${recordsPerPage}`;
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

        api.get(`${cardListRequest}`)
            .then(response => {
              setCardList(response.data.data);
              setTotalCards(response.data.meta.total_cards);
            })
            .catch(error => console.error(error));
    }, [currentPage, recordsPerPage, selectedFilters]);

    // Reset current page after making changes to query that impact total pages
    useEffect(() => {
      setCurrentPage(1);
    }, [selectedFilters, recordsPerPage]);
    
    return (
        <BaseLayout>
          <div className="h-full w-full grow flex flex-col gap-2">
            <div className="flex w-full">
              <Filters
                filters={filters}
                selectedFilters={selectedFilters}
                onChange={setSelectedFilters}/>
            </div>
            {!user &&
            <Alert 
              variant='light' 
              color='blue'
              icon={<IconInfoCircle/>}> Log in or create an account to track your cards!</Alert> 
            }
            <DataTable
              page={currentPage}
              height={'75vh'}
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
                // { @TODO mobile view
                //   accessor: 'mobile',
                //   title:'',
                //   //visibleMediaQuery: (theme) => `(max-width: ${theme.breakpoints.sm})`,
                //   render: (record) => <CardTableMobileView card={record} quantity="0"/>
                // },
                {
                  accessor: 'number',
                  //visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.md})`,
                  width: '15vw',
                },
                {
                  accessor: 'thumbnail_url',
                  width: '6vw',
                  title: 'Preview',
                  //visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.md})`,
                  render: ({thumbnail_url, number}) => (
                    <img className="mx-auto w-auto h-auto max-w-[4vw] max-h-[4vw]" src={thumbnail_url} alt={number + ' thumbnail'}/>
                  )
                },
                { 
                  accessor: 'formatted_name',
                  title: 'Name',
                  width: '20vw',
                  //visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.md})`,
                },
                {
                  accessor: 'tags',
                  title: 'Tags',
                  //visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.md})`,
                  render: ({tags}) => (
                    <Tags tags={tags}/>        
                  )
                },
                {
                  accessor: 'quantity',
                  title: 'Quantity',
                  width: '10vw',
                  //visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.md})`,
                  render: ({ quantity, id, number }) => {
                      const [localQty, setLocalQty] = useState(quantity ?? 0);

                      const handleBlur = () => {
                        if (!user){
                          // Can't store quantity without associated user
                          return;
                        }

                        api.post(`/cards/${id}/quantity`, { quantity: localQty })
                          .then(() => console.log(`Card ${id} quantity updated to ${localQty}`))
                          .catch((err) => console.error(`Failed to update card ${id}`, err));
                      };

                      // @TODO values don't clear on refresh when logging out
                      return (
                        <NumberInput
                          aria-label={number + ' quantity input'}
                          min={0}
                          disabled={!user}
                          value={localQty}
                          onChange={(val) => setLocalQty(val ?? 0)}
                          onBlur={handleBlur}
                          className="w-20 md:w-24 mx-auto"
                        />
                      );
                    },
                }
              ]}
            />
          </div>
        </BaseLayout>
    );
}

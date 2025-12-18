import { useState, useEffect } from 'react';
import { NumberInput } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import Tags from './tags';
import Filters from './filters';
import { api } from '@/lib/api';
import { useAuth } from '../../auth/auth-context';

export default function CardTable() {
  const { user } = useAuth();
  const [cardList, setCardList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [filters, setFilters] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});
  const [totalCards, setTotalCards] = useState(0);

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
        setTotalCards(response.data.meta.total_cards);
      })
      .catch(console.error);
  }, [currentPage, recordsPerPage, selectedFilters]);

  // Reset page when filters or page size change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters, recordsPerPage]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <Filters
        filters={filters}
        selectedFilters={selectedFilters}
        onChange={setSelectedFilters}
      />

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
          // {
          //   accessor: 'mobile',
          //   title:'',
          //   visibleMediaQuery: (theme) => `(max-width: ${theme.breakpoints.sm})`,
          //   render: (record) => <CompactDisplay card={record}/>
          // },
          {
            accessor: 'number',
            // visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.md})`,
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
            // visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.md})`,
          },
          {
            accessor: 'tags',
            title: 'Tags',
            // visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.md})`,
            render: ({tags}) => (
              <Tags tags={tags}/>        
            )
          },
          {
            accessor: 'quantity',
            title: 'Quantity',
            width: '10vw',
            // visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.md})`,
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

                return (
                  <NumberInput
                    aria-label={`${number} quantity input`}
                    min={0}
                    disabled={!user}
                    value={localQty}
                    onChange={val => setLocalQty(val ?? 0)}
                    onBlur={handleBlur}
                    className="w-20 md:w-24 mx-auto"
                  />
                );
              },
           },
          ]}
        />
  </div>
  );
}
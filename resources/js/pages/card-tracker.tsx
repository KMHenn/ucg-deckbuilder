import BaseLayout from '../layouts/base-layout';
import { useState, useEffect } from 'react';
import { NumberInput, MultiSelect} from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import '@mantine/core/styles/NumberInput.css';
import '@mantine/core/styles/Pagination.css';

export default function CardTracker({totalCards = 1, filters = []}) {
    const [cardList, setCardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);

    const [selectedRarities, setSelectedRarities] = useState([]);
    const [selectedFeatures, setSelectedFeatures] = useState([]);
        
    useEffect(() => {
        fetch(`/api/cards?page=${currentPage}&per_page=${recordsPerPage}&format=table&rarities=${selectedRarities}`)
            .then(response => response.json())
            .then(dataCollection => setCardList(dataCollection.data))
            .catch(error => console.error(error));
    }, [currentPage, recordsPerPage, selectedRarities]);
    
    return (
        <BaseLayout>
          <div className="h-full">
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
                  accessor: 'number',
                },
                {
                  accessor: 'thumbnail_url',
                  title: 'Preview',
                  render: ({thumbnail_url, number}) => (
                    <img className="w-auto h-auto max-w-24 max-h-24" src={thumbnail_url} alt={number + ' thumbnail'}/>
                  )
                },
                { 
                  accessor: 'formatted_name',
                  title: 'Name' 
                },
                {
                  accessor: 'feature',
                  filter: (
                    <MultiSelect
                      label="Feature"
                      data={filters.feature}
                      value={selectedFeatures}
                      onChange={setSelectedFeatures}
                      clearable
                    />
                  )
                },
                {
                  accessor: 'rarity',
                  filter: (
                    <MultiSelect
                      label="Rarity"
                      data={filters.rarity}
                      value={selectedRarities}
                      onChange={setSelectedRarities}
                      clearable
                      searchable
                    />
                  )
                },
                {
                  accessor: 'type'
                },
                {
                  accessor: 'round',
                },
                {
                  accessor: 'level'
                },
                // {
                //   accessor: 'details',
                //   title: 'Tags',
                //   render: ({details}) => (
                //     <div className="flex gap-2 w-auto">
                //       {Object.entries(details).map(([label, value]) => (
                //           <div className="tcg-card-display-tag">
                //             <div className="text-xs opacity-50">{label}</div>
                //             <div>{value}</div>
                //           </div>
                //       ))}
                //       </div>
                //   )
                // },
                {
                  accessor: 'qty',
                  title: 'Quantity',
                  render: ({qty, number}) => (
                    <NumberInput aria-label={number + ' quantity input'} min="0" value={qty ? qty : 0} className="w-20 md:w-24"/>
                  )
                }
              ]}
    />
          </div>
        </BaseLayout>
    );
}

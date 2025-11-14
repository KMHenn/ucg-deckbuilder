import BaseLayout from '../layouts/base-layout';
import { useState, useEffect } from 'react';
import { NumberInput} from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import '@mantine/core/styles/NumberInput.css';
import '@mantine/core/styles/Pagination.css';

export default function CardTracker({totalCards = 1}) {
    const [cardList, setCardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);

    /* @TODO need to handle reloading cards on page OR rpp change */
        
    useEffect(() => {
        fetch(`/api/cards?page=${currentPage}&per_page=${recordsPerPage}&format=table`)
            .then(response => response.json())
            .then(dataCollection => setCardList(dataCollection.data))
            .catch(error => console.error(error));
    }, [currentPage]);
    

    return (
        <BaseLayout>
          <div className="h-full">
            <DataTable
              page={currentPage}
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
                    <img className="w-auto h-auto max-w-20 max-h-20" src={thumbnail_url} alt={number + ' thumbnail'}/>
                  )
                },
                { 
                  accessor: 'formatted_name',
                  title: 'Name' 
                },
                {
                  accessor: 'details',
                  title: 'Tags',
                  render: ({details}) => (
                    <div className="flex gap-2">
                      {details.map((detail) => (
                          <div className="tcg-card-display-tag">{detail}</div>
                      ))}
                      </div>
                  )
                },
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

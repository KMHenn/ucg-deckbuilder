import BaseLayout from '../layouts/base-layout';
import { useState, useEffect } from 'react';
import { Pagination, Table } from '@mantine/core';
import { NumberInput, Select } from '@mantine/core';
import '@mantine/core/styles/NumberInput.css';
import '@mantine/core/styles/Pagination.css';

export default function CardTracker({totalPages = 1}) {
    const [cardList, setCardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
        
    useEffect(() => {
        fetch(`/api/cards?page=${currentPage }&per_page=${rowsPerPage}`)
            .then(response => response.json())
            .then(dataCollection => setCardList(dataCollection.data))
            .catch(error => console.error(error));
    }, [currentPage]);
    

    return (
        <BaseLayout>
          <div className="h-full">
            <Table.ScrollContainer minWidth={500} maxHeight={"80vh"} type="native" className="shadow-md">
              <Table stickyHeader>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Preview</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Rarity</Table.Th>
                    <Table.Th>Number</Table.Th>
                    <Table.Th>Tags</Table.Th>
                    <Table.Th>Qty</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {cardList.map((card) => (
                    <Table.Tr key={card.number}>
                      <Table.Td>
                        <img className="w-auto h-auto max-w-20 max-h-20" src={card.thumbnail_url} alt={card.number}/>
                      </Table.Td>
                      <Table.Td className="w-fit">{card.formatted_name}</Table.Td>
                      <Table.Td className="w-fit">{card.rarity}</Table.Td>
                      <Table.Td className="w-fit">{card.number}</Table.Td>
                      <Table.Td className="w-fit">
                        <div className="h-full flex gap-2">
                          {card.details.map((detail) => (
                            <div className="tcg-card-display-tag">{detail}</div>
                          ))}
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <NumberInput aria-label={card.number + " quantity"} min="0" className="w-24"/>
                        </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
            <div className="flex justify-between w-[50vw] mx-auto mt-6">
              <Pagination onChange={setCurrentPage} total={totalPages} siblings={2} withEdges className="w-fit mx-auto"/>
            </div>
          </div>
        </BaseLayout>
    );
}

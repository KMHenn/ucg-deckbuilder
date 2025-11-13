import BaseLayout from '../layouts/base-layout';
import { useState, useEffect } from 'react';
import { Table } from '@mantine/core';
import { NumberInput } from '@mantine/core';

// interface TablePaginationActionsProps {
//   count: number;
//   page: number;
//   rowsPerPage: number;
//   onPageChange: (
//     event: React.MouseEvent<HTMLButtonElement>,
//     newPage: number,
//   ) => void;
// }

// function TablePaginationActions(props: TablePaginationActionsProps) {
//   const { count, page, rowsPerPage, onPageChange } = props;

//   const handleFirstPageButtonClick = (
//     event: React.MouseEvent<HTMLButtonElement>,
// ) => {
//     onPageChange(event, 1);
//   };

//   const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//     onPageChange(event, page - 1);
//   };

//   const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//     onPageChange(event, page + 1);
//   };

//   const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//     onPageChange(event, Math.max(1, Math.ceil(count / rowsPerPage) - 1));
//   };

//   return (
//     <Box sx={{ flexShrink: 0, ml: 2.5 }}>
//       <IconButton
//         onClick={handleFirstPageButtonClick}
//         disabled={page === 0}
//         aria-label="first page"
//       >
//         {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
//       </IconButton>
//       <IconButton
//         onClick={handleBackButtonClick}
//         disabled={page === 0}
//         aria-label="previous page"
//       >
//         {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
//       </IconButton>
//       <IconButton
//         onClick={handleNextButtonClick}
//         disabled={page >= Math.ceil(count / rowsPerPage) - 1}
//         aria-label="next page"
//       >
//         {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
//       </IconButton>
//       <IconButton
//         onClick={handleLastPageButtonClick}
//         disabled={page >= Math.ceil(count / rowsPerPage) - 1}
//         aria-label="last page"
//       >
//         {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
//       </IconButton>
//     </Box>
//   );
// }

export default function CardTracker({totalCards = 1}) {
    const [cardList, setCardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setCurrentPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(0);
    };
        
    useEffect(() => {
        fetch(`/api/cards?page=${currentPage + 1}&per_page=${rowsPerPage}`)
            .then(response => response.json())
            .then(dataCollection => setCardList(dataCollection.data))
            .catch(error => console.error(error));
    }, [currentPage]);
    

    return (
        <BaseLayout>
          <div>
              <h1>Card Tracker</h1>
                  <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Preview</Table.Th>
                      <Table.Th>Name</Table.Th>
                      <Table.Th>Number</Table.Th>
                      <Table.Th>Feature</Table.Th>
                      <Table.Th>Qty</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {cardList.map((card) => (
                      <Table.Tr key={card.number}>
                        <Table.Td><img className="w-auto h-auto max-w-30 max-h-30" src={card.thumbnail_url} alt={card.number}/></Table.Td>
                        <Table.Td>{card.name}</Table.Td>
                        <Table.Td>{card.number}</Table.Td>
                        <Table.Td>{card.feature}</Table.Td>
                        <Table.Td><NumberInput label="Qty" min="0"/></Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
          </div>
        </BaseLayout>
    );
}

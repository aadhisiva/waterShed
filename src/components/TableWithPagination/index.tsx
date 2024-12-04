import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import ViewListIcon from '@mui/icons-material/ViewList';

import { EnhancedTableHead } from './Header';
import { EnhancedTableToolbar } from './Toolbar';
import { debounce } from '../../utils/resuableFunc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number,
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface EnhancedTableDataProps {
  handleClickModify: any;
  rows: any;
  originalData?: any;
  headCells: any;
  setCopyTableData: any;
  title?: string;
  page: number | any;
  setPage?: any;
  rowsPerPage?: number | any;
  setRowsPerPage?: any;
  totalCount: number;
  isButtonType?: string;
};

const debounceDelay = 500;
export default function TableWithPagination({
  handleClickModify,
  rows,
  originalData,
  headCells,
  setCopyTableData,
  title,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  totalCount,
  isButtonType
}: EnhancedTableDataProps) {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState('');
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [dense, setDense] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: any,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - totalCount) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        0 ,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, rows, totalCount],
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    setSearchValue(value);
    const timeoutId = setTimeout(() => {
      // Perform the filter operation when the search term is updated
      if (value.trim() === '') {
        setCopyTableData(originalData); // If no search term, show all data
      } else {
        const filtered = (rows || []).filter((item: Record<string, any>) => {
              return headCells.some((headCell: any) =>
                item[headCell.id]
                  ?.toString()
                  .toLowerCase()
                  .includes(value.toLowerCase()),
              );
            });
        setCopyTableData(filtered);
      }
    }, debounceDelay);
  
    // Cleanup timeout on every change
    return () => clearTimeout(timeoutId);
  };

  return (
    <Box
      sx={{
        width: '100%'
      }}
    >
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          handleSearch={handleSearch}
          searchValue={searchValue}
          title={title}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'small'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={headCells}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={index}
                    sx={{ cursor: 'pointer' }}
                  >
                    {headCells.map((headCell: any, index: string) => {
                      if (headCell.id == 'Action') {
                        return (
                          <TableCell
                            align="center"
                            key={labelId + '' + index}
                            onClick={() => handleClickModify(row)}
                          >
                            <Tooltip title={isButtonType !== "Edit" ? isButtonType : "Edit"}>
                              <IconButton>
                                {isButtonType !== "Edit" ? 
                                <ViewListIcon
                                  color="primary"
                                  sx={{ fontSize: 15 }}
                                />
                                :
                                <EditIcon
                                  color="primary"
                                  sx={{ fontSize: 15 }}
                                />
                        }
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell
                          component="th"
                          id={labelId + '' + index}
                          scope="row"
                          padding="none"
                          align="center"
                          key={row[headCell.id] + '' + index}
                        >
                          {row[headCell.id]}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
              {/* {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 13 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

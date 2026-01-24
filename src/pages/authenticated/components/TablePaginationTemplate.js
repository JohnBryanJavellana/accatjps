import { TablePagination } from '@mui/material';

const TablePaginationTemplate = ({ dataset, rowsPerPage = 12, page = 0, rowsPerPageOptions = [12, 24, 36, 60], labelRowsPerPage, callbackFunction }) => {
    const handleChangePage = (_, newPage) => {
        callbackFunction({
            rows: rowsPerPage,
            page: newPage
        });
    };

    const handleChangeRowsPerPage = (event) => {
        callbackFunction({
            rows: event.target.value,
            page: 0
        });
    };

    return (
        <>
            <TablePagination
                component="div"
                count={dataset.length}
                page={page}
                sx={{
                    '& .MuiTablePagination-displayedRows': {
                        display: 'flex',
                        alignItems: 'center',
                        margin: '0 0px', 
                        userSelect: 'none'
                    },
                    '& .MuiTablePagination-toolbar': {
                        display: 'flex',
                        alignItems: 'center',
                    },
                    '& .MuiTablePagination-selectLabel': {
                        display: 'flex',
                        alignItems: 'center',
                        paddingTop: '12px !important',
                        marginTop: '0px !important'
                    },
                    '& .MuiTablePagination-select': {
                        marginRight: '10px'
                    }
                }}
                className='text-muted small'
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={rowsPerPageOptions}
                labelRowsPerPage={labelRowsPerPage}
            />
        </>
    )
}

export default TablePaginationTemplate;
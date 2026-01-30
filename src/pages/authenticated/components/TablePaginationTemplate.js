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
                    '& .MuiTablePagination-toolbar': {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '52px',
                    },
                    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                        margin: 0,
                        alignSelf: 'center',
                        display: 'flex',
                        alignItems: 'center',
                    },
                    '& .MuiTablePagination-actions': {
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '8px',
                    },
                    '& .MuiTablePagination-select': {
                        display: 'flex',
                        alignItems: 'center',
                        paddingTop: 0,
                        paddingBottom: 0,
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
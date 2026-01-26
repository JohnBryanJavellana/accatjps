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
                        flexWrap: { xs: 'wrap', sm: 'nowrap' },
                        justifyContent: { xs: 'center', sm: 'flex-end' },
                        height: { xs: 'auto', sm: '52px' },
                        padding: { xs: '10px 0', sm: '0 16px' },
                    },
                    '& .MuiTablePagination-selectLabel': {
                        display: 'flex',
                        alignItems: 'center',
                        paddingTop: '12px !important',
                        margin: { xs: '0 4px', sm: '0 8px' }
                    },
                    '& .MuiTablePagination-displayedRows': {
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: { xs: '8px', sm: '0px' },
                        userSelect: 'none'
                    },
                    '& .MuiTablePagination-actions': {
                        marginLeft: { xs: '0px', sm: '20px' }
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
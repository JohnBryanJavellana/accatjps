import { Checkbox, FormControl, InputLabel, OutlinedInput, Tooltip } from '@mui/material';
import { useState, useMemo, useCallback, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import './CustomDataTable.css';

const CustomDataTable = ({
    columns = [],
    progressPending = false,
    data = [],
    onRowClick,
    selectableRows = false,
    isRowDisabled = false,
    onSelectedRowsChange,
    selectedRows = [],
    conditionalStyle = [],
    isDense = false,
    isSingleChoose = false,
    textToSearch = '',
    isRowsExpandable = false,
    expandedComponent = () => <></>
}) => {
    const [searchText, setSearchText] = useState('');

    const customStyles = {
        headCells: { style: { fontWeight: 'bold' } }
    };

    const defaultConditionalStyles = [
        {
            when: (row) => row.id > 0,
            style: (row) => {
                return {
                    // opacity: 0,
                    // '--row-animation-delay': `${row.index * 0.2}s`,
                };
            },
        },
    ];

    const safeSelectedRows = Array.isArray(selectedRows) ? selectedRows.map(Number) : [];
    const handleSearch = (value) => setSearchText(String(value || '').toLowerCase());

    const filteredData = useMemo(() => {
        const q = (searchText || '').toLowerCase();
        return data.filter(item => {
            const parts = columns
                .filter(col => typeof col.selector === 'function')
                .map(col => {
                    try { return String(col.selector(item) || '') } catch { return '' }
                });

            if (parts.length === 0) {
                const { profile_picture, ...rest } = item || {};
                parts.push(JSON.stringify(rest || {}));
            }

            return parts.join(' ').toLowerCase().includes(q);
        });
    }, [data, columns, searchText]);

    const handleRowSelected = useCallback(({ selectedRows: currentSelectedRows = [] }) => {
        const eventIds = Array.isArray(currentSelectedRows) ? currentSelectedRows.map(r => Number(r.id)) : [];
        const prevIds = safeSelectedRows.slice(); // copy
        const visibleIds = filteredData.map(r => Number(r.id));
        const additions = eventIds.filter(id => !prevIds.includes(id));
        const removals = prevIds.filter(id => visibleIds.includes(id) && !eventIds.includes(id));

        let next = prevIds.filter(id => !removals.includes(id)).concat(additions);
        next = Array.from(new Set(next));

        const prevJson = JSON.stringify(prevIds);
        const nextJson = JSON.stringify(next);
        if (typeof onSelectedRowsChange === 'function' && prevJson !== nextJson) {
            onSelectedRowsChange(next);
        }
    }, [filteredData, safeSelectedRows, onSelectedRowsChange]);

    useEffect(() => {
        if (textToSearch) {
            setSearchText(textToSearch);
        }
    }, [textToSearch]);

    const mergedConditionalStyles = [...defaultConditionalStyles, ...conditionalStyle];

    return (
        <>
            <div className='row'>
                <div className={`col-12`}>
                    <FormControl fullWidth size='small' margin='dense' variant="outlined">
                        <InputLabel htmlFor="CustomDataTableSearch">Search</InputLabel>
                        <OutlinedInput
                            value={searchText}
                            onChange={(e) => handleSearch(e.target.value)}
                            id="CustomDataTableSearch"
                            type="text"
                            label={<p>Search</p>}
                        />
                    </FormControl>
                </div>
            </div>

            <DataTable
                keyField='key'
                customStyles={customStyles}
                progressPending={progressPending}
                columns={columns}
                data={filteredData}
                pagination
                onRows
                onRowClicked={onRowClick}
                dense={isDense}
                highlightOnHover
                selectableRowsHighlight
                selectableRowsSingle={isSingleChoose}
                selectableRowsComponent={Checkbox}
                selectableRowDisabled={isRowDisabled}
                selectableRows={selectableRows}
                onSelectedRowsChange={handleRowSelected}
                selectableRowSelected={(row) => safeSelectedRows.includes(Number(row.id))}
                conditionalRowStyles={mergedConditionalStyles}
                expandableRows={isRowsExpandable}
                expandableRowsComponent={expandedComponent}
            />
        </>
    );
};

export default CustomDataTable;

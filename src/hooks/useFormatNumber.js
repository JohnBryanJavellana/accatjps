import React from 'react'

const useFormatNumber = () => {
    const FormatNumber = (number) => {
        return Number(number).toLocaleString('en-US', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        });
    }

    return { FormatNumber };
}

export default useFormatNumber;
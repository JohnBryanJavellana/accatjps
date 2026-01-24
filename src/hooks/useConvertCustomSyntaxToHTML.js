import dayjs from 'dayjs';
import React from 'react'

const useConvertCustomSyntaxToHTML = () => {
    const convertText = (data) => {
        const text = data
            .replace(/{br}/g, '<br/>')
            .replace(/{b}/g, '<b>').replace(/{-b}/g, '</b>')
            .replace(/{month}/g, dayjs().format('MMMM'));

        return text;
    }

    return { convertText };
}

export default useConvertCustomSyntaxToHTML;
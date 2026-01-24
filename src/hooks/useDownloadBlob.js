import React from 'react'

const useDownloadBlob = () => {
    const Generate = (data, type, filename) => {
        const file = new Blob([data], { type: type });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank');

        const link = document.createElement('a');
        link.href = fileURL;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(fileURL);
    }

    return { Generate };
}

export default useDownloadBlob;
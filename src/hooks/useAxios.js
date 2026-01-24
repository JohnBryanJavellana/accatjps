import React from 'react'

const useAxios = () => {
    const AxiosEngine = (url) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            file ? reader.readAsDataURL(file) : reject(new Error("No file provided."));
        });
    };

    return (
        <div>useAxios</div>
    )
}

export default useAxios
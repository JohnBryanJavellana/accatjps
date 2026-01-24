const usePhotoToBase64 = () => {
    const GenerateBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            file && reader.readAsDataURL(file);
        });
    };

    return { GenerateBase64 };
}

export default usePhotoToBase64;
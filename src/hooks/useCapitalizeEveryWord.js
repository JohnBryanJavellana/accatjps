import React from 'react'

const useCapitalizeEveryWord = () => {
    const CapitalizeEveryWord = (sentences) => {
        const words = sentences.split(" ");
        const capitalizedWords = words.map(word => {
            if (word.length === 0) return "";
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });

        return capitalizedWords.join(" ");
    }
    
    return { CapitalizeEveryWord };
}

export default useCapitalizeEveryWord;
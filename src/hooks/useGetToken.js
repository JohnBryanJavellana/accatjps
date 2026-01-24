const useGetToken = () => {
    const setToken = (tokenName, token) => localStorage.setItem(tokenName, token);
    const getToken = (tokenName) => localStorage.getItem(tokenName);
    const removeToken = (tokenName) => localStorage.removeItem(tokenName);
    
    return { setToken, getToken, removeToken };
}

export default useGetToken;

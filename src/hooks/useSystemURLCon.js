const useSystemURLCon = () => {
    // Use the domain name and https
    const url = "https://127.0.0.1:8000/api";
    const urlWithoutToken = "https://127.0.0.1:8000";

    return { url, urlWithoutToken };
}

export default useSystemURLCon;

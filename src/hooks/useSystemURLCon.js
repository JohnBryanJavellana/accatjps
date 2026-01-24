const useSystemURLCon = () => {
    const url = "http://127.0.0.1:8000/api";
    const urlWithoutToken = "http://127.0.0.1:8000";

    return { url, urlWithoutToken };
}

export default useSystemURLCon;
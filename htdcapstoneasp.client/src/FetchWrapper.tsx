import { useNavigate } from "react-router-dom";

function FetchWrapper(
    requestURL: RequestInfo,
    requestInit: RequestInit
) : Promise<any> {
    // const navigate = useNavigate();

    const token = localStorage.getItem("jwtToken");
    const headers : Record<string, string> = {
        ...requestInit.headers as Record<string, string>,
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
    requestInit.headers = headers;

    return fetch(requestURL, requestInit)
        .then(response => {
            if (response.status === 401) {
                // navigate("/");
                window.location.href = "/";
                localStorage.clear();
                return Promise.reject("Your credentials have expired. Please login again.");
            }
            return response;
        })
        .catch(error => {
            console.log("Unexpected errors occurred: ", error);
            return Promise.reject(error);
        })
}

export default FetchWrapper;
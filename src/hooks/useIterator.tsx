/**
 * Custom hook to manage user iteration from a paginated API endpoint.
 *
 * @param {iteratorProps} props - The properties for the iterator.
 * @param {string} props.endpoint - The API endpoint to fetch users from.
 *
 * @returns {iteratorHook} - The iterator hook containing the current user index, user list, loading state, and navigation functions.
 * @returns {number} iteratorHook.current - The current index of the user in the user list.
 * @returns {Array<User>} iteratorHook.userList - The list of users fetched from the API.
 * @returns {boolean} iteratorHook.loading - The loading state indicating if the data is being fetched.
 * @returns {() => void} iteratorHook.next - Function to move to the next user in the list.
 * @returns {() => void} iteratorHook.prev - Function to move to the previous user in the list.
 *
 * @typedef {Object} User - The user object.
 * @property {Object} name - The name of the user.
 * @property {string} name.title - The title of the user.
 * @property {string} name.first - The first name of the user.
 * @property {string} name.last - The last name of the user.
 * @property {string} email - The email of the user.
 * @property {Object} picture - The picture object containing URLs of the user's pictures.
 * @property {string} picture.large - The URL of the large picture.
 * @property {string} picture.medium - The URL of the medium picture.
 * @property {string} picture.thumbnail - The URL of the thumbnail picture.
 *
 * @typedef {Object} QueryParams - The query parameters for the API request.
 * @property {number} page - The page number to fetch.
 * @property {number} results - The number of results per page.
 *
 * @typedef {Object} UsersResponse - The response object from the API.
 * @property {Array<User>} results - The list of users in the response.
 * @property {Object} info - The information object containing metadata about the response.
 * @property {number} info.page - The current page number in the response.
 */
import React from "react";

interface iteratorProps {
    endpoint: string,
};

interface iteratorHook {
    current: number,
    userList: Array<User>,
    loading: boolean,
    next: () => void,
    prev: () => void,
}

type User = {
    name: {
        title: string,
        first: string,
        last: string,
    },
    email: string,
    picture: {
        large: string,
        medium: string,
        thumbnail: string,
    }
}

interface QueryParams {
    page: number,
    results: number,
}

interface UsersResponse {
    results: Array<User>,
    info: {
        page: number,
    }
}

type buildUrlWithParams = (baseUrl: string, params: QueryParams) => string;
const buildUrl: buildUrlWithParams = (baseUrl, params) => {
    const url = new URL(baseUrl);
    (Object.keys(params) as (keyof QueryParams)[]).forEach(key => url.searchParams.append(key, params[key].toString()));
    return url.toString();
};

type useIteratorHook = (props: iteratorProps) => iteratorHook;
const useIterator: useIteratorHook = ({endpoint}) => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [userList, setUserList] = React.useState<User[]>([]);
    const [current, setCurrent] = React.useState<number>(-1);
    const [page, setPage] = React.useState<number>(1);
    const [response, setResponse] = React.useState<UsersResponse>();

    React.useEffect(() => {
        const fetchUsers = async(): Promise<void> => {
            setLoading(true);
            try {
                const params: QueryParams = {
                    page,
                    results: 5,
                };
                const fetchUrl: string = buildUrl(endpoint, params);
                const response: Response = await fetch(fetchUrl);
                const data: UsersResponse = await response.json();
                setResponse(() => data);
                setUserList(prevUserList => {
                    return [...prevUserList, ...data.results];
                });
                setCurrent(prevCurrent => prevCurrent + 1);
            } catch(error: unknown) {
            if(error instanceof Error) {
                console.error("error fetching users: ", error.message);
            } else {
                console.error("Unexpected error:", error);
            }

            } finally {
                setLoading(false);
            }
        };
        if(response?.info?.page !== page) {
            fetchUsers();
        }
    }, [page, endpoint, response?.info?.page]);

    const next = React.useCallback(() => {
        setCurrent(prevCurrent => {
        if (prevCurrent + 1 < userList.length) {
            return prevCurrent + 1;
        } else {
            setPage(previousPage => previousPage + 1);
            return prevCurrent;
        }
        });
    }, [userList.length]);

    const prev = React.useCallback(() => {
        setCurrent(prevCurrent => Math.max(prevCurrent - 1, 0));
    }, []);

    return ({
        loading,
        userList,
        current,
        next,
        prev,
    });
};

export default useIterator;
export type {iteratorHook};
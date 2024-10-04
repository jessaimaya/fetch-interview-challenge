/**
 * App component that fetches and displays user data from a given API.
 *
 * @component
 * @example
 * return (
 *   <App />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @typedef {Object} AppProps
 *
 * @property {string} apiUrl - The URL of the API to fetch user data from.
 *
 * @typedef {Object} iteratorHook
 * @property {number} current - The index of the current user in the userList.
 * @property {Function} prev - Function to navigate to the previous user.
 * @property {Function} next - Function to navigate to the next user.
 * @property {boolean} loading - Indicates if the data is currently being loaded.
 * @property {Array} userList - The list of users fetched from the API.
 *
 * @hook useIterator
 * @param {Object} options - The options for the hook.
 * @param {string} options.endpoint - The API endpoint to fetch data from.
 * @returns {iteratorHook} The state and functions for iterating over the user list.
 */
import './App.css'
import useIterator, { iteratorHook } from './hooks/useIterator';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AppProps {};


const App: React.FC<AppProps> = () => {
  const apiUrl = "https://randomuser.me/api/";
  const {current, prev, next, loading, userList}: iteratorHook = useIterator({endpoint: apiUrl});
  return (
    <>
      {loading && <h2>Loading...</h2>}
      {userList.length > 0 && !loading && <div className="card">
        <img src={userList[current].picture.medium} alt="profile picture" />
        <div className="action-buttons">
          <button onClick={() => prev()} disabled={current === 0}>Prev</button>
          <button onClick={() => next()}>Next</button>
        </div>
      </div>}
      <h1>Video Interview Challenge</h1>
      <div className="card">
        <p>
          I found one of this Turing interview video about react fetching data related challenge, so I wanted to try myself.
        </p>
      </div>
      <a className="read-the-docs" href="https://www.youtube.com/watch?v=GeoohyU8Qxw" title="Turing video challenge">Video challenge</a>
    </>
  )
}

export default App

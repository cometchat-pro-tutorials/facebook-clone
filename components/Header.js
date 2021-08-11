// import useState, useRef, useContext to get shared data from react context.
import { useState, useRef, useContext } from "react";
// import Context to get shared data.
import Context from "../Context";
// import real time databse firebase.
import { realTimeDb } from "../firebase";
// import custom components.
import HeaderIcon from "./HeaderIcon";
import HeaderRightIcon from "./HeaderRightIcon";

function Header() {
  // search results state.
  const [searchResults, setSearchResults] = useState([]);
  // get shared data from react context.
  const { user, setUser, setIsLoading, setIsChatLayoutShown, setSelectedContact } = useContext(Context);
  // create search ref to get value from the search box.
  const searchRef = useRef(null);

  /**
   * log out function.
   */
  const logout = () => {
    if (confirm("Are you sure to log out ?")) {
      // clear authenticated user data from local storage and react context.
      localStorage.removeItem("auth");
      setUser(null);
      window.location.reload();
    }
  };

  /**
   * check the user is a friend, or not.
   * @param {*} friends 
   * @param {*} user 
   * @returns 
   */
  const isFriend = (friends, user) => {
    if (!friends || friends.length === 0 || !user) {
      return false;
    }
    return friends.find(friend => friend.uid === user.id);
  }

  /**
   * search users by user's email.
   * @param {*} e 
   */
  const onSearchChanged = (e) => {
    const keywords = e.target.value;
    if (keywords === '') {
      setSearchResults(() => []);
      return;
    }
    // call firebase realtime data to search users by user's email.
    realTimeDb.ref().child('users').orderByChild('email').startAt(keywords).endAt(keywords + "\uf8ff").on("value", function(snapshot) {
      const users = snapshot.val();
      if (users && users.length !== 0) {
        const keys = Object.keys(users);
        const searchResults = keys.map(key => users[key]);
        const url = `https://api-us.cometchat.io/v2.0/users/${user.id}/friends`;
        const options = {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            appId: `${process.env.NEXT_PUBLIC_COMETCHAT_APP_ID}`,
            apiKey: `${process.env.NEXT_PUBLIC_COMETCHAT_API_KEY}`,
          }
        };
        fetch(url, options).then((res) => {
          res.json().then(friends => {
            setSearchResults(() => searchResults.map(searchRes => {
              if (searchRes.id === user.id) {
                searchRes.status = 1; // you.
              } else if(isFriend(friends.data, searchRes)) { 
                searchRes.status = 0; // your friend.
              } else {
                searchRes.status = -1; // stranger.
              }
              return searchRes;
            }))
          });
        }).catch(error => {
          alert('Cannot load search results, please try again');
        });
      }
    });
  }

  /**
   * close the search box and clear search results. 
   */
  const closeSearchBox = () => {
    setSearchResults(() => []);
    searchRef.current.value = '';
  }

  /**
   * add friend
   * @param {*} friendUid 
   */
  const addFriend = (friend) => {
    // show loading indicator.
    setIsLoading(true);
    // send request to comet chat api.
    const url = `https://api-us.cometchat.io/v2.0/users/${user.id}/friends`;
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        appId: `${process.env.NEXT_PUBLIC_COMETCHAT_APP_ID}`,
        apiKey: `${process.env.NEXT_PUBLIC_COMETCHAT_API_KEY}`,
      },
      body: JSON.stringify({ accepted: [friend.id] }),
    };
    fetch(url, options)
      .then((res) => {
        // hide loading indicator.
        setIsLoading(false);
        // close search box and clear text input.
        searchRef.current.value = '';
        setSearchResults(() => []);
        // show success alert.
        alert(`${friend.email} was added as friend succesfully`);
      })
      .catch((err) => {
        console.error("error:" + err)
        // show failure alert.
        alert(`Failure to add ${friend.email} as friend`);
        // hide loading indicator.
        setIsLoading(false);
      });
  }

  const showChatUI = () => {
    setIsChatLayoutShown(true);
  };

  const hideChatUI = () => {
    setIsChatLayoutShown(false);
    setSelectedContact(null);
  }

  return (
    <header className="header">
      {/* Left */}
      <div className="header__left">
        <svg
          onClick={hideChatUI}
          viewBox="0 0 36 36"
          className="a8c37x1j ms05siws hwsy1cff b7h9ocf4"
          fill="url(#jsc_c_3)"
          height="40"
          width="40"
        >
          <defs>
            <linearGradient
              x1="50%"
              x2="50%"
              y1="97.0782153%"
              y2="0%"
              id="jsc_c_3"
            >
              <stop offset="0%" stopColor="#0062E0"></stop>
              <stop offset="100%" stopColor="#19AFFF"></stop>
            </linearGradient>
          </defs>
          <path d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z"></path>
          <path
            className="p361ku9c"
            fill="#fff"
            d="M25 23l.8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z"
          ></path>
        </svg>
        <div className="header__searchbox">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            width="1.25rem"
            height="1.5rem"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={searchRef}
            className="header__searchinput"
            placeholder="Search Facebook"
            onChange={onSearchChanged}
          />
          {searchResults && searchResults.length !== 0 && searchRef.current.value !== '' && (
            <div className="header__searchresult">
              <div className="header__searchtitlecontainer">
                <div className="header__searchtitle">Search Results</div>
                <div className="header__searchclose">
                  <img onClick={closeSearchBox} src="https://static.xx.fbcdn.net/rsrc.php/v3/y2/r/__geKiQnSG-.png" />
                </div>
              </div>
              <div className="header__searchresultlist">
                {searchResults.map(result => (
                  <div key={result.id} className="header__searchresultlist-item">
                    <div className="header__searchresultlist-item-avatar">
                      <img src={result.avatar} />
                    </div>
                    <span className="header__searchresultlist-item-username">
                      {result.email}
                    </span>
                    <div className="header__searchresultlist-item-add-fr-btn">
                      {result.status == 1 ? <span>You</span> : result.status == 0 ? <span>Friend</span> : <button onClick={() => addFriend(result)}>Add Friend</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center */}
      <div className="header__center">
        <div className="header__iccontainer">
          <HeaderIcon
            onClick={hideChatUI}
            active
            icon={
              <svg
                fill="#2563EB"
                viewBox="0 0 28 28"
                className="a8c37x1j ms05siws hwsy1cff b7h9ocf4 aaxa7vy3"
                height="28"
                width="28"
              >
                <path d="M25.825 12.29C25.824 12.289 25.823 12.288 25.821 12.286L15.027 2.937C14.752 2.675 14.392 2.527 13.989 2.521 13.608 2.527 13.248 2.675 13.001 2.912L2.175 12.29C1.756 12.658 1.629 13.245 1.868 13.759 2.079 14.215 2.567 14.479 3.069 14.479L5 14.479 5 23.729C5 24.695 5.784 25.479 6.75 25.479L11 25.479C11.552 25.479 12 25.031 12 24.479L12 18.309C12 18.126 12.148 17.979 12.33 17.979L15.67 17.979C15.852 17.979 16 18.126 16 18.309L16 24.479C16 25.031 16.448 25.479 17 25.479L21.25 25.479C22.217 25.479 23 24.695 23 23.729L23 14.479 24.931 14.479C25.433 14.479 25.921 14.215 26.132 13.759 26.371 13.245 26.244 12.658 25.825 12.29"></path>
              </svg>
            }
          />
          <HeaderIcon
            icon={
              <svg
                viewBox="0 0 28 28"
                className="a8c37x1j ms05siws hwsy1cff b7h9ocf4 em6zcovv"
                height="28"
                width="28"
              >
                <path d="M8.75 25.25C8.336 25.25 8 24.914 8 24.5 8 24.086 8.336 23.75 8.75 23.75L19.25 23.75C19.664 23.75 20 24.086 20 24.5 20 24.914 19.664 25.25 19.25 25.25L8.75 25.25ZM17.163 12.846 12.055 15.923C11.591 16.202 11 15.869 11 15.327L11 9.172C11 8.631 11.591 8.297 12.055 8.576L17.163 11.654C17.612 11.924 17.612 12.575 17.163 12.846ZM21.75 20.25C22.992 20.25 24 19.242 24 18L24 6.5C24 5.258 22.992 4.25 21.75 4.25L6.25 4.25C5.008 4.25 4 5.258 4 6.5L4 18C4 19.242 5.008 20.25 6.25 20.25L21.75 20.25ZM21.75 21.75 6.25 21.75C4.179 21.75 2.5 20.071 2.5 18L2.5 6.5C2.5 4.429 4.179 2.75 6.25 2.75L21.75 2.75C23.821 2.75 25.5 4.429 25.5 6.5L25.5 18C25.5 20.071 23.821 21.75 21.75 21.75Z"></path>
              </svg>
            }
          />
          <HeaderIcon
            icon={
              <svg
                viewBox="0 0 28 28"
                className="a8c37x1j ms05siws hwsy1cff b7h9ocf4 em6zcovv"
                height="28"
                width="28"
              >
                <path d="M17.5 23.75 21.75 23.75C22.164 23.75 22.5 23.414 22.5 23L22.5 14 22.531 14C22.364 13.917 22.206 13.815 22.061 13.694L21.66 13.359C21.567 13.283 21.433 13.283 21.34 13.36L21.176 13.497C20.591 13.983 19.855 14.25 19.095 14.25L18.869 14.25C18.114 14.25 17.382 13.987 16.8 13.506L16.616 13.354C16.523 13.278 16.39 13.278 16.298 13.354L16.113 13.507C15.53 13.987 14.798 14.25 14.044 14.25L13.907 14.25C13.162 14.25 12.439 13.994 11.861 13.525L11.645 13.35C11.552 13.275 11.419 13.276 11.328 13.352L11.155 13.497C10.57 13.984 9.834 14.25 9.074 14.25L8.896 14.25C8.143 14.25 7.414 13.989 6.832 13.511L6.638 13.351C6.545 13.275 6.413 13.275 6.32 13.351L5.849 13.739C5.726 13.84 5.592 13.928 5.452 14L5.5 14 5.5 23C5.5 23.414 5.836 23.75 6.25 23.75L10.5 23.75 10.5 17.5C10.5 16.81 11.06 16.25 11.75 16.25L16.25 16.25C16.94 16.25 17.5 16.81 17.5 17.5L17.5 23.75ZM3.673 8.75 24.327 8.75C24.3 8.66 24.271 8.571 24.238 8.483L23.087 5.355C22.823 4.688 22.178 4.25 21.461 4.25L6.54 4.25C5.822 4.25 5.177 4.688 4.919 5.338L3.762 8.483C3.729 8.571 3.7 8.66 3.673 8.75ZM24.5 10.25 3.5 10.25 3.5 12C3.5 12.414 3.836 12.75 4.25 12.75L4.421 12.75C4.595 12.75 4.763 12.69 4.897 12.58L5.368 12.193C6.013 11.662 6.945 11.662 7.59 12.193L7.784 12.352C8.097 12.609 8.49 12.75 8.896 12.75L9.074 12.75C9.483 12.75 9.88 12.607 10.194 12.345L10.368 12.2C11.01 11.665 11.941 11.659 12.589 12.185L12.805 12.359C13.117 12.612 13.506 12.75 13.907 12.75L14.044 12.75C14.45 12.75 14.844 12.608 15.158 12.35L15.343 12.197C15.989 11.663 16.924 11.663 17.571 12.197L17.755 12.35C18.068 12.608 18.462 12.75 18.869 12.75L19.095 12.75C19.504 12.75 19.901 12.606 20.216 12.344L20.38 12.208C21.028 11.666 21.972 11.666 22.62 12.207L23.022 12.542C23.183 12.676 23.387 12.75 23.598 12.75 24.097 12.75 24.5 12.347 24.5 11.85L24.5 10.25ZM24 14.217 24 23C24 24.243 22.993 25.25 21.75 25.25L6.25 25.25C5.007 25.25 4 24.243 4 23L4 14.236C2.875 14.112 2 13.158 2 12L2 9.951C2 9.272 2.12 8.6 2.354 7.964L3.518 4.802C4.01 3.563 5.207 2.75 6.54 2.75L21.461 2.75C22.793 2.75 23.99 3.563 24.488 4.819L25.646 7.964C25.88 8.6 26 9.272 26 9.951L26 11.85C26 13.039 25.135 14.026 24 14.217ZM16 23.75 16 17.75 12 17.75 12 23.75 16 23.75Z"></path>
              </svg>
            }
          />
          <HeaderIcon
            icon={
              <svg
                viewBox="0 0 28 28"
                className="a8c37x1j ms05siws hwsy1cff b7h9ocf4 em6zcovv"
                height="28"
                width="28"
              >
                <path d="M25.5 14C25.5 7.649 20.351 2.5 14 2.5 7.649 2.5 2.5 7.649 2.5 14 2.5 20.351 7.649 25.5 14 25.5 20.351 25.5 25.5 20.351 25.5 14ZM27 14C27 21.18 21.18 27 14 27 6.82 27 1 21.18 1 14 1 6.82 6.82 1 14 1 21.18 1 27 6.82 27 14ZM7.479 14 7.631 14C7.933 14 8.102 14.338 7.934 14.591 7.334 15.491 6.983 16.568 6.983 17.724L6.983 18.221C6.983 18.342 6.99 18.461 7.004 18.578 7.03 18.802 6.862 19 6.637 19L6.123 19C5.228 19 4.5 18.25 4.5 17.327 4.5 15.492 5.727 14 7.479 14ZM20.521 14C22.274 14 23.5 15.492 23.5 17.327 23.5 18.25 22.772 19 21.878 19L21.364 19C21.139 19 20.97 18.802 20.997 18.578 21.01 18.461 21.017 18.342 21.017 18.221L21.017 17.724C21.017 16.568 20.667 15.491 20.067 14.591 19.899 14.338 20.067 14 20.369 14L20.521 14ZM8.25 13C7.147 13 6.25 11.991 6.25 10.75 6.25 9.384 7.035 8.5 8.25 8.5 9.465 8.5 10.25 9.384 10.25 10.75 10.25 11.991 9.353 13 8.25 13ZM19.75 13C18.647 13 17.75 11.991 17.75 10.75 17.75 9.384 18.535 8.5 19.75 8.5 20.965 8.5 21.75 9.384 21.75 10.75 21.75 11.991 20.853 13 19.75 13ZM15.172 13.5C17.558 13.5 19.5 15.395 19.5 17.724L19.5 18.221C19.5 19.202 18.683 20 17.677 20L10.323 20C9.317 20 8.5 19.202 8.5 18.221L8.5 17.724C8.5 15.395 10.441 13.5 12.828 13.5L15.172 13.5ZM16.75 9C16.75 10.655 15.517 12 14 12 12.484 12 11.25 10.655 11.25 9 11.25 7.15 12.304 6 14 6 15.697 6 16.75 7.15 16.75 9Z"></path>
              </svg>
            }
          />
          <HeaderIcon
            icon={
              <svg
                viewBox="0 0 28 28"
                className="a8c37x1j ms05siws hwsy1cff b7h9ocf4 em6zcovv"
                height="28"
                width="28"
              >
                <path d="M23.5 9.5H10.25a.75.75 0 00-.75.75v7c0 .414.336.75.75.75H17v5.5H4.5v-19h19v5zm0 14h-5v-6.25a.75.75 0 00-.75-.75H11V11h12.5v12.5zm1.5.25V4.25C25 3.561 24.439 3 23.75 3H4.25C3.561 3 3 3.561 3 4.25v19.5c0 .689.561 1.25 1.25 1.25h19.5c.689 0 1.25-.561 1.25-1.25z"></path>
              </svg>
            }
          />
        </div>
      </div>

      {/* Right */}
      <div className="header__right">
        {user ? (
          <>
            <img className="header__avatar" src={user.avatar} />
            <p className="header__username">
              {user.email.substring(0, user.email.indexOf("@"))}
            </p>
          </>
        ) : (
          <></>
        )}
        <HeaderRightIcon
          icon={
            <i
              data-visualcompletion="css-img"
              className="hu5pjgll lzf7d6o1"
              style={{
                backgroundImage:
                  'url("https://static.xx.fbcdn.net/rsrc.php/v3/yJ/r/zP3oNYqGLNB.png")',
                backgroundPosition: "-58px -13px",
                backgroundSize: "auto",
                width: "20px",
                height: "20px",
                backgroundRepeat: "no-repeat",
                display: "inline-block",
              }}
            ></i>
          }
        />
        <HeaderRightIcon
          onClick={showChatUI}
          icon={
            <svg
              viewBox="0 0 28 28"
              alt=""
              className="a8c37x1j ms05siws hwsy1cff b7h9ocf4 fzdkajry"
              height="20"
              width="20"
            >
              <path d="M14 2.042c6.76 0 12 4.952 12 11.64S20.76 25.322 14 25.322a13.091 13.091 0 0 1-3.474-.461.956 .956 0 0 0-.641.047L7.5 25.959a.961.961 0 0 1-1.348-.849l-.065-2.134a.957.957 0 0 0-.322-.684A11.389 11.389 0 0 1 2 13.682C2 6.994 7.24 2.042 14 2.042ZM6.794 17.086a.57.57 0 0 0 .827.758l3.786-2.874a.722.722 0 0 1 .868 0l2.8 2.1a1.8 1.8 0 0 0 2.6-.481l3.525-5.592a.57.57 0 0 0-.827-.758l-3.786 2.874a.722.722 0 0 1-.868 0l-2.8-2.1a1.8 1.8 0 0 0-2.6.481Z"></path>
            </svg>
          }
        />
        <HeaderRightIcon
          icon={
            <svg
              viewBox="0 0 28 28"
              alt=""
              className="a8c37x1j ms05siws hwsy1cff b7h9ocf4 fzdkajry"
              height="20"
              width="20"
            >
              <path d="M7.847 23.488C9.207 23.488 11.443 23.363 14.467 22.806 13.944 24.228 12.581 25.247 10.98 25.247 9.649 25.247 8.483 24.542 7.825 23.488L7.847 23.488ZM24.923 15.73C25.17 17.002 24.278 18.127 22.27 19.076 21.17 19.595 18.724 20.583 14.684 21.369 11.568 21.974 9.285 22.113 7.848 22.113 7.421 22.113 7.068 22.101 6.79 22.085 4.574 21.958 3.324 21.248 3.077 19.976 2.702 18.049 3.295 17.305 4.278 16.073L4.537 15.748C5.2 14.907 5.459 14.081 5.035 11.902 4.086 7.022 6.284 3.687 11.064 2.753 15.846 1.83 19.134 4.096 20.083 8.977 20.506 11.156 21.056 11.824 21.986 12.355L21.986 12.356 22.348 12.561C23.72 13.335 24.548 13.802 24.923 15.73Z"></path>
            </svg>
          }
        />
        <HeaderRightIcon
          onClick={logout}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              height="22"
              width="22"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          }
        />
      </div>
    </header>
  );
}

export default Header;

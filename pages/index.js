// import useState, useEffect
import { useState, useEffect } from 'react';
// import context in order to share state between components.
import Context from '../Context';
// import custom components.
import Head from "next/head";
import Feed from "../components/Feed";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Contact from "../components/Contact";
import Login from "../components/Login";
import Loading from "../components/Loading";
import ChatBox from "../components/ChatBox";
import ChatLayout from "../components/ChatLayout";
import RightSidebar from '../components/RightSidebar';
// import realtime database to interact with Firebase.
import { realTimeDb } from "../firebase";

export default function Home({ posts }) {
  // create loading state and share to other components.
  // loading state will be used to show / hide loading indicator.
  const [isLoading, setIsLoading] = useState(false);
  // user state contains authenticated user.
  const [user, setUser] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  // comet chat.
  const [cometChat, setCometChat] = useState(null);
  // posts
  const [wallPosts, setWallPosts] = useState([]);
  // selected user / group.
  const [selectedContact, setSelectedContact] = useState(null);
  // check chat layout should be shown, or not.
  const [isChatLayoutShown, setIsChatLayoutShown] = useState(false);

  useEffect(() => {
    // init cometchat pro.
    initCometChat();
    // get authenticated user from localStorage (if any).
    const authenticatedUser = localStorage.getItem('auth');
    // set user state.
    setUser(authenticatedUser ? JSON.parse(authenticatedUser) : null);
  }, []);

  useEffect(() => {
    setHasLoaded(true);
  }, [user]);

  useEffect(() => {
    if (posts && posts.length !== 0) {
      setWallPosts(posts);
    }
  }, [posts]);

  /**
   * init comet chat.
   */
  const initCometChat = async () => {
    const { CometChat } = await import('@cometchat-pro/chat');
    const appID = `${process.env.NEXT_PUBLIC_COMETCHAT_APP_ID}`;
    const region = `${process.env.NEXT_PUBLIC_COMETCHAT_REGION}`;
    const appSetting = new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(region).build();
    CometChat.init(appID, appSetting).then(
      () => {
        setCometChat(() => CometChat);
      },
      error => {
      }
    );
  }

  if (!hasLoaded || !cometChat) {
    return <Loading />
  }

  // if there is not authenticated user, login page will be shown.
  if (!user) {
    return (
      <Context.Provider value={{isLoading, setIsLoading, user, setUser, cometChat}}>
        <Login />
        {isLoading && <Loading />}
      </Context.Provider>
    );
  };

  // if user has logged in and isChatLayout = true, chat layout will be shown.
  if (user && isChatLayoutShown) {
    return (
      <Context.Provider value={{isLoading, setIsLoading, user, setUser, cometChat, wallPosts, setWallPosts, selectedContact, setSelectedContact, isChatLayoutShown, setIsChatLayoutShown}}>
        <div className="index">
          <Head>
            <title>Facebook</title>
          </Head>
          <Header />
          <main className="chat__layout-main bg-white">
              <div className="chat__layout-contact">
                <Contact />
              </div>
              <div className="chat__layout">
                <ChatLayout />
              </div>
              <div className="chat__layout-rightsidebar">
                <RightSidebar />
              </div>
              {isLoading && <Loading />}
          </main>
        </div>
      </Context.Provider>
    )
  }

  // if there is authenticated user, home page will be shown.
  return (
    <Context.Provider value={{isLoading, setIsLoading, user, setUser, cometChat, wallPosts, setWallPosts, selectedContact, setSelectedContact, isChatLayoutShown, setIsChatLayoutShown}}>
      <div className="index">
        <Head>
          <title>Facebook</title>
        </Head>
        <Header />
        <main className="main">
            <Sidebar />
            <Feed />
            <Contact />
            <ChatBox />
            {isLoading && <Loading />}
        </main>
      </div>
    </Context.Provider>
  );
}

export async function getServerSideProps() {
  const docs = [];

  // get list of wall posts from Firebase.
  const postRef = await realTimeDb.ref('posts');
  const snapshot = await postRef.once('value');

  const posts = snapshot.val();
  
  if (posts && posts.length !== 0) {
    const keys = Object.keys(posts);
    keys.forEach(key => {
      docs.push(posts[key]);
    });  
  }
  // pass posts to Home component as props.
  return {
    props: {
      posts: docs.sort((a,b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      })
    },
  };
}

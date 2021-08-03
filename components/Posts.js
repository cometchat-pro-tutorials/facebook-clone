// import useContext to get shared data.
import { useContext } from 'react';
// import Context.
import Context from '../Context';
// import custom components.
import Post from "./Post";

function Posts() {
  const { wallPosts } = useContext(Context);
  return (
    <div>
      {wallPosts.map((post) => (
        <Post
          key={post.id}
          createdBy={post.createdBy}
          message={post.message}
          timestamp={post.timestamp}
          imageUrl={post.imageUrl}
          userAvatar={post.userAvatar}
        />
      ))}
    </div>
  );
}

export default Posts;

// import custom components
import InputBox from "./InputBox";
import Stories from "./Stories";
import Posts from "./Posts";

function Feed() {
  return (
    <div className="feed">
      <div className="feed__container">
        <Stories />
        <InputBox />
        <Posts />
      </div>
    </div>
  );
}

export default Feed;

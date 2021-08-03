function StoryCard({ name, src, profile }) {
  return (
    <div className="story__card">
      <img
        className="story__profile"
        src={profile}
      />
      <img
        className="story__background"
        src={src}
      />
      <p className="story__name">
        {name}
      </p>
    </div>
  );
}

export default StoryCard;

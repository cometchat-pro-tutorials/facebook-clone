function Post({ createdBy, message, imageUrl, timestamp, userAvatar }) {
  return (
    <div className="post__container">
      <div className="post__title-container">
        <div className="post__title">
          <img className="header__avatar" src={userAvatar} />
          <div>
            <p className="post__name">{createdBy}</p>
            {timestamp ? (
              <p className="post__timestamp">
                {new Date(timestamp).toLocaleString()}
              </p>
            ) : (
              <p className="post__timestamp">Loading</p>
            )}
          </div>
        </div>

        <p className="post__message">{message}</p>
      </div>
      {imageUrl && (
        <div className="post__background">
          <img src={imageUrl} />
        </div>
      )}

      {/* Post Footer */}
      <div className="post__footer">
        <div className="post__footer-item">
          <i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: 'url("https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/8sY7O-nSxto.png")', backgroundPosition: '0px -191px', backgroundSize: 'auto', width: '20px', height: '20px',backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
          <p className="post__reaction">Like</p>
        </div>

        <div className="post__footer-item">
          <i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: 'url("https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/8sY7O-nSxto.png")', backgroundPosition: '0px -153px', backgroundSize: 'auto', width: '20px', height: '20px',backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
          <p className="post__reaction">Comment</p>
        </div>

        <div className="post__footer-item">
          <i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: 'url("https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/8sY7O-nSxto.png")', backgroundPosition: '0px -210px', backgroundSize: 'auto', width: '20px', height: '18px',backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
          <p className="post__reaction">Share</p>
        </div>
      </div>
    </div>
  );
}

export default Post;

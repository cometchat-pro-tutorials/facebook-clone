function Message(props) {
  const {message, avatar, isRight} = props;

  if (!message || !avatar) { 
    return <></>
  }

  if (isRight) {
    return (
      <div className="message__right">
        <div className="message__content message__content--right">
          <p>{message}</p>
        </div>
        <div className="message__avatar">
          <img src={avatar}/>
        </div>
      </div>
    );
  }

  return (
    <div className="message__left">
      <div className="message__avatar">
        <img src={avatar}/>
      </div>
      <div className="message__content message__content--left">
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Message;
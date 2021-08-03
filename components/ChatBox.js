// import useContext, useRef.
import { useContext, useRef, useEffect, useState } from "react";
// import Context.
import Context from "../Context";
// import custom components.
import Message from "./Message";
// import uuid to generate id for messages.
import { v4 as uuidv4 } from "uuid";

function ChatBox() {
  const [messages, setMessages] = useState([]);

  const { user, selectedContact, setSelectedContact, cometChat } = useContext(Context);

  const messageRef = useRef(null);

  useEffect(() => {
    if (selectedContact) {
      // get list of messages.
      getMessages();
      // listen for messages.
      listenForMessages();
    }
    return () => {
      if (selectedContact) {
        cometChat.removeMessageListener(selectedContact.id);
        setMessages(() => []);
      }
    }
  }, [selectedContact]);

  /**
   * listen for messages
   */
  const listenForMessages = () => {
    cometChat.addMessageListener(
      selectedContact.id,
      new cometChat.MessageListener({
        onTextMessageReceived: (message) => {
          // set state.
          setMessages((prevMessages) => [...prevMessages, message]);
        },
      })
    );
  }

  /**
   * close chat box
   */
  const closeChatBox = () => {
    setSelectedContact(null);
  }

  /**
   * get messages.
   */
  const getMessages = () => {
    console.log(selectedContact.id);
    const limit = 50;
    const messageRequestBuilder = new cometChat.MessagesRequestBuilder()
      .setLimit(limit)
    if (selectedContact.contactType === 0) {
      messageRequestBuilder.setGUID(selectedContact.id);
    } else if (selectedContact.contactType === 1) {
      messageRequestBuilder.setUID(selectedContact.id);
    }

    const messagesRequest = messageRequestBuilder.build();

    messagesRequest
      .fetchPrevious()
      .then((messages) => {
        console.log(messages);
        setMessages(() => messages);
      })
      .catch((error) => {});
  }

  /**
   * send message
   * @param {*} e 
   */
  const sendMessage = (e) => {
    if (e.key === 'Enter') {
      // get the value from input.
      const message = messageRef.current.value;
      if (message) {
        // call cometchat api to send the message.
        const textMessage = new cometChat.TextMessage(
          selectedContact.id,
          message,
          selectedContact.contactType === 1 ? cometChat.RECEIVER_TYPE.USER : cometChat.RECEIVER_TYPE.GROUP
        );
        
        cometChat.sendMessage(textMessage).then(
          msg => {
            // reset input box.
            messageRef.current.value = '';
            // append the new message to "messages" state.
            setMessages((prevMessages) => [...prevMessages, {
              id: uuidv4(),
              text: message,
              sender: {
                avatar: user.avatar
              },
              isRight: false
            }]);
          }, 
          error => {
            alert('Cannot send you message, please try later');
          }
        );
      }
    }
  }

  const isRight = (message) => {
    if (message.isRight === false) {
      return false;
    }
    // if it is a private chat.
    if (selectedContact.contactType === 1) {
      return message.receiverId === user.id;
    } else if (selectedContact.contactType === 0) {
      // if it is a group chat.
      return message.sender.uid !== user.id;
    }
  }

  if (!selectedContact) {
    return <></>
  }

  return (
    <div className="chatbox">
      <div className="chatbox__title">
        <div className="chatbox__title-left">
          <img src={selectedContact.contactAvatar} />
          <span>{selectedContact.contactName}</span>
        </div>
        <div className="chatbox__title-right" onClick={closeChatBox}>
          <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y2/r/__geKiQnSG-.png" />
        </div>
      </div>
      <div className="message__container">
        {messages && messages.length !== 0 && messages.map(message => (
          <Message key={message.id} message={message.text} avatar={message.sender.avatar} isRight={isRight(message)} />
        ))}
      </div>
      <div className="chatbox__input">
        <input placeholder="Message..." onKeyDown={sendMessage} ref={messageRef}/>
        <svg fill="#2563EB" className="crt8y2ji" width="20px" height="20px" viewBox="0 0 24 24"><path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" fillRule="evenodd" stroke="none"></path></svg>
      </div>
    </div>
  );
}

export default ChatBox;
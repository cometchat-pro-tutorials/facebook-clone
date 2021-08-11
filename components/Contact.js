// import useEffect, useState, useContext.
import { useEffect, useState, useContext } from 'react';
// import Context.
import Context from "../Context";

function Contact() {
  const [contacts, setContacts] = useState([]);

  const { user, cometChat, setSelectedContact, isChatLayoutShown } = useContext(Context);

  useEffect(() => {
    // get list of contacts.
    getContacts();
  }, [])

  const transformContacts = (friends, groups) => {
    const contacts = [];
    for (const friend of friends) { 
      contacts.push({
        id: friend.uid,
        contactName: friend.name,
        contactAvatar: friend.avatar,
        status: friend.status,
        contactType: 1 // 1 is a friend, 0 is a group.
      });
    }
    for (const group of groups) {
      contacts.push({
        id: group.guid,
        contactName: group.name,
        contactAvatar: group.icon,
        status: 'available',
        contactType: 0 // 1 is a friend, 0 is a group.
      })
    }
    return contacts;
  }

  const getContacts = () => {
    // get list of friends.
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
        // get list of json groups.
        const groupsRequest = new cometChat.GroupsRequestBuilder()
          .setLimit(100)
          .joinedOnly(true)
          .build();

        groupsRequest.fetchNext().then(
          groupList => {
            // update contacts state.
            setContacts(() => transformContacts(friends.data, groupList));
          },
          error => {
          }
        );
      });
    }).catch(error => {
    });
  };

  const selectContact = (contact) => {
    setSelectedContact(contact);
  };

  return (
    <div className={`contact ${isChatLayoutShown ? 'w-100' : ''}`}>
      <div className="contact__container">
        <div className={`contact__title ${isChatLayoutShown ? 'pt-half' : ''}`}>
          <span className="contact__name">Contacts</span>
          <div className="contact__icons">
            <i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: 'url("https://static.xx.fbcdn.net/rsrc.php/v3/yw/r/WCd6OGdSzhO.png")', backgroundPosition: '-46px -219px', backgroundSize: 'auto', width: '16px', height: '16px',backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
            <i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: 'url("https://static.xx.fbcdn.net/rsrc.php/v3/ya/r/c9bZJwAgQeN.png")', backgroundPosition: '0 -1080px', backgroundSize: 'auto', width: '16px', height: '16px',backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
            <i data-visualcompletion="css-img" className="hu5pjgll lzf7d6o1" style={{backgroundImage: 'url("https://static.xx.fbcdn.net/rsrc.php/v3/ya/r/c9bZJwAgQeN.png")', backgroundPosition: '0 -1063px', backgroundSize: 'auto', width: '16px', height: '16px',backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
          </div>
        </div>
        <div className="contact__list">
          {
            contacts.map(contact => (
              <div key={contact.id} className="contact__list-item" onClick={() => selectContact(contact)}>
                <div className="contact__avatar">
                  <img src={contact.contactAvatar} />
                  <span className={`contact__online-status ${contact.status === 'available' ? 'contact__online-status--active' : 'contact__online-status--inactive'}`}></span>
                </div>
                <span className="contact__username">{contact.contactName}</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Contact;
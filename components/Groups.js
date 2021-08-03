// import useEffect, useRef, useContext, useState.
import { useEffect, useRef, useContext, useState } from "react";
// import Context.
import Context from "../Context";
// import uuid to generate id for groups.
import { v4 as uuidv4 } from "uuid";

function Groups(props) {
  const [groups, setGroups] = useState([]);

  const { toggleModal } = props;

  const { cometChat, setIsLoading } = useContext(Context);

  const groupNameRef = useRef(null);
  const groupTypeRef = useRef(null);

  useEffect(() => {
    // call api to get list of groups.
    getGroups();
  }, []);

  /**
   * generate random avatar for demo purpose
   * @returns 
   */
   const generateAvatar = () => {
    // hardcode list of user's avatars for the demo purpose.
    const avatars= [
      'https://data-us.cometchat.io/assets/images/avatars/captainamerica.png',
      'https://data-us.cometchat.io/assets/images/avatars/cyclops.png',
      'https://data-us.cometchat.io/assets/images/avatars/ironman.png',
      'https://data-us.cometchat.io/assets/images/avatars/spiderman.png',
      'https://data-us.cometchat.io/assets/images/avatars/wolverine.png'
    ];
    const avatarPosition = Math.ceil(Math.random() * 5);
    return avatars[avatarPosition];
  }

  /**
   * get groups
   */
  const getGroups = () => {
    // show loading indicator.
    setIsLoading(true);
    
    const groupsRequest = new cometChat.GroupsRequestBuilder()
      .setLimit(100)
      .build();

    groupsRequest.fetchNext().then(
      groupList => {
        // update groups state.
        setGroups(() => groupList);
        // hide loading indicator.
        setIsLoading(false);
      },
      error => {
        // hide loading indicator.
        setIsLoading(false);
      }
    );
  }

  /**
   * create an new group.
   */
  const createGroup = () => {
    const groupName = groupNameRef.current.value;
    const groupType = groupTypeRef.current.value;

    if (groupName && groupType) {
      const groupIcon = generateAvatar();
      const group = new cometChat.Group(uuidv4(), groupName, groupType, "");
      group.setIcon(groupIcon);
      cometChat.createGroup(group).then(
          group => {
              alert(`${groupName} was created successfully`);
              getGroups();
          },
          error => {
              alert(`Cannot create ${groupName}, please try again`);
          }
      );
    } else {
      alert(`Please input group's name and select group's type`);
    }
  }

  /**
   * join group
   * @param {*} group 
   */
  const joinGroup = (group) => {
    cometChat.joinGroup(group.guid, group.type, group.password ? group.password : '').then(
      group => {
        alert(`Joined group ${group.name} successfully`);
        getGroups();
      },
      error => {
      }
    );
  }

  return (
    <div className="groups">
      <div className="groups__content">
        <div className="groups__container">
          <div className="groups__title">Groups</div>
          <div className="groups__close">
            <img
              onClick={() => toggleModal(false)}
              src="https://static.xx.fbcdn.net/rsrc.php/v3/y2/r/__geKiQnSG-.png"
            />
          </div>
        </div>
        <div className="groups__subtitle"></div>
        <div className="groups__form">
          <input type="text" placeholder="Group Name" ref={groupNameRef}/>
          <select ref={groupTypeRef} defaultValue={cometChat.GROUP_TYPE.PUBLIC}>
            <option value={cometChat.GROUP_TYPE.PUBLIC}>Public</option>
            <option value={cometChat.GROUP_TYPE.PRIVATE}>Private</option>
          </select>
          <button className="groups__btn" onClick={createGroup}>
            Create
          </button>
        </div>
        {groups && groups.length !== 0 && (
          <div className="groups__list-container">
            {
              <table className="groups__list-table">
                <tr>
                  <th>Icon</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Action</th>
                </tr>
                {groups.map(group => (
                  <tr>
                    <td className="groups__image"><img src={group.icon} /></td>
                    <td><p className="groups__name">{group.name}</p></td>
                    <td><p className="groups__type">{group.type}</p></td>
                    <td>{group.hasJoined ? <span className="groups__status">Joined</span> : <button className="groups__item-button" onClick={() => joinGroup(group)}>Join Group</button>}</td>
                  </tr>
                ))}
              </table>
            }
          </div>
        )}
      </div>
    </div>
  );
}

export default Groups;
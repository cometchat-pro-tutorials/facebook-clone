// import useContext to get share data.
import { useContext } from 'react';
// import Context.
import Context from '../Context';

function RightSidebar() {

  const { selectedContact } = useContext(Context);

  if (!selectedContact) {
    return (
      <div className="rightsidebar">
      </div>
    );
  }

  return (
    <div className="rightsidebar">
      <img src={selectedContact?.contactAvatar} />
      <p>{selectedContact?.contactName}</p>
    </div>
  );
}

export default RightSidebar;
// import useContext to get share data from react context.
import { useContext } from 'react';
// import context.
import Context from "../Context";
// import custom components.
import SidebarRow from "./SidebarRow";
import Groups from "./Groups";
import withModal from "./Modal";

function Sidebar(props) {
  const { user } = useContext(Context);

  const { toggleModal } = props;

  return (
    <div className="sidebar">
      <SidebarRow src={user.avatar} title={user.email.substring(0, user.email.indexOf('@'))} />
      <SidebarRow src="https://static.xx.fbcdn.net/rsrc.php/v3/y8/r/S0U5ECzYUSu.png" title="Friends" />
      <SidebarRow toggleModal={toggleModal} src="https://static.xx.fbcdn.net/rsrc.php/v3/y5/r/PrjLkDYpYbH.png" title="Groups" />
      <SidebarRow src="https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/D2y-jJ2C_hO.png" title="Marketplace" />
      <SidebarRow src="https://static.xx.fbcdn.net/rsrc.php/v3/y5/r/duk32h44Y31.png" title="Watch" />
      <SidebarRow src="https://static.xx.fbcdn.net/rsrc.php/v3/ys/r/8wTx0Eu2vRq.png" title="Events" />
      <SidebarRow src="https://static.xx.fbcdn.net/rsrc.php/v3/y8/r/he-BkogidIc.png" title="Memories" />
      <SidebarRow src="https://static.xx.fbcdn.net/rsrc.php/v3/yD/r/lVijPkTeN-r.png" title="Saved" />
      <SidebarRow src="https://static.xx.fbcdn.net/rsrc.php/v3/yH/r/kyCAf2jbZvF.png" title="Pages" />
      <SidebarRow src="https://static.xx.fbcdn.net/rsrc.php/v3/yo/r/DO-SN-shaZL.png" title="Jobs" />
      <SidebarRow title="See More" />
    </div>
  );
}

export default withModal(Groups)(Sidebar);

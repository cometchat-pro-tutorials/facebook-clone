function SidebarRow({ src, title, toggleModal }) {
  
  const showHideModal = () => {
    if (toggleModal) {
      toggleModal(true);
    }
  }

  return (
    <div className="sidebar__row" onClick={showHideModal}>
      {src && (
        <img src={src} className="sidebar__imgrow" />
      )}
      <p className="sidebar__rowtitle">{title}</p>
    </div>
  );
}

export default SidebarRow;

function SidebarRow({ src, title, toggleModal }) {
  return (
    <div className="sidebar__row" onClick={() => toggleModal(true)}>
      {src && (
        <img src={src} className="sidebar__imgrow" />
      )}
      <p className="sidebar__rowtitle">{title}</p>
    </div>
  );
}

export default SidebarRow;

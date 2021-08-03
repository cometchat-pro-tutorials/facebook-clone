function HeaderRightIcon({icon, onClick}) {
  return (
    <div className="header__ricon" onClick={onClick}>
      {icon}
    </div>
  );
}

export default HeaderRightIcon;

function HeaderRightIcon({icon, onClick}) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  }
  return (
    <div className="header__ricon" onClick={handleClick}>
      {icon}
    </div>
  );
}

export default HeaderRightIcon;

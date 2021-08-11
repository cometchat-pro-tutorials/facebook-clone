function HeaderIcon({active, icon, onClick }) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  }
  return (
    <div className={`${active ? 'icon--active' : ''} header__icon`} onClick={handleClick}>
      {icon}
    </div>
  );
}

export default HeaderIcon;

function HeaderIcon({active, icon }) {
  return (
    <div className={`${active ? 'icon--active' : ''} header__icon`}>
      {icon}
    </div>
  );
}

export default HeaderIcon;

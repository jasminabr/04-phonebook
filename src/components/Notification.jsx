const Notification = ({ message, type }) => {
  if (!message) {
    return null;
  }

  const notificationStyle = type === "success" ? " success" : " error";

  return <div className={"notification" + notificationStyle}>{message}</div>;
};

export default Notification;

interface MessageProps {
  content: string;
  msgSender: string;
  sentByMe: boolean;
}

export default function Message({
  content,
  msgSender,
  sentByMe,
}: MessageProps) {
  const containerClassName: string = sentByMe
    ? "message-sent-container"
    : "message-received-container";
  const messageClassName: string = sentByMe
    ? "message-sent"
    : "message-received";

  return (
    <div className={containerClassName}>
      <p className="msg-sender">{sentByMe ? "You" : msgSender}</p>
      <span className={messageClassName}>{content}</span>
    </div>
  );
}

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
  const containerClasses: string = sentByMe
    ? "message-container right"
    : "message-container left";
  const messageClasses: string = sentByMe
    ? "message sent right"
    : "message received left";

  return (
    <div className={containerClasses}>
      <p className="msg-sender">{sentByMe ? "You" : msgSender}</p>
      <span className={messageClasses}>{content}</span>
    </div>
  );
}

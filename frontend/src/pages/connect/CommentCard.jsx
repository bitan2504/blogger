import MConnectCard from "./MConnectCard.jsx";

export default function CommentCard({ comment }) {
  return (
    <div className="commentcard-container">
      <div className="commentcard-header">
        <MConnectCard author={comment?.author} />
      </div>
      <div className="commentcard-content-container">
        <p className="commentcard-content">{comment?.content}</p>
      </div>
    </div>
  );
}

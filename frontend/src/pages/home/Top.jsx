import FetchPosts from "../../components/FetchPosts";

export default function Top() {
  return (
    <>
      <h1>Top</h1>
      <FetchPosts uri="http://localhost:3000/home/top" />
    </>
  );
}

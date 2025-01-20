function Redirect({ message, pageName, countDown }) {
  return (
    <>
      <h1>{message}</h1>
      <h2>You will be redirected to {pageName} page in {countDown} seconds.</h2>
    </>
  );
}

export default Redirect;
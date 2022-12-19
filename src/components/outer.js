export default function Outer({ Children }) {
  return (
    <>
      {" "}
      <div className="hold-transition sidebar-mini">
        <div className="wrapper">
          <div className="content-wrapper">{Children}</div>
        </div>
      </div>
    </>
  );
}

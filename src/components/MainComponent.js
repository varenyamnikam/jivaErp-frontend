import React from "react";
import Headerpart from "./headerpart";
import Sidemenu from "./sidemenu";
import ShortCutKeys from "./shortcutKeys";
function MainComponent({ page }) {
  console.log(page);
  return (
    <>
      <div>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback"
        />
        <link
          rel="stylesheet"
          href="plugins/fontawesome-free/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css"
        />
        <link
          rel="stylesheet"
          href="plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css"
        />
        <link
          rel="stylesheet"
          href="plugins/icheck-bootstrap/icheck-bootstrap.min.css"
        />
        <link rel="stylesheet" href="plugins/jqvmap/jqvmap.min.css" />
        <link rel="stylesheet" href="dist/css/adminlte.min.css" />
        <link
          rel="stylesheet"
          href="plugins/overlayScrollbars/css/OverlayScrollbars.min.css"
        />
        <link
          rel="stylesheet"
          href="plugins/daterangepicker/daterangepicker.css"
        />
        <link
          rel="stylesheet"
          href="plugins/summernote/summernote-bs4.min.css"
        />{" "}
        <div className="wrapper">
          <Headerpart />
          <Sidemenu />
          <div className="hold-transition sidebar-mini">
            <div className="wrapper">
              <div className="content-wrapper">{page} </div>
            </div>
          </div>

          <aside className="control-sidebar control-sidebar-dark"></aside>
        </div>
      </div>
      <ShortCutKeys />
    </>
  );
}
export default MainComponent;

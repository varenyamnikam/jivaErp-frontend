import React from "react";
import "./print.css";
const Components = (props) => {
  const Header = () => (
    <div className={"page-header"} style={{ textAlign: "center" }}>
      I'm The Header
      <br />
      <button
        type="button"
        onClick={() => window.print()}
        style={{ background: "pink" }}
      >
        PRINT ME!
      </button>
    </div>
  );

  const FooterComponent = () => (
    <div className={"page-footer"}>I'm The Footer</div>
  );

  const AddressInfo = () => (
    <div style={{ height: "200px", width: "200px" }}>I'm The AddressInfo</div>
  );

  const TableComponent = () => (
    <>
      <body>
        <table>
          <thead>
            <tr>
              <td>
                <div class="page-header-space"></div>
              </td>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                {/* <div className={"page"}>PAGE 1</div>
      <div className={"page"}>PAGE 2</div> */}{" "}
                <div className={"page"} style={{ lineHeight: 3 }}>
                  {Array.from({ length: 50 }).map((_, index) => (
                    <>
                      " PAGE 3 - Long Content
                      <br /> Lorem ipsum dolor sit amet, consectetur adipiscing
                      elit. Nunc tincidunt metus eu consectetur rutrum. Praesent
                      tempor facilisis dapibus. Aliquam cursus diam ac vehicula
                      pulvinar. Integer lacinia non odio et condimentum. Aenean
                      faucibus cursus mi, sed interdum turpis sagittis a.
                      Quisque quis pellentesque mi. Ut erat eros, posuere sed
                      scelerisque ut, pharetra vitae tellus. Suspendisse ligula
                      sapien, laoreet ac hendrerit sit amet, viverra vel mi.
                      Pellentesque faucibus nisl et dolor pharetra, vel mattis
                      massa venenatis. Integer congue condimentum nisi, sed
                      tincidunt velit tincidunt non. Nulla sagittis sed lorem
                      pretium aliquam. Praesent consectetur volutpat nibh, quis
                      pulvinar est volutpat id. Cras maximus odio posuere
                      suscipit venenatis. Donec rhoncus scelerisque metus, in
                      tempus erat rhoncus sed. Morbi massa sapien, porttitor id
                      urna vel, volutpat blandit velit. Cras sit amet sem eros.
                      Quisque commodo facilisis tristique. Proin pellentesque
                      sodales rutrum. Vestibulum purus neque, congue vel dapibus
                      in, venenatis ut felis. Donec et ligula enim. Sed sapien
                      sapien, tincidunt vitae lectus quis, ultricies rhoncus mi.
                      Nunc dapibus nulla tempus nunc interdum, sed facilisis ex
                      pellentesque. Nunc vel lorem leo. Cras pharetra sodales
                      metus. Cras lacus ex, consequat at consequat vel, laoreet
                      ac dui. Curabitur aliquam, sapien quis congue feugiat,
                      nisi nisl feugiat diam, sed vehicula velit nulla ac nisl.
                      Aliquam quis nisi euismod massa blandit pharetra nec eget
                      nunc. Etiam eros ante, auctor sit amet quam vel, fringilla
                      faucibus leo. Morbi a pulvinar nulla. Praesent sed
                      vulputate nisl. Orci varius natoque penatibus et magnis
                      dis parturient montes, nascetur ridiculus mus. Aenean
                      commodo mollis iaculis. Maecenas consectetur enim vitae
                      mollis venenatis. Ut scelerisque pretium orci id laoreet.
                      In sit amet pharetra diam. Vestibulum in molestie lorem.
                      Nunc gravida, eros non consequat fermentum, ex orci
                      vestibulum orci, non accumsan sem velit ac lectus. Vivamus
                      malesuada lacus nec velit dignissim, ac fermentum nulla
                      pretium. Aenean mi nisi, convallis sed tempor in,
                      porttitor eu libero. Praesent et molestie ante. Duis
                      suscipit vitae purus sit amet aliquam. Vestibulum lectus
                      justo, lobortis a purus a, dapibus efficitur metus.
                      Suspendisse potenti. Duis dictum ex lorem. Suspendisse nec
                      ligula consectetur magna hendrerit ullamcorper et eget
                      mauris. Etiam vestibulum sodales diam, eget venenatis nunc
                      luctus quis. Ut fermentum placerat neque nec elementum.
                      Praesent orci erat, rhoncus vitae est eu, dictum molestie
                      metus. Cras et fermentum elit. Aenean eget augue lacinia,
                      varius ante in, ullamcorper dolor. Cras viverra purus non
                      egestas consectetur. Nulla nec dolor ac lectus convallis
                      aliquet sed a metus. Suspendisse eu imperdiet nunc, id
                      pulvinar risus. Maecenas varius sagittis est, vel
                      fermentum risus accumsan at. Vestibulum sollicitudin dui
                      pharetra sapien volutpat, id convallis mi vestibulum.
                      Phasellus commodo sit amet lorem quis imperdiet. Proin nec
                      diam sed urna euismod ultricies at sed urna. Quisque
                      ornare, nulla et vehicula ultrices, massa purus vehicula
                      urna, ac sodales lacus leo vitae mi. Sed congue placerat
                      justo at placerat. Aenean suscipit fringilla vehicula.
                      Quisque iaculis orci vitae arcu commodo maximus. Maecenas
                      nec nunc rutrum, cursus elit quis, porttitor sapien. Sed
                      ac hendrerit ipsum, lacinia fringilla velit. Donec
                      ultricies feugiat dictum. mi, sed interdum turpis sagittis
                      a. Quisque quis pellentesque mi. Ut erat eros, posuere sed
                      scelerisque ut, pharetra vitae tellus. Suspendisse ligula
                      sapien, laoreet ac hendrerit sit amet, viverra vel mi.
                      Pellentesque faucibus nisl et dolor pharetra, vel mattis
                      massa venenatis. Integer congue condimentum nisi, sed
                      tincidunt velit tincidunt non. Nulla sagittis sed lorem
                      pretium aliquam. Praesent consectetur volutpat nibh, quis
                      pulvinar est volutpat id. Cras maximus odio posuere
                      suscipit venenatis. Donec rhoncus scelerisque metus, in
                      tempus erat rhoncus sed. Morbi massa sapien, porttitor id
                      urna vel, volutpat blandit velit. Cras sit amet sem eros.
                      Quisque commodo facilisis tristique. Proin pellentesque
                      sodales rutrum. Vestibulum purus neque, congue vel dapibus
                      in, venenatis ut felis. Donec et ligula enim. Sed sapien
                      sapien, tincidunt vitae lectus quis, ultricies rhoncus mi.
                      Nunc dapibus nulla tempus nunc interdum, sed facilisis ex
                      pellentesque. Nunc vel lorem leo. Cras pharetra sodales
                      metus. Cras lacus ex, consequat at consequat vel, laoreet
                      ac dui. Curabitur aliquam, sapien quis congue feugiat,
                      nisi nisl feugiat diam, sed vehicula velit nulla ac nisl.
                      Aliquam quis nisi euismod massa blandit pharetra nec eget
                      nunc. Etiam eros ante, auctor sit amet quam vel, fringilla
                      faucibus leo. Morbi a pulvinar nulla. Praesent sed
                      vulputate nisl. Orci varius natoque penatibus et magnis
                      dis parturient montes, nascetur ridiculus mus. Aenean
                      commodo mollis iaculis. Maecenas consectetur enim vitae
                      mollis venenatis. Ut scelerisque pretium orci id laoreet.
                      In sit amet pharetra diam. Vestibulum in molestie lorem.
                      Nunc gravida, eros non consequat fermentum, ex orci
                      vestibulum orci, non accumsan sem velit ac lectus. Vivamus
                      malesuada lacus nec velit dignissim, ac fermentum nulla
                      pretium. Aenean mi nisi, convallis sed tempor in,
                      porttitor eu libero. Praesent et molestie ante. Duis
                      suscipit vitae purus sit amet aliquam. Vestibulum lectus
                      justo, lobortis a purus a, dapibus efficitur metus.
                      Suspendisse potenti. Duis dictum ex lorem. Suspendisse nec
                      ligula consectetur magna hendrerit ullamcorper et eget
                      mauris. Etiam vestibulum sodales diam, eget venenatis nunc
                      luctus quis. Ut fermentum placerat neque nec elementum.
                      Praesent orci erat, rhoncus vitae est eu, dictum molestie
                      metus. Cras et fermentum elit. Aenean eget augue lacinia,
                      varius ante in, ullamcorper dolor. Cras viverra purus non
                      egestas consectetur. Nulla nec dolor ac lectus convallis
                      aliquet sed a metus. Suspendisse eu imperdiet nunc, id
                      pulvinar risus. Maecenas varius sagittis est, vel
                      fermentum risus accumsan at. Vestibulum sollicitudin dui
                      pharetra sapien volutpat, id convallis mi vestibulum.
                      Phasellus commodo sit amet lorem quis imperdiet. Proin nec
                      diam sed urna euismod ultricies at sed urna. Quisque
                      ornare, nulla et vehicula ultrices, massa purus vehicula
                      urna, ac sodales lacus leo vitae mi. Sed congue placerat
                      justo at placerat. Aenean suscipit fringilla vehicula.
                      Quisque iaculis orci vitae arcu commodo maximus. Maecenas
                      nec nunc rutrum, cursus elit quis, porttitor sapien. Sed
                      ac hendrerit ipsum, lacinia fringilla velit. Donec
                      ultricies feugiat dictum. "{" "}
                    </>
                  ))}
                </div>
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td>
                <div class="page-footer-space"></div>
              </td>
            </tr>
          </tfoot>
        </table>
      </body>
    </>
  );

  return { Header, AddressInfo, FooterComponent, TableComponent };
};

export default Components;

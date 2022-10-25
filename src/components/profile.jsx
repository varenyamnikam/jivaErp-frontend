import { reactLocalStorage } from "reactjs-localstorage";
import "./profile.scss";

const Profile = () => {
  const recentImageDataUrl = localStorage.getItem("recent-image");
  const userCompanyName = reactLocalStorage.get("userCompanyName");

  function getImage() {
    if (recentImageDataUrl) {
      return <img src={recentImageDataUrl} alt="" id="img" className="img" />;
    } else
      return (
        <img
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
          alt=""
          id="img"
          className="img"
        />
      );
  }

  return (
    <>
      <div>
        <div className="profile">
          <figure>
            {getImage()}{" "}
            <header>
              <h3>{reactLocalStorage.get("userName")}</h3>{" "}
              <small>{reactLocalStorage.get("userCompanyName")}</small>
            </header>
          </figure>
          <main>
            <dl>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
              mollitia, molestiae quas vel sint commodi repudiandae consequuntur
              voluptatum laborum numquam blanditiis harum quisquam eius sed odit
              fugiat iusto fuga praesentium optio, eaque rerum! Provident
              similique accusantium nemo autem. Veritatis obcaecati tenetur iure
              eius earum ut molestias architecto voluptate aliquam nihil,
              eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit,
              tenetur error, harum nesciunt ipsum debitis quas aliquid.
              Reprehenderit, quia. Quo neque error repudiandae fuga? Ipsa
              laudantium molestias eos sapiente officiis modi at sunt excepturi
              expedita sint? Sed quibusdam recusandae alias error harum maxime
              adipisci amet laborum. Perspiciatis minima nesciunt dolorem!
              Officiis iure rerum voluptates a cumque velit quibusdam sed amet
              tempora. Sit laborum ab, eius fugit doloribus tenetur fugiat,
              temporibus enim commodi iusto libero magni deleniti quod quam
              consequuntur! Commodi minima excepturi repudiandae velit hic
              maxime doloremque. Quaerat provident commodi consectetur veniam
              similique ad earum omnis ipsum saepe, voluptas, hic voluptates
              pariatur est explicabo fugiat, dolorum eligendi quam cupiditate
              excepturi mollitia maiores labore suscipit quas? Nulla, placeat.
              Voluptatem quaerat non architecto ab laudantium modi minima sunt
              esse temporibus sint culpa, recusandae aliquam numquam{" "}
            </dl>
          </main>
        </div>
      </div>
    </>
  );
};
export default Profile;

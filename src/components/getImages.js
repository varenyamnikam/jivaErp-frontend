import React, { Component } from "react";
import { Grid } from "@material-ui/core";
export class ImageUpload extends Component {
  state = {
    profileImg: this.props.recentImage,
  };
  imageHandler = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        this.setState({ profileImg: reader.result });
        localStorage.setItem("recent-image", reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  render() {
    const { profileImg } = this.state;
    return (
      <Grid container>
        <Grid Item sm={4}>
          <img
            style={{
              minWidth: "125px",
              minHeight: "125px",
              borderRadius: "50%",
              padding: "10px",
              boxShadow: "0px 0px 20px rgba(#151515, 0.15)",
              display: "flex",
            }}
            src={profileImg}
            alt=""
            id="img"
            className="img"
          />
        </Grid>
        <Grid
          Item
          sm={8}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <input
            type="file"
            accept="image/*"
            name="image-upload"
            id="input"
            onChange={this.imageHandler}
            style={{ width: "200px" }}
          />
        </Grid>
      </Grid>
    );
  }
}

export default ImageUpload;
// <div className="label">
// <label className="image-upload" htmlFor="input">
//   <i className="material-icons">add_photo_alternate</i>
//   Choose your Photo
// </label>
// </div>
//

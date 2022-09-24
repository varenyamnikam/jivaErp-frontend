import { reactLocalStorage } from "reactjs-localstorage";
import React, { useState, useEffect } from "react";
import AuthHandler from "../Utils/AuthHandler";
import Config from "../Utils/Config";
import axios from "axios";
import { useUserRoles } from "./Store";

const KEYS = {
  roleitems: "roleitems",
  roleId: "roleId",
};

export function GetAllRoles() {
  const token = AuthHandler.getLoginToken();
  console.log(token);

  const body = { hello: "hello" };
  axios
    .post(Config.userUrl, body, {
      headers: {
        authorization: "Bearer" + token,
      },
    })
    .then(function (response) {
      reactLocalStorage.set("role", JSON.stringify(response.data.adm_userrole));
      console.log(response.data.adm_userrole);
    });

  const role = JSON.parse(reactLocalStorage.get("role"));
  console.log(role);

  return role;
}

export function insertnewRole(data) {
  console.log(data.roleCode);
  const token = AuthHandler.getLoginToken();
  axios
    .put(
      Config.userUrl,
      { roleCode: data.roleCode, roleName: data.roleName },
      {
        headers: {
          authorization: "Bearer" + token,
        },
      }
    )
    .then(function (response) {
      if (response.data.auth) {
        reactLocalStorage.set("msg1", JSON.stringify(response.data.message1));
        console.log(response.data.message1);
      }
    });
}

export function insertnewRoleRights(data) {
  const token = AuthHandler.getLoginToken();
  axios
    .post(
      Config.userRightsUrl,
      {
        roleCode: data.roleCode,
        roleName: data.roleName,
        menuRight: data.menuRight,
        editRight: data.editRight,
        addRight: data.addRight,
        deleteRight: data.deleteRight,
      },
      {
        headers: {
          authorization: "Bearer" + token,
        },
      }
    )
    .then(function (response) {
      if (response.data.auth) {
        reactLocalStorage.set("msg1", JSON.stringify(response.data.message1));
        console.log(response.data.message1);
      }
    });
}

export function deleteUserRole(data) {
  // const { removeUerRole } = useUserRoles();
  const token = AuthHandler.getLoginToken();
  console.log(data);
  axios
    .post(
      Config.deleteUserRoleUrl,
      {
        roleCode: data,
      },
      {
        headers: {
          authorization: "Bearer" + token,
        },
      }
    )
    .then(function (response) {
      if (response.data.auth) {
        reactLocalStorage.set(
          "newroled",
          JSON.stringify(response.data.adm_userrole1)
        );
        console.log(response.data.adm_userrole1);
        // removeUerRole(data)
        //console.log(newroled);
        //  return (JSON.parse(JSON.stringify(response.data.adm_userrole1)))
        //  return (response.data.adm_userrole1)
      }
    });
}

// export function deleteRole(data) {
//     deleteRoleRights(data)
//     const roled = JSON.parse(reactLocalStorage.get('newroled'));
//     console.log(roled);
//     return roled;
// }

export function updatenewRole(data) {
  let roleitems = GetAllRoles();
  let recordIndex = roleitems.findIndex((x) => x.id == data.id);
  roleitems[recordIndex] = { ...data };
  localStorage.setItem(KEYS.roleitems, JSON.stringify(roleitems));
}

// export function deleteRole(_id) {
//     let roleitems = getAllRoles();
//     roleitems = roleitems.filter(x => x._id != _id)
//     localStorage.setItem(KEYS.roleitems, JSON.stringify(roleitems));
// }

export function generateRoleId() {
  if (localStorage.getItem(KEYS.roleId) == null)
    localStorage.setItem(KEYS.roleId, "0");
  var _id = parseInt(localStorage.getItem(KEYS.roleId));
  localStorage.setItem(KEYS.roleId, (++_id).toString());
  return _id;
}
export function deleteUserRights(data) {
  // const { removeUerRole } = useUserRoles();
  const { roleCode, roleName } = data;
  console.log(roleCode, roleName, data);

  const token = AuthHandler.getLoginToken();
  console.log(data);
  axios.post(
    Config.resetUrl,
    {
      roleCode: roleCode,
      roleName: roleName,
    },
    {
      headers: {
        authorization: "Bearer" + token,
      },
    }
  );
}
// export function Insertnewuser(data) {
//   const values = data;
//   console.log(values);
//   const token = AuthHandler.getLoginToken();
//   axios
//     .post(
//       Config.addUser,
//       { values },
//       {
//         headers: {
//           authorization: "Bearer" + token,
//         },
//       }
//     )
//     .then((response) => {
//       userCodeValue = response.data.values;
//       console.log("hi....", response.data.values);
//     });
//   console.log(userCodeValue);
//   return userCodeValue;
// }
export function updateuser(data) {
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");

  const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;
  const values = data;
  console.log(values);
  const token = AuthHandler.getLoginToken();
  axios
    .patch(
      Config.usermasterUrl + query,
      { values },
      {
        headers: {
          authorization: "Bearer" + token,
        },
      }
    )
    .then(function (response) {
      if (response.data.auth) {
        console.log(response.data.err);
      }
    });
}

export function deleteuser(data) {
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");

  const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;

  const values = data;
  console.log(values);
  const token = AuthHandler.getLoginToken();
  axios
    .put(
      Config.usermasterUrl + query,
      { values },
      {
        headers: {
          authorization: "Bearer" + token,
        },
      }
    )
    .then(function (response) {
      if (response.data.auth) {
        console.log(response.data.err);
      }
    });
  axios
    .put(
      Config.userRightsUrl + query,
      { values },
      {
        headers: {
          authorization: "Bearer" + token,
        },
      }
    )
    .then(function (response) {});
}
export function deleteBranch(data) {
  const values = data;
  console.log(values);
  const token = AuthHandler.getLoginToken();
  axios
    .post(
      Config.deleteBranch,
      { values },
      {
        headers: {
          authorization: "Bearer" + token,
        },
      }
    )
    .then(function (response) {
      if (response.data.auth) {
        console.log(response.data.err);
      }
    });
}
export function updateBranch(data) {
  const values = data;
  console.log(values);
  const token = AuthHandler.getLoginToken();
  axios
    .post(
      Config.updateBranch,
      { values },
      {
        headers: {
          authorization: "Bearer" + token,
        },
      }
    )
    .then(function (response) {
      if (response.data.auth) {
        console.log(response.data.err);
      }
    });
}
export function insertLocation(data) {
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;

  const values = data;
  console.log(values);
  const token = AuthHandler.getLoginToken();
  axios
    .post(
      Config.addlocation + query,
      { values },
      {
        headers: {
          authorization: "Bearer" + token,
        },
      }
    )
    .then((response) => {
      console.log(values);
    });
}
export function insertglGroup(data) {
  const values = data;
  console.log(values);
  const token = AuthHandler.getLoginToken();
  axios
    .post(
      Config.addacglgroup,
      { ...values },
      {
        headers: {
          authorization: "Bearer" + token,
        },
      }
    )
    .then((response) => {
      console.log(values);
    });
}
export function insertAcAdress(data) {
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;

  const values = data;
  delete values["_id"];
  console.log(values);
  const token = AuthHandler.getLoginToken();
  axios
    .patch(
      Config.acadress + query,
      { ...values },
      {
        headers: {
          authorization: "Bearer" + token,
        },
      }
    )
    .then((response) => {
      console.log(values);
      console.log(response);
    });
}
export function deleteAcAdress(data) {
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;

  const values = data;
  console.log(values);
  const token = AuthHandler.getLoginToken();
  axios
    .post(
      Config.acadress + query,
      { values },
      {
        headers: {
          authorization: "Bearer" + token,
        },
      }
    )
    .then((response) => {
      console.log(values);
      console.log(response);
    });
}

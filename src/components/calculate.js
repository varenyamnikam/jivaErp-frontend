import React, { useState } from "react";

export default function Calculate(
  values,
  quantity,
  rate,
  qr,
  discount,
  dqr,
  name1,
  name2,
  name3,
  name4,
  final
) {
  function percentOfAmt(net, amt) {
    console.log("hi");
    var per = (Number(net) / Number(amt)) * 100;
    return per;
  }
  function amtOfPercent(per, amt) {
    console.log(per, amt);
    var net = (Number(per) / 100) * Number(amt);
    console.log(net);
    return subStractFromAmt(net, amt);
  }

  function subStractFromAmt(sub, amt) {
    console.log("hi");
    amt = Number(amt) - sub;
    return amt;
  }
  function addFromAmt(add, amt) {
    console.log("hi", add, amt);
    amt = Number(amt) + add;
    return amt;
  }

  function totalBeforeDs() {
    console.log(values, qr, values[qr]);
    if (values[qr] !== Number(values[quantity]) * Number(values[rate])) {
      console.log(values[qr], Number(values[quantity]) * Number(values[rate]));
      return Number(values[quantity]) * Number(values[rate]);
    } else {
      console.log(values[qr], Number(values[quantity]) * Number(values[rate]));
      return null;
    }
  }
  function totalAfterDs() {
    console.log(values, qr, values[qr]);
    if (
      Number(values[dqr]) !== subStractFromAmt(values[discount], values[qr])
    ) {
      return subStractFromAmt(values[discount], values[qr]);
    } else {
      return null;
    }
  }
  function Final() {
    let x = addFromAmt(Number(values[name1]), Number(values[dqr]));
    let y = addFromAmt(Number(values[name2]), x);
    let z = addFromAmt(Number(values[name3]), y);
    let l = addFromAmt(Number(values[name4]), z);
    // let l = 0;
    // addArray.map((item, index) => {
    //   l = l + values[item];
    // });
    console.log(x, y, z, l);
    // console.log(l);
    return l;
  }

  return { totalBeforeDs, totalAfterDs, Final };
}

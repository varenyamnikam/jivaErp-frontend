import React, { useEffect, useState } from "react";
import PageHeader from "../../../components/PageHeader";
import AuthHandler from "../../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../../Utils/Config";
import * as roleService from "../../../services/roleService";
import { NotifyMsg } from "../../../components/notificationMsg";
import ButtonLoader from "../../../components/loading";
import prodConversnFn from "../../../components/tally/master/productTally";
import DownloadMasterTallyXml from "../../../components/tally/master/convertMasterData";
import Notification from "../../../components/Notification";
import Controls from "../../../components/controls/Controls";
import accConversnFn from "../../../components/tally/master/accountTally";
import DownloadAccountingTallyXml from "../../../components/tally/accounting/convertTransactionData";
import DownloadTransactionTallyXml from "../../../components/tally/transactions/convertTransactionData";
import DownloadVouTallyXml from "../../../components/tally/transactions/dwnldTrnsctn";
import StaticDatePickerLandscape from "../../../components/calendarLandscape";
import { Grid } from "@material-ui/core";
import VouConversnFn from "../../../components/tally/transactions/voucherXml";

export default function Tally() {
  const [loading, setLoading] = useState(true);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [filter, setFilter] = useState({
    startDate: roleService.getStartDate(),
    endDate: roleService.getEndDate(),
  });

  const [data, setData] = useState({});
  const user = AuthHandler.getUser();

  const handleErr = (err) => {
    setNotify(NotifyMsg(4));
    setLoading(false);
  };

  const fetchData = async () => {
    try {
      const url =
        Config().tally +
        `&yearCode=${user.currentYearCode}&branchCode=${user.currentBranchCode}&startDate=${filter.startDate}&endDate=${filter.endDate}`;

      const handleErr = (err) => {
        setNotify(NotifyMsg(4));
        setLoading(false);
      };

      const handleRes = (res) => {
        setData(res.data);
        console.log(res);
      };

      await roleService.axiosGet(url, handleRes, handleErr, () => {
        // setLoading(false);
      });
    } catch (err) {
      handleErr(err);
    } finally {
      setLoading(false);
      console.log("finally");
    }
  };

  useEffect(() => {
    loading && fetchData();
  }, []);

  const { convertProdToXml, convertUomToXml, convertItemGrpToXml, wrapperXml } =
    prodConversnFn;
  console.log(data);
  function findProdName(code) {
    let found = data.mst_prodMaster.find((item) => item.prodCode == code);
    return found ? found.prodName : "";
  }
  function masterClick() {
    const acGroups = data.acGroups;
    const accounts = data.accounts;
    const { convertAccToXml, convertAcGrpToXml, wrapperXml } = accConversnFn;
    function findOb(code) {
      let balance = 0;
      data.openingBalance
        .filter((item) => item.acCode == code)
        .map((item) => {
          balance += Number(item.credit);
          balance -= Number(item.debit);
        });
      return balance;
    }
    function findOpStk(code) {
      let balance = 0;
      data.stockTrans
        .filter((item) => item.refType == "OP" && item.prodCode == code)
        .map((item) => {
          balance += Number(item.inwardQty);
          balance -= Number(item.outwardQty);
        });
      return balance;
    }
    function findGrpName(grpCode) {
      let found = acGroups.find((item) => item.acGroupCode == grpCode);
      return found ? found.acGroupName : "";
    }
    function findGrpName(grpCode) {
      let found = acGroups.find((item) => item.acGroupCode == grpCode);
      return found ? found.acGroupName : "";
    }
    function findAdress(acc) {
      let found = data.adressData.find((item) => item.acCode == acc.acCode);
      return found
        ? found
        : {
            addressLine1: "",
            pincode: "",
            countryName: "",
            stateName: "",
            addressLine2: "",
          };
    }

    const tallyAccGeneralData = accounts
      .filter((item) => item.acCode[0] == "G")
      .map((item) => ({
        ...item,
        acGroupName: findGrpName(item.acGroupCode),
        openingBalance: 0,
        adress: {
          addressLine1: "",
          addressLine2: "",
          pincode: "",
          countryName: "",
          stateName: "",
        },
      }));

    const tallyAcGrpData = acGroups
      .filter((item) => item.userCompanyCode !== "all")
      .map((item) => ({
        grpName: item.acGroupName,
        parentGrpName: findGrpName(item.parentGroupCode),
      }));
    const tallyAccPartyData = accounts
      .filter((item) => item.acCode[0] !== "G")
      .map((item) => ({
        ...item,
        acGroupName: findGrpName(item.acGroupCode),
        adress: findAdress(item),
        openingBalance: findOb(item.acCode),
      }));
    const prodData = data.mst_prodMaster.map((item) => ({
      ...item,
      openingStock: findOpStk(item.prodCode),
    }));

    console.log(tallyAccPartyData);
    const accDataAndFnArr = [
      { data: data.mst_unit, fn: convertUomToXml },
      { data: data.mst_prodTypes, fn: convertItemGrpToXml },
      { data: prodData, fn: convertProdToXml },
      { data: tallyAcGrpData, fn: convertAcGrpToXml },
      { data: tallyAccGeneralData, fn: convertAccToXml },
      { data: tallyAccPartyData, fn: convertAccToXml },
    ];
    DownloadMasterTallyXml(accDataAndFnArr, wrapperXml, "Masters.xml");
  }

  async function voucherClick() {
    // acLedger,allTransVouchersLedger
    // voucher,:allTransVouchers
    // accounts,:accounts
    // voucherItems,inv_voucherItems
    // adress,adressData
    // products,mst_prodMaster
    // allVouchers,allTransVouchers
    const { convertInvVouToXml } = VouConversnFn;
    await fetchData();
    const returnedTransArr = DownloadTransactionTallyXml({
      accounts: data.accounts,
      voucherItems: data.inv_voucherItems,
      adress: data.adressData,
      products: data.mst_prodMaster,
      acLedger: data.allTransVouchersLedger,
      voucher: data.allTransVouchers,
    });
    const returnedAccArr = DownloadAccountingTallyXml(
      data.allAccVouchersLedger,
      data.accounts
    );
    console.log("hi", returnedTransArr, returnedAccArr);
    let stockVouchers = data.stockTrans.map((item) => ({
      ...item,
      prodName: findProdName(item.prodCode),
    }));
    let inventoryVou = DownloadMasterTallyXml(
      [{ data: stockVouchers, fn: convertInvVouToXml }],
      wrapperXml,
      "InventoryTransaction.xml"
    );
    console.log(stockVouchers, inventoryVou);
    DownloadVouTallyXml(
      [...returnedTransArr, ...returnedAccArr, ...inventoryVou],
      wrapperXml
    );
  }

  return (
    <>
      <PageHeader title="Export To Tally" icon={<></>} />
      <section className="content">
        <div className="card">
          <div className="card-body">
            <section className="content">
              <Notification notify={notify} setNotify={setNotify} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <StaticDatePickerLandscape
                    size="small"
                    name="startDate"
                    label=" From-"
                    value={filter}
                    setValue={setFilter}
                    style={{ top: 20 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <StaticDatePickerLandscape
                    size="small"
                    name="endDate"
                    label="To-"
                    value={filter}
                    setValue={setFilter}
                  />
                </Grid>{" "}
                <Grid item xs={12}>
                  <Controls.Button onClick={voucherClick} text={"Vouchers"} />
                </Grid>{" "}
                <Grid item xs={12}>
                  <Controls.Button onClick={masterClick} text={"Masters"} />
                </Grid>
              </Grid>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}

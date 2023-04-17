const initialValues = {
userCompanyCode: "",
vouNo: "X X X X",
branchCode: "",
docCode: //depends upon file,
finYear: "",
vno: "",
manualNo: "",
vouDate: new Date(),
srNo: "",<= imp
acCode: "",
acName: "",
debit: "",
credit: "",
narration: "",
refType: "",
vouStatus: "",
checkNo: "",
favouringName: "",
entryBy: "",
entryOn: "",
};

# Reused in
1. BP
2. BR 
3. CP 
4. CR 
  //(they are same just diffrence is in B bank acc in C cash acc and payment & reciept means credit and debit see the logic in code)
1. JV no need of bankvalues here bankvalue exists but we hid it on acForm
* f(x) code => [finalCalc](./AcForm.js
)
# sr No

records is made up of more than 1 entries of same vou no
but they have diff srNo
if srNo==1 it is bankvalues and shown in main table
else when edited all th entrirs of the vouNo selected
are taken in itemList and in itemList all the entries whose
srNo!==1 is shown in form table

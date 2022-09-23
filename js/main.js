let inputName = document.querySelector("#name");
let inputEmail = document.querySelector("#email");
let inputMobile = document.querySelector("#mobile");

let formEmp = document.querySelector("#formEmp");
let tableBody = document.querySelector("#example tbody");

let submitBtn = document.querySelector("#submit");
let contEdit = document.querySelector("#contIdEdit");

class Employee {
  constructor(id, name, email, mobile) {
    (this.id = id),
      (this.name = name),
      (this.email = email),
      (this.mobile = mobile);
  }
  showData() {
    Employee.addHtmlData(this.id, this.name, this.email, this.mobile);
    return this;
  }
  storeEmployee() {
    let allData = JSON.parse(localStorage.getItem("employee")) ?? [];
    allData.push({
      id: this.id,
      name: this.name,
      email: this.email,
      mobile: this.mobile,
    });
    localStorage.setItem("employee", JSON.stringify(allData));
  }
  static showAllEmployees() {
    if (localStorage.getItem("employee")) {
      JSON.parse(localStorage.getItem("employee")).forEach((data) => {
        Employee.addHtmlData(data.id, data.name, data.email, data.mobile);
      });
    }
  }

  static addHtmlData(id, name, email, mobile) {
    const trEl = document.createElement("tr");
    trEl.className = "odd";
    trEl.id = id;
    trEl.setAttribute("role", "row");
    trEl.innerHTML = `
                                <td>${name}</td>
                                <td>${email}</td>
                                <td>${mobile}</td>
                                <td>
                                    <button class="btn btn-info edit">Edit</button>
                                    <button class="btn btn-danger delete">Delete</button>
                                </td>
                        `;
    tableBody.appendChild(trEl);
  }
  static deleteFun() {
    tableBody.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete")) {
        //remove from element
        e.target.parentElement.parentElement.remove();
        //remove from localStorage
        let id = e.target.parentElement.parentElement.id;
        let LocalStorageArr = JSON.parse(localStorage.getItem("employee"));
        let search = LocalStorageArr.find((ele) => ele.id == id);
        let newData = LocalStorageArr.filter((e) => e != search);
        localStorage.setItem("employee", JSON.stringify(newData));
      }
    });
  }
  static editFunc() {
    tableBody.addEventListener("click", (e) => {
      if (e.target.classList.contains("edit")) {
        let id = e.target.parentElement.parentElement.id;
        let LocalStorageArr = JSON.parse(localStorage.getItem("employee"));
        let search = LocalStorageArr.find((ele) => ele.id == id);
        inputName.value = search.name;
        inputEmail.value = search.email;
        inputMobile.value = search.mobile;
        contEdit.value = id;
        submitBtn.value = "edit this item";
      }
    });
  }
  updateEmployee(id) {
    let newItem = {
      id: id,
      name: this.name,
      email: this.email,
      mobile: this.mobile,
    };
    let dataFromLocal = JSON.parse(localStorage.getItem("employee"));
    let updateData = dataFromLocal.map((ele) => {
      if (ele.id == id) {
        return newItem;
      }
      return ele;
    });
    localStorage.setItem("employee", JSON.stringify(updateData));
    tableBody.innerHTML = "";
    Employee.showAllEmployees();
    contEdit.value = "";
    submitBtn.value = "store the data"
  }
}

Employee.showAllEmployees();
formEmp.addEventListener("submit", (e) => {
  e.preventDefault();
  if (
    inputName.value === "" ||
    inputEmail.value === "" ||
    inputMobile.value === ""
  ) {
    return;
  }
  if (contEdit.value === "") {
    let id = new Date().getTime();
    const newEmp = new Employee(
      id,
      inputName.value,
      inputEmail.value,
      inputMobile.value
    );
    newEmp.showData().storeEmployee();
  } else {
    let id = contEdit.value;
    const newEmp = new Employee(
      id,
      inputName.value,
      inputEmail.value,
      inputMobile.value
    );
    newEmp.updateEmployee(id);
  }
  inputName.value = "";
  inputEmail.value = "";
  inputMobile.value = "";
});

Employee.deleteFun();
Employee.editFunc();

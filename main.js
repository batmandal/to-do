const cards = document.querySelectorAll(".cards");
const modal = document.querySelector(".modal");
const addBtn = document.querySelectorAll("#add-btn");
const form = document.querySelector("form");
const card = document.querySelectorAll(".card");
const container = document.querySelector(".container");
const counter = document.querySelectorAll(".counter");
const search = document.querySelector("#search");
const clicked = document.querySelector(".clicked");
const submit = document.querySelectorAll("button");
let editid = 0;
let editTask = 0;

const elements = form.elements;

let data = JSON.parse(localStorage.getItem("data")) ?? [];
let id = localStorage.getItem("id") ?? 0;

// let searchValue = "";
// let setSearchValue = (newSearchValue) => {
//   searchValue = newSearchValue;
//   render();
// };

const setData = (arr) => {
  data = arr;
  render();
};

const render = () => {
  cards.forEach((card) => {
    card.innerHTML = "";
  });

  const sorted = data.sort((a, b) => {
    const sa = a.priority === "high" ? 0 : a.priority === "medium" ? 1 : 2;
    const sb = b.priority === "high" ? 0 : b.priority === "medium" ? 1 : 2;

    return sa - sb;
  });

  sorted
    // .filter((item) => {
    //   return item.title.includes(searchValue);
    // })
    .forEach((item) => {
      if (item.status === "To do") {
        cards[0].innerHTML += Card(item);
      } else if (item.status === "In progress") {
        cards[1].innerHTML += Card(item);
      } else if (item.status === "Stuck") {
        cards[2].innerHTML += Card(item);
      } else if (item.status === "Done") {
        cards[3].innerHTML += Card(item);
      }
      console.log(item.title);
    });

  const deletetask = document.querySelectorAll(".deletetask");
  deletetask.forEach((item) => {
    item.addEventListener("click", () => {
      const id = item.id;
      console.log(id);
      const newDatas = data.filter((e) => {
        return e.id !== id;
      });
      setData(newDatas);
      counters();
      savedata();
    });
  });

  const checkbutton = document.querySelectorAll(".left");
  checkbutton.forEach((bttns) => {
    bttns.addEventListener("click", () => {
      const id = bttns.id;
      const newData = data.map((item) => {
        if (item.id === id) {
          item.status = "Done";
        }
        return item;
      });

      setData(newData);
      counters();
      savedata();
    });
  });

  const edit = document.querySelectorAll(".bordernote");
  edit.forEach((edt) => {
    edt.addEventListener("click", () => {
      editid = edt.parentNode.parentNode.id;
      console.log(editid);
      const editTitle =
        edt.parentNode.parentNode.querySelector(".task-name").textContent;

      const editDesc =
        edt.parentNode.parentNode.querySelector(".task").textContent;

      const editPrio =
        edt.parentNode.parentNode.querySelector(".priority").textContent;

      const editStatus =
        edt.parentNode.parentNode.querySelector(".status").textContent;
      console.log(editStatus, editDesc, editPrio, editTitle);

      modal.style.display = "flex";
      modal.querySelector("#title").value = editTitle;
      modal.querySelector("#desc").value = editDesc;
      modal.querySelector("#browsers").value = editStatus;
      modal.querySelector("#browsers1").value = editPrio;

      editTask = 1;
      clicked.style.display = "flex";
      container.style.opacity = "0.7";
      console.log(editTask);
    });
  });

  const carddrag = document.querySelectorAll(".card");
  carddrag.forEach((dragable) => {
    dragable.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text", event.target.id);
    });
  });
  submit.forEach((a) => {
    a.addEventListener("click", () => {
      clicked.style.display = "none";
      container.style.opacity = "1";
    });
  });
  clicked.addEventListener("click", () => {
    clicked.style.display = "none";
    modal.style.display = "none";
    container.style.opacity = "1";
  });

  addBtn.forEach((a) => {
    a.addEventListener("click", () => {
      modal.style.display = "flex";
      container.style.opacity = "0.7";
      clicked.style.display = "flex";
    });
  });

  search.addEventListener("input", (event) => {
    setSearchValue(event.target.value);
  });
};

const Card = (props) => {
  return `
 <div class="card" id="${props.id}" draggable="true">

 <div class="left border" id="${props.id}">
 <i class="fa-solid fa-check"></i>
</div>
<div class="middle">
   <h3 class="task-name">${props.title}</h3>
   <p class="task">${props.desc}</p>
   <p class="status">${props.status}</p>
   <div class="priority">${props.priority}</div>
   

</div>
<div class="right">
       <div class="border deletetask" id="${props.id}" >
           <i class="fa-solid fa-xmark"></i>
       </div>
   <div class="bordernote">
       <i class="fa-solid fa-file-pen"></i>
   </div>
</div>
 
 </div>
 `;
};

render();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (editTask == 0) {
    const { elements } = event.target;
    // console.log(elements);

    const desc = elements["desc"].value;
    const title = elements["title"].value;
    const status = elements.status.value;
    const priority = elements.priority.value;
    const newData = [...data, { title, desc, status, id: "id" + id, priority }];
    id++;
    setData(newData);

    savedata();
    container.style.opacity = "1";
    counters();
  } else {
    let card = document.querySelectorAll(".card");
    card.forEach((item) => {
      console.log(item.id);
      const newData = data.map((item) => {
        if (item.id == editid) {
          item.title = form.elements.title.value;
          item.desc = form.elements.desc.value;
          item.status = form.elements.status.value;
          item.priority = form.elements.priority.value;
          editTask = 0;
        }
        return item;
      });
      counters();
      setData(newData);
      savedata();
      console.log(editTask);
    });
  }
  id++;
  inputclear(elements);
  modal.style.display = "none";
});

const boards = document.querySelectorAll(".board");
boards.forEach((board) => {
  board.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  board.addEventListener("drop", (event) => {
    const status = board.querySelector("h2").textContent;

    const id = event.dataTransfer.getData("text");

    const newData = data.map((item) => {
      if (item.id === id) {
        item.status = status;
      }
      return item;
    });

    console.log(newData);

    setData(newData);
    counters();
    savedata();
  });
});
const counters = () => {
  for (let i = 0; i < cards.length; i++) {
    counter[i].innerHTML = cards[i].childElementCount;
  }
};
counters();

function inputclear(elements) {
  for (let i = 0; i < 2; i++) {
    elements[i].value = "";
  }
}

const savedata = () => {
  localStorage.setItem("data", JSON.stringify(data));
  localStorage.setItem("id", id);
};
// savedata();

const exittask = document.querySelector(".exitaddtask");
exittask.addEventListener("click", () => {
  modal.style.display = "none";
  clicked.style.display = "none";
  container.style.opacity = "1";
});

// addBtn.forEach((a) => {
//   a.addEventListener("click", () => {
//     modal.style.display = "flex";
//     container.style.opacity = "0.7";
//     clicked.style.display = "flex";
//   });
// });

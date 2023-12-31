const totalContainer = document.querySelector(".burger-total");
const addToCart = document.querySelector(".buton-unu");
const emptyBasket = document.querySelector(".buton-doi");
const addItemButtons = document.querySelectorAll(".add-item.clone-item");
const cloneContainers = document.querySelectorAll(".clone-container");
const selectedItems = document.querySelectorAll(".burger-select select");
const nameBurger = document.querySelector(".personal-name");
const total = document.querySelector(".total-price-row");

const updateTotals = () => {
  let totalPrice = 0;
  let totalMass = 0;

  totalContainer.innerHTML = "";

  document.querySelectorAll(".burger-select select").forEach((select) => {
    if (select.selectedIndex === 0) return; // sar peste default "-"

    const selectedOption = select.options[select.selectedIndex];
    const selectContainer = select.closest(".burger-select");

    const name = selectedOption.text.split(" (")[0];
    const price = parseFloat(selectedOption.dataset.price);
    const mass = parseFloat(selectedOption.dataset.mass);

    totalPrice += price;
    totalMass += mass;

    const row = document.createElement("div");
    row.classList.add("result-row");
    row.dataset.option = selectContainer.dataset.option;

    const createLabel = (className, text) => {
      const label = document.createElement("span");
      label.classList.add(className);
      label.textContent = text;
      return label;
    };

    row.append(
      createLabel("label", `${name} : `),
      createLabel("value", `${price} lei`),
      createLabel("mass", ` (${mass} gr)`)
    );

    totalContainer.append(row);
  });

  const totalRow = document.createElement("div");
  totalRow.classList.add("total-price-row");

  totalRow.innerHTML = `
    <span class="label">Total : </span>
    <span class="value"><span class="total-price">${totalPrice}</span> lei</span>
    <span class="mass"> (<span class="total-mass">${totalMass}</span> gr)</span>
  `;

  totalContainer.append(totalRow);
};

const populateOptions = (selectId, options) => {
  const select = document.getElementById(selectId);
  select.innerHTML = "";

  const createOption = (price, mass, name) => {
    const option = document.createElement("option");
    option.dataset.price = price;
    option.dataset.mass = mass;
    option.text = name === "-" ? "-" : `${name} (${price} lei)`;
    return option;
  };

  select.append(
    createOption("", "-", "-"),
    ...options.map((opt) => createOption(opt.price, opt.mass, opt.name))
  );

  select.addEventListener("change", updateTotals);
};

const cloneSelectOptions = (originalSelectContainer) => {
  const originalSelect = originalSelectContainer.querySelector("select");
  const cloneContainer = document.createElement("div");
  cloneContainer.classList.add("burger-select", "clone-container");

  const cloneSelect = originalSelect.cloneNode(true);
  cloneSelect.addEventListener("change", updateTotals);
  cloneContainer.appendChild(cloneSelect);

  const deleteButton = document.createElement("div");
  deleteButton.classList.add("del-item");

  cloneContainer.appendChild(deleteButton);

  originalSelectContainer.parentNode.insertBefore(
    cloneContainer,
    originalSelectContainer.nextSibling
  );

  deleteButton.addEventListener("click", () => {
    cloneContainer.remove();
    updateTotals();
    setupSelects();
  });
};

const postData = async (url, data) => {
  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
};

const setupSelects = () => {
  const selects = document.querySelectorAll(".burger-select select");

  selects.forEach((select, index) => {
    updateIngredient(select, index);
  });
};

const fetchData = () => {
  return fetch("/data/menu.json")
    .then((response) => response.json())
    .then((data) => data);
};

const ingrediente = [];
let left = true;

const deleteIngredient = (index) => {
  const removedIngredient = ingrediente.splice(index, 1);
};

const displaySelectedRow = (index, selectedItemIndex, data) => {
  const burgerMakeContainer = document.querySelector(".burger-make");
  const existingRow = document.querySelector(`#row-${index}`);
  const rowId = `row-${index}`;

  if (index === 1 && selectedItemIndex !== 0) {
    const carneDefaultElement = document.getElementById("carneDefault");
    if (carneDefaultElement) {
      carneDefaultElement.style.display = "none";
    }
  }

  if (selectedItemIndex === 0) {
    deleteIngredient(index);

    if (existingRow) {
      burgerMakeContainer.removeChild(existingRow);
    }
    return;
  }

  const selectedItem = selectedItemIndex - 1;
  const selectedOption = data[index].type[selectedItem];

  if (existingRow) {
    const imagine = existingRow.querySelector(".ingredient");
    imagine.src = selectedOption.img;
    imagine.classList.add("jello-on-appear");

    const descriere = existingRow.querySelector(
      ".image-description-left, .image-description-right"
    );
    descriere.innerHTML = selectedOption.name;
  } else {
    const row = document.createElement("div");
    row.classList.add("burger-row");
    row.id = rowId;

    const descriere = document.createElement("span");
    descriere.innerHTML = selectedOption.name;
    descriere.classList.add(
      left ? "image-description-left" : "image-description-right"
    );

    const arrow = document.createElement("img");
    arrow.src = left ? "/tomato/arrow-left.svg" : "/tomato/arrow-right.svg";
    arrow.classList.add(left ? "arrow-left" : "arrow-right");

    const imagine = document.createElement("img");
    imagine.src = selectedOption.img;
    imagine.classList.add("ingredient", "jello-on-appear");

    if (left) {
      row.appendChild(imagine);
      row.appendChild(arrow);
      row.appendChild(descriere);
    } else {
      row.appendChild(descriere);
      row.appendChild(arrow);
      row.appendChild(imagine);
    }

    burgerMakeContainer.insertBefore(row, last);
  }

  ingrediente[index] = selectedOption.name;
  left = !left;
};

const updateIngredient = (select, index) => {
  select.addEventListener("change", () => {
    const selectedItemIndex = select.selectedIndex;

    fetchData().then((data) => {
      const selectedOption =
        selectedItemIndex === 0
          ? null
          : data[index].type[selectedItemIndex - 1];

      const sameSelectIndex = ingrediente.findIndex(
        (ingredient, i) => i !== index && ingredient === selectedOption?.name
      );

      if (sameSelectIndex !== -1) {
        ingrediente.splice(sameSelectIndex, 1);
      }

      if (selectedOption) {
        ingrediente[index] = selectedOption.name;
      } else {
        ingrediente[index] = null;
      }

      displaySelectedRow(index, selectedItemIndex, data);
    });
  });
};

window.addEventListener("load", () => {
  fetch("/data/menu.json")
    .then((response) => response.json())
    .then((data) => {
      populateOptions("chifla", [data[0]]);
      populateOptions("carne", data[1].type);
      populateOptions("sos-chifla-jos", data[2].type);
      populateOptions("sos-chifla-top", data[3].type);
      populateOptions("cascaval", data[4].type);
      populateOptions("topping", data[5].type);
      setupSelects();
    });

  addItemButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const originalSelectContainer = button.closest(".burger-select");
      cloneSelectOptions(originalSelectContainer);
      setupSelects();
    });
  });
});

fetchData().then((data) => {
  selects.forEach((select, index) => {
    displaySelectedRow(index, 0, data);
  });
});

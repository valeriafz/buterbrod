const totalContainer = document.querySelector(".burger-total");
const addToCart = document.querySelector(".buton-unu");
const emptyBasket = document.querySelector(".buton-doi");
const addItemButtons = document.querySelectorAll(".add-item.clone-item");
const cloneContainers = document.querySelectorAll(".clone-container");
const selectedItems = document.querySelectorAll(".burger-select select");
const nameBurger = document.querySelector(".personal-name");

const updateTotals = () => {
  let totalPrice = 0;
  let totalMass = 0;

  totalContainer.innerHTML = "";

  selectedItems.forEach((select) => {
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

  originalSelectContainer.parentNode.insertBefore(
    cloneContainer,
    originalSelectContainer.nextSibling
  );
};

addToCart.addEventListener("click", () => {
  const selectedChoices = [];

  selectedItems.forEach((select) => {
    const selectedOption = select.options[select.selectedIndex];

    if (selectedOption.value !== "") {
      const choice = {
        name: selectedOption.text.split(" (")[0],
        price: parseFloat(selectedOption.dataset.price),
        mass: parseFloat(selectedOption.dataset.mass),
      };
      selectedChoices.push(choice);
    }
  });
  console.log(selectedChoices);
  console.log(`Name burger: ${nameBurger.value}`);
});

emptyBasket.addEventListener("click", () => {
  totalContainer.innerHTML = "";

  cloneContainers.forEach((cloneContainer) => {
    cloneContainer.remove();
  });

  selectedItems.forEach((select) => {
    select.selectedIndex = 0;
  });

  nameBurger.value = "";
});

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
    });

  addItemButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const originalSelectContainer = button.closest(".burger-select");
      cloneSelectOptions(originalSelectContainer);
    });
  });
});

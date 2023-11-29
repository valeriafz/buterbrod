let scrolled = false;

const scrollToBurger = () => {
  const burgerSection = document.querySelector(".burger");

  if (burgerSection) {
    window.scrollTo({
      top: burgerSection.offsetTop - 130,
      behavior: "smooth",
    });
  }
};

window.addEventListener("scroll", () => {
  const burger = document.querySelector(".burger");
  const header = document.querySelector(".navbar");

  if (!scrolled && burger) {
    window.scrollTo({
      top: burger.offsetTop - 130,
      behavior: "smooth",
    });

    scrolled = true;
    header.classList.add("header");
  } else if (window.scrollY === 0) {
    scrolled = false;
    header.classList.remove("header");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown") {
    scrollToBurger();
  }
});

const arrow = document.querySelector(".scroll-down");

arrow.addEventListener("click", () => {
  console.log("Click event triggered!");
  scrollToBurger();
});

fetchData().then((data) => {
  selects.forEach((select, index) => {
    displaySelectedRow(index, 0, data);
  });
});

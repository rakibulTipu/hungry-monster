const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  mealsEl = document.getElementById("meals"),
  resultHeading = document.getElementById("result-heading"),
  single_mealEl = document.getElementById("single-meal");

// search meal & fetch from api
let searchMeal = (e) => {
  e.preventDefault();
  // remove single meal value from dom
  single_mealEl.innerHTML = "";
  // get search term
  const term = search.value;

  // check for empty
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search results for "${term}"</h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<h2>Sorry, We don't have any item by the name of "${term}!"</h2>`;
          mealsEl.innerHTML = "";
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) =>
                `<div class="meal">
            <img src='${meal.strMealThumb}' alt='${meal.strMeal}' />
            <div class='meal-info' data-mealID='${meal.idMeal}'>
            <h3>${meal.strMeal}</h3>
            </div>
            </div>`
            )
            .join("");
        }
      });
    search.value = "";
  } else {
    alert("Please write your meal name");
  }
};
// Fetch meal by id
let getMealById = (mealID) => {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
};
// add meal to dom
let addMealToDOM = (meal) => {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `<div class='single-meal'>
  <img src='${meal.strMealThumb}' alt='${meal.strMeal}'/>
  <div class="single-meal-info">
  <h1>${meal.strMeal}</h1>
  </div>
  <div class='main'>
  <h2>Ingredients</h2>
  <ul>
  ${ingredients
    .map((list) => `<li><i class="fas fa-check-square"></i>${list}</li>`)
    .join("")}
  </ul>
  </div>
  </div>`;
};

// EVENT LISTENERS
submit.addEventListener("submit", searchMeal);
mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealID");
    getMealById(mealID);
  }
});

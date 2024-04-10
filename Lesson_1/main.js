var courseAPI = "http://localhost:3000/courses";

function start() {
  getCourses(renderCourses);
  handleCreateForm();
}

//chạy ứng dụng web, chạy starrt đầu tiên
start();

function getCourses(callback) {
  fetch(courseAPI)
    .then(function (response) {
      return response.json();
    })
    .then(callback);
}

function createCourse(data, callback) {
  var options = {
    method: "POST",
    body: JSON.stringify(data),
  };
  fetch(courseAPI, options)
    .then(function (response) {
      return response.json();
    })
    .then(callback);
}

function handleDeleteCourse(id) {
  var options = {
    method: "DELETE",
  };
  fetch(courseAPI + "/" + id, options)
    .then(function (response) {
      return response.json();
    })
    .then(function () {});
}
function renderCourses(courses) {
  var listCoursesBlock = document.querySelector("#list-courses");
  var htmls = courses.map(function (courses) {
    return `<li >
    <h4>${courses.name}</h4>
    <h4>${courses.description}</h4>
    <button onclick="handledeleteCourse">Xóa ${courses.id}</button>
    </li>`;
  });
  listCoursesBlock.innerHTML = htmls.join(" ");
}

function handleCreateForm() {
  var createBtn = document.querySelector("#create");

  createBtn.onclick = function () {
    var name = document.querySelector('input[name="name"]').value;
    var description = document.querySelector('input[name="description"]').value;

    var formData = {
      name: name,
      description: description,
    };
    createCourse(formData);
  };
}

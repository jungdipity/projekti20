"use strict";
const url = "http://localhost:3000";
const signupForm = document.querySelector("#signupForm");
const loginForm = document.querySelector("#loginForm");
const logincontainer = document.querySelector(".logincontainer");
const signupcontainer = document.querySelector(".signupcontainer");
const navLogout = document.querySelector("#navlogout");
const navLogin = document.querySelector("#navlogin");
const navHome = document.querySelector("#navhome");
const navSignup = document.querySelector("#navsignup");
const navMyblog = document.querySelector("#navmyblog");
const userInfo = document.querySelector("#userinfo");
const frontpageContainer = document.querySelector(".frontpageContainer");
const searchResults = document.querySelector(".searchresultsContainer");
const search = document.querySelector("#search");
const randomBlogsit = document.querySelector("#randomBlogitList");
const popularBlogsit = document.querySelector("#popularBlogitList");
const queryString = window.location.search;
const mainContainer = document.querySelector(".mainContainer");


/*
  Visual
*/
const renderUsersBlogs = async () => {
  const queryString = window.location.search;
  console.log(queryString);

  const urlParams = new URLSearchParams(queryString);
  if (urlParams.has("ShowUserid")) {
    const userid = urlParams.get("ShowUserid");
    console.log(userid);
    var userinblogit = await getBlogsByUserId(userid);

    var u = await getUserByIdForBlog(userid);
    var useri=u[0];

      mainContainer.innerHTML = `<div class="header">`
      const header = document.querySelector(".header");
         if (sessionStorage.getItem("loggedUserId") !== undefined && userid == sessionStorage.getItem("loggedUserId")) {
          header.innerHTML += `<button id="editBlogInfo" onclick="editBlogInfoForm()">Edit</button>`
      }
      header.innerHTML +=`<h2>`+ isnull(useri.BlogName, 'No name') +`</h2></div></div>`

    var leftcolumn = `<div class="leftcolumn">`

    if (sessionStorage.getItem("loggedUserId") !== undefined && userid == sessionStorage.getItem("loggedUserId")) {
    leftcolumn+=`<button id="addNewPost" onclick="openNewBlogForm()">Add new</button>`
    }

    for (var b = 0; b < userinblogit.length; b++) {

    if (userinblogit[b].Image == null) {
      imgsrc = '';
    } else {
    var imgsrc = url + '/' + userinblogit[b].Image;
    }

      var blogi = userinblogit[b];
      leftcolumn +=  
      `<div class="card">
      <h3> ` + blogi.Title + `</h3>
      <h5> Created at: ` + new Date(blogi.CreateAt).toLocaleDateString('en-GB', { hour: '2-digit', minute: '2-digit'}) + `</h5>`
      
      if(blogi.UpdateAt !== null) {
        leftcolumn+='<h5> Update at: ' + new Date(blogi.UpdateAt).toLocaleDateString('en-GB', { hour: '2-digit', minute: '2-digit'}) + '</h5>';
      }

      leftcolumn+=
      `<div class="blogbody">
      <div class="fakeimg" style="height: 200px">
      <img class="blogikuvat" src="`+imgsrc+`"/>
      </div><br>
      <span class="content">` + blogi.Content + `</span>
      </div>
      <p class="blogLikes">Likes: ` + blogi.amountOfLikes + ` <button id="like">+</button><button id="dislike">-</button></p>
      <p class="blogCategory">Category: <button>dfg</button></p>`

      if (sessionStorage.getItem("loggedUserId") !== undefined && blogi.UserID == sessionStorage.getItem("loggedUserId")) {
        leftcolumn+='<button id="editBlog" onclick="openModifyBlogForm('+blogi.ID+')">Edit</button><button id="deleteBlog" onclick="deleteBlog('+blogi.ID+')">Delete</button>';
      }

      leftcolumn+=`</div>`
    }

    leftcolumn+= `</div>`
     mainContainer.innerHTML+=leftcolumn;


     if (useri.ProfileImage == null) {
      profimgsrc = '';
    } else {
      var profimgsrc = url + '/' + useri.ProfileImage;
    }

     mainContainer.innerHTML+=  
     `<div class="rightcolumn">
        <div class="card">
          <h2>About Me</h2>
          <img class="profilepicture" src="`+ profimgsrc +`"/>
          <p>` + isnull(useri.Description,'No description') + `</p>
        </div>
      </div>
    </div>`

  } else if (sessionStorage.getItem("loggedUserId") !== undefined) {
    const blogid = sessionStorage.getItem("loggedUserId");
    console.log(blogid);
    var userinblogit = await getBlogsByUserId(blogid);

    for (var b = 0; b < userinblogit.length; b++) {
      var blogi = userinblogit[b];

      mainContainer.innerHTML +=
        `<li>
        <img></img>
        <h3> ` +
        blogi.Title +
        `</h3>
        <p>Likes: ` +
        blogi.amountOfLikes +
        `</p>
        <p>User: ` +
        blogi.UserID +
        `</p>
        </li>`;
    }
  } else {
    // Current user
    console.log("Ei ole määriteltyä käyttäjää"); 
  }
};

async function editBlogInfoForm() {
  var userid = sessionStorage.getItem("loggedUserId")
  var u= await getUserById(userid);
  var useri=u[0];

  var popup = document.createElement("div");
  popup.setAttribute("id", "popup");
  popup.innerHTML = 
  `<div id="editBlogInfoPopupoverlay" class="modaloverlay">
  <div id="editBlogInfoPopup">
  <h1>Edit your profile:</h1>
  <form id="editBlogInfoForm">
  <label for="BlogName"><b>Blog Name</b></label>
  <br>
    <input type="text" placeholder="Enter Blog Name" name="BlogName" value="`+ useri.BlogName +`" title="Max 20 letters" pattern=".{1,20}" required>
    <br><br>
     <br>
    <label for="image"><b>Profile image: </b></label><br>
    <input type="file" name="ProfileImage" accept="image/*" placeholder="Choose file" required>
    <br><br>
    <label for="AboutMe"><b>Description:</b></label>
    <br>
    <textarea id="description" rows="10" cols="30" placeholder="Enter description" name="Description" maxlength="200" required>`+ useri.Description +`</textarea><br>
    <input type="hidden" name="ID" value="`+ userid +`">

    <button type="submit">Confirm</button>
    <button type="submit" onclick="closeForm()">Cancel</button>
  </form>
  </div>
  `;
  popup.addEventListener("submit", onBlogInfoModify);
  document.body.appendChild(popup);
  document.body.style = "overflow: hidden";
};


async function onBlogInfoModify(evt){
  evt.preventDefault();

  let editBlogInfoForm = document.getElementById("editBlogInfoForm") 
  let params = new FormData(editBlogInfoForm);

  closeForm();

  const fetchOptions = {
    method: "PUT",
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: params
  };

  const response = await fetch(url + "/user", fetchOptions);
  const json = await response.json();
  console.log("Modify blog response", json);
  if (!json.user) {
    alert(json.message);
  } else {
  }
  renderUsersBlogs();
}

function openNewBlogForm() {
  var popup = document.createElement("div");
  popup.setAttribute("id", "popup");
  popup.innerHTML = 
  `<div id="newBlogPopupoverlay" class="modaloverlay">
  <div id="newBlogPopup">
  <h1>Add new blog</h1>
  <form id="newBlogForm" enctype="multipart/form-data">
  <label for="title"><b>Title: </b></label><br>
    <input type="text" placeholder="Enter title" name="Title" title="Max 100 letters" pattern=".{1,100}" required><br>
    <br>
    <label for="image"><b>Image: </b></label><br>
    <input type="file" name="Image" accept="image/*" placeholder="Choose file" required>
    <br>
    <br>
    <label for="content"><b>Blog text: </b></label><br>
    <textarea id="content" rows="10" cols="30" placeholder="Enter content" name="Content" required></textarea><br>
    <br><br>
    <label for="category">Choose category:</label>
    <select name="Category" id="category">
      <option value="category1">category1</option>
      <option value="category2">category2</option>
      <option value="category3">category3</option>
      <option value="category4">category4</option>
    </select> 
    <br><br>
    <button type="submit" >Add</button>
    <button type="button" onclick="closeForm()">Cancel</button>
    <input type="hidden" name="UserID" value="`+sessionStorage.getItem("loggedUserId")+`">
  </form>
  </div>
  `;
  popup.addEventListener("submit", onBlogSubmit);
  document.body.appendChild(popup);
  document.body.style = "overflow: hidden";
}

async function onBlogSubmit(evt){
  evt.preventDefault();

let newBlogForm = document.getElementById("newBlogForm");
let params = new FormData(newBlogForm);

  closeForm();

  const fetchOptions = {
    method: "POST",
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
    // body: JSON.stringify(params),
    body: params
  };

  const response = await fetch(url + "/blogs", fetchOptions);
  const json = await response.json();
  console.log("Add blog response", json);
  if (!json.user) {
    alert(json.message);
  } else {
    // 
  }
  renderUsersBlogs();
  //await addBlog(JSON.stringify(params));
}



async function onBlogModify(evt){
  evt.preventDefault();

  let modifyBlogForm = document.getElementById("modifyBlogForm");
  let params = new FormData(modifyBlogForm);

  closeForm();

  const fetchOptions = {
    method: "PUT",
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: params
  };

  const response = await fetch(url + "/blogs", fetchOptions);
  const json = await response.json();
  console.log("Modify blog response", json);
  if (!json.user) {
    alert(json.message);
  } else {
  }
  renderUsersBlogs();
}


function openModifyBlogForm(blogid) {
  var popup = document.createElement("div");
  popup.setAttribute("id", "popup");
  popup.innerHTML = 
  `<div id="modifyBlogPopupoverlay" class="modaloverlay">
  <div id="modifyBlogPopup">
  <h1>Edit blog</h1>
  <form id="modifyBlogForm" enctype="multipart/form-data">
  <label for="title"><b>New title: </b></label><br>
    <input type="text" placeholder="Enter title" name="Title" title="Max 100 letters" pattern=".{1,100}" required>
    <br><br>
    <label for="image"><b>Image: </b></label><br>
    <input type="file" name="Image" accept="image/*" placeholder="Choose file" required>
    <br><br>
    <label for="content"><b>Edit Blog text: </b></label><br>
    <textarea id="content" rows="10" cols="30" placeholder="Enter content" name="Content" required></textarea><br>
    <br>
    <label for="category">Change category:</label>
    <select name="category" id="category">
      <option value="category1">category1</option>
      <option value="category2">category2</option>
      <option value="category3">category3</option>
      <option value="category4">category4</option>
    </select> 
    <br><br>
    <button type="submit">Confirm</button>
    <button type="button" onclick="closeForm()">Cancel</button>
    <input type="hidden" name="ID" value="`+ blogid +`">
  </form>
  </div>
  `;
  popup.addEventListener("submit", onBlogModify);
  document.body.appendChild(popup);
  document.body.style = "overflow: hidden";
}


async function openClickedBlog(blogid) {
  var blogit = await getBlogById(blogid);
  var blogi=blogit[0];

  var popup = document.createElement("div");
  popup.setAttribute("id", "popup");
  popup.innerHTML = 
  `<div id="ClickedBlogPopupoverlay" class="modaloverlay">
  <div id="ClickedBlogPopup">
  <div class="popupcard">
  <h3> ` + blogi.Title + `</h3>
  <div class="blogbody">
  <div class="fakeimg" style="height: 200px">
  <img class="blogikuvat" src="`+blogi.Image+`"/>
  </div><br>
  <span class="content">` + blogi.Content + `</span>
  </div>
  <p class="blogLikes">Likes: ` + blogi.amountOfLikes + ` <button id="like">+</button><button id="dislike">-</button></p>
  <p class="blogCategory">Category: <button class="categoryButton">dfg</button></p>
  <button onclick="closeForm()" class="closeButton">Close</button>
  <a href="` + '?ShowUserid=' + blogi.UserID + `">Go to users blog</a> 
  </div>
  `;

  document.body.appendChild(popup);
  document.body.style = "overflow: hidden";
}

function closeForm() {
  document.body.removeChild(popup);
  document.body.style = "overflow: auto";
}


async function renderRandomBlogs() {
  var randomBlogit = await getRandomBlogs();

  for (var b = 0; b < randomBlogit.length; b++) {
    var blogi = randomBlogit[b];

    randomBlogsit.innerHTML +=
    `<li>
    <img src="`+blogi.Image+`"></img>
    <h3> ` + blogi.Title + `</h3>
    <p>Likes: ` + blogi.amountOfLikes + `</p>
    <p>User: ` + blogi.UserID + `</p>
    <button onclick="openClickedBlog(`+ blogi.ID +`)" class="viewButton">View</button>
    </li>`;
  }
}

async function renderPopularBlogs() {
  var popularBlogit = await getPopularBlogs();

  for (var b = 0; b < popularBlogit.length; b++) {
    var blogi = popularBlogit[b];

    popularBlogsit.innerHTML +=
      `<li>
      <img src="`+blogi.Image+`" style="width: 100%; height: 250px"></img>
      <h3> ` + blogi.Title + `</h3>
      <p>Likes: ` + blogi.amountOfLikes + `</p>
      <p>User: ` + blogi.UserID + `</p>
      <button onclick="openClickedBlog(`+ blogi.ID +`)" class="viewButton">View</button>
      </li>`;
  }
}

async function renderSearchResults(jep) {
  var blogit = await getBlogs();

  searchResults.innerHTML = "<h1>Search Results</h1>";

  if (blogit.length > 0) {
    for (var b = 0; b < blogit.length; b++) {
      var blogi = blogit[b];

    searchResults.innerHTML += `<li>
    <h3> ` + blogi.Title + `</h3>
    <p> ` + blogi.Content + `</p>
    <button onclick="openClickedBlog(`+ blogi.ID +`)" class="viewButton">View</button>
    </li>`;
    }
  } else {
    searchResults.innerHTML += "<p id='noResults'>No results</p>";
  }

  searchResults.style.display = "block";
  loginForm.style.display = "none";
  signupForm.style.display = "none";
  mainContainer.style.display = "none";
}

async function onPageLoading() {
  // If we have param
  const urlParams = new URLSearchParams(queryString);

  if (urlParams.has("ShowUserid")) {
    // Lets render current users blog
    renderUsersBlogs();
  } else {
    // Lets render popular/randomblogs
    renderPopularBlogs();
    renderRandomBlogs();
  }
}
/* ---------------------------------------------- */



/*
  Communications with backend
*/
const getBlogById = async (blogid) => {
  try {
    const response = await fetch(url + "/blogs/" + blogid);
    const blog = await response.json();

    console.log(blog);
    return blog;
  } catch (e) {
    console.log(e.message);
  }
};

const getBlogsByUserId = async (ShowUserid) => {
  try {
    const response = await fetch(url + "/blogs/ByUser/" + ShowUserid);
    const blogs = await response.json();

    console.log(blogs);
    return blogs;
  } catch (e) {
    console.log(e.message);
  }
};

const getUserById = async (userid) => {
  try {
    const options = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(url + "/user/" + userid, options);
    const users = await response.json();

    return users;
  } catch (e) {
    console.log(e.message);
  }
};

const getUserByIdForBlog = async (userid) => {
  try {
    const options = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(url + "/blogs/bloginfo/" + userid, options);
    const users = await response.json();

    return users;
  } catch (e) {
    console.log(e.message);
  }
};


const getBlogs = async () => {
  var searchText = search.value;

  try {
    const response = await fetch(url + "/blogs/search/" + searchText);
    const blogs = await response.json();

    console.log(blogs);
    return blogs;
  } catch (e) {
    console.log(e.message);
  }
};

const getRandomBlogs = async () => {
  try {
    const response = await fetch(url + "/blogs/randomblogs");
    const blogs = await response.json();

    console.log(blogs);
    return blogs;
  } catch (e) {
    console.log(e.message);
  }
};

const getPopularBlogs = async () => {
  try {
    const response = await fetch(url + "/blogs/popularblogs");
    const blogs = await response.json();

    console.log(blogs);
    return blogs;
  } catch (e) {
    console.log(e.message);
  }
};

const getUsers = async () => {
  try {
    const options = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(url + "/user", options);
    const users = await response.json();
    //createUserOptions(users);
  } catch (e) {
    console.log(e.message);
  }
};


const deleteBlog = async (id) => {
  
  var r = confirm("Oletko varma?");
  if(r==true){

  const options = {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
  };
  try {
    await fetch(url + '/blogs/' + id, options);
  } catch (e) {
    throw new Error(e.message);
  }
  renderUsersBlogs();
}
};


const addLike = async (id) => {

};


const removeLike = async (id) => {

};
/* ---------------------------------------------- */



/* 
  Listeners
*/
signupForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();

  var inputs = document
    .getElementById("signupForm")
    .getElementsByTagName("input");

  var params = {};

  for (var i = 0; i < inputs.length; i++) {
    var curr = inputs[i];
    if (curr.getAttribute("type") === "text") {
      params[curr.getAttribute("name")] = curr.value;
    }
    if (curr.getAttribute("type") === "password") {
      params[curr.getAttribute("name")] = curr.value;
    }
  }

  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  };
  const response = await fetch(url + "/auth/register", fetchOptions);
  const json = await response.json();
  console.log("user add response", json);
 
  if (!json.user) {
    alert('Rekisteröinti epäonnistui!');
  } else {

  // save token & user id
  sessionStorage.setItem("token", json.token);
  sessionStorage.setItem("loggedUserId", json.user.ID);

  //show/hide
  navMyblog.style.display = "block";
  navMyblog.href = "?ShowUserid=" + sessionStorage.getItem("loggedUserId");
  loginForm.style.display = "none";
  mainContainer.style.display = "block";
  frontpageContainer.style.display = "block";
  navLogout.style.display = "block";
  navSignup.style.display = "none";
  signupForm.style.display = "none";
  getUsers();
  alert('Rekisteröinti onnistui!');
  }
  window.location.reload();
});


loginForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();

  var inputs = document
    .getElementById("loginForm")
    .getElementsByTagName("input");

  var params = {};

  for (var i = 0; i < inputs.length; i++) {
    var curr = inputs[i];
    if (curr.getAttribute("type") === "text") {
      params[curr.getAttribute("name")] = curr.value;
    }
    if (curr.getAttribute("type") === "password") {
      params[curr.getAttribute("name")] = curr.value;
    }
  }

  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  };

  const response = await fetch(url + "/auth/login", fetchOptions);
  const json = await response.json();
  console.log("login response", json);

  if (!json.user) {
    alert(json.message);
  } else {

    // save token & user id
    sessionStorage.setItem("token", json.token);
    sessionStorage.setItem("loggedUserId", json.user.ID);

    // show/hide
    navMyblog.style.display = "block";
    navMyblog.href = "?ShowUserid=" + sessionStorage.getItem("loggedUserId");
    loginForm.style.display = "none";
    navLogout.style.display = "block";
    navLogin.style.display = "none";
    navSignup.style.display = "none";
    frontpageContainer.style.display = "block";
    signupForm.style.display = "none";
    searchResults.style.display = "none";
    mainContainer.style.display = "block";

    getUsers();

    alert("Kirjautuminen onnistui!");
    window.location.reload();
  }
});

navMyblog.addEventListener("click", async (evt)=>{
  navMyblog.setAttribute("class", "active")
  navLogin.setAttribute("class", "");
  navHome.setAttribute("class", "");
  navSignup.setAttribute("class", "")
});

navLogout.addEventListener("click", async (evt) => {
  evt.preventDefault();
  try {
    const options = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(url + "/auth/logout", options);
    const json = await response.json();
    console.log(json);

    // remove token
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("loggedUserId")
    alert("You have logged out");

    // show/hide
    navMyblog.href = "/";
    navMyblog.style.display = "none";
    navLogout.style.display = "none";
    navSignup.style.display = "block";
    navLogin.style.display = "block";
  } catch (e) {
    console.log(e.message);
  }
  window.location.reload();
});

navSignup.addEventListener("click", async (evt) => {
  evt.preventDefault();

  navSignup.setAttribute("class", "active");
  navLogin.setAttribute("class", "");
  navHome.setAttribute("class", "");
  navMyblog.setAttribute("class", "")

  searchResults.style.display = "none";
  loginForm.style.display = "none";
  signupForm.style.display = "block";
  frontpageContainer.style.display = "none";
  mainContainer.style.display = "none";
});

navLogin.addEventListener("click", async (evt) => {
  evt.preventDefault();

  navLogin.setAttribute("class", "active");
  navHome.setAttribute("class", "");
  navSignup.setAttribute("class", "");
  navMyblog.setAttribute("class", "")

  searchResults.style.display = "none";
  frontpageContainer.style.display = "none";
  loginForm.style.display = "block";
  signupForm.style.display = "none";
  mainContainer.style.display = "none";
});

navHome.addEventListener("click", async (evt) => {
  evt.preventDefault();

  navHome.setAttribute("class", "active");
  navLogin.setAttribute("class", "");
  navSignup.setAttribute("class", "");
  navMyblog.setAttribute("class", "");

  frontpageContainer.style.display = "block";
  signupForm.style.display = "none";
  loginForm.style.display = "none";
  searchResults.style.display = "none";
});

// when app starts, check if token exists and hide login form etc.
if (sessionStorage.getItem("token")) {
  navMyblog.href = "?ShowUserid=" + sessionStorage.getItem("loggedUserId")
  frontpageContainer.style.display = "block";
  loginForm.style.display = "none";
  signupForm.style.display = "none";
  navLogout.style.display = "block";
  navLogin.style.display = "none";
  navSignup.style.display = "none";
  navMyblog.style.display = "block";
  getUsers();
}

function isnull(value, replacingValue) {
  var returnValue = replacingValue;
  try {
      if (value != undefined) {
          if (value != 'null' && value != 'Unknown') {
              returnValue = value;
          }
      }
  } catch (error) {
      console.log(error);
  }
  return returnValue;
}

function openMenu() {
  const nav = document.getElementById("topnavbar");
  if (nav.className === "topnav") {
    nav.className += " responsive";
  } else {
    nav.className = "topnav";
  }
}
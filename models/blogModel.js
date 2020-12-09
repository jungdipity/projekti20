"use strict";
const pool = require("../database/db");
const promisePool = pool.promise();

const getAllBlogs = async () => {
  try {
    const [rows] = await promisePool.query("SELECT * FROM post");
    //console.log("rows", rows);
    return rows;
  } catch (e) {
    console.log("blogModel error:", e.message);
    return { error: "Error in getAllBlogs" };
  }
};

const getBlogById = async (id) => {
  try {
    const [rows] = await promisePool.execute(
      "SELECT * FROM post WHERE ID = ?",
      [id]
    );
    //console.log("rows", rows);
    return rows;
  } catch (e) {
    console.log("blogModel error:", e.message);
    return { error: "Error in getBlogById" };
  }
};

const getBlogsByUserId = async (id) => {
  try {
    const [rows] = await promisePool.execute(
      "SELECT * FROM post WHERE UserID = ? ORDER BY ID DESC",
      [id]
    );
    //console.log("rows", rows);
    return rows;
  } catch (e) {
    console.log("blogModel error:", e.message);
    return { error: "Error in getBlogsByUserId"};
  }
};

const getBlogBySearchParam = async (searchparam) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM post WHERE content like ("%' +
        searchparam +
        '%") or title like ("%' +
        searchparam +
        '%")'
    );
    //console.log("rows", rows);
    return rows;
  } catch (e) {
    console.log("blogModel error:", e.message);
    return { error: "Error in getBlogBySearchParam" };
  }
};

const getRandomBlogs = async () => {
  try {
    const [rows] = await promisePool.execute(
      "SELECT * FROM post ORDER BY RAND() LIMIT 10"
    );
    //console.log("rows", rows);
    return rows;
  } catch (e) {
    console.log("blogModel error:", e.message);
    return { error: "Error in getRandomBlogs" };
  }
};

const getPopularBlogs = async () => {
  try {
    const [rows] = await promisePool.execute(
      "SELECT * FROM post ORDER BY amountOfLikes DESC LIMIT 10"
    );
    return rows;
  } catch (e) {
    console.log("blogModel error:", e.message);
    return { error: "Error in getPopularBlogs" };
  }
};

const addLike = async (id) => {
  try {
    const [rows] = await promisePool.execute(
      "UPDATE post SET amountOfLikes=amountOfLikes+1 WHERE ID = ?",
      [id]
    );
    console.log("rows", rows);
    return await getBlogById(id);
  } catch (e) {
    console.log("blogModel error:", e.message);
    return { error: "Error in addLike" };
  }
};

const removeLike = async (id) => {
  try {
    const [rows] = await promisePool.execute(
      "UPDATE post SET amountOfLikes=amountOfLikes-1 WHERE ID = ? AND amountOfLikes>0",
      [id] 
    );
    console.log("rows", rows);
    return await getBlogById(id);
  } catch (e) {
    console.log("blogModel error:", e.message);
    return { error: "Error in removeLike" };
  }
};

const addBlog = async (params) => {
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO post (Title, CreateAt, Content, Image, UserID) VALUES (?, NOW(), ?, ?, ?)',
        params
    );
    return rows;
  } catch (e) {
    console.log('blogModel error', e.message);
    return {error: 'Error in addBlog'};
  }
}

const updateBlog = async (params) => {
  try {
    const [rows] = await promisePool.execute(
        'UPDATE post SET Title = ?, UpdateAt = NOW(),  Content = ?, Image = ? WHERE ID = ?',
        params
    );
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.log('blogModel error', e.message);
    return {error: 'Error in updateBlog'};
  }
}

const deleteBlog = async (id) => {
  try {
    const [rows] = await promisePool.execute('DELETE FROM post WHERE ID = ?',
        [id]);
    return rows;
  } catch (e) {
    console.log('blogModel error', e.message);
    return {error: 'Error in deleteBlog'};
  }
}

const getBlogInfoFromUserById = async (ID) => {
  try {
    const [rows] = await promisePool.execute('SELECT Description, ProfileImage, BlogName FROM user WHERE ID = ?', [ID]);
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.log('userModel error:', e.message);
    return {error: 'Error'};
  }
}

module.exports = {
  getAllBlogs,
  getBlogById,
  getBlogBySearchParam,
  getRandomBlogs,
  addLike,
  removeLike,
  addBlog,
  updateBlog,
  deleteBlog,
  getBlogsByUserId,
  getPopularBlogs,
  getBlogInfoFromUserById
};

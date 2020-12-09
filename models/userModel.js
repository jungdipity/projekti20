"use strict";
const pool = require("../database/db");
const promisePool = pool.promise();

const getAllUsers = async () => {
    try {
      const [rows] = await promisePool.query('SELECT * FROM user');
      console.log('rows', rows);
      return rows;
    } catch (e) {
      console.log('userModel error:', e.message);
      return {error: 'Error'};
    }
  };

  const getUserById = async (ID) => {
    try {
      const [rows] = await promisePool.execute('SELECT * FROM user WHERE ID = ?', [ID]);
      console.log('rows', rows);
      return rows;
    } catch (e) {
      console.log('userModel error:', e.message);
      return {error: 'Error'};
    }
  }


  const addUser = async (params) => {
    try {
      console.log(params)
      const [rows] = await promisePool.execute(
          'INSERT INTO user (Username, Email, Password) VALUES (?, ?,?)',
          params
      );
      console.log('rows', rows);
      return rows;
    } catch (e) {
      console.log('userModel error:', e.message);
      return {error: 'Error'};
    }
  }

  const getUserLogin = async (params) => {
    try {
      console.log('getUserLogin', params);
      const [rows] = await promisePool.execute(
          'SELECT * FROM user WHERE Username = ?;',
          params);
      return rows;
    } catch (e) {
      console.log('error', e.message);
    }
  };

  const updateUser = async (params) => {
    try {
      const [rows] = await promisePool.execute(
          'UPDATE user SET BlogName = ?, Description = ?, ProfileImage = ? WHERE ID = ?',
          params
      );
      console.log('rows', rows);
      return rows;
    } catch (e) {
      console.log('blogModel error', e.message);
      return {error: 'Error in updateBlog'};
    }
  }

  module.exports = {
    getAllUsers,
    getUserById,
    addUser,
    updateUser,
    getUserLogin,
  };
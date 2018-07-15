const DaoBase = require('./src/dao/base.dao');
const Login = require('./src/dao/login.dao');

const test = new DaoBase();
const login = new Login();

//test.putItem();

Login.login('admin', 'password');

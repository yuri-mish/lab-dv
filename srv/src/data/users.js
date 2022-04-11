'use strict';

const users = [
  {
    ref: '0176413761b289e6d64c2c14a758c1c7',
    token: '0hy894hf0dlkfh9oinv',
    validTo: 'anyDate',
    isAdmin: false,
    branch: '',
    name: '',
    branches: []
  },
];

class Users {
  constructor() {
    this.users = users;
  }

  add(user) {
    const exists = this.users.find(u => (u.name === user.name));
    if (!exists) this.users.push(user);
  }

  findByName(name) {
    return this.users.find(user => (user.name === name));
  }

  deleteByName(name) {
    for (let i = this.users.length; i--;) {
      if (this.users[i].name === name) {
        this.users.splice(i, 1);
      }
    }
  }

  static create() {
    return new Users();
  }
}

module.exports = Users.create();

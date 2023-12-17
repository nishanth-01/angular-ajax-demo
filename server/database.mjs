class User {
  id;//string /^\d{4}$/
  role;//string 'admin' or 'general'
  password;//string /[a-z]{4}/
  sessionId;//string /\w{8}/

  constructor(id, role, password, sessionId) {
    this.id = id;
    this.role = role;
    this.password = password;
    this.sessionId = sessionId;
  }
}

export default class DataBase {
  mockUsers = [];
  init () {
    for(let i=1000; i<1032; i++) {
      this.mockUsers
        .push(new User(i.toString(10), (i%2)?'admin':'general', 'asb', '1'));
    }
  }

  close () {}

  // errors '' | 'notfound' | 'invalid' | 'dberror'
  getUser(userId) {
    const user = this.mockUsers.find((u) =>  u.id === userId);
    if(!user) return { err: 'notfound' };
    return { user: user, err: '' };
  }
  // return a array that should be 'JSON.stringify()' able
  getUsers() {
    return { users: this.mockUsers, err: '' };
  }
  // return error as 'string', empty string on success
  // unset session id if 'sessionId' is null
  // session id is a 'number'
  setSessionId(userId, sessionId) {
    return '';
  }
}

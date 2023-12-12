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

const mockUsers = [
  new User('1234', 'general', 'asb', '1'),
  new User('1235', 'general', 'asb', '1'),
  new User('1236', 'admin',   'asb', '1'),
  new User('1237', 'admin',   'asb', '1'),
  new User('1238', 'admin',   'asb', '1'),
  new User('1239', 'general', 'asb', '1'),
  new User('1240', 'general', 'asb', '1'),
];

export default class DataBase {
  init () {
    // throw exception if failed
  }
  close () {}

  // errors '' | 'notfound' | 'invalid' | 'dberror'
  getUser(userId) {
    const user = mockUsers.find((u) =>  u.id === userId);
    if(!user) return { err: 'user not found' };
    return { user: user, err: '' };
  }
  // return a array that should be 'JSON.stringify()' able
  getUsers() {
    return { users: mockUsers, err: '' };
  }
  // return error as 'string', empty string on success
  // unset session id if 'sessionId' is null
  // session id is a 'number'
  setSessionId(userId, sessionId) {
    return '';
  }
}

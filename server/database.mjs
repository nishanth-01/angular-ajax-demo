class User {
  id;//string /^\d{4}$/
  role;//string 'admin' or 'general'
  password;//string /[a-z]{4}/
  sessionId;//string /\w{8}/
}

const mockUser = new User('1234', 'general', 'asb', 'kdf43h_1');
const mockUsers = [
  new User('1234', 'general', 'asb', 'kdf43h_1'),
  new User('1235', 'general', 'asb', 'kdf43h_2'),
  new User('1236', 'admin', 'asb', 'kdf43h_3'),
  new User('1237', 'admin', 'asb', 'kdf43h_4'),
  new User('1238', 'admin', 'asb', 'kdf43h_5'),
  new User('1239', 'general', 'asb', 'kdf43h_6'),
  new User('1240', 'general', 'asb', 'kdf43h_7'),
];

export default class DataBase {
  init () {
    // throw exception if failed
  }
  close () {}

  getUser(userId) {
    return mockUser;
  }
  // return a array that should be 'JSON.stringify()' able
  getUsers() {
    return mockUsers;
  }
  // return should be string, empty string on success
  // unset session id if 'sessionId' is null
  // session id is a 'number'
  setSessionId(userId, sessionId) {}
}

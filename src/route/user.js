// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class User {
  //ДЕ буде зберізатися в приватній змінній list
  static #list = []

  constructor(email, login, password) {
    this.email = email;
    this.login = login;
    this.password = password;
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password;

  static add = (user) => {
   this.#list.push(user)
  }

  static getList = () => this.#list
  

  static getById = (id) => 
    this.#list.find((user) => user.id === id)

    static deleteById = (id) => {
      const index = this.#list.findIndex(
        (user) => user.id === id,
      )

      if(index !== -1) {
        this.#list.splice(index, 1)
        return true;
      }else{
        return false;
      }
    }
  
    static updateById = (id, data) => {
      const user = this.getById(id)

      if(user) {
        this.update(user,data)

        return true;
      }else{
        return false;
      }
    }
  
  static update = (user,{email}) => {
    if(email) {
      user.email = email
    }
  }
}

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки


router.post('/user-create', function (req, res) {
  const {email, login, password} = req.body;

  const user = new User(email, login, password);

  User.add(user)
  console.log(User.getList(user))

  res.render('user-success-info', {  
    style: 'user-success-info',
    info: 'Користувач створенний',
  })
 
})

router.get('/user-delete', function (req, res) {
  const { id } = req.query;

 User.deleteById( Number(id))


  res.render('user-success-info', {
    style: 'user-success-info',
    info: 'Користувач видаленний',

  })
 
})

router.post('/user-update', function (req, res) {
  const {email,password,id} = req.body;
  
  let result = false;

  const user = User.getById(Number(id))

  

  if(user.verifyPassword(password)) {
    User.update(user, {email})
    result = true;
  }

 console.log(email,password,id)

  res.render('user-success-info', {  
    style: 'user-success-info',
    info: result ? 'Оновлення Емайл пошти': 'Помилка',
  })
 
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router

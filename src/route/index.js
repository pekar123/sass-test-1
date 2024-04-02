// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
  //Приватне поле, яке містить список створених товарів
  static #list = []

  constructor(name, price, description,createDate ) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.createDate = () => {
      this.date = new Date().toISOString()
    };
    this.id = Math.floor(Math.random() * 5) + 1;
  }
  
  //Повертає список створених товарів
  static getList = () => this.#list
  //Додає переданий в аргументі товар в список створених товарів в приватному полі #list
  static add = (product) => {
    this.#list.push(product)
  }
  //Знаходить товар в списку створених товарів за допомогою ID, яке повинно бути числом, та яке передається як аргумент
  static getById = (id) => 
    this.#list.find((product) => product.id === id)
    //Оновлює властивості аргументу data в об’єкт товару, який був знайдений по ID. Можна оновлювати price, name, description
    static updateById = (id, data) => {
      const product = this.getById(id)
      const {name,price,description} = data

      if(product) {
        if(name) {
          product.name = name
        }

        if(price) {
          product.price = price
        }

        if(description) {
          product.description = description
        }
        return true
      }else{
        return false
      }
    }
    //Видаляє товар по його ID зі списку створених товарів
    static deleteById = (id) => {
      const index = this.#list.findIndex((product) => product.id === id)

      if(index !== -1){
        this.#list.splice(index, 1)
        return true;
      }else{
        return false;
      }
    }
}

router.get('/product-create', function (req, res) {

  res.render('product-create', {
    style: 'product-create',
    
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/product-create', function (req, res) {
  const {name, price, description } = req.body;

  const product = new Product(name,price,description)

  Product.add(product)
  console.log(Product.getList(product))
  res.render('product-alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-alert',
    info: 'Товар був успішно створений'
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/product-alert', function (req, res) {
  // res.render генерує нам HTML сторінку
  
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-alert', {
    style: 'product-alert',
    info: 'Товар був успішно створений'
    

  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/product-list', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = Product.getList()
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('/', {
    style: '/',
    

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },

  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/product-edit', function (req, res) {
  const {id} = req.query
  //за допомогою id вам потрібно отримати об’єкт сутності
  //product з таким id
  const product = Product.getById(Number(id))
  console.log(product)

  if (product) {
    // ↙️ cюди вводимо назву файлу з сontainer
    return res.render('product-edit', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'product-edit',

      data: {
        name: product.name,
        price: product.price,
        id: product.id,
        description: product.description,
      },
    })
  } else {
    return res.render('product-alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'product-alert',
      info: 'Продукту за таким ID не знайдено',
    })
  }
})

router.post('/product-edit', function (req, res) {
  const {name, price, description,id} = req.body

  const product = Product.updateById(Number(id),{
    name,
    price,
    description,
  })
  console.log(id)
  console.log(product)

  if(product) {
    res.render('product-alert', {
      style: 'product-alert',
      info: 'Інформація про товар оновлена',
    })
  }else{
    res.render('product-alert', {
      style: 'product-alert',
      info: 'Сталася помилка',
  })
  }
  
  // ↑↑ сюди вводимо JSON дані
})

router.get('/product-delete', function (req, res) {
  const {id} = req.query
  //за допомогою id вам потрібно отримати об’єкт сутності
  //product з таким id
  const product = Product.deleteById(Number(id))
  console.log(product)

  // ↙️ cюди вводимо назву файлу з сontainer
    return res.render('product-alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'product-alert',
      info: 'Видалений'

    })
 
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router

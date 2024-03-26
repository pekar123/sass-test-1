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
    this.createDate = new Date();
    this.id = Math.random();
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

      if(product){
        this.update(product,data)
        return true;
      }else{
        return false;
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

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',
  })
  // ↑↑ сюди вводимо JSON дані
})

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
  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/alert', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = Product.getList()
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-list', {
    style: 'alert',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },

  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/product-list', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = Product.getList()
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-list', {
    style: 'product-list',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },

  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router

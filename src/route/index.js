// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Product {
  static #list =[]

  static #count = 0

  constructor(img,title,description,category,price,amount=0,){
    this.id = ++Product.#count //генеруємо унікальний id товару
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }

  static add = (
    ...data
  ) => {
    const newProduct = new Product(
      ...data
    )  
    this.#list.push(newProduct)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) => {
    return this.#list.find((product)=> product.id === id)
  }

  static getRandomList = (id) => {
    //Фільтруємо товари, щоб вилучити той, з яким порівнюємо id
    const filteredList = this.#list.filter((product) => product.id !==id,)
    //Відсортовуємо за допомогою Math.random() та перемішуємо масив
    const shuffledList = filteredList.sort (
      () => Math.random() - 0.5,
    )
   //Повертаємо перші 3 елементи з перемішаного масиву
    return shuffledList.slice(0,3)
  }

} 

Product.add (
	'https://picsum.photos/200/300',
	'Компютер Artline Gaming (X43v31) AMD Ryzen 5 360/',
	'AMD Ryzen 5 3600 (3.6 - 4.2 Ггц) / RAM 16 Гб / HDD 1 Tб + 55D 480 Гб / ',
	[
		{ id: 1, text: 'Готовий до відправки' },
		{ id: 2, text: 'Топ продажів' },	
	],
	27000,
  10,
)
Product.add (
	'https://picsum.photos/200/300',
	'Компютер ProLine Business (8112p19) Intel Core i5 9400F/',
	'Intel Core i5 9400F (2.9 - 4.1 Ггц) / RAM 8 Гб / HDD 1 Tб/Intel UHD Gtafics 630 / DDR 4 / ',
	[{ id: 2, text: 'Топ продажів' }],
	20000,
  10,
)
Product.add (
	'https://picsum.photos/200/300',
	'Компютер ProLine Worksstation (w87p03) Intel Xeon E-2226C/',
	' Intel Xeon E-2226C (3.4 - 4.7 Ггц) / RAM 16 Гб / SSD 512 Гб/nVidia Quadro P620, 2Гб / DDR 4 / ',
	[{ id: 1, text: 'Готовий до відправки' }],
	40000,
  10,
)

class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1

  static #count = 0
  static #list = []

  static #bonusAccount = new Map()

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }

  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
    ) => {
      const amount = this.calcBonusAmount(price)

      const currentBalance = Purchase.getBonusBalance(email)

      const updateBalance = currentBalance + amount - bonusUse

      Purchase.#bonusAccount.set(email,updateBalance)

      console.log(email,updateBalance)

      return amount
    }
  

  constructor (data, product) {
    this.id = ++Purchase.#count

    this.firstname = data.firstname
    this.lastname = data.lastname

    this.phone = data.phone
    this.email = data.email

    this.comment = data.comment || null

    this.bonus = data.bonus || 0

    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount

    this.product = product
  }

  

  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)
    
    this.#list.push(newPurchase)

    return newPurchase
  }

  static getList = () => {
    return Purchase.#list.reverse().map((purchase) => ({
      id: purchase.id,
      product: purchase.product.title,
      totalPrice: purchase.totalPrice,
      bonus: Purchase.calcBonusAmount(purchase.totalPrice),
    }))
  }

  static getListInfo = () => {
    return Purchase.#list.reverse().map((purchase) => ({
      id: purchase.id,

      firstname: purchase.firstname,
      lastname: purchase.lastname,
      phone: purchase.phone,
      email: purchase.email,

      product: purchase.product.title,
      comment: purchase.comment,
      
      productPrice: purchase.productPrice,
      deliveryPrice: purchase.deliveryPrice,
      totalPrice: purchase.totalPrice,
      bonus: Purchase.calcBonusAmount(purchase.totalPrice),
    }))
  }

  static getById = (id) => {
    return Purchase.#list.find((item)=> item.id === id)
  }

 static updateById = (id,data) => {
   const purchase = this.getById(id)
   const {firstname,lastname,email,phone} = data

   if(purchase) {
    if(firstname) {
      purchase.firstname = firstname
    }

    if(lastname) {
      purchase.lastname = lastname
    }

    if(email) {
      purchase.email = email
    }

    if(phone) {
      purchase.phone = phone
    }
    return true
   }else{
    return false
   }
 }

  static updateById = (id,data) => {
    const purchase = Purchase.getById(id)

    if(purchase){
      if(data.firstname)
      purchase.firstname = data.firstname
      if(data.lastname)
      purchase.lastname = data.lastname
      if(data.phone)
      purchase.phone = data.phone
      if(data.email)
      purchase.email = data.email

      return true
    }else{
      return false
    }
  }
}

class Promocode {
  static #list = []

  constructor(name,factor) {
    this.name = name
    this.factor = factor
  }

  static add = (name, factor) => {
    const newPromocode = new Promocode(name,factor)
    Promocode.#list.push(newPromocode)
    return newPromocode
  }

  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}

Promocode.add('SUMMER2023', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALE25', 0.75)

router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-index',

    data: {
      list: Product.getList(),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/purchase-product', function (req, res) {
  // res.render генерує нам HTML сторінку
  const id = Number(req.query.id)
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-product', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-product',

    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id)
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/purchase-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  if(amount < 1){
    return res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',
  
      data: {
        message: 'Помилка',
        info: 'Некоректна кількість товару',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  const product = Product.getById(id);
  
  if(product.amount < 1){
    return res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такої кількості товару немає в наявності',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  console.log(product,amount)

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)
    
  
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-create',

    data: {
      id:product.id,
      cart: [
        {
          text: `${product.title} (${amount}) шт`,
          price: productPrice,
        },
        {
          text:`Доставка`,
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/purchase-submit', function (req, res) {
  
  // res.render генерує нам HTML сторінку
  const id = Number(req.query.id)

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    email,
    phone,

    promocode,
    bonus,
    comment,
  } = req.body

  const product = Product.getById(id)

  if(!product) {
    return res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',
  
      data: {
        message: 'Помилка',
        info: 'Товар не знайдено',
        link: `/purchase-list`,
      },
    })
  }

  if(product.amount < amount) {
    return res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',
  
      data: {
        message: 'Помилка',
        info: 'Товара немає в потрібній кількості',
        link: `/purchase-list`,
      },
    })
  
  }

  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus) 
  ) 
  {
    return res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',
  
      data: {
        message: 'Помилка',
        info: 'Дані вказані не коректно',
        link: `/purchase-list`,
      },
    })
  }

  if (!firstname || !lastname || !email || !phone ) {
    return  res.render ('alert', {
      style: 'alert',

      data: {
        message: `Заповніть обов'язкові поля`,
        info: 'Некоректні дані',
        link: `/purchase-list`,
      }
    }) 
  }
//Бонуси для обрахунку знижки на товар
  if(bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email)

    console.log(bonusAmount)

    if(bonus > bonusAmount) {
      bonus = bonusAmount
    }

    Purchase.updateBonusBalance(email,totalPrice,bonus)
    // totatlPrice = totalPrice - bonus
    totalPrice -=bonus
  }else{
    Purchase.updateBonusBalance(email,totalPrice,0)
  }
//Промоко 
  if(promocode) {
    promocode = Promocode.getByName(promocode)

    if(promocode) {
      totalPrice = Promocode.calc(promocode,totalPrice)
    }
  }

  if(totalPrice < 0) totalPrice = 0

  const purchase = Purchase.add (
    {
    totalPrice,  
    productPrice,
    deliveryPrice,
    amount,
    bonus,

    firstname,
    lastname,
    phone,
    email,

    promocode,
    comment,
  }, 
  product,
  )

  console.log(purchase)

  return res.render('alert', {
    style: 'alert',

    data: {
      message: 'Успішно',
      info: 'Замовлення створено',
      link: `/purchase-list`,
    },
  })
})

router.get('/purchase-list', function (req, res) {
  // res.render генерує нам HTML сторінку
  // console.log(bonus)

  const list = Purchase.getList()
  console.log('purchase-list:', list)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-list',

    data: {
      purchases: {
        list,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/purchase-info', function (req, res) {
  // res.render генерує нам HTML сторінку
  // console.log(bonus)
  const id = Number(req.query.id)
  const info = Purchase.getListInfo(id)
  console.log('purchase-info:', info)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-info', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-info',

    data: {
      purchases: {
        info,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/purchase-change', function (req, res) {
  // res.render генерує нам HTML сторінку
  // console.log(bonus)
  const id = Number(req.query.id)
  
  const list = Purchase.getList(id)
  console.log('purchase-change:', list)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-change', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-change',

    data: {
      purchases: {
        list,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/purchase-change', function (req, res) {
  const {id} = req.query
  //за допомогою id вам потрібно отримати об’єкт сутності
  //product з таким id
  const purchase = Purchase.getById(Number(id))
  console.log(purchase)

  if (purchase) {
    // ↙️ cюди вводимо назву файлу з сontainer
    return res.render('purchase-change', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'purchase-change',

      data: {
        firstname: purchase.firstname,
        lastname: purchase.lastname,
        email: purchase.email,
        phone: purchase.phone,
      },
    })
  } else {
    return res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',
      info: 'Продукту за таким ID не знайдено',
    })
  }
})

router.post('/purchase-change', function (req, res) {
 const {id,firstname,lastname,email,phone,}= req.body;

 const purchase = Purchase.updateById(Number(id), {
  firstname,
  lastname,
  email,
  phone,
 })

 console.log(id)
console.log(purchase)



  // ↙️ cюди вводимо назву файлу з сontainer
  if(purchase){
    return res.render('alert', {
      style: 'alert',
  
      data: {
        message: 'Успішно',
        info: 'Інформація про товар оновлена',
        link: `/purchase-list`,
      },
    })
  }else{
    return res.render('alert', {
      style: 'alert',
  
      data: {
        message: 'Успішно',
        info: 'Сталася помилка',
        link: `/purchase-list`,
      },
    })
  }
  // ↑↑ сюди вводимо JSON дані
})



// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router

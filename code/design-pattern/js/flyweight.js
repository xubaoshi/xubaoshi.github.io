/**
 * 享元模式
 *
 * 简介：
 * 运行共享技术避免大量拥有相同内容的小类的开销，是大家共享一个类
 * 在程序设计中，有时需要生产大量细粒度的类实例来表示数据，如果能发现这些实例除了几个参数外，基本相同，就可以采用享元模式大幅度减少需要实例化的类的数量。
 * 把那些参数移动到类实例外面，在方法调用时再将他们传递进来
 *
 * 前端使用场景：
 * 1.应用在内存里大量相似的对象上
 * 2.应用在 DOM 层上，可以用在中央事件管理器上用来避免父容器里的每个子元素都附加事件句柄
 * http://c.biancheng.net/view/1371.html
 */

// demo1(未优化)
;(function() {
  var Book = function(
    id,
    title,
    author,
    genre,
    pageCount,
    publisherID,
    ISBN,
    checkoutDate,
    checkoutMember,
    dueReturnDate,
    availability
  ) {
    this.id = id
    this.title = title
    this.author = author
    this.genre = genre
    this.pageCount = pageCount
    this.publisherID = publisherID
    this.ISBN = ISBN
    this.checkoutDate = checkoutDate
    this.checkoutMember = checkoutMember
    this.dueReturnDate = dueReturnDate
    this.availability = availability
  }
  Book.prototype = {
    getTitle: function() {
      return this.title
    },
    getAuthor: function() {
      return this.author
    },
    getISBN: function() {
      return this.ISBN
    },
    /*其它get方法在这里就不显示了*/

    // 更新借出状态
    updateCheckoutStatus: function(
      bookId,
      newStatus,
      checkoutDate,
      checkoutMember,
      newReturnDate
    ) {
      this.id = bookId
      this.availability = newStatus
      this.checkoutDate = checkoutDate
      this.checkoutMember = checkoutMember
      this.dueReturnDate = newReturnDate
    },
    //续借
    extendCheckoutPeriod: function(bookId, newReturnDate) {
      this.id = bookId
      this.dueReturnDate = newReturnDate
    },
    //是否到期
    isPastDue: function(bookId) {
      var currentDate = new Date()
      return currentDate.getTime() > Date.parse(this.dueReturnDate)
    }
  }
})

// 同一本书 title, author, genre, pageCount, publisherID, ISBN 无论是谁借基本信息都是一样的

// demo1(享元模式)
;(function() {
  // 内部状态
  var Book = function(title, author, genre, pageCount, publisherID, ISBN) {
    this.title = title
    this.author = author
    this.genre = genre
    this.pageCount = pageCount
    this.publisherID = publisherID
    this.ISBN = ISBN
  }

  // Book 工厂 单例
  var BookFactory = function() {
    var exsitingBooks = {}
    return {
      createBook: function(title, author, genre, pageCount, publisherID, ISBN) {
        // 查找之前是否已经创建
        var exsitingBook = exsitingBooks[ISBN]
        if (exsitingBook) {
          return exsitingBook
        } else {
          var book = new Book(
            title,
            author,
            genre,
            pageCount,
            publisherID,
            ISBN
          )
        }
      }
    }
  }

  // 外部状态
  var BookRecordManager = function() {
    var bookRecordDatabase = {}
    return {
      // 添加借书记录
      addBookRecord: function(
        id,
        title,
        author,
        genre,
        pageCount,
        publisherID,
        ISBN,
        checkoutDate,
        checkoutMember,
        dueReturnDate,
        availability
      ) {
        var book = bookFactory.createBook(
          title,
          author,
          genre,
          pageCount,
          publisherID,
          ISBN
        )
        bookRecordDatabase[id] = {
          checkoutMember: checkoutMember,
          checkoutDate: checkoutDate,
          dueReturnDate: dueReturnDate,
          availability: availability,
          book: book
        }
      },
      updateCheckoutStatus: function(
        bookId,
        newStatus,
        checkoutDate,
        checkoutMember,
        newReturnDate
      ) {
        var record = bookRecordDatabase[bookId]
        record.availability = newStatus
        record.checkoutDate = checkoutDate
        record.checkoutMember = checkoutMember
        record.dueReturnDate = newReturnDate
      },
      extendCheckoutPeriod: function(bookId, newReturnDate) {
        bookRecordDatabase[bookId].dueReturnDate = newReturnDate
      },
      isPastDue: function(bookId) {
        var currentDate = new Date()
        return (
          currentDate.getTime() >
          Date.parse(bookRecordDatabase[bookId].dueReturnDate)
        )
      }
    }
  }
})()

/**
 * 享元模式是一个提高程序效率和性能的模式，会大大加快程序的运行速度，应用场合较多。
 */

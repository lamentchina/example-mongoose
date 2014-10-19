var koala = require('koala')
  ,mongoose = require('mongoose')
  ,Schema = mongoose.schema;
var app = koala();
mongoose.connect('mongodb://127.0.0.1/test');
var UsersSchema = new Schema({
  /**
   * 用户名
   * @type {[type]}
   */
  userName: {
    type: String,
    index: true,
    required: true,
    unique: true
  },
  /**
   * 账号类型
   * @type {Number} 1 个人用户, 2 组织用户
   */
  type: {
    type: Number,
    required: true,
    default: 1
  },
  /**
   * 邮箱地址
   * @type {String}
   */
  email: {
    type: String,
    index: true,
    required: true,
    unique: true
  },
  /**
   * 当前状态
   * @type {Number} // TODO 值待定
   */
  status: Number,
  /**
   * 最后登录时间
   * @type {Date}
   */
  lastLoginAt: Date
});

UsersSchema.statics.add = function (obj) {
  yield this.create({
    userName: obj.userName
    , email: obj.email
  }).save();
};

module.exports = mongoose.model('Users', UsersSchema);
app.use(function(){

  yield this.model('Users').add({ userName: 'tom', email:'admin@javapk.net'});
  console.log('save success ~ ')
});

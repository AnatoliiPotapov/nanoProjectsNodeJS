var mongoose = require('mongoose');


var PostsSchema = new mongoose.Schema({
  name: String, // Название эксперимента
  short_description: String, // Короткое описание
  tags: [{type:String}], // Набор тегов
  date:Number,
  author:String, //  Ссылка на автора
  deleted:Boolean, // Был ли эксперимент удален пользователем
  lot_number:String, // Лот номер для контроля качества
});

PostsSchema.methods.delete = function() {
  this.deleted = true;
}

mongoose.model('Post', PostsSchema);

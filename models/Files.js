var mongoose = require('mongoose');

var FileSchema = new mongoose.Schema({
  name: String, // Название файла
  short_description: String, // Короткое описание
  creation_time:Number, // Время создания
  actual_time:Number, // Времяна временной шкале
  author:String, //  Ссылка на автора
  link:String // Ссылка на файл
});

mongoose.model('File', FileSchema);

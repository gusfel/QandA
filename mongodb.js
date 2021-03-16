import mongoose from 'mongoose';

const { Schema } = mongoose;

mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });

const questionsSchema = new Schema({
  question_id: Schema.Types.ObjectId,
  product_id: Number,
  question_body: String,
  question_date: Date,
  asker_name: String,
  question_helpfulness: Number,
  question_reported: Boolean,
  answers: [{
    type: Schema.Types.ObjectId,
    ref: 'Answer',
  }],
});

const answersSchema = new Schema({
  _question_id: { type: Schema.Types.ObjectId, ref: 'Question' },
  answer_id: Number,
  answer_body: String,
  answer_date: Date,
  answerer_name: String,
  answer_helpfulness: Number,
  answer_reported: Boolean,
  photos: [{
    type: Schema.Types.ObjectId,
    ref: 'Photo',
  }],
});

const photoSchema = new Schema({
  _answer_id: { type: Schema.Types.ObjectId, ref: 'Answer' },
  photo_url: String,
});

const Questions = mongoose.model('Question', questionsSchema);
const Answers = mongoose.model('Answer', answersSchema);
const Photos = mongoose.model('Photo', photoSchema);

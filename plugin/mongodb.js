import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/zguiyong', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
mongoose.set('useCreateIndex', true);

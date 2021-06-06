import mongoose from 'mongoose';

mongoose.connect(process.env.MongoDBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
mongoose.set('useCreateIndex', true);

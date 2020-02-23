import mongoose from 'mongoose'

mongoose.connect(
	'mongodb+srv://root:1234@cluster0-mtpng.mongodb.net/test?retryWrites=true&w=majority',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
)
mongoose.set('useCreateIndex', true)
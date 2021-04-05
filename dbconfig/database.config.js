// module.exports = {
//     devUrl: 'mongodb://localhost:27017/dummy-data',
//     productionurl:''
// }
const mongoose= require("mongoose");
const uri = `mongodb+srv://arjunwinklix:ulxO3pZu2YySe0f9@cluster0.v7a1w.mongodb.net/callMyMover?retryWrites=true&w=majority`;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false ,
  useCreateIndex: true
})
.then(() => {
  console.log("MongoDB Connected…")
})
.catch(err => console.log(err))

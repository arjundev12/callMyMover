const mongoose= require("mongoose");

// mangoose.connect("mongodb://localhost:27017/call-my-mover", {
//   useNewUrlParser:true, 
//    useUnifiedTopology: true,
//    keepAlive: true,
//    useCreateIndex: true,
//    useFindAndModify: false
//   }).then(() => {
//   console.log("Connected to Database");
//   }).catch((err) => {
//     console.log(err);
//       console.log("Not Connected to Database ERROR! ");
//   });

const uri = "mongodb+srv://arjunwinklix:ulxO3pZu2YySe0f9@cluster0.v7a1w.mongodb.net/callMyMover?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB Connected…")
})
.catch(err => console.log(err))
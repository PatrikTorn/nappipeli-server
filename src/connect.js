import mongoose from 'mongoose';
const conString = `mongodb://PatrikTorn97:Vincit97@ds135255.mlab.com:35255/nappipeli`;

const connect = mongoose.connect(conString, {useNewUrlParser:true}, (err, success) => {
    if(err) console.log('Mongoose not connected', err)
    else console.log("Mongoose connected")
});

export default connect;

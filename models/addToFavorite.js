const mongoose=require("mongoose");
const addToFavorite=new mongoose.Schema({
userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    require:true
},
jobId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"PostJob",
    require:true
},
    
})

const favorite = mongoose.model("addToFavorite", addToFavorite);

module.exports = favorite;
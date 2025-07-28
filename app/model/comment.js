const mongoose=require('mongoose');

const commentSchema=new mongoose.Schema({
    post:{type:mongoose.Schema.Types.ObjectId,ref:'Post'},
    commentBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    comment:{type:String,required:true}
})

module.exports=mongoose.model('Comment',commentSchema);
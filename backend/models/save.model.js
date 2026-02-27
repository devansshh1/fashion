const  mongoose=require('mongoose');

const saveSchema=new mongoose.Schema({
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  contentType: {
    type: String,
    enum: ["food", "post"],
    required: true
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
},{
    timestamps:true
});
saveSchema.index({user:1, contentId:1, contentType:1}, {unique:true});

module.exports=mongoose.model('Save',saveSchema);

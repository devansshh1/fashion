const  mongoose=require('mongoose');

const saveSchema=new mongoose.Schema({
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodPartner",
    default: null
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
saveSchema.pre("validate", function () {
    if (!this.user && !this.partner) {
        throw new Error("Save must belong to a user or partner");
    }

    if (this.user && this.partner) {
        throw new Error("Save cannot belong to both user and partner");
    }
});

saveSchema.index(
    { user: 1, contentId: 1, contentType: 1 },
    { unique: true, partialFilterExpression: { user: { $type: "objectId" } } }
);
saveSchema.index(
    { partner: 1, contentId: 1, contentType: 1 },
    { unique: true, partialFilterExpression: { partner: { $type: "objectId" } } }
);

module.exports=mongoose.model('Save',saveSchema);

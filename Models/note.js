const { Schema, model } = require("mongoose")

const noteSchema = new Schema({
    userId: Schema.Types.ObjectId,
    note: String,
    shared: Array,
    elasticId: String
  })
  
  
  const Note = model("Note", noteSchema)
  module.exports = Note
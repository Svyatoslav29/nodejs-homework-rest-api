import pkg from 'mongoose';
import { MAX_AGE, MIN_AGE } from '../lib/constants';

const { Schema, SchemaTypes, model } = pkg;

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  age: {
    type: Number,
    min: MIN_AGE,
    max: MAX_AGE,
    default: null
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
   owner: {
     type: SchemaTypes.ObjectId,
     ref: 'user',
    }
}, {
    versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true, transform: function (doc, ret) {
        delete ret._id
        return ret
      }
    },
    toObject: { virtuals: true }
})

contactSchema.virtual('status').get(function() {
  if (this.age > 50) {
    return 'old'
  }
  return 'young'
})
  
const Contact = model('contact', contactSchema);

export default Contact
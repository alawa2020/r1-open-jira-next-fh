import mongoose, { Schema, Model } from 'mongoose'
import { Entry } from '../interfaces';

export interface IEntry extends Entry {};

const EntrySchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  createAt: {
    type: Number,
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'in-progress', 'finished'],
      message: '{VALUE} no es un estado permitido',
    },
    default: 'pending',
  }
});

const EntryModel: Model<IEntry> = mongoose.models.Entry || mongoose.model('Entry', EntrySchema );

export default EntryModel;
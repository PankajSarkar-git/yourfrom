import mongoose from "mongoose";

const responseAnswerSchema = new mongoose.Schema(
  {
    responseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Response",
      required: true,
      index: true,
    },

    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
      index: true,
    },

    fieldId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FormField",
      required: true,
      index: true,
    },

    fieldLabel: {
      type: String,
      required: true,
      trim: true,
    },

    fieldType: {
      type: String,
      required: true,
    },

    answer: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

responseAnswerSchema.index({
  responseId: 1,
  fieldId: 1,
});

export default mongoose.model("ResponseAnswer", responseAnswerSchema);
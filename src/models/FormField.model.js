import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: String,
      required: true,
      trim: true,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const formFieldSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "text",
        "textarea",
        "email",
        "password",
        "number",
        "phone",
        "url",

        "date",
        "time",
        "datetime-local",
        "month",
        "week",

        "select",
        "multiselect",
        "radio",
        "checkbox",

        "file",
        "image",

        "rating",
        "range",
        "color",

        "toggle",
        "switch",

        "hidden",

        "tags",
      ],
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    label: {
      type: String,
      required: true,
      trim: true,
    },

    placeholder: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    defaultValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    required: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    readOnly: {
      type: Boolean,
      default: false,
    },

    hidden: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
    },

    options: {
      type: [optionSchema],
      default: [],
    },

    multiple: {
      type: Boolean,
      default: false,
    },

    searchable: {
      type: Boolean,
      default: false,
    },

    clearable: {
      type: Boolean,
      default: false,
    },

    validation: {
      minLength: Number,

      maxLength: Number,

      min: Number,

      max: Number,

      regex: String,

      minSelect: Number,

      maxSelect: Number,

      fileTypes: [String],

      maxFileSize: Number,

      maxFiles: Number,
    },

    ui: {
      width: {
        type: String,
        enum: ["25%", "33%", "50%", "66%", "75%", "100%"],
        default: "100%",
      },

      helpText: String,

      prefix: String,

      suffix: String,

      icon: String,
    },

    conditions: [
      {
        fieldId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FormField",
        },

        operator: {
          type: String,
          enum: [
            "equals",
            "notEquals",
            "contains",
            "greaterThan",
            "lessThan",
          ],
        },

        value: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("FormField", formFieldSchema);
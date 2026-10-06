import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
  {
    // Owner
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Basic Information
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    coverImage: {
      type: String,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    // Theme
    theme: {
      primaryColor: {
        type: String,
        default: "#2563eb",
      },

      backgroundColor: {
        type: String,
        default: "#ffffff",
      },

      textColor: {
        type: String,
        default: "#111827",
      },

      borderRadius: {
        type: Number,
        default: 8,
      },

      fontFamily: {
        type: String,
        default: "Inter",
      },
    },

    // Settings
    settings: {
      collectEmail: {
        type: Boolean,
        default: false,
      },

      requireLogin: {
        type: Boolean,
        default: false,
      },

      allowMultipleResponses: {
        type: Boolean,
        default: true,
      },

      shuffleQuestions: {
        type: Boolean,
        default: false,
      },

      showProgressBar: {
        type: Boolean,
        default: true,
      },

      saveDraft: {
        type: Boolean,
        default: false,
      },

      captcha: {
        type: Boolean,
        default: false,
      },

      isPublic: {
        type: Boolean,
        default: true,
      },

      passwordProtected: {
        type: Boolean,
        default: false,
      },

      password: {
        type: String,
        default: "",
      },
    },

    // Submission Limits
    responseLimit: {
      enabled: {
        type: Boolean,
        default: false,
      },

      maxResponses: {
        type: Number,
        default: 0,
      },
    },

    // Schedule
    schedule: {
      startDate: Date,

      endDate: Date,
    },

    // Success Page
    successPage: {
      title: {
        type: String,
        default: "Thank You!",
      },

      message: {
        type: String,
        default: "Your response has been submitted successfully.",
      },

      redirectUrl: {
        type: String,
        default: "",
      },
    },

    // Notifications
    notifications: {
      emailNotification: {
        type: Boolean,
        default: false,
      },

      notifyEmail: {
        type: String,
        default: "",
      },
    },

    // SEO
    seo: {
      metaTitle: String,

      metaDescription: String,

      keywords: [String],
    },

    // Analytics
    analytics: {
      views: {
        type: Number,
        default: 0,
      },

      submissions: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Form", formSchema);
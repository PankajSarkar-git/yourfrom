import mongoose from "mongoose";
import slugify from "slugify";

import Form from "../../models/Form.model.js";
import FormField from "../../models/FormField.model.js";

import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

/**
 * Create Form
 * POST /api/v1/forms
 */
export const createForm = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      title,
      description,
      fields = [],
      settings,
      theme,
      responseLimit,
      schedule,
      successPage,
      notifications,
      seo,
      coverImage,
      logo,
      status,
    } = req.body;

    if (!title?.trim()) {
      throw new ApiError(400, "Form title is required");
    }

    if (!Array.isArray(fields) || fields.length === 0) {
      throw new ApiError(400, "At least one field is required");
    }

    let slug = slugify(title, {
      lower: true,
      strict: true,
    });

    const exists = await Form.findOne({ slug });

    if (exists) {
      slug = `${slug}-${Date.now()}`;
    }

    const [form] = await Form.create(
      [
        {
          userId: req.user._id,
          title,
          description,
          slug,
          settings,
          theme,
          responseLimit,
          schedule,
          successPage,
          notifications,
          seo,
          coverImage,
          logo,
          status,
        },
      ],
      { session }
    );

    const formFields = fields.map((field, index) => ({
      ...field,
      formId: form._id,
      order: index + 1,
    }));

    await FormField.insertMany(formFields, {
      session,
    });

    await session.commitTransaction();

    const createdFields = await FormField.find({
      formId: form._id,
    }).sort({ order: 1 });

    return res.status(201).json(
      new ApiResponse(201, "Form created successfully", {
        form,
        fields: createdFields,
      })
    );
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

/**
 * Get All Forms
 * GET /api/v1/forms
 */
export const getForms = asyncHandler(async (req, res) => {
  const forms = await Form.find({
    userId: req.user._id,
  }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Forms fetched successfully", forms));
});

/**
 * Get Single Form
 * GET /api/v1/forms/:id
 */
export const getFormById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const form = await Form.findOne({
    _id: id,
    userId: req.user._id,
  });

  if (!form) {
    throw new ApiError(404, "Form not found");
  }

  const fields = await FormField.find({
    formId: form._id,
  }).sort({
    order: 1,
  });

  return res.status(200).json(
    new ApiResponse(200, "Form fetched successfully", {
      form,
      fields,
    })
  );
});

/**
 * Update Form
 * PUT /api/v1/forms/:id
 */
export const updateForm = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { id } = req.params;

    const {
      title,
      description,
      fields = [],
      settings,
      theme,
      responseLimit,
      schedule,
      successPage,
      notifications,
      seo,
      coverImage,
      logo,
      status,
    } = req.body;

    const form = await Form.findOne({
      _id: id,
      userId: req.user._id,
    }).session(session);

    if (!form) {
      throw new ApiError(404, "Form not found");
    }

    form.title = title;
    form.description = description;
    form.settings = settings;
    form.theme = theme;
    form.responseLimit = responseLimit;
    form.schedule = schedule;
    form.successPage = successPage;
    form.notifications = notifications;
    form.seo = seo;
    form.coverImage = coverImage;
    form.logo = logo;
    form.status = status;

    await form.save({ session });

    await FormField.deleteMany(
      {
        formId: form._id,
      },
      { session }
    );

    const updatedFields = fields.map((field, index) => ({
      ...field,
      formId: form._id,
      order: index + 1,
    }));

    await FormField.insertMany(updatedFields, {
      session,
    });

    await session.commitTransaction();

    const newFields = await FormField.find({
      formId: form._id,
    }).sort({
      order: 1,
    });

    return res.status(200).json(
      new ApiResponse(200, "Form updated successfully", {
        form,
        fields: newFields,
      })
    );
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

/**
 * Delete Form
 * DELETE /api/v1/forms/:id
 */
export const deleteForm = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { id } = req.params;

    const form = await Form.findOne({
      _id: id,
      userId: req.user._id,
    }).session(session);

    if (!form) {
      throw new ApiError(404, "Form not found");
    }

    await FormField.deleteMany(
      {
        formId: form._id,
      },
      { session }
    );

    await Form.deleteOne(
      {
        _id: form._id,
      },
      { session }
    );

    await session.commitTransaction();

    return res
      .status(200)
      .json(new ApiResponse(200, "Form deleted successfully"));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});
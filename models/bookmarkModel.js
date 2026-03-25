const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

// Schema for bookmark resource
// Includes validation rules and data normalization
const bookmarkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      trim: true,
      maxlength: [
        40,
        "A bookmark title must have less or equal than 40 characters",
      ],
      minlength: [
        1,
        "A bookmark title must have more or equal than 1 characters",
      ],
      required: [true, "A bookmark must have a title"],
    },
    url: {
      type: String,
      required: [true, "A bookmark must have a url"],
      trim: true,
      validate: [validator.isURL, "Please provide a valid URL"],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [
        200,
        "A bookmark description must have less or equal than 200 characters",
      ],
    },
    category: {
      type: String,
      required: [true, "A bookmark must have a category"],
      enum: ["dev", "design", "career", "productivity", "etc"],
      lowercase: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    versionKey: false, // removes __v field
  },
);

// Automatically generate slug from title before saving document
bookmarkSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// Ensure slug is updated when title changes during update operations
bookmarkSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() || {};

  // Normalize update object structure
  if (!update.$set) {
    update.$set = {};
  }

  const title = update.title || update.$set.title;

  if (title) {
    update.$set.slug = slugify(title, { lower: true });
  }

  next();
});

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

module.exports = Bookmark;

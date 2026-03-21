const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const bookmarkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      trim: true,
      maxlength: [
        40,
        "A bookmark name must have less or equal than 40 characters",
      ],
      minlength: [
        1,
        "A bookmark name must have more or equal than 1 characters",
      ],
      required: [true, "A bookmark must have a name"],
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
    timestamps: true,
    versionKey: false,
  },
);

bookmarkSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

module.exports = Bookmark;

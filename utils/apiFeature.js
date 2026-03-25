const AppError = require("./appError");

// Utility class for building reusable API query features
// Supports filtering, searching, sorting, field limiting, and pagination
class APIFeatures {
  constructor(query, queryString, model) {
    this.query = query;
    this.queryString = queryString;
    this.model = model;
    this.filterObj = {};
    this.paginationResult = {};
  }

  // Apply filtering for allowed fields only
  filter() {
    const allowedFields = ["category", "tags"];

    allowedFields.forEach((field) => {
      if (this.queryString[field] !== undefined) {
        this.filterObj[field] = this.queryString[field];
      }
    });

    // Convert string boolean query into actual boolean value
    if (this.queryString.isFavorite !== undefined) {
      const value = this.queryString.isFavorite.toLowerCase();

      if (value !== "true" && value !== "false") {
        throw new AppError(
          "Invalid value for isFavorite. Please use 'true' or 'false'.",
          400,
        );
      }

      this.filterObj.isFavorite = value === "true";
    }

    this.query = this.query.find(this.filterObj);
    return this;
  }

  // Apply text search across selected fields
  search() {
    if (this.queryString.search) {
      const searchableFields = ["title", "description", "url"];

      // Escape special regex characters to prevent invalid or unsafe patterns
      const escaped = this.queryString.search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );

      this.filterObj.$or = searchableFields.map((field) => ({
        [field]: { $regex: escaped, $options: "i" },
      }));

      this.query = this.query.find(this.filterObj);
    }

    return this;
  }

  // Apply predefined sort options
  sort() {
    const sortOptions = {
      latest: "-createdAt",
      oldest: "createdAt",
      az: "title",
      za: "-title",
    };

    if (this.queryString.sort) {
      const sorts = this.queryString.sort
        .split(",")
        .map((sort) => sort.trim().toLowerCase())
        .filter(Boolean);

      // Fallback to default sort when query exists but is empty
      if (sorts.length === 0) {
        this.query = this.query.sort("-createdAt");
        return this;
      }

      const invalidSorts = sorts.filter((sort) => !sortOptions[sort]);

      if (invalidSorts.length > 0) {
        throw new AppError(
          `Invalid sort options: ${invalidSorts.join(", ")}.`,
          400,
        );
      }

      const sortBy = sorts.map((sort) => sortOptions[sort]).join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      // Default sort order: newest first
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  // Limit response fields to only allowed selections
  limitFields() {
    const allowedSelectFields = [
      "title",
      "url",
      "description",
      "category",
      "tags",
      "isFavorite",
      "slug",
      "createdAt",
      "updatedAt",
    ];

    if (this.queryString.fields) {
      const fields = this.queryString.fields
        .split(",")
        .map((field) => field.trim())
        .filter(Boolean);

      if (fields.length === 0) {
        return this;
      }

      const invalidFields = fields.filter(
        (field) => !allowedSelectFields.includes(field),
      );

      if (invalidFields.length > 0) {
        throw new AppError(
          `Invalid field selections: ${invalidFields.join(", ")}.`,
          400,
        );
      }

      this.query = this.query.select(fields.join(" "));
    } else {
      // Exclude internal fields by default
      this.query = this.query.select("-__v");
    }

    return this;
  }

  // Apply pagination and build pagination metadata
  async paginate() {
    const page =
      this.queryString.page === undefined ? 1 : Number(this.queryString.page);

    const limit =
      this.queryString.limit === undefined
        ? 10
        : Number(this.queryString.limit);

    if (!Number.isInteger(page) || page < 1) {
      throw new AppError("Page must be a positive integer.", 400);
    }

    if (!Number.isInteger(limit) || limit < 1) {
      throw new AppError("Limit must be a positive integer.", 400);
    }

    const skip = (page - 1) * limit;

    // Count total documents based on current filter/search conditions
    const total = await this.model.countDocuments(this.filterObj);
    const totalPages = Math.ceil(total / limit);

    if (skip >= total && total > 0) {
      throw new AppError("Page number exceeds total pages.", 400);
    }

    this.paginationResult = {
      total,
      totalPages,
      currentPage: page,
      limit,
    };

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;

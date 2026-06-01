import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);

// categorySchema.pre("save", function (next) {
//     if (this.isModified("name")) {
//         this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
//     }
//     next();
// });

const Category = mongoose.model("categories", categorySchema);
export default Category;

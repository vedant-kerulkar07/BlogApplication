import Blog from "../models/blog.model.js"
import cloudinary from "../config/cloudinary.js"
import { encode } from "entities"
import Category from "../models/category.modle.js"
import main from "../config/groq.js"
import { handleError } from "../helpers/handleError.js"


export const addBlog = async (req, res, next) => {
    try {
        const data = JSON.parse(req.body.data);

        // Check if slug already exists
        const existingBlog = await Blog.findOne({
            slug: data.slug,
        });

        if (existingBlog) {
            return next(
                handleError(
                    409,
                    "A blog with this slug already exists. Please use a different title."
                )
            );
        }

        let featuredImage = "";

        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(
                req.file.path,
                {
                    folder: "mern-blog",
                    resource_type: "auto",
                }
            );

            featuredImage = uploadResult.secure_url;
        }

        const blog = new Blog({
            author: data.author,
            category: data.category,
            title: data.title,
            slug: data.slug,
            featuredImage,
            blogContent: encode(data.blogContent),
        });

        await blog.save();

        return res.status(201).json({
            success: true,
            message: "Blog added successfully",
        });

    } catch (error) {
        console.error("❌ ADD BLOG ERROR:", error);

        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            return next(
                handleError(
                    409,
                    "A blog with this slug already exists."
                )
            );
        }

        return next(handleError(500, error.message));
    }
};


export const editBlog = async (req, res, next) => {
    try {
        const { blogid } = req.params
        const blog = await Category.findById(blogid).populate('category', 'name')
        if (!blog) {
            next(handleError(404, 'Data not found'))
        }
        res.status(200).json({
            category
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}
export const updateBlog = async (req, res, next) => {
    try {
        const { blogid } = req.params
        const data = JSON.parse(req.body.data)

        const blog = await Blog.findById(blogid)

        blog.category = data.category
        blog.title = data.title
        blog.slug = data.slug
        blog.blogContent = encode(data.blogContent)

        let featuredImage = blog.featuredImage
        if (req.file) {
            const uploadResult = await cloudinary.uploader
                .upload(req.file.path, {
                    folder: 'mern-blog',
                    resource_type: 'auto'
                })
                .catch((error) => {
                    return next(handleError(500, error.message))
                });
            featuredImage = uploadResult.secure_url
        }

        blog.featuredImage = featuredImage
        await blog.save()

        res.status(200).json({
            success: true,
            message: 'Blog updated successfully'
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}
export const deleteBlog = async (req, res, next) => {
    try {
        const { blogid } = req.params
        await Blog.findByIdAndDelete(blogid)
        res.status(200).json({
            success: true,
            message: 'Blog deleted successfully',
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}
export const showAllBlog = async (req, res, next) => {
    try {
        const user = req.user
        let blog;
        if (user.role === 'admin') {
            blog = await Blog.find().populate('author', 'name avatar role').populate('category', 'name slug').sort({ createdAt: -1 }).lean().exec()
        } else {
            blog = await Blog.find({ author: user._id }).populate('author', 'name avatar role').populate('category', 'name slug').sort({ createdAt: -1 }).lean().exec()
        }
        res.status(200).json({
            blog
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const getBlog = async (req, res, next) => {
    try {
        const { slug } = req.params
        const blog = await Blog.findOne({ slug }).populate('author', 'name avatar role').populate('category', 'name slug').lean().exec()
        res.status(200).json({
            blog
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}
export const getRelatedBlog = async (req, res, next) => {
    try {
        const { category, blog } = req.params
        const categoryData = await Category.findOne({ slug: category })
        if (!categoryData) {
            return next(404, 'Category data not found')
        }
        const categoryId = categoryData._id
        const relatedBlog = await Blog.find({ category: categoryId, slug: { $ne: blog } }).lean().exec()
        res.status(200).json({
            relatedBlog
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}
export const getBlogByCategory = async (req, res, next) => {
    try {
        const { category } = req.params
        const categoryData = await Category.findOne({ slug: category })
        if (!categoryData) {
            return next(404, 'Category data not found')
        }
        const categoryId = categoryData._id
        const blog = await Blog.find({ category: categoryId }).populate('author', 'name avatar role').populate('category', 'name slug').lean().exec()
        res.status(200).json({
            blog,
            categoryData
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}
export const search = async (req, res, next) => {
    try {
        const { q } = req.query

        const blog = await Blog.find({ title: { $regex: q, $options: 'i' } }).populate('author', 'name avatar role').populate('category', 'name slug').lean().exec()
        res.status(200).json({
            blog,

        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const getAllBlogs = async (req, res, next) => {
    try {
        const blog = await Blog.find().populate('author', 'name avatar role').populate('category', 'name slug').sort({ createdAt: -1 }).lean().exec()
        res.status(200).json({
            blog
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}


export const generateContent = async (req, res, next) => {
    try {
        console.log("➡️ Generate content API called");

        const { prompt } = req.body;

        console.log("📝 Prompt received:", prompt);

        if (!prompt || !prompt.trim()) {
            return next(handleError(400, "Prompt is required"));
        }

        const content = await main(prompt);

        console.log("✅ Content generated successfully");

        return res.status(200).json({
            success: true,
            content,
        });

    } catch (error) {
        console.error("❌ Generate Content Error:", error);

        return next(
            handleError(
                500,
                error.message || "Failed to generate blog content"
            )
        );
    }
};
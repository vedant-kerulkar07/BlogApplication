import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import slugify from "slugify";
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/useFetch";
import Dropzone from "react-dropzone";
import Editor from "@/components/Editor";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RouteBlog } from "@/helpers/RouteName";
import Loading from "@/components/Loading";
import { toast } from "react-toastify";
import { marked } from "marked";

const AddBlog = () => {
    const navigate = useNavigate();

    const user = useSelector((state) => state.user);

    const {
        data: categoryData,
        loading,
        error,
    } = useFetch(
        `${getEnv("VITE_API_BASE_URL")}/category/all-category`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    const [filePreview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [generating, setGenerating] = useState(false);

    // --------------------------------
    // Form Schema
    // --------------------------------

    const formSchema = z.object({
        category: z.string().min(1, "Please select a category"),

        title: z
            .string()
            .min(3, "Title must be at least 3 characters long"),

        slug: z
            .string()
            .min(3, "Slug must be at least 3 characters long"),

        blogContent: z
            .string()
            .min(
                3,
                "Blog content must be at least 3 characters long"
            ),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),

        defaultValues: {
            category: "",
            title: "",
            slug: "",
            blogContent: "",
        },
    });

    // --------------------------------
    // Watch Blog Title
    // --------------------------------

    const blogTitle = form.watch("title");

    // --------------------------------
    // Automatically Generate Slug
    // --------------------------------

    useEffect(() => {
        if (blogTitle) {
            const slug = slugify(blogTitle, {
                lower: true,
                strict: true,
            });

            form.setValue("slug", slug);
        } else {
            form.setValue("slug", "");
        }
    }, [blogTitle, form]);

    // --------------------------------
    // Generate Blog Content using Groq
    // --------------------------------

    const generateContent = async () => {
        try {
            const title = form.getValues("title");

            if (!title || !title.trim()) {
                return toast.error(
                    "Please enter a blog title first"
                );
            }

            setGenerating(true);

            console.log("🤖 Generating blog content...");
            console.log("Blog title:", title);

            const response = await fetch(
                `${getEnv(
                    "VITE_API_BASE_URL"
                )}/blog/generate-content`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        prompt: title.trim(),
                    }),
                }
            );

            const data = await response.json();

            console.log("AI Response:", data);

            if (!response.ok) {
                return toast.error(
                    data.message ||
                    "Failed to generate blog content"
                );
            }

            if (!data.content) {
                return toast.error(
                    "AI did not return any blog content"
                );
            }

            const htmlContent = marked.parse(data.content);

            console.log(
                "✅ Markdown converted to HTML"
            );

            console.log(
                "Generated HTML:",
                htmlContent
            );

            form.setValue(
                "blogContent",
                htmlContent,
                {
                    shouldValidate: true,
                    shouldDirty: true,
                }
            );

            toast.success(
                "Blog content generated successfully"
            );

        } catch (error) {
            console.error(
                "❌ Generate content frontend error:",
                error
            );

            toast.error(
                error.message ||
                "Failed to generate blog content"
            );

        } finally {
            setGenerating(false);
        }
    };

    // --------------------------------
    // Submit Blog
    // --------------------------------

    async function onSubmit(values) {
        try {
            // Check image
            if (!file) {
                return showToast(
                    "error",
                    "Feature image is required"
                );
            }

            // Check user
            if (!user?.user?._id) {
                return showToast(
                    "error",
                    "User information not found. Please login again."
                );
            }

            const newValues = {
                ...values,
                author: user.user._id,
            };

            setGenerating(true);

            const formData = new FormData();

            formData.append("file", file);

            formData.append(
                "data",
                JSON.stringify(newValues)
            );

            // KEEPING YOUR ORIGINAL API ENDPOINT
            const response = await fetch(
                `${getEnv("VITE_API_BASE_URL")}/blog/add/`,
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                }
            );

            const data = await response.json();

            console.log(
                "Blog submit response:",
                data
            );

            if (!response.ok) {
                return showToast(
                    "error",
                    data.message ||
                    "Failed to create blog"
                );
            }

            // Reset form
            form.reset();

            setFile(null);
            setPreview(null);

            // Redirect
            navigate(RouteBlog);

            showToast(
                "success",
                data.message ||
                "Blog created successfully"
            );

        } catch (error) {
            console.error(
                "❌ Blog submit error:",
                error
            );

            showToast(
                "error",
                error.message ||
                "Failed to create blog"
            );

        } finally {
            setGenerating(false);
        }
    }

    const handleFileSelection = (files) => {
        if (!files || files.length === 0) {
            return;
        }

        const selectedFile = files[0];

        const preview = URL.createObjectURL(
            selectedFile
        );

        setFile(selectedFile);
        setPreview(preview);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <Card className="pt-5">
                <CardContent>

                    <h1 className="text-2xl font-bold mb-4">
                        Add Blog
                    </h1>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(
                                onSubmit
                            )}
                        >

                            {/* Category */}

                            <div className="mb-3">

                                <FormField
                                    control={form.control}
                                    name="category"

                                    render={({ field }) => (
                                        <FormItem>

                                            <FormLabel>
                                                Category
                                            </FormLabel>

                                            <FormControl>

                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={
                                                        field.value
                                                    }
                                                >

                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>

                                                    <SelectContent>

                                                        {categoryData?.category?.length >
                                                            0 ? (

                                                            categoryData.category.map(
                                                                (
                                                                    category
                                                                ) => (
                                                                    <SelectItem
                                                                        key={
                                                                            category._id
                                                                        }
                                                                        value={
                                                                            category._id
                                                                        }
                                                                    >
                                                                        {
                                                                            category.name
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            )

                                                        ) : (

                                                            <SelectItem
                                                                value="no-category"
                                                                disabled
                                                            >
                                                                No categories
                                                                available
                                                            </SelectItem>

                                                        )}

                                                    </SelectContent>

                                                </Select>

                                            </FormControl>

                                            <FormMessage />

                                        </FormItem>
                                    )}
                                />

                            </div>


                            {/* Title */}

                            <div className="mb-3">

                                <FormField
                                    control={form.control}
                                    name="title"

                                    render={({ field }) => (
                                        <FormItem>

                                            <FormLabel>
                                                Title
                                            </FormLabel>

                                            <FormControl>

                                                <Input
                                                    placeholder="Enter your blog title"
                                                    {...field}
                                                />

                                            </FormControl>

                                            <FormMessage />

                                        </FormItem>
                                    )}
                                />

                            </div>


                            {/* Slug */}

                            <div className="mb-3">

                                <FormField
                                    control={form.control}
                                    name="slug"

                                    render={({ field }) => (
                                        <FormItem>

                                            <FormLabel>
                                                Slug
                                            </FormLabel>

                                            <FormControl>

                                                <Input
                                                    placeholder="Slug"
                                                    {...field}
                                                />

                                            </FormControl>

                                            <FormMessage />

                                        </FormItem>
                                    )}
                                />

                            </div>


                            {/* Featured Image */}

                            <div className="mb-5">

                                <span className="mb-2 block font-medium">
                                    Featured Image
                                </span>

                                <Dropzone
                                    onDrop={
                                        handleFileSelection
                                    }
                                    accept={{
                                        "image/*": [],
                                    }}
                                    maxFiles={1}
                                >

                                    {({
                                        getRootProps,
                                        getInputProps,
                                    }) => (

                                        <div
                                            {...getRootProps()}
                                            className="cursor-pointer"
                                        >

                                            <input
                                                {...getInputProps()}
                                            />

                                            <div className="flex justify-center items-center w-36 h-28 border-2 border-dashed border-dashboard rounded overflow-hidden">

                                                {filePreview ? (

                                                    <img
                                                        src={
                                                            filePreview
                                                        }
                                                        alt="Featured preview"
                                                        className="w-full h-full object-cover"
                                                    />

                                                ) : (

                                                    <span className="text-sm text-gray-500 text-center px-2">

                                                        Click or
                                                        drop image

                                                    </span>

                                                )}

                                            </div>

                                        </div>
                                    )}

                                </Dropzone>

                            </div>


                            {/* Blog Content */}

                            <div className="mb-5">

                                <FormField
                                    control={form.control}
                                    name="blogContent"

                                    render={({ field }) => (

                                        <FormItem>

                                            {/* AI Generate Button */}

                                            <div className="mb-3">

                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={
                                                        generateContent
                                                    }
                                                    disabled={
                                                        generating
                                                    }
                                                >

                                                    {generating ? (

                                                        <>

                                                            <Loading className="mr-2" />

                                                            Generating...

                                                        </>

                                                    ) : (

                                                        "Generate Blog Description"

                                                    )}

                                                </Button>

                                            </div>


                                            {/* Editor */}

                                            <FormControl>

                                                <Editor
                                                    props={{
                                                        initialData:
                                                            field.value,

                                                        onChange: (
                                                            event,
                                                            editor
                                                        ) => {

                                                            const data =
                                                                editor.getData();

                                                            field.onChange(
                                                                data
                                                            );

                                                        },
                                                    }}
                                                />

                                            </FormControl>

                                            <FormMessage />

                                        </FormItem>
                                    )}
                                />

                            </div>


                            {/* Submit */}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={
                                    generating
                                }
                            >

                                {generating ? (

                                    <>

                                        <Loading className="mr-2" />

                                        Submitting...

                                    </>

                                ) : (

                                    "Submit"

                                )}

                            </Button>

                        </form>

                    </Form>

                </CardContent>
            </Card>
        </div>
    );
};

export default AddBlog;

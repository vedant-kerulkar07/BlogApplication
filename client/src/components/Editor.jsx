import { useState, useEffect, useRef, useMemo } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
    ClassicEditor,
    Autoformat,
    AutoImage,
    Autosave,
    BalloonToolbar,
    BlockQuote,
    BlockToolbar,
    Bold,
    CloudServices,
    Essentials,
    FindAndReplace,
    FullPage,
    Fullscreen,
    GeneralHtmlSupport,
    Heading,
    HtmlComment,
    HtmlEmbed,
    ImageBlock,
    ImageCaption,
    ImageInline,
    ImageInsert,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    MediaEmbed,
    Mention,
    PageBreak,
    Paragraph,
    PasteFromMarkdownExperimental,
    PasteFromOffice,
    ShowBlocks,
    SimpleUploadAdapter,
    SourceEditing,
    SpecialCharacters,
    SpecialCharactersArrows,
    SpecialCharactersCurrency,
    SpecialCharactersEssentials,
    SpecialCharactersLatin,
    SpecialCharactersMathematical,
    SpecialCharactersText,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextPartLanguage,
    TextTransformation,
    Title,
    TodoList,
    Underline,
    WordCount,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

const LICENSE_KEY = "GPL";

export default function Editor({ props }) {
    const editorContainerRef = useRef(null);
    const editorRef = useRef(null);
    const editorInstanceRef = useRef(null);
    const editorWordCountRef = useRef(null);

    const [isLayoutReady, setIsLayoutReady] = useState(false);

    useEffect(() => {
        setIsLayoutReady(true);

        return () => {
            setIsLayoutReady(false);
        };
    }, []);

    const { editorConfig } = useMemo(() => {
        if (!isLayoutReady) {
            return {};
        }

        return {
            editorConfig: {
                toolbar: {
                    items: [
                        "undo",
                        "redo",
                        "|",
                        "sourceEditing",
                        "showBlocks",
                        "findAndReplace",
                        "textPartLanguage",
                        "fullscreen",
                        "|",
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "underline",
                        "|",
                        "specialCharacters",
                        "pageBreak",
                        "link",
                        "insertImage",
                        "mediaEmbed",
                        "insertTable",
                        "blockQuote",
                        "htmlEmbed",
                        "|",
                        "bulletedList",
                        "numberedList",
                        "todoList",
                        "outdent",
                        "indent",
                    ],
                    shouldNotGroupWhenFull: false,
                },

                plugins: [
                    Autoformat,
                    AutoImage,
                    Autosave,
                    BalloonToolbar,
                    BlockQuote,
                    BlockToolbar,
                    Bold,
                    CloudServices,
                    Essentials,
                    FindAndReplace,
                    FullPage,
                    Fullscreen,
                    GeneralHtmlSupport,
                    Heading,
                    HtmlComment,
                    HtmlEmbed,
                    ImageBlock,
                    ImageCaption,
                    ImageInline,
                    ImageInsert,
                    ImageInsertViaUrl,
                    ImageResize,
                    ImageStyle,
                    ImageTextAlternative,
                    ImageToolbar,
                    ImageUpload,
                    Indent,
                    IndentBlock,
                    Italic,
                    Link,
                    LinkImage,
                    List,
                    ListProperties,
                    MediaEmbed,
                    Mention,
                    PageBreak,
                    Paragraph,
                    PasteFromMarkdownExperimental,
                    PasteFromOffice,
                    ShowBlocks,
                    SimpleUploadAdapter,
                    SourceEditing,
                    SpecialCharacters,
                    SpecialCharactersArrows,
                    SpecialCharactersCurrency,
                    SpecialCharactersEssentials,
                    SpecialCharactersLatin,
                    SpecialCharactersMathematical,
                    SpecialCharactersText,
                    Table,
                    TableCaption,
                    TableCellProperties,
                    TableColumnResize,
                    TableProperties,
                    TableToolbar,
                    TextPartLanguage,
                    TextTransformation,
                    Title,
                    TodoList,
                    Underline,
                    WordCount,
                ],

                balloonToolbar: [
                    "bold",
                    "italic",
                    "|",
                    "link",
                    "insertImage",
                    "|",
                    "bulletedList",
                    "numberedList",
                ],

                blockToolbar: [
                    "bold",
                    "italic",
                    "|",
                    "link",
                    "insertImage",
                    "insertTable",
                    "|",
                    "bulletedList",
                    "numberedList",
                    "outdent",
                    "indent",
                ],

                fullscreen: {
                    onEnterCallback: (container) =>
                        container.classList.add(
                            "editor-container",
                            "editor-container_classic-editor",
                            "editor-container_include-block-toolbar",
                            "editor-container_include-word-count",
                            "editor-container_include-fullscreen",
                            "main-container"
                        ),
                },

                heading: {
                    options: [
                        {
                            model: "paragraph",
                            title: "Paragraph",
                            class: "ck-heading_paragraph",
                        },
                        {
                            model: "heading1",
                            view: "h1",
                            title: "Heading 1",
                            class: "ck-heading_heading1",
                        },
                        {
                            model: "heading2",
                            view: "h2",
                            title: "Heading 2",
                            class: "ck-heading_heading2",
                        },
                        {
                            model: "heading3",
                            view: "h3",
                            title: "Heading 3",
                            class: "ck-heading_heading3",
                        },
                        {
                            model: "heading4",
                            view: "h4",
                            title: "Heading 4",
                            class: "ck-heading_heading4",
                        },
                        {
                            model: "heading5",
                            view: "h5",
                            title: "Heading 5",
                            class: "ck-heading_heading5",
                        },
                        {
                            model: "heading6",
                            view: "h6",
                            title: "Heading 6",
                            class: "ck-heading_heading6",
                        },
                    ],
                },

                htmlSupport: {
                    allow: [
                        {
                            name: /^.*$/,
                            styles: true,
                            attributes: true,
                            classes: true,
                        },
                    ],
                },

                image: {
                    toolbar: [
                        "toggleImageCaption",
                        "imageTextAlternative",
                        "|",
                        "imageStyle:inline",
                        "imageStyle:wrapText",
                        "imageStyle:breakText",
                        "|",
                        "resizeImage",
                    ],
                },

                licenseKey: LICENSE_KEY,

                link: {
                    addTargetToExternalLinks: true,
                    defaultProtocol: "https://",

                    decorators: {
                        toggleDownloadable: {
                            mode: "manual",
                            label: "Downloadable",

                            attributes: {
                                download: "file",
                            },
                        },
                    },
                },

                list: {
                    properties: {
                        styles: true,
                        startIndex: true,
                        reversed: true,
                    },
                },

                mention: {
                    feeds: [
                        {
                            marker: "@",
                            feed: [],
                        },
                    ],
                },

                placeholder: "Type or paste your content here!",

                table: {
                    contentToolbar: [
                        "tableColumn",
                        "tableRow",
                        "mergeTableCells",
                        "tableProperties",
                        "tableCellProperties",
                    ],
                },
            },
        };
    }, [isLayoutReady]);

    /*
     * -----------------------------------------
     * Update CKEditor when AI content changes
     * -----------------------------------------
     */

    useEffect(() => {
        const editor = editorInstanceRef.current;

        if (!editor) {
            return;
        }

        const newData = props?.initialData || "";
        const currentData = editor.getData();

        if (newData !== currentData) {
            editor.setData(newData);
        }
    }, [props?.initialData]);

    return (
        <div className="main-container">
            <div
                className="editor-container editor-container_classic-editor editor-container_include-block-toolbar editor-container_include-word-count editor-container_include-fullscreen"
                ref={editorContainerRef}
            >
                <div className="editor-container__editor">
                    <div ref={editorRef}>
                        {editorConfig && (
                            <CKEditor
                                editor={ClassicEditor}
                                config={editorConfig}
                                data={props?.initialData || ""}

                                onReady={(editor) => {
                                    editorInstanceRef.current = editor;

                                    const wordCountPlugin =
                                        editor.plugins.get("WordCount");

                                    if (
                                        wordCountPlugin &&
                                        editorWordCountRef.current
                                    ) {
                                        editorWordCountRef.current.appendChild(
                                            wordCountPlugin.wordCountContainer
                                        );
                                    }
                                }}

                                onChange={(event, editor) => {
                                    const data = editor.getData();

                                    props.onChange(event, editor);

                                    /*
                                     * Keep React Hook Form synchronized
                                     */
                                    if (props?.onChange) {
                                        props.onChange(event, editor);
                                    }
                                }}

                                onAfterDestroy={() => {
                                    editorInstanceRef.current = null;

                                    if (
                                        editorWordCountRef.current
                                    ) {
                                        editorWordCountRef.current.innerHTML =
                                            "";
                                    }
                                }}
                            />
                        )}
                    </div>
                </div>

                <div
                    className="editor_container__word-count"
                    ref={editorWordCountRef}
                ></div>
            </div>
        </div>
    );
}
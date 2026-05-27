import { BlogCard, BlogPost } from "./BlogCard";

const MOCK_POSTS: BlogPost[] = [
    {
        id: "1",
        author: "Author Name",
        date: "May 27, 2026",
        title: "Title of blog article 1",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        tags: ["Product", "Research", "Technology"],
        imageSrc: "https://images.unsplash.com/photo-1779285691595-318197a9181a?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
    },
    {
        id: "2",
        author: "Author Name",
        date: "May 26, 2026",
        title: "Title of blog article 2",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        tags: ["Opinion", "Technology"],
        imageSrc: "https://images.unsplash.com/photo-1779777847962-4b01e7406620?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        id: "3",
        author: "Author Name",
        date: "May 25, 2026",
        title: "Title of blog article 3",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        tags: ["Tutorials"],
        imageSrc: "https://images.unsplash.com/photo-1779547011126-c646b7de93b5?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        id: "4",
        author: "Author Name",
        date: "May 10, 2026",
        title: "Title of blog article 4",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        tags: ["Product"],
        imageSrc: "https://images.unsplash.com/photo-1777229514251-f946a6833921?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
    },
    {
        id: "5",
        author: "Author Name",
        date: "May 13, 2026",
        title: "Title of blog article 5",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        tags: ["Opinion", "Technology"],
        imageSrc: "https://images.unsplash.com/photo-1779226347540-0393047b97b3?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        id: "6",
        author: "Author Name",
        date: "May 25, 2026",
        title: "Title of blog article 6",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        tags: ["Tutorials"],
        imageSrc: "https://images.unsplash.com/photo-1778084401179-282263a7e928?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
];

export function BlogGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 my-12">
            {MOCK_POSTS.map((post) => (
                <BlogCard key={post.id} post={post} />
            ))}
        </div>
    );
}
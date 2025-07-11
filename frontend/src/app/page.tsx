import AppContent from "@/components/app-content";
import Image from "next/image";

export default function Home() {
  const posts = [
    {
      id: 1,
      title: "How I Built My Blog with Next.js and Tailwind",
      excerpt: "A walkthrough of how I set up my blog using Next.js, Tailwind CSS, and Markdown.",
      date: "July 8, 2025",
      author: {
        name: "Alice Johnson",
        avatar: "/icons/user.png",
      },
    },
    {
      id: 2,
      title: "Top 5 VSCode Extensions for Developers",
      excerpt: "These extensions save me hours every week — here's my list.",
      date: "June 29, 2025",
      author: {
        name: "Bob Smith",
        avatar: "/icons/user.png",
      },
    },
    {
      id: 3,
      title: "Why I Switched from Medium to My Own Platform",
      excerpt: "I explain why I left Medium and took control of my writing platform.",
      date: "June 20, 2025",
      author: {
        name: "Charlie Nguyen",
        avatar: "/icons/user.png",
      },
    },
  ];

  return (
    <AppContent>
      <div className="space-y-12">
        {/* Hero */}
        <section className="text-center py-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Developer Stories</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Read and share articles from developers around the world.
          </p>
        </section>

        {/* Posts Feed */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Latest Posts</h2>
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-6 border border-gray-200 rounded-md hover:shadow transition-shadow"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full invert"
                  />
                  <span className="text-sm font-medium text-gray-700">{post.author.name}</span>
                  <span className="text-xs text-gray-400">· {post.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-1">{post.title}</h3>
                <p className="text-gray-700 mb-4">{post.excerpt}</p>
                <a href={`/posts/${post.id}`} className="text-blue-600 hover:underline">
                  Read More →
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppContent>
  );
}

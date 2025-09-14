import { useState, useEffect } from "react";
import Head from "next/head";

interface Post {
  id: number;
  name: string;
  createdAt: number;
  updatedAt?: number;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostName, setNewPostName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/posts");
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setPosts(data.posts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Create new post
  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostName.trim()) return;

    try {
      setLoading(true);
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newPostName }),
      });

      if (!response.ok) throw new Error("Failed to create post");

      setNewPostName("");
      await fetchPosts(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Trigger cleanup
  const triggerCleanup = async () => {
    try {
      setLoading(true);
      const response = await fetch("/trigger/cleanup", { method: "POST" });
      if (!response.ok) throw new Error("Failed to trigger cleanup");
      alert("Cleanup triggered successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <Head>
        <title>CF Test - D1 Database & Triggers</title>
        <meta name="description" content="Test Cloudflare D1 database and triggers functionality" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white text-center mb-8">
            CF Test - <span className="text-[hsl(280,100%,70%)]">D1 Database</span> & Triggers
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              Error: {error}
            </div>
          )}

          {/* Create Post Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Create New Post</h2>
            <form onSubmit={createPost} className="flex gap-4">
              <input
                type="text"
                value={newPostName}
                onChange={(e) => setNewPostName(e.target.value)}
                placeholder="Enter post name"
                className="flex-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:border-white/50"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !newPostName.trim()}
                className="bg-[hsl(280,100%,70%)] hover:bg-[hsl(280,100%,60%)] text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50 transition-colors"
              >
                {loading ? "Creating..." : "Create Post"}
              </button>
            </form>
          </div>

          {/* Posts List */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Posts ({posts.length})</h2>
              <button
                onClick={fetchPosts}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 transition-colors"
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>

            {posts.length === 0 ? (
              <p className="text-white/70">No posts found. Create one above!</p>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white/20 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-white">{post.name}</h3>
                        <p className="text-sm text-white/70">
                          ID: {post.id} | Created: {
                            typeof post.createdAt === 'number'
                              ? new Date(post.createdAt * 1000).toLocaleString()
                              : new Date(post.createdAt).toLocaleString()
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trigger Actions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Trigger Actions</h2>
            <div className="space-x-4">
              <button
                onClick={triggerCleanup}
                disabled={loading}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 transition-colors"
              >
                Trigger Cleanup
              </button>
            </div>
            <p className="text-sm text-white/70 mt-3">
              These actions will work when deployed to Cloudflare Workers with triggers configured.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

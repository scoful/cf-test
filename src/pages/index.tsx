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
      const data = (await response.json()) as { posts: Post[] };
      setPosts(data.posts ?? []);
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

  // Trigger cleanup (commented out for initial D1 testing)
  // const triggerCleanup = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch("/trigger/cleanup", { method: "POST" });
  //     if (!response.ok) throw new Error("Failed to trigger cleanup");
  //     alert("Cleanup triggered successfully!");
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "Unknown error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    void fetchPosts();
  }, []);

  return (
    <>
      <Head>
        <title>CF Test - D1 Database & Triggers</title>
        <meta
          name="description"
          content="Test Cloudflare D1 database and triggers functionality"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] py-8">
        <div className="container mx-auto px-4">
          <h1 className="mb-8 text-center text-4xl font-bold text-white">
            CF Test -{" "}
            <span className="text-[hsl(280,100%,70%)]">D1 Database</span> &
            Triggers
          </h1>

          {error && (
            <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
              Error: {error}
            </div>
          )}

          {/* Create Post Form */}
          <div className="mb-6 rounded-xl bg-white/10 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Create New Post
            </h2>
            <form onSubmit={createPost} className="flex gap-4">
              <input
                type="text"
                value={newPostName}
                onChange={(e) => setNewPostName(e.target.value)}
                placeholder="Enter post name"
                className="flex-1 rounded-lg border border-white/30 bg-white/20 px-4 py-2 text-white placeholder-white/70 focus:border-white/50 focus:outline-none"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !newPostName.trim()}
                className="rounded-lg bg-[hsl(280,100%,70%)] px-6 py-2 font-bold text-white transition-colors hover:bg-[hsl(280,100%,60%)] disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Post"}
              </button>
            </form>
          </div>

          {/* Posts List */}
          <div className="mb-6 rounded-xl bg-white/10 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Posts ({posts.length})
                </h2>
                <p className="text-sm text-white/70">
                  🤖 Auto-inserting every minute via Cron Trigger
                </p>
              </div>
              <button
                onClick={fetchPosts}
                disabled={loading}
                className="rounded-lg bg-green-500 px-4 py-2 font-bold text-white transition-colors hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>

            {posts.length === 0 ? (
              <p className="text-white/70">No posts found. Create one above or wait for the cron trigger!</p>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <div key={post.id} className="rounded-lg bg-white/20 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">
                            {post.name}
                          </h3>
                          {post.name.includes("Scheduled") && (
                            <span className="rounded bg-blue-500 px-2 py-1 text-xs text-white">
                              Auto-generated
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white/70">
                          ID: {post.id} | Created:{" "}
                          {typeof post.createdAt === "number"
                            ? new Date(post.createdAt * 1000).toLocaleString()
                            : new Date(post.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trigger Actions - Commented out for initial D1 testing */}
          {/*
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
          */}
        </div>
      </main>
    </>
  );
}

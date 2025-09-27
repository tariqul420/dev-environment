<section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {blogs.map((blog) => (
    <Link key={blog.slug} href={`/blogs/${blog.slug}`}>
      <Card className="hover:shadow-xl transition-shadow cursor-pointer">
        {blog.coverImage && <img src={blog.coverImage} alt={blog.title} className="w-full h-48 object-cover rounded-t-md" />}
        <CardHeader>
          <CardTitle>{blog.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">{blog.description}</p>
          <div className="flex justify-between text-xs text-gray-500">
            <span>⏱️ {blog.readTime || 5} min read</span>
            <span>📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
          {blog.categories.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {blog.categories.map((cat) => (
                <span key={cat} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  #{cat}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  ))}
</section>;

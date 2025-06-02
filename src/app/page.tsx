import { Metadata } from 'next';
import VideoPlayerContainer from '@/components/video/VideoPlayerContainer';

export const metadata: Metadata = {
  title: 'Home - Video Player App',
  description: 'Welcome to the Video Player App - Watch and enjoy high-quality videos',
};

export default function HomePage() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-8">Welcome to Video Player App</h1>

      <div className="featured-video">
        <h2 className="text-2xl font-semibold mb-4">Featured Video</h2>
        <VideoPlayerContainer src="/videos/featured.mp4" title="Featured Video" />
      </div>

      <div className="video-categories mt-12">
        <h2 className="text-2xl font-semibold mb-6">Explore Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {['Nature', 'Technology', 'Sports', 'Music', 'Education', 'Entertainment'].map(category => (
            <div
              key={category}
              className="category-card p-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <h3 className="text-lg font-medium">{category}</h3>
              <p className="text-gray-600 mt-2">Explore {category.toLowerCase()} videos</p>
            </div>
          ))}
        </div>
      </div>

      <div className="call-to-action my-12 p-8 bg-gray-100 rounded-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">Start Watching Today</h2>
        <p className="text-gray-700 mb-6">Discover thousands of videos across various categories</p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition-colors">
          Browse All Videos
        </button>
      </div>
    </div>
  );
}

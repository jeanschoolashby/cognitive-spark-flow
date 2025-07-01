
import { MindguardWidget } from "@/components/MindguardWidget";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Main content area - simulate a browsing experience */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Sample Web Content
        </h1>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Article: The Future of Technology</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
              nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
              eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Video: Understanding Neural Networks</h2>
            <div className="bg-gray-200 h-48 rounded flex items-center justify-center">
              <p className="text-gray-500">Video Placeholder</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Interactive Content</h2>
            <p className="text-gray-600 mb-4">
              This is where Mindguard would typically interrupt with cognitive challenges 
              to enhance your learning and retention.
            </p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
              Continue Reading
            </button>
          </div>
        </div>
      </div>

      {/* Mindguard Widget - positioned in corner */}
      <MindguardWidget />
    </div>
  );
};

export default Index;

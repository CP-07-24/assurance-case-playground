import React from "react";
import Logo from "../../assets/logoeditor.png";

interface LandingPageProps {
  onUseTemplate: () => void;
  onStartBlank: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onUseTemplate,
  onStartBlank,
}) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img src={Logo} alt="Company Logo" className="h-8 w-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-4">
              Begin Your Design
            </h1>
            <p className="text-gray-500">
              Choose how you want to start your diagram
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={onUseTemplate}
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Use a Template
            </button>

            <div className="text-center text-gray-500">or</div>

            <button
              onClick={onStartBlank}
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Start Without Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

import { Button } from "antd";

export default function NotFound() {
  return (
    <div className="grid place-items-center min-h-[84vh] bg-gray-100">
      <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-12">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">
          404 - Not Found
        </h2>
        <p className="text-xl mb-8 text-gray-600">
          Could not find the requested resource
        </p>
        <Button type="primary" size="large" href="/">
          Return Home
        </Button>
      </div>
    </div>
  );
}

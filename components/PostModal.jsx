import FixedOverlay from "./FixedOverlay";

export default function PostModal({ message }) {
  const modalMsg = message ? message : 'Submitting...';

  return (
    <FixedOverlay>
      <div className="rounded-sm shadow-lg">
        <div className="border border-white rounded-sm shadow">
          <div className="bg-gray-100 rounded-t-sm pl-4 pr-8 py-2">{modalMsg}</div>
          <div className="progress h-2 bg-gray-300 rounded-b-sm"></div>
        </div>
      </div>
    </FixedOverlay>
  );
}
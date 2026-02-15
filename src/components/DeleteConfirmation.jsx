function DeleteConfirmation({ todoTitle, onConfirm, onCancel, isLoading }) {
  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Are you sure you want to delete{" "}
        <span className="font-semibold">"{todoTitle}"</span>?
      </p>
      <p className="text-sm text-red-600">This action cannot be undone.</p>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed transition font-medium"
        >
          {isLoading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}

export default DeleteConfirmation;

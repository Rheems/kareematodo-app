import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { todoAPI } from "../utils/api.js";
import Modal from "../components/Modal.js";
import TodoForm from "../components/TodoForm.js";
import DeleteConfirmation from "../components/DeleteConfirmation.js";
import SEO from "../components/SEO.js";

function TodoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    data: todo,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["todo", id],
    queryFn: () => todoAPI.getTodo(id),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => todoAPI.updateTodo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo", id] });
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setIsEditModalOpen(false);
      alert("Todo updated successfully!");
    },
    onError: (error) => {
      alert("Failed to update todo: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => todoAPI.deleteTodo(id),
    onSuccess: () => {
      alert("Todo deleted successfully!");
      navigate("/");
    },
    onError: (error) => {
      alert("Failed to delete todo: " + error.message);
    },
  });

  const handleEdit = (data) => {
    updateMutation.mutate(data);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading todo details...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-700 mb-2">
            Error Loading Todo
          </h2>
          <p className="text-red-600 mb-4">{error.message}</p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={todo?.title || "Todo Details"}
        description={
          todo?.description || "View todo details and manage your task"
        }
        keywords="todo details, task information"
      />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <span className="mr-2">←</span>
            Back to Todos
          </button>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-start justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                {todo?.title}
              </h1>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  todo?.completed
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {todo?.completed ? "Completed" : "Incomplete"}
              </span>
            </div>

            {todo?.description && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {todo.description}
                </p>
              </div>
            )}

            <div className="border-t pt-6 space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Todo ID:</span>
                <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">
                  {todo?.id}
                </span>
              </div>
              {todo?.userId && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">User ID:</span>
                  <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">
                    {todo.userId}
                  </span>
                </div>
              )}
              {todo?.createdAt && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-sm text-gray-700">
                    {new Date(todo.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-medium"
              >
                Edit Todo
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition font-medium"
              >
                Delete Todo
              </button>
            </div>
          </div>
        </div>

        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Todo"
        >
          <TodoForm
            onSubmit={handleEdit}
            initialData={todo}
            isLoading={updateMutation.isPending}
          />
        </Modal>

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Todo"
        >
          <DeleteConfirmation
            todoTitle={todo?.title}
            onConfirm={handleDelete}
            onCancel={() => setIsDeleteModalOpen(false)}
            isLoading={deleteMutation.isPending}
          />
        </Modal>
      </div>
    </>
  );
}

export default TodoDetail;

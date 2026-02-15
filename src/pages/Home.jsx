import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { todoAPI } from "../utils/api";
import Modal from "../components/Modal";
import TodoForm from "../components/TodoForm";
import DeleteConfirmation from "../components/DeleteConfirmation";
import SEO from "../components/SEO";

function Home() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);

  const queryClient = useQueryClient();

  // Fetch todos
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["todos", page],
    queryFn: () => todoAPI.getTodos(page, 10),
  });

  // Log when page changes
  useEffect(() => {
    console.log("🔢 Page state is now:", page);
  }, [page]);

  const createMutation = useMutation({
    mutationFn: todoAPI.createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setIsCreateModalOpen(false);
      alert("Todo created successfully!");
    },
    onError: (error) => {
      alert("Failed to create todo: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => todoAPI.updateTodo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setIsEditModalOpen(false);
      setSelectedTodo(null);
      alert("Todo updated successfully!");
    },
    onError: (error) => {
      alert("Failed to update todo: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: todoAPI.deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setIsDeleteModalOpen(false);
      setSelectedTodo(null);
      alert("Todo deleted successfully!");
    },
    onError: (error) => {
      alert("Failed to delete todo: " + error.message);
    },
  });

  const openEditModal = (todo) => {
    setSelectedTodo(todo);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (todo) => {
    setSelectedTodo(todo);
    setIsDeleteModalOpen(true);
  };

  const filteredTodos =
    data?.data?.filter((todo) => {
      if (!todo || !todo.title) return false;
      const matchesSearch = todo.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "complete" && todo.completed) ||
        (filter === "incomplete" && !todo.completed);
      return matchesSearch && matchesFilter;
    }) || [];

  const totalPages = data?.meta?.totalPages || 1;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 p-8 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title="Home" description="Manage your todos" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              My Todos
            </h1>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition"
            >
              + New Todo
            </button>
          </div>

          {/* Search & Filter */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Todos</option>
                <option value="complete">Completed</option>
                <option value="incomplete">Incomplete</option>
              </select>
            </div>
          </div>

          {/* Todo List */}
          <div className="space-y-4 mb-8">
            {filteredTodos.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <p className="text-gray-500 text-lg">No todos found</p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Link
                        to={`/todos/${todo.id}`}
                        className="text-xl font-semibold text-gray-800 hover:text-blue-600"
                      >
                        {todo.title}
                      </Link>
                      {todo.description && (
                        <p className="text-gray-600 mt-2">{todo.description}</p>
                      )}
                    </div>
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-medium ${
                        todo.completed
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {todo.completed ? "Done" : "Pending"}
                    </span>
                  </div>
                  <div className="flex gap-3 mt-4 pt-4 border-t">
                    <button
                      onClick={() => openEditModal(todo)}
                      className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(todo)}
                      className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* PAGINATION - SUPER SIMPLE VERSION */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-center gap-6">
              {/* Previous Button */}
              <button
                type="button"
                onClick={() => {
                  console.log("⬅️ PREVIOUS BUTTON CLICKED!");
                  console.log("Current page before:", page);
                  const newPage = page - 1;
                  console.log("New page will be:", newPage);
                  if (newPage >= 1) {
                    setPage(newPage);
                  }
                }}
                disabled={page <= 1}
                style={{
                  padding: "12px 24px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  cursor: page <= 1 ? "not-allowed" : "pointer",
                  backgroundColor: page <= 1 ? "#e5e7eb" : "#3b82f6",
                  color: page <= 1 ? "#9ca3af" : "white",
                  border: "none",
                }}
              >
                ← Previous
              </button>

              {/* Page Display */}
              <div
                style={{
                  padding: "12px 24px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  borderRadius: "8px",
                }}
              >
                Page {page} of {totalPages}
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={() => {
                  console.log("➡️ NEXT BUTTON CLICKED!");
                  console.log("Current page before:", page);
                  console.log("Total pages:", totalPages);
                  const newPage = page + 1;
                  console.log("New page will be:", newPage);
                  if (newPage <= totalPages) {
                    setPage(newPage);
                  }
                }}
                disabled={page >= totalPages}
                style={{
                  padding: "12px 24px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  cursor: page >= totalPages ? "not-allowed" : "pointer",
                  backgroundColor: page >= totalPages ? "#e5e7eb" : "#3b82f6",
                  color: page >= totalPages ? "#9ca3af" : "white",
                  border: "none",
                }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Modals */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Todo"
        >
          <TodoForm
            onSubmit={(data) => createMutation.mutate(data)}
            isLoading={createMutation.isPending}
          />
        </Modal>

        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTodo(null);
          }}
          title="Edit Todo"
        >
          <TodoForm
            onSubmit={(data) =>
              updateMutation.mutate({ id: selectedTodo.id, data })
            }
            initialData={selectedTodo}
            isLoading={updateMutation.isPending}
          />
        </Modal>

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedTodo(null);
          }}
          title="Delete Todo"
        >
          <DeleteConfirmation
            todoTitle={selectedTodo?.title}
            onConfirm={() => deleteMutation.mutate(selectedTodo.id)}
            onCancel={() => {
              setIsDeleteModalOpen(false);
              setSelectedTodo(null);
            }}
            isLoading={deleteMutation.isPending}
          />
        </Modal>
      </div>
    </>
  );
}

export default Home;

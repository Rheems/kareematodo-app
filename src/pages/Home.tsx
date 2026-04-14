import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { todoAPI } from "../utils/api.js";
import Modal from "../components/Modal.js";
import TodoForm from "../components/TodoForm.js";
import DeleteConfirmation from "../components/DeleteConfirmation.js";
import SEO from "../components/SEO.js";

function Home() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["todos", page],
    queryFn: () => todoAPI.getTodos(page, 10),
  });

  useEffect(() => {
    console.log("📄 Current page:", page);
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-700 mx-auto"></div>
          <p className="mt-4 text-amber-900 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="bg-white p-8 rounded-lg max-w-md shadow-xl border-2 border-red-200">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title="Home" description="Manage your todos" />

      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-amber-900 mb-2">
                My Todos
              </h1>
              <p className="text-amber-700">Manage your tasks efficiently</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-amber-700 to-amber-900 text-white px-6 py-3 rounded-xl hover:from-amber-800 hover:to-amber-950 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 justify-center"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Todo
            </button>
          </div>

          {/* Search & Filter */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-amber-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="all">All Todos</option>
                <option value="complete">Completed</option>
                <option value="incomplete">Incomplete</option>
              </select>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">
                    Total Tasks
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {filteredTodos.length}
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Completed
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {filteredTodos.filter((t) => t.completed).length}
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold mt-1">
                    {filteredTodos.filter((t) => !t.completed).length}
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Todo List */}
          <div className="space-y-4 mb-8">
            {filteredTodos.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-lg border border-amber-200">
                <p className="text-amber-600 text-lg">No todos found</p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border border-amber-100"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Link
                        to={`/todos/${todo.id}`}
                        className="text-xl font-semibold text-amber-900 hover:text-amber-700"
                      >
                        {todo.title}
                      </Link>
                      {todo.description && (
                        <p className="text-amber-700 mt-2">
                          {todo.description}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-medium ${
                        todo.completed
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {todo.completed ? "Done" : "Pending"}
                    </span>
                  </div>
                  <div className="flex gap-3 mt-4 pt-4 border-t border-amber-100">
                    <button
                      onClick={() => openEditModal(todo)}
                      className="flex-1 bg-amber-100 text-amber-800 px-4 py-2 rounded-lg hover:bg-amber-200 transition font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(todo)}
                      className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* PAGINATION */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
            <div className="flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={() => {
                  const newPage = page - 1;
                  if (newPage >= 1) {
                    setPage(newPage);
                  }
                }}
                disabled={page <= 1}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  page <= 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-700 to-amber-900 text-white hover:from-amber-800 hover:to-amber-950 shadow-md"
                }`}
              >
                ← Previous
              </button>

              <div className="px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-900 text-white rounded-lg font-bold">
                Page {page} of {totalPages}
              </div>

              <button
                type="button"
                onClick={() => {
                  const newPage = page + 1;
                  if (newPage <= totalPages) {
                    setPage(newPage);
                  }
                }}
                disabled={page >= totalPages}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  page >= totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-700 to-amber-900 text-white hover:from-amber-800 hover:to-amber-950 shadow-md"
                }`}
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

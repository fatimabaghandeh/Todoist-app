import { useState } from "react";
import { addTodos, getTodos } from "./api/fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ThreeDot } from "react-loading-indicators";

export default function Todo() {
  const [newTodo, setNewTodo] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addTodos,
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const previousTodos = queryClient.getQueryData(["todos"]);
      queryClient.setQueryData(["todos"], (old: Todo[]) => [
        ...old,
        { ...newTodo, id: 2000 },
      ]);
      return { previousTodos };
    },

    onError: (_, __, context) => {
      queryClient.setQueryData(["todos"], context?.previousTodos);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
  const {
    isPending,
    error,
    data: todos,
  } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: getTodos,
  });
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen text-primaryC">
        <ThreeDot color="#0ACDFF " size="medium" text="" textColor="primaryC" />
      </div>
    );
  }
  if (error) {
    return <div>Error {error.message}</div>;
  }

  return (
    <div className="max-w-[630px] mx-14 lg:mx-[300px] md:mx-[200px]">
      <div className="   gap-6 my-8  grid grid-cols-4  ">
        <input
          type="text"
          onChange={(e) => {
            setNewTodo(e.target.value);
          }}
          value={newTodo}
          placeholder=" New Todo"
          className="p-3  col-start-1 col-end-4 rounded-full focus:outline-[#0ACDFF]"
        />
        <button
          onClick={async () => {
            setNewTodo("");
            mutation.mutate({ content: newTodo });
          }}
          className="bg-[#0ACDFF] col-start-4 hover:bg-[#0ACD]  font-bold text-primaryB  text-3xl  rounded-lg  "
          type="button"
        >
          +
        </button>
      </div>
      <div className=" grid grid-cols-1 gap-4 mb-10 ">
        {todos.map((todo) => {
          return (
            <div
              key={todo.id}
              className="p-3  bg-primaryB text-1xl font-sans   rounded-md   "
            >
              {todo.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

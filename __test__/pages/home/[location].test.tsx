import { render } from "@testing-library/react";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import TablesPage from "../../../pages/home/[location]";
import { Game, Table, User } from "../../../types";

const wrapper = (props: { children: ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
};

describe("TablesPage", () => {
  const initialTables: Table[] = [];
  const mentors: User[] = [];
  const location = 1;
  const initialGames: Game[] = [];

  it("renders a heading", () => {
    const { getByText } = render(
      <TablesPage
        initialGames={initialGames}
        location={location}
        initialTables={initialTables}
        mentors={mentors}
      />,
      { wrapper }
    );

    const heading = getByText(/add table/i);
  });
});

import { useContext, useState } from "react";
import { DateInput } from "../../components/DateInput";
import { Header } from "../../components/Header";
import { InputWithLabel } from "../../components/InputWithLabel";
import { CreateTableDialog } from "../../components/CreateTableDialog";
import { GetServerSideProps } from "next";
import { getTables, useGetTables } from "../../utils/api/table";
import { Table, User, Game } from "../../types";
import { TableCard } from "../../components/TableCard";
import { getUsers } from "../../utils/api/user";
import { TagListWithAutocomplete } from "../../components/TagListWithAutocomplete";
import { TagType } from "../../types/index";
import { getGames, useGetGames } from "../../utils/api/game";
import { SelectedDateContext } from "../../context/SelectedDateContext";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const location = Number(context.params?.location);

  if (!location) {
    return {
      redirect: {
        statusCode: 301,
        destination: "/home/1",
      },
    };
  }

  const initialTables = await getTables({ context });
  const initialGames = await getGames({ context });
  const mentors = await getUsers({ context });
  return {
    props: {
      location,
      initialTables,
      initialGames,
      mentors,
    },
  };
};

const TablesPage = ({
  initialTables,
  mentors,
  location,
  initialGames,
}: {
  initialTables: Table[];
  mentors: User[];
  location: number;
  initialGames: Game[];
}) => {
  const [isCreateTableDialogOpen, setIsCreateTableDialogOpen] = useState(false);
  const { setSelectedDate, selectedDate } = useContext(SelectedDateContext);
  const [showAllTables, setShowAllTables] = useState(true);

  let { tables } = useGetTables(initialTables);
  tables = tables || initialTables;
  tables.sort((a, b) => {
    if (a.finishHour && !b.finishHour) {
      return 1;
    } else if (!a.finishHour && b.finishHour) {
      return -1;
    } else {
      return 0;
    }
  });
  let { games } = useGetGames(initialGames);
  games = games || initialGames;

  const activeTables = tables.filter((table) => !table.finishHour);
  const activeTableCount = activeTables.length;
  const totalTableCount = tables.length;

  const activeCustomerCount = activeTables.reduce((prev, curr) => {
    return prev + curr.playerCount;
  }, 0);
  const totalCustomerCount = activeTables.reduce((prev, curr) => {
    return prev + curr.playerCount;
  }, 0);

  return (
    <>
      <Header />
      <div className="container h-full py-4 px-12">
        {/* Remove class [ h-64 ] when adding a card block */}
        <div className="h-full flex w-full flex-wrap flex-col">
          <div className="flex justify-between">
            <div className="flex items-center text-3xl">
              <DateInput
                id="date"
                date={selectedDate}
                setDate={setSelectedDate}
              />
            </div>
            <button
              onClick={() => setIsCreateTableDialogOpen(true)}
              className="my-3 bg-white transition duration-150 ease-in-out hover:border-gray-900 hover:text-gray-900 rounded border border-gray-800 text-gray-800 px-6 text-sm"
            >
              Add table
            </button>
          </div>
          <div className="flex flex-col  md:flex-row gap-8">
            <div className="flex flex-col md:flex-row md:gap-16 w-full">
              <InputWithLabel
                name="activeTable"
                label="Open Table"
                type="number"
                readOnly
                className="w-full"
                value={activeTableCount}
              />
              <InputWithLabel
                name="totalTable"
                label="Total Table"
                type="number"
                readOnly
                className="w-full"
                value={totalTableCount}
              />

              <InputWithLabel
                name="activeCustomer"
                label="Active Customer"
                type="number"
                readOnly
                className="w-full"
                value={activeCustomerCount}
              />
              <InputWithLabel
                name="totalCustomer"
                label="Total Customer"
                type="number"
                readOnly
                className="w-full"
                value={totalCustomerCount}
              />
            </div>
          </div>
          <TagListWithAutocomplete
            suggestions={mentors as TagType<User>[]}
            name="employees"
            label="Who's at cafe?"
          />
        </div>
        <div className="flex justify-end">
          <button onClick={() => setShowAllTables((value) => !value)}>
            {showAllTables ? "Show open tables" : "Show all tables"}
          </button>
        </div>
        <div className="h-full columns-4 gap-8 mt-4">
          {(showAllTables ? tables : activeTables).map((table) => (
            <TableCard
              key={table._id}
              table={table}
              mentors={mentors}
              games={games as Game[]}
            />
          ))}
        </div>
      </div>
      <CreateTableDialog
        location={location}
        isOpen={isCreateTableDialogOpen}
        close={() => setIsCreateTableDialogOpen(false)}
      />
    </>
  );
};

export default TablesPage;

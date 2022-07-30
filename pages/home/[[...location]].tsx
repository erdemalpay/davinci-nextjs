import { useContext, useState, useEffect } from "react";
import { DateInput } from "../../components/DateInput";
import { Header } from "../../components/Header";
import { InputWithLabel } from "../../components/InputWithLabel";
import { CreateTableDialog } from "../../components/CreateTableDialog";
import { GetServerSideProps } from "next";
import { getTables, useGetTables } from "../../utils/api/table";
import { Table, User, Game, Visit } from "../../types";
import { TableCard } from "../../components/TableCard";
import { getUsers } from "../../utils/api/user";
import { ActiveVisitList } from "../../components/ActiveVisitList";
import { getGames, useGetGames } from "../../utils/api/game";
import { SelectedDateContext } from "../../context/SelectedDateContext";
import { sortTable } from "../../utils/sort";
import { getVisits, useGetVisits } from "../../utils/api/visit";
import { isToday } from "date-fns";
import { PreviousVisitList } from "../../components/PreviousVisitList";

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
  const initialVisits = await getVisits({ context });
  const users = await getUsers({ context });
  return {
    props: {
      location,
      users,
      initialTables,
      initialGames,
      initialVisits,
    },
  };
};

const TablesPage = ({
  users,
  location,
  initialTables,
  initialGames,
  initialVisits,
}: {
  users: User[];
  location: number;
  initialTables: Table[];
  initialGames: Game[];
  initialVisits: Visit[];
}) => {
  const [isCreateTableDialogOpen, setIsCreateTableDialogOpen] = useState(false);
  const { setSelectedDate, selectedDate } = useContext(SelectedDateContext);
  const [showAllTables, setShowAllTables] = useState(true);

  let { games } = useGetGames(initialGames);
  games = games || initialGames;

  let { visits } = useGetVisits(initialVisits);
  visits = visits || initialVisits;

  let { tables } = useGetTables(initialTables);
  tables = tables || initialTables;
  // Sort tables first active tables, then closed ones.
  // if both active then sort by name
  tables.sort(sortTable);

  // Sort users by name
  users.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    } else if (a.name < b.name) {
      return -1;
    } else {
      return 0;
    }
  });

  const defaultUser: User = users.find((user) => user._id === "dv") as User;

  const [mentors, setMentors] = useState<User[]>([defaultUser]);

  const activeTables = tables.filter((table) => !table.finishHour);
  const activeTableCount = activeTables.length;
  const totalTableCount = tables.length;

  const activeCustomerCount = activeTables.reduce(
    (prev: number, curr: Table) => {
      return Number(prev) + Number(curr.playerCount);
    },
    0
  );
  const totalCustomerCount = tables.reduce((prev: number, curr: Table) => {
    return Number(prev) + Number(curr.playerCount);
  }, 0);
  const tableColumns: Table[][] = [[], [], [], []];
  (showAllTables ? tables : activeTables).forEach((table, index) => {
    tableColumns[index % 4].push(table);
  });

  useEffect(() => {
    const newMentors = [defaultUser];

    if (visits) {
      visits.forEach(
        (visit) => !visit.finishHour && newMentors.push(visit.user)
      );
    }
    setMentors(newMentors);
  }, [defaultUser, visits]);
  return (
    <>
      <Header />
      <div className="container relative h-full py-4 px-12">
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
          {isToday(selectedDate!) ? (
            <ActiveVisitList
              suggestions={users}
              name="employees"
              label="Who's at cafe?"
              visits={visits.filter((visit) => !visit.finishHour)}
            />
          ) : (
            <PreviousVisitList visits={visits} />
          )}
        </div>
        <div className="flex justify-end">
          <button onClick={() => setShowAllTables((value) => !value)}>
            {showAllTables ? "Show open tables" : "Show all tables"}
          </button>
        </div>
        <div className="h-full grid grid-cols-1 lg:grid-cols-4 mt-4 gap-x-8">
          {tableColumns.map((tables, idx) => (
            <div key={idx}>
              {tables.map((table) => (
                <TableCard
                  key={table._id || table.startHour}
                  table={table}
                  mentors={mentors}
                  games={games as Game[]}
                />
              ))}
            </div>
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

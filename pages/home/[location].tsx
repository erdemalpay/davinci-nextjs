import { useState } from "react";
import { DateInput } from "../../components/DateInput";
import { Header } from "../../components/Header";
import { InputWithLabel } from "../../components/InputWithLabel";
import { CreateTableDialog } from "../../components/CreateTableDialog";
import { GetServerSideProps } from "next";
import { getTables } from "../../utils/api/table";
import { Table, User } from "../../types";
import { TableCard } from "../../components/TableCard";
import { getUsers } from "../../utils/api/user";
import { TagListWithAutocomplete } from "../../components/TagListWithAutocomplete";
import { TagType } from "../../types/index";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const location = Number(context.params?.location);
  const initialTables = await getTables({ location, context });
  const users = await getUsers({ context });
  return {
    props: {
      location,
      initialTables,
      users,
    },
  };
};

const TablesPage = ({
  initialTables,
  users,
  location,
}: {
  initialTables: Table[];
  users: User[];
  location: number;
}) => {
  const [tables, setTables] = useState(initialTables);
  const [isCreateTableDialogOpen, setIsCreateTableDialogOpen] = useState(false);

  return (
    <>
      <Header />
      <div className="container h-full py-4 px-12">
        {/* Remove class [ h-64 ] when adding a card block */}
        <div className="h-full flex w-full flex-wrap flex-col">
          <div className="flex justify-between">
            <div className="flex items-center text-3xl">
              <DateInput id="date" />
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
                label="Active Table"
                type="number"
                readOnly
                className="w-full"
              />
              <InputWithLabel
                name="totalTable"
                label="Total Table"
                type="number"
                readOnly
                className="w-full"
                value={1}
              />

              <InputWithLabel
                name="activeCustomer"
                label="Active Customer"
                type="number"
                readOnly
                className="w-full"
              />
              <InputWithLabel
                name="totalCustomer"
                label="Total Customer"
                type="number"
                readOnly
                className="w-full"
              />
            </div>
          </div>
          <div className="w-full">
            {/* <InputWithLabel
              name="mentors"
              type="autocomplete"
              label="Who's at cafe?"
              className="w-full"
            /> */}
          </div>
          <TagListWithAutocomplete
            suggestions={users as TagType<User>[]}
            name="employees"
            label="Who's at cafe?"
          />
        </div>
        <div className="w-full grid grid-cols-4 gap-8 mt-12">
          {tables.map((table) => (
            <TableCard key={table._id} table={table} />
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

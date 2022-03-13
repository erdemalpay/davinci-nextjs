import { useState } from "react";
import { DateInput } from "../../components/DateInput";
import { Header } from "../../components/Header";
import { InputWithLabel } from "../../components/InputWithLabel";
import { CreateTableDialog } from "../../components/CreateTableDialog";
import { GetServerSideProps } from "next";
import { getTables } from "../../utils/api/table";
import { Table } from "../../types";
import { getToken } from "../../utils/serverUtils";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const location = Number(context.params?.location);
  const initialTables = await getTables({ location, context });
  return {
    props: {
      location,
      initialTables,
    },
  };
};

const TablesPage = ({
  initialTables,
  location,
}: {
  initialTables: Table[];
  location: Number;
}) => {
  const [tables, setTables] = useState(initialTables);
  let [isCreateTableDialogOpen, setIsCreateTableDialogOpen] = useState(false);
  return (
    <>
      <Header />
      <div className="w-full h-full py-12 ">
        {/* Remove class [ h-64 ] when adding a card block */}
        <div className="container mx-auto px-6 h-64">
          <div className="flex w-full h-full flex-wrap">
            <div className="container mx-auto pb-10 h-64">
              <div className="rounded w-full h-full flex flex-col gap-8">
                <div className="flex justify-between">
                  <div className="flex align-middle">
                    <DateInput id="date" />
                  </div>
                  <button
                    onClick={() => setIsCreateTableDialogOpen(true)}
                    className="my-3 bg-white transition duration-150 ease-in-out hover:border-gray-900 hover:text-gray-900 rounded border border-gray-800 text-gray-800 px-6 text-sm"
                  >
                    Add table
                  </button>
                </div>
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col md:flex-row">
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
                  </div>
                  <div className="flex flex-col md:flex-row">
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
                  <div className="w-full">
                    <InputWithLabel
                      name="mentors"
                      type="autocomplete"
                      label="Who's at cafe?"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
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

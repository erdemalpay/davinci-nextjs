import { NextPage } from "next";
import { useState } from "react";
import { DateInput } from "../components/DateInput";
import { Header } from "../components/Header";
import { InputWithLabel } from "../components/InputWithLabel";
import { CreateTableDialog } from "../components/CreateTableDialog";

const TablesPage: NextPage = () => {
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
                      label="Active Table"
                      type="number"
                      readOnly
                      className="w-full"
                    />
                    <InputWithLabel
                      label="Total Table"
                      type="number"
                      readOnly
                      className="w-full"
                      value={1}
                    />
                  </div>
                  <div className="flex flex-col md:flex-row">
                    <InputWithLabel
                      label="Active Customer"
                      type="number"
                      readOnly
                      className="w-full"
                    />
                    <InputWithLabel
                      label="Total Customer"
                      type="number"
                      readOnly
                      className="w-full"
                    />
                  </div>
                  <div className="w-full">
                    <InputWithLabel
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
        isOpen={isCreateTableDialogOpen}
        close={() => setIsCreateTableDialogOpen(false)}
      />
    </>
  );
};

export default TablesPage;

import { useState, useContext, useCallback, useEffect } from "react";
import { StoreContext } from "../utils/store";
import { useParams } from "react-router";

function EditTeam() {
  const { state } = useContext(StoreContext);
  const { id } = useParams();
  const [team, setTeam] = useState([
    // {
    //   id: 123,
    //   name: "Hardik Agarwal ",
    //   role: "SDE-1",
    // },
    // {
    //   id: 213,
    //   name: "Suryashankar Das",
    //   role: "SDE-1",
    // },
  ]);
  const [style, setStyle] = useState("");

  const getEmployees = useCallback(async () => {
    try {
      const eids = await state.contract.methods.curr_emp_of_company(id).call();
      const team = [];
      for (let eid of eids) {
        const exp = await state.contract.methods.experiences(eid).call();
        team.push({
          id: parseInt(eid),
          // name: (await state.contract.methods.companies(rid).call()).name,
          name: exp.user_name,
          role: exp.role,
        });
      }
      setTeam(team);
    } catch (e) {
      console.error({ e });
    }
  }, [id, state.contract]);

  useEffect(function () {
    getEmployees();
  });

  useEffect(() => {
    if (!state.connected) {
      setStyle("authenticated");
    }
    getEmployees();
  }, [getEmployees]);

  return (
    <div className="p-3">
      <div>
        <p className="text-lg">Team</p>
      </div>
      <div>
        {team.map((item, i) => {
          return (
            <div className="p-2 m-2 flex flex-row justify-around items-center bg-gray-200 border-solid rounded-lg ">
              <div>
                <p>
                  <h1 className="font-medium text-lg text-blue-700 inline">
                    {item.name}
                  </h1>{" "}
                  is part of of your Oraganization as {item.role} from Date to
                  Date.
                </p>
              </div>
              <div className={style}>
                <button
                  className={
                    "bg-red-800 text-white active:bg-red-800 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  }
                  type="button"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default EditTeam;

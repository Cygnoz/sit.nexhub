import { useEffect, useState } from "react";
import bgImage from "../../../assets/Images/Group 37 (1).png";
import { endponits } from "../../../Services/apiEndpoints";
import useApi from "../../../Hooks/useApi";

type Props = {
  seeOrgDetails?: boolean;
};

function Banner({ seeOrgDetails }: Props) {
  const [oneOrganization, setOneOrganization] = useState<any | []>([]);
 
  const { request: getOneOrganization } = useApi("get", 7004);
 
  const getOrganization = async () => {
    try {
      const url = `${endponits.GET_ONE_ORGANIZATION}`;
      const { response, error } = await getOneOrganization(url);
 
      if (!error && response?.data) {
        setOneOrganization(response.data);
      }
    } catch (error) {
      console.error("Error fetching organization:", error);
    }
  };

  useEffect(() => {
    getOrganization();
  }, []);

  return (
    <div className="bg-[#F7E7CE] rounded-lg flex h-[148px]">
      {seeOrgDetails && oneOrganization && (
        <div className="ms-2 p-2 text-center mt-3 items-center flex">
          <div>
            <p className="bg-gray text-sm w-fit text-yellow-50 rounded-md p-2">
              Organization
            </p>
            <div className="flex mt-1">
              <p className="mt-1 text-[#303F58]">
                <b>
                  {oneOrganization?.organizationName || "Organization Profile"}
                </b>
              </p>
             { oneOrganization.organizationId && <div className="ms-3 bg-white rounded-md p-1 text-textColor">
                ID: {oneOrganization?.organizationId}
              </div>}
            </div>
          </div>
        </div>
      )}
      <div className="flex ml-auto w-fit">
        <img src={bgImage} className="bottom-0 top-8 mt-auto" alt="" />
      </div>
    </div>
  );
}
 
export default Banner;
 
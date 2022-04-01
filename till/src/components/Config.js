import ConfigurationMenu from "./ConfigurationMenu";
import StaffConfig from "./StaffConfig";
import ItemConfig from "./ItemConfig";
import CategoryConfig from "./CategoryConfig";
import ContactsConfig from "./ContactsConfig";
import "../styles/style.css";
import "../styles/config.css";
import { useParams } from "react-router-dom";

function Config({
  darkmode,
  EmployeeData,
  staffUpdates,
  setStaffUpdates,
  demoMode,
  setItemUpdates,
  ItemData,
  itemUpdates,
  ContactData,
  contactDataUpdates,
  setContactDataUpdates,
}) {
  const { section } = useParams();
  return (
    <div id="main" className={darkmode}>
      <div id="config">
        <ConfigurationMenu configMenu={section} darkmode={darkmode} />
        <StaffConfig
          configMenu={section}
          darkmode={darkmode}
          EmployeeData={EmployeeData}
          staffUpdates={staffUpdates}
          setStaffUpdates={setStaffUpdates}
          demoMode={demoMode}
        />
        <ItemConfig
          configMenu={section}
          darkmode={darkmode}
          EmployeeData={EmployeeData}
          setItemUpdates={setItemUpdates}
          ItemData={ItemData}
          demoMode={demoMode}
        />
        <CategoryConfig
          configMenu={section}
          darkmode={darkmode}
          ItemData={ItemData}
          itemUpdates={itemUpdates}
          setItemUpdates={setItemUpdates}
          demoMode={demoMode}
        />
        <ContactsConfig
          configMenu={section}
          darkmode={darkmode}
          ContactData={ContactData}
          contactDataUpdates={contactDataUpdates}
          setContactDataUpdates={setContactDataUpdates}
          demoMode={demoMode}
        />
      </div>
    </div>
  );
}

export default Config;

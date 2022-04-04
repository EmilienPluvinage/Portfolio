import ConfigurationMenu from "./ConfigurationMenu";
import StaffConfig from "./StaffConfig";
import ItemConfig from "./ItemConfig";
import CategoryConfig from "./CategoryConfig";
import ContactsConfig from "./ContactsConfig";
import "../../styles/style.css";
import "../../styles/config.css";
import { useParams } from "react-router-dom";
import { useTheme } from "../ThemeContext";

function Config({
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
  const darkmode = useTheme();
  const { section } = useParams();
  return (
    <div id="main" className={darkmode}>
      <div id="config">
        <ConfigurationMenu configMenu={section} />
        <StaffConfig
          configMenu={section}
          EmployeeData={EmployeeData}
          staffUpdates={staffUpdates}
          setStaffUpdates={setStaffUpdates}
          demoMode={demoMode}
        />
        <ItemConfig
          configMenu={section}
          EmployeeData={EmployeeData}
          setItemUpdates={setItemUpdates}
          ItemData={ItemData}
          demoMode={demoMode}
        />
        <CategoryConfig
          configMenu={section}
          ItemData={ItemData}
          itemUpdates={itemUpdates}
          setItemUpdates={setItemUpdates}
          demoMode={demoMode}
        />
        <ContactsConfig
          configMenu={section}
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

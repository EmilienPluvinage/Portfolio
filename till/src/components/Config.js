import ConfigurationMenu from "./ConfigurationMenu";
import StaffConfig from "./StaffConfig";
import ItemConfig from "./ItemConfig";
import CategoryConfig from "./CategoryConfig";
import ContactsConfig from "./ContactsConfig";
import "../styles/style.css";
import "../styles/config.css";

function Config({
  configMenu,
  updateConfigMenu,
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
  return (
    <div id="main" className={darkmode}>
      <div id="config">
        <ConfigurationMenu
          configMenu={configMenu}
          updateConfigMenu={updateConfigMenu}
          darkmode={darkmode}
        />
        <StaffConfig
          configMenu={configMenu}
          updateConfigMenu={updateConfigMenu}
          darkmode={darkmode}
          EmployeeData={EmployeeData}
          staffUpdates={staffUpdates}
          setStaffUpdates={setStaffUpdates}
          demoMode={demoMode}
        />
        <ItemConfig
          configMenu={configMenu}
          updateConfigMenu={updateConfigMenu}
          darkmode={darkmode}
          EmployeeData={EmployeeData}
          setItemUpdates={setItemUpdates}
          ItemData={ItemData}
          demoMode={demoMode}
        />
        <CategoryConfig
          configMenu={configMenu}
          updateConfigMenu={updateConfigMenu}
          darkmode={darkmode}
          ItemData={ItemData}
          itemUpdates={itemUpdates}
          setItemUpdates={setItemUpdates}
          demoMode={demoMode}
        />
        <ContactsConfig
          configMenu={configMenu}
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

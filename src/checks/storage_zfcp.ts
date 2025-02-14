import { it, page } from "../lib/helpers";
import { SelectInstallationDevicePage } from "../pages/select_installation_device_page";
import { SidebarPage } from "../pages/sidebar_page";
import { StoragePage } from "../pages/storage_page";
import { ZfcpPage } from "../pages/zfcp_page";

export function prepareZfcpStorage() {
  it("should prepare zFCP storage", async function () {
    const storage = new StoragePage(page);
    const selectInstallationDevice = new SelectInstallationDevicePage(page);
    const zfcp = new ZfcpPage(page);
    const sidebar = new SidebarPage(page);

    await sidebar.goToStorage();
    await storage.changeInstallationDevice();
    await selectInstallationDevice.prepareZfcp();
    await zfcp.activateDevice(0);
    await zfcp.activateDevice(1);
    await zfcp.backToDeviceSelection();
    await zfcp.activateMultipath();
    await selectInstallationDevice.selectDevice(5);
  }, 200000);
}

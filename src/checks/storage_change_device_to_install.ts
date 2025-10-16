import { it, page } from "../lib/helpers";
import { SidebarPage } from "../pages/sidebar_page";
import { SelectDeviceToInstallPage } from "../pages/select_device_to_install_page";
import { StoragePage } from "../pages/storage_page";

export function changeDeviceToInstall() {
  it("should change device to install for storage space warning test", async function () {
    const storage = new StoragePage(page);
    const selectDev = new SelectDeviceToInstallPage(page);
    const sidebar = new SidebarPage(page);

    await sidebar.goToStorage();
    await storage.changeDevice();
    await storage.selectAnotherDisk();
    await selectDev.selectDevice("/dev/vdb");
    await selectDev.confirmDevice();
    await storage.verifySpaceAllocationFailed();

    await storage.changeDevice();
    await storage.selectAnotherDisk();
    await selectDev.selectDevice("/dev/vdc");
    await selectDev.confirmDevice();
    await storage.verifySpaceAllocationFailed();
  });

  it("should change device back to install", async function () {
    const storage = new StoragePage(page);
    const selectDev = new SelectDeviceToInstallPage(page);
    const sidebar = new SidebarPage(page);

    await sidebar.goToStorage();
    await storage.changeDevice();
    await storage.selectAnotherDisk();
    await selectDev.selectDevice("/dev/vda");
    await selectDev.confirmDevice();
  });
}

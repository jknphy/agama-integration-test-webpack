import { it, page } from "../lib/helpers";
import { SidebarPage } from "../pages/sidebar_page";
import { StoragePage } from "../pages/storage_page";

export function verifyDecryptDestructiveActions() {
  const whatToCheck = [
    "btrfs on /dev/system/lv",
    "logical volume lv",
    "swap on /dev/system/lv0",
    "logical volume lv0",
    "volume group system",
    "partition /dev/",
    "partition /dev/",
    "GPT",
  ];

  it("should unfold list of destructive actions", async function () {
    await new SidebarPage(page).goToStorage();
    await new StoragePage(page).expandDestructiveActionsList();
  });

  for (const action of whatToCheck) {
    it("should delete " + action, async function () {
      await new StoragePage(page).verifyDestructiveAction(action);
    });
  }
}

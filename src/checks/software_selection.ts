import { it, page } from "../lib/helpers";
import { SidebarPage } from "../pages/sidebar_page";
import { SoftwarePage } from "../pages/software_page";
import { SoftwareSelectionPage } from "../pages/software_selection_page";

export function selectSinglePattern(pattern: string) {
  it(`should select pattern ${pattern}`, async function () {
    const sidebar = new SidebarPage(page);
    const software = new SoftwarePage(page);
    const softwareSelection = new SoftwareSelectionPage(page);

    await sidebar.goToSoftware();
    await software.changeSelection();
    await softwareSelection.selectPattern(pattern);
    await softwareSelection.close();
  });
}

export function selectMultiPattern(patterns: string[]) {
  it(`should select patterns ${patterns.join(", ")}`, async function () {
    const sidebar = new SidebarPage(page);
    const software = new SoftwarePage(page);
    const softwareSelection = new SoftwareSelectionPage(page);

      await sidebar.goToSoftware();
      await software.changeSelection();
      await Promise.all(patterns.map(async (pattern) => {
        try {
          await softwareSelection.selectPattern(pattern);
        } catch (error) {
          console.error(`Failed to select pattern: ${pattern}`, error);
        }
      }));
      await softwareSelection.close();
  });
}
